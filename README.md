# Edilson João — Gesso, Drywall e Decoração

Site institucional de página única para o gesseiro **Edilson João**, que atua há
25 anos em São Paulo e região com forro de gesso, drywall, sancas curvas e
redondas, estruturas metálicas e acabamentos de alto padrão.

O site é **um único arquivo HTML** com CSS e JavaScript embutidos. Não tem build,
não tem dependência de framework e não precisa de servidor: basta abrir no
navegador ou publicar no GitHub Pages.

---

## 🔗 Site publicado

Depois de ativar o GitHub Pages (instruções abaixo), o site fica em:

```
https://jonasmenezes-dev.github.io/edilson-joao-portfolio/
```

---

## 📱 Como ativar o GitHub Pages (passo a passo)

1. Abra o repositório no GitHub:
   `https://github.com/JonasMenezes-Dev/edilson-joao-portfolio`
2. Clique na aba **Settings** (Configurações).
3. No menu lateral esquerdo, clique em **Pages**.
4. Em **Source**, escolha **Deploy from a branch**.
5. Em **Branch**, selecione **`main`** e a pasta **`/ (root)`**.
6. Clique em **Save**.
7. Aguarde de 1 a 2 minutos. O link aparece no topo da própria página de
   configuração.

> **Por que funciona sem configurar nada?**
> O arquivo principal se chama `index.html`, que é o nome que o GitHub Pages
> procura automaticamente. A pasta `assets/` fica ao lado dele, e os caminhos no
> código são relativos (`assets/...`), então tudo é encontrado.

### Atualizar o site depois

Qualquer commit enviado para a branch `main` é publicado automaticamente em
cerca de 1 minuto. Não é preciso repetir a configuração.

---

## 🗂️ Estrutura do projeto

```
Site Pai/
├── index.html                  ← o site inteiro (HTML + CSS + JS)
├── README.md                   ← este arquivo
├── .nojekyll                   ← diz ao GitHub Pages para não processar com Jekyll
├── .gitignore                  ← o que não deve ir para o repositório
├── assets/
│   ├── *.webp                  ← fotos otimizadas (é o que o site usa)
│   └── originais/              ← fotos originais, sem tratamento (backup)
└── tools/
    └── otimizar-imagens.py     ← script que gera as versões otimizadas
```

### O que é cada coisa

| Arquivo                     | Para que serve                                                                                                  |
| --------------------------- | --------------------------------------------------------------------------------------------------------------- |
| `index.html`                | Página completa. Contém todo o CSS no `<style>` e o JavaScript no `<script>` no final.                          |
| `assets/*.webp`             | Fotos em WebP, geradas em até três tamanhos (`-1600`, `-800`, `-480`).                                          |
| `assets/originais/`         | Fotos originais em JPG. **Não são usadas pelo site** — servem de backup e como entrada do script de otimização. |
| `tools/otimizar-imagens.py` | Reprocessa as fotos originais e gera as versões WebP.                                                           |
| `.nojekyll`                 | Impede que o GitHub Pages rode o Jekyll, que ignoraria arquivos começando com `_` ou `.`.                       |

---

## 🖼️ Como trocar ou adicionar fotos

O site usa três tamanhos por foto, para o celular baixar arquivos leves:

| Sufixo  | Largura | Usado em                            |
| ------- | ------- | ----------------------------------- |
| `-1600` | 1600 px | Desktop (foto principal do topo)    |
| `-800`  | 800 px  | Tablet, e o padrão das demais fotos |
| `-480`  | 480 px  | Celular                             |

### Passo a passo

1. Coloque a foto nova em `assets/originais/` (pode ser `.jpg` ou `.png`).
   Use um nome simples, sem espaços e sem acento — por exemplo `obra-escritorio.jpg`.
2. Rode o script:

   ```powershell
   python tools/otimizar-imagens.py
   ```

   Ele gera `obra-escritorio-800.webp` e `obra-escritorio-480.webp` em `assets/`.
   Se a foto tiver mais de 1600 px de largura, gera também a versão `-1600`.

3. Adicione a foto no site. **Há dois lugares**, conforme onde ela deve aparecer:
   - **Portfólio** — no `<script>`, procure `var items=[` e acrescente uma linha:

     ```js
     {cats:[cats[0],cats[6]],title:"Título que aparece na foto",src:"obra-escritorio",max:800,alt:"Descrição para acessibilidade e Google"},
     ```

     - `cats` — categorias do filtro (veja a lista em `var cats=[`).
     - `src` — o nome base do arquivo, **sem** `assets/` e **sem** `-800.webp`.
     - `max` — a maior versão gerada: `1600` ou `800`.
     - `title` — texto que aparece sobre a foto.
     - `alt` — descrição da imagem (importante para Google e leitores de tela).

   - **Seções fixas** (topo, projetos especiais, sobre) — procure o `<picture>` e
     troque o caminho em cada `<source>` e no `<img>`.

> **Primeira foto do portfólio**
> A primeira da lista ocupa o dobro do espaço (é a foto de destaque). Para
> escolher outra, basta reordenar as linhas de `var items=[`.
> A ordem dos filtros também sai daí: a primeira linha é sempre a 1ª da galeria.

---

## 🧩 O que o site contém

| Seção                    | Descrição                                                                                         |
| ------------------------ | ------------------------------------------------------------------------------------------------- |
| **Topo**                 | Chamada principal + botão de WhatsApp + selo de "25 anos"                                         |
| **Diferenciais**         | Seis pontos fortes, com o número 25 em destaque                                                   |
| **Serviços**             | Oito categorias (forros, sancas, drywall, estruturas, acabamentos, reparos, isolamento, projetos) |
| **Projetos especiais**   | Faixa escura com foco em sancas curvas e redondas                                                 |
| **Portfólio**            | Galeria filtrável por categoria, com ampliação ao clicar                                          |
| **Parcerias**            | Voltado a arquitetos, engenheiros, construtoras                                                   |
| **Como funciona**        | Quatro passos do atendimento                                                                      |
| **Sobre**                | Apresentação do Edilson                                                                           |
| **Perguntas frequentes** | Nove dúvidas comuns, em sanfona                                                                   |
| **Orçamento**            | Formulário que monta a mensagem e abre o WhatsApp                                                 |
| **Contato**              | Chamada final com WhatsApp                                                                        |
| **Rodapé**               | Navegação, serviços e contato                                                                     |

### O formulário não usa servidor

Ao enviar, o JavaScript monta uma mensagem de texto com os dados preenchidos e
abre o WhatsApp já com ela escrita. **Nenhum dado é salvo** — nem no site, nem em
banco de dados. As fotos do local são anexadas manualmente pelo próprio cliente
na conversa, como o site orienta.

Para trocar o número de WhatsApp, procure no `<script>`:

```js
var N = "5511915136969";
```

Formato: `55` (Brasil) + `11` (DDD) + número, sem espaços, traços ou parênteses.

---

## 📱 Responsividade

O site foi construído pensando primeiro no celular, porque a maioria dos
visitantes chega pelo WhatsApp ou por redes sociais.

- **Funciona de 320 px a telas grandes**, sem rolagem horizontal.
- **Menu sanduíche** abaixo de 900 px, com separadores e botão de WhatsApp.
- **Fotos adaptadas ao tamanho da tela** via `<picture>`/`srcset` — o celular
  baixa arquivos de 480 px, não os de 1600 px.
- **Campos de formulário com 16 px**, o que evita o zoom automático indesejado
  que o iPhone aplica em campos menores.
- **Botões com altura confortável** para o toque.
- **Filtros do portfólio com rolagem lateral**, em vez de quebrar em várias linhas.
- **Espaçamento respeitando notch e barra inferior** do celular
  (`safe-area-inset`).
- **Animações desativadas** para quem usa "reduzir movimento" no sistema.

---

## ⚡ Desempenho

As fotos originais somavam **2,6 MB**. Depois da otimização, a maior versão de
cada foto soma **1,0 MB** (60% menor), e o celular baixa bem menos que isso,
porque usa as versões de 480 px.

| Original              | Maior versão WebP | Redução   |
| --------------------- | ----------------- | --------- |
| 241490.jpg — 1.288 KB | 497 KB            | 61%       |
| 241491.jpg — 120 KB   | 37 KB             | 70%       |
| Demais fotos          | 12 a 150 KB       | 34% a 74% |

O site **não carrega nenhuma biblioteca externa** de JavaScript ou CSS. As únicas
requisições externas são as fontes do Google (Bricolage Grotesque e Manrope).

---

## ♿ Acessibilidade e SEO

- Estrutura semântica com `<header>`, `<main>`, `<section>`, `<footer>` e
  hierarquia correta de títulos (`h1` → `h2` → `h3`).
- Todas as imagens têm `alt` descritivo.
- Navegação por teclado com foco visível.
- `aria-label`, `aria-expanded` e `aria-pressed` nos controles interativos.
- Meta `description` e dados estruturados Schema.org (tipo `Person`).
- `lang="pt-BR"` no `<html>`.

---

## 🛠️ Como rodar localmente

Não precisa de servidor. Basta abrir o arquivo no navegador:

```powershell
start index.html
```

Se preferir um servidor local (útil para testar o comportamento de rede):

```powershell
python -m http.server 8000
```

Depois acesse `http://localhost:8000`.

---

## ✅ Antes de publicar — checklist

- [ ] O número de WhatsApp em `var N=` está correto?
- [ ] As fotos que você quer no topo são a `241490` e a `241491`?
- [ ] A primeira foto do portfólio é a que você considera mais bonita?
- [ ] Todas as fotos novas foram passadas pelo `tools/otimizar-imagens.py`?
- [ ] Os títulos e textos das fotos (`title`) descrevem bem cada trabalho?

---

## 📝 Observações

- **A pasta `assets/originais/` não é usada pelo site.** Ela existe para que você
  nunca perca a foto original. Se o repositório ficar pesado demais, ela pode ser
  removida do Git sem afetar o site — mas guarde uma cópia em outro lugar.
- **Ainda faltam fotos** de escritórios e ambientes corporativos acabados, de
  drywall finalizado (hoje há apenas a placa sendo instalada) e de isolamento
  acústico/térmico. A seção de parcerias menciona escritórios modernos, e uma
  foto comprovando isso deixaria a página mais convincente.
