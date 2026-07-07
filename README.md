# Imperium Imóveis — Gerador de Carrosséis

Gera 10 artes de **1080 × 1350** no padrão Imperium (faixas nos slides 1–9 e card azul no slide 10),
a partir de 10 fotos + textos. O logo padrão é o `logo.png` da raiz (também copiado em `public/`).

## Rodar local

A logo já vem **embutida no código** (`public/logo-data.js`), então funciona de dois jeitos:

**Jeito rápido (sem servidor):** dê dois cliques em `public/index.html` — abre no navegador e já funciona,
inclusive o download.

**Com servidor (recomendado p/ testar igual produção):** requer Node.js 18+.

```bash
npm start
```

Depois abra **http://localhost:3000**. Não há dependências para instalar — o servidor é Node puro (`server.js`).

## Duas abas

No topo há duas abas:

- **Carrossel (10 artes)** — as 10 artes com faixas e o card final.
- **Post único** — um informativo só (etiqueta no canto, foto full-width, manchete preta grande e botão
  "Leia a legenda"). Você troca só a foto e os textos; a manchete ajusta o tamanho sozinha. Mesmo formato 1080 × 1350.

## Como usar (carrossel)

1. **Adicionar fotos** — envie as fotos; elas preenchem os slots 1–10 na ordem.
2. Passe o mouse sobre cada miniatura para **reordenar (◀ ▶)**, **trocar** (clique) ou **remover (✕)**.
3. O slot **10 · CARD** (borda dourada) é o fundo do card final — coloque a foto aérea nele.
4. Preencha os textos (capa, faixas 2–9, e o card final com valor).
5. **Baixar** por slide, ou **Baixar todas (PNG)**. Se o navegador bloquear, use **Abrir** e salve manualmente.

### Trocar o logo padrão

O logo padrão é a versão embutida em `public/logo-data.js`. Para trocar de vez, substitua o `logo.png`
da raiz e gere de novo o data URL (recorta a margem transparente automaticamente):

```bash
python3 - << 'PY'
from PIL import Image
import base64
im = Image.open("logo.png").convert("RGBA")
bbox = im.getbbox()          # recorta a margem transparente
im.crop(bbox).save("public/logo-tight.png")
with open("public/logo-tight.png","rb") as f:
    data = "data:image/png;base64," + base64.b64encode(f.read()).decode()
open("public/logo-data.js","w").write('window.LOGO_DATA_URL="%s";\n' % data)
print("logo-data.js atualizado")
PY
```

Para um teste pontual sem gerar arquivo, use o botão **Trocar logo** na barra lateral.

## Deploy no Railway

1. Suba este projeto para um repositório Git (GitHub).
2. No Railway: **New Project → Deploy from GitHub repo** e selecione o repositório.
3. O Railway detecta o `package.json` e roda `npm start` automaticamente.
4. O app escuta em `process.env.PORT` (já configurado no `server.js`).

Nenhuma variável de ambiente é necessária.

## Estrutura

```
.
├── server.js          # servidor estático (Node puro)
├── package.json       # script start + engine node
├── logo.png           # logo oficial (fonte)
└── public/
    ├── index.html     # interface
    ├── app.js         # geração das artes em canvas
    └── logo.png       # logo servido para o app
```
