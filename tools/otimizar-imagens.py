#!/usr/bin/env python3
"""
Otimiza as fotos de assets/ para uso no site.

Para cada imagem em assets/originais/ gera, em assets/:
 <nome>-1600.webp  -> versao grande (desktop / lightbox)
 <nome>-800.webp   -> versao media (tablet, 2x de cards ~400px)
 <nome>-480.webp   -> versao pequena (celular, 1x de cards ~360px)

O HTML usa <picture> com srcset, entao o navegador baixa so o tamanho
necessario. Rode de novo quando entrar foto nova: ele reprocessa tudo.

Uso:
    python tools/otimizar-imagens.py            # gera/atualiza
    python tools/otimizar-imagens.py --dry-run  # so mostra o que faria
"""

from __future__ import annotations

import argparse
import sys
from pathlib import Path

try:
    from PIL import Image, ImageOps
except ImportError:
    sys.exit("Pillow nao instalado. Rode: python -m pip install Pillow")

RAIZ = Path(__file__).resolve().parent.parent
ORIGINAIS = RAIZ / "assets" / "originais"
DESTINO = RAIZ / "assets"

# Larguras geradas. A maior define o limite de upscale (nunca ampliamos).
LARGURAS = (1600, 800, 480)
QUALIDADE = 82
EXTENSOES = {".jpg", ".jpeg", ".png", ".webp"}


def nome_base(caminho: Path) -> str:
    """Nome sem extensao, em minusculas, sem espacos."""
    return caminho.stem.lower().replace(" ", "-")


def otimizar(origem: Path, dry_run: bool = False) -> list[tuple[Path, int, int]]:
    """Gera as variantes WebP de uma imagem. Devolve [(caminho, bytes, largura)]."""
    gerados: list[tuple[Path, int, int]] = []

    with Image.open(origem) as img:
        img = ImageOps.exif_transpose(img)  # respeita rotacao do celular
        largura_original = img.width

        if img.mode not in ("RGB", "RGBA"):
            img = img.convert("RGB")
        # WebP nao usa canal alfa em fotos: economiza bytes
        if img.mode == "RGBA":
            fundo = Image.new("RGB", img.size, (255, 255, 255))
            fundo.paste(img, mask=img.split()[-1])
            img = fundo

        for largura in LARGURAS:
            if largura > largura_original:
                continue  # nao faz upscale
            altura = round(img.height * largura / img.width)
            redimensionada = img.resize((largura, altura), Image.LANCZOS)

            destino = DESTINO / f"{nome_base(origem)}-{largura}.webp"
            if not dry_run:
                redimensionada.save(
                    destino, "WEBP", quality=QUALIDADE, method=6
                )
            tamanho = destino.stat().st_size if destino.exists() else 0
            gerados.append((destino, tamanho, largura))

    return gerados


def main() -> int:
    parser = argparse.ArgumentParser(description="Otimiza as fotos do site.")
    parser.add_argument(
        "--dry-run", action="store_true", help="nao escreve nada, so relata"
    )
    args = parser.parse_args()

    if not ORIGINAIS.is_dir():
        sys.exit(
            f"Pasta nao encontrada: {ORIGINAIS}\n"
            "Coloque as fotos originais em assets/originais/ e rode de novo."
        )

    fotos = sorted(
        p for p in ORIGINAIS.iterdir()
        if p.is_file() and p.suffix.lower() in EXTENSOES
    )
    if not fotos:
        sys.exit(f"Nenhuma imagem encontrada em {ORIGINAIS}")

    print(f"Originais: {ORIGINAIS}")
    print(f"Destino:   {DESTINO}\n")

    total_antes = 0
    total_depois = 0

    for foto in fotos:
        antes = foto.stat().st_size
        total_antes += antes
        gerados = otimizar(foto, args.dry_run)
        depois = max((t for _, t, _ in gerados), default=0)
        total_depois += depois

        economia = (1 - depois / antes) * 100 if antes and depois else 0
        print(
            f"{foto.name:<28} {antes / 1024:>8.0f} KB  ->  "
            f"{depois / 1024:>6.0f} KB  ({economia:>4.0f}% menor)"
        )
        for destino, tamanho, largura in gerados:
            print(f"    {destino.name:<32} {tamanho / 1024:>6.0f} KB  ({largura}px)")

    if total_antes and total_depois:
        print(
            f"\nTotal (maior versao de cada foto): "
            f"{total_antes / 1024 / 1024:.1f} MB -> {total_depois / 1024 / 1024:.1f} MB "
            f"({(1 - total_depois / total_antes) * 100:.0f}% menor)"
        )
    if args.dry_run:
        print("\n[dry-run] nada foi escrito.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
