# Edilson João — Gesso, Drywall e Decoração

Site institucional de página única para o gesseiro **Edilson João**, que atua há
25 anos em São Paulo e região com forro de gesso, drywall, sancas curvas e
redondas, estruturas metálicas e acabamentos.

O site é um único arquivo HTML, com CSS e JavaScript embutidos. Não tem build,
não depende de framework e não precisa de servidor. Basta abrir no navegador ou
publicar no GitHub Pages.

---

## Publicação

### Ativar o GitHub Pages

1. Abra o repositório no GitHub:
   `https://github.com/JonasMenezes-Dev/edilson-joao-portfolio`
2. Clique na aba **Settings**.
3. No menu lateral, clique em **Pages**.
4. Em **Source**, escolha **Deploy from a branch**.
5. Em **Branch**, selecione **`main`** e a pasta **`/ (root)`**.
6. Clique em **Save**.

Depois de um a dois minutos, o site fica disponível em:

```
https://jonasmenezes-dev.github.io/edilson-joao-portfolio/
```

Funciona sem configuração adicional porque o arquivo principal se chama
`index.html`, que é o nome que o GitHub Pages procura sozinho. A pasta `assets/`
fica ao lado dele e os caminhos no código são relativos.

### Atualizar o site

Qualquer commit enviado para a branch `main` é publicado automaticamente em
cerca de um minuto. Não é preciso repetir a configuração.

---

## Estrutura do projeto

```
Site Pai/
├── index.html                  o site inteiro (HTML + CSS + JS)
├── README.md                   este arquivo
├── .nojekyll                   impede o processamento do Pages pelo Jekyll
├── .gitignore
├── assets/
│   ├── *.webp                  fotos otimizadas (é o que o site usa)
│   └── originais/              fotos originais em JPG (backup)
└── tools/
    └── otimizar-imagens.py     gera as versões otimizadas
```

| Arquivo                     | Função                                                                                                                       |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `index.html`                | Página completa. Todo o CSS está no bloco `<style>` do cabeçalho e o JavaScript no `<script>` antes do fechamento do `body`. |
| `assets/*.webp`             | Fotos em WebP, em até três tamanhos: `-1600`, `-800` e `-480`.                                                               |
| `assets/originais/`         | Fotos originais. Não são usadas pelo site; servem de backup e de entrada para o script.                                      |
| `tools/otimizar-imagens.py` | Reprocessa as fotos originais e gera as versões WebP.                                                                        |
| `.nojekyll`                 | Impede que o GitHub Pages rode o Jekyll, que ignoraria arquivos começando com `_` ou `.`.                                    |

---

## Fotos

### Nomes em uso

Cada foto tem um nome que descreve o conteúdo, sem acento e sem espaço.

| Arquivo base                            | Conteúdo                                                        | Tamanhos gerados |
| --------------------------------------- | --------------------------------------------------------------- | ---------------- |
| `instalacao-drywall-estrutura-metalica` | Placa de gesso sendo instalada em parede com estrutura metálica | 1600, 800, 480   |
| `sanca-redonda-forro-placas`            | Sanca redonda com forro modular iluminado                       | 800, 480         |
| `sanca-curva-ponto-luz`                 | Sanca curva com ponto de luz                                    | 800, 480         |
| `forro-sanca-curva-rebaixado`           | Forro com sanca curva e rebaixamento                            | 800, 480         |
| `forro-sanca-fechada-corredor`          | Sanca fechada em corredor                                       | 800, 480         |
| `divisoria-drywall-aberturas`           | Divisória de drywall com vãos de passagem                       | 800, 480         |
| `fachada-edificio-em-execucao`          | Fachada de edifício em execução                                 | 800, 480         |
| `estrutura-metalica-drywall-osb`        | Estrutura metálica com reforços em OSB                          | 800, 480         |
| `forro-pilar-trilho-luz`                | Forro com trilho de iluminação e pilar revestido                | 800, 480         |
| `massa-juntas-cantos`                   | Massa e tratamento de juntas e cantos                           | 800, 480         |
| `sanca-aberta-forro-iluminado`          | Sanca aberta com forro central iluminado                        | 800, 480         |
| `fachada-edificio-sao-paulo`            | Edifício de alto padrão em São Paulo                            | 800, 480         |

### Tamanhos

| Sufixo  | Largura | Usado em                           |
| ------- | ------- | ---------------------------------- |
| `-1600` | 1600 px | Desktop, na foto principal do topo |
| `-800`  | 800 px  | Tablet e padrão das demais fotos   |
| `-480`  | 480 px  | Celular                            |

O HTML usa `<picture>` com `srcset`, então o navegador baixa apenas o tamanho
adequado à tela.

### Adicionar uma foto nova

1. Coloque o arquivo em `assets/originais/`, em JPG ou PNG. Use um nome simples,
   sem acento e sem espaço, por exemplo `obra-escritorio.jpg`.
2. Rode o script:

   ```powershell
   python tools/otimizar-imagens.py
   ```

   Ele gera `obra-escritorio-800.webp` e `obra-escritorio-480.webp` em `assets/`.
   Se a imagem tiver mais de 1600 px de largura, gera também a versão `-1600`.

3. Adicione a foto no `index.html`. Há dois lugares possíveis.

   **Portfólio** — procure `var items=[` no `<script>` e acrescente uma linha:

   ```js
   {cats:[cats[0],cats[6]],title:"Título que aparece sobre a foto",src:"obra-escritorio",max:800,alt:"Descrição da imagem"},
   ```

   | Campo   | O que é                                                        |
   | ------- | -------------------------------------------------------------- |
   | `cats`  | Categorias do filtro. A lista completa está em `var cats=[`.   |
   | `title` | Texto que aparece sobre a foto na galeria.                     |
   | `src`   | Nome base do arquivo, sem `assets/` e sem o sufixo de tamanho. |
   | `max`   | Maior versão gerada: `1600` ou `800`.                          |
   | `alt`   | Descrição da imagem, usada por leitores de tela e pelo Google. |

   **Seções fixas** (topo, projetos especiais, sobre) — procure o bloco
   `<picture>` correspondente e troque o caminho em cada `<source>` e no `<img>`.

A primeira linha de `var items=[` ocupa o dobro do espaço na galeria, porque é a
foto de destaque. Para escolher outra, basta reordenar as linhas.

---

## Conteúdo do site

| Seção                | Descrição                                                                                         |
| -------------------- | ------------------------------------------------------------------------------------------------- |
| Topo                 | Chamada principal, botão de WhatsApp e selo de 25 anos                                            |
| Diferenciais         | Seis pontos fortes, com o número 25 em destaque                                                   |
| Serviços             | Oito categorias: forros, sancas, drywall, estruturas, acabamentos, reparos, isolamento e projetos |
| Projetos especiais   | Faixa escura com foco em sancas curvas e redondas                                                 |
| Portfólio            | Galeria filtrável por categoria, com ampliação ao clicar                                          |
| Parcerias            | Voltado a arquitetos, engenheiros e construtoras                                                  |
| Como funciona        | Quatro passos do atendimento                                                                      |
| Sobre                | Apresentação do Edilson                                                                           |
| Perguntas frequentes | Nove dúvidas comuns, em sanfona                                                                   |
| Orçamento            | Formulário que monta a mensagem e abre o WhatsApp                                                 |
| Contato              | Chamada final com WhatsApp                                                                        |
| Rodapé               | Navegação, serviços e contato                                                                     |

### O formulário não usa servidor

Ao enviar, o JavaScript monta uma mensagem de texto com os dados preenchidos e
abre o WhatsApp já com ela escrita. Nenhum dado é salvo, nem no site nem em banco
de dados. As fotos do local são anexadas manualmente pelo cliente na conversa,
como o próprio site orienta.

Para trocar o número de WhatsApp, procure no `<script>`:

```js
var N = "5511915136969";
```

O formato é `55` (Brasil) mais `11` (DDD) mais o número, sem espaço, traço ou
parêntese.

---

## Responsividade

O site foi construído pensando primeiro no celular, porque a maioria dos
visitantes chega pelo WhatsApp ou por redes sociais.

- Funciona de 320 px a telas grandes, sem rolagem horizontal.
- Menu sanduíche abaixo de 900 px, com separadores e botão de WhatsApp.
- Fotos adaptadas ao tamanho da tela por meio de `<picture>` e `srcset`. O
  celular baixa arquivos de 480 px, não os de 1600 px.
- Campos de formulário com 16 px, o que evita o zoom automático que o iPhone
  aplica em campos menores.
- Botões com altura confortável para o toque.
- Filtros do portfólio com rolagem lateral, em vez de quebrar em várias linhas.
- Espaçamento respeitando notch e barra inferior do celular, via
  `safe-area-inset`.
- Animações desativadas para quem usa a opção de reduzir movimento no sistema.

---

## Desempenho

As fotos originais somam 2,6 MB. Depois da otimização, a maior versão de cada
foto soma 1,0 MB, e o celular baixa bem menos que isso porque usa as versões de
480 px.

| Tamanho | Arquivos | Total  | Média por arquivo |
| ------- | -------- | ------ | ----------------- |
| 480 px  | 13       | 300 KB | 23 KB             |
| 800 px  | 13       | 684 KB | 53 KB             |
| 1600 px | 1        | 497 KB | 497 KB            |

A foto do topo no celular caiu de 1.288 KB para 41 KB.

O site não carrega nenhuma biblioteca externa de JavaScript ou CSS. As únicas
requisições externas são as fontes do Google, Bricolage Grotesque e Manrope.

---

## Compartilhamento e indexação

- Metadados Open Graph e Twitter Card para melhorar a prévia do link ao compartilhar o site.
- Favicon SVG com a identidade visual do projeto.
- URL canônica para a página publicada no GitHub Pages.
- `robots.txt` e `sitemap.xml` para orientar rastreadores.
- Esses arquivos ajudam a descrever e descobrir o site, mas não garantem indexação nem posicionamento no Google. Para acompanhar resultados, o proprietário pode verificar o domínio no Google Search Console.

## Acessibilidade e SEO

- Estrutura semântica com `<header>`, `<main>`, `<section>` e `<footer>`, e
  hierarquia correta de títulos.
- Todas as imagens têm `alt` descritivo.
- Navegação por teclado com foco visível.
- `aria-label`, `aria-expanded` e `aria-pressed` nos controles interativos.
- Meta `description` e dados estruturados Schema.org do tipo `Person`.
- `lang="pt-BR"` no elemento `html`.

---

## Rodar localmente

Não é necessário servidor. Basta abrir o arquivo no navegador:

```powershell
start index.html
```

Para testar o comportamento de rede, use um servidor local:

```powershell
python -m http.server 8000
```

Depois acesse `http://localhost:8000`.

---

## Checklist antes de publicar

- [ ] O número de WhatsApp em `var N=` está correto?
- [ ] A primeira foto do portfólio é a que você considera mais bonita?
- [ ] As fotos novas passaram pelo `tools/otimizar-imagens.py`?
- [ ] Os títulos e descrições das fotos novas correspondem ao que aparece nelas?

---

## Observações

- A pasta `assets/originais/` não é usada pelo site. Ela existe para que as fotos
  originais nunca sejam perdidas. Se o repositório ficar pesado, ela pode sair do
  Git sem afetar o site, desde que exista uma cópia em outro lugar.
- Faltam fotos de escritórios e ambientes corporativos acabados, de drywall
  finalizado (hoje há apenas a placa sendo instalada) e de isolamento acústico ou
  térmico. A seção de parcerias menciona escritórios modernos, e uma foto
  comprovando isso deixaria a página mais convincente.
