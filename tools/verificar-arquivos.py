"""Auditoria estática, sem dependências: python tools/verificar-arquivos.py"""
from html.parser import HTMLParser
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parent.parent
HTML = (ROOT / 'index.html').read_text(encoding='utf-8')
JS = (ROOT / 'assets/main.js').read_text(encoding='utf-8')
CSS = (ROOT / 'assets/styles.css').read_text(encoding='utf-8')

class Scan(HTMLParser):
    def __init__(self):
        super().__init__()
        self.ids = set()
        self.links = []
        self.assets = []
        self.services = 0
        self.faq = 0
    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if 'id' in a:
            assert a['id'] not in self.ids, f"ID duplicado: {a['id']}"
            self.ids.add(a['id'])
        if tag == 'article' and 'svc' in a.get('class', '').split():
            self.services += 1
        if tag == 'details':
            self.faq += 1
        for prop in ('href', 'src', 'srcset'):
            if prop in a:
                for url in a[prop].split(',') if prop == 'srcset' else [a[prop]]:
                    url = url.strip().split(' ')[0]
                    if url.startswith('#'):
                        self.links.append(url[1:])
                    elif url.startswith('assets/'):
                        self.assets.append(url)

s = Scan()
s.feed(HTML)
for anchor in s.links:
    assert anchor in s.ids, f'Âncora ausente: #{anchor}'
for asset in s.assets:
    assert (ROOT / asset).is_file(), f'Arquivo ausente: {asset}'
assert s.services == 8, f'Esperados 8 serviços, encontrados {s.services}'
assert s.faq == 9, f'Esperadas 9 perguntas, encontradas {s.faq}'
assert '25 anos' in HTML and '5511915136969' in JS, 'Dados fundamentais alterados'
for name in re.findall(r'src:"([a-z0-9-]+)"', JS):
    assert (ROOT / f'assets/{name}-800.webp').is_file(), f'Foto da galeria ausente: {name}'
    assert (ROOT / f'assets/{name}-480.webp').is_file(), f'Foto mobile ausente: {name}'
assert len(re.findall(r'src:"[a-z0-9-]+"', JS)) == 10, 'Galeria deveria ter 10 trabalhos'
assert 'prefers-reduced-motion' in CSS, 'Respeito ao movimento reduzido ausente'
assert 'aria-pressed' in JS and 'showModal' in JS and 'FormData' in JS, 'Comportamento da galeria ou formulário ausente'
print('OK: HTML, links internos, arquivos locais, 8 serviços, 9 FAQs, 10 projetos, contato, CSS e interações essenciais.')
print('OBS: teste estático não substitui execução do site em navegador.')
