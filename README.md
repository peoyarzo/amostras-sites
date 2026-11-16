# Amostras de sites para consultórios odontológicos

Modelo reutilizável de landing page de uma página, em HTML, CSS e JavaScript, para montar prévias demonstrativas de consultórios odontológicos. Não há etapa de compilação nem dependência de npm para rodar o site.

A amostra pronta deste repositório é **fictícia**: Odonto Sorriso Vila Sônia, na Vila Sônia, São Paulo/SP. Não use dados reais de profissionais ou de clínicas sem autorização.

Todas as páginas vão com `noindex` e o `robots.txt` bloqueia a indexação (`User-agent: *` / `Disallow: /`). Há uma faixa discreta com o texto **Prévia demonstrativa**.

## Estrutura

```
template/                              # modelo base (HTML, CSS, JS e um config.js para preencher)
sites/odonto-sorriso-vila-sonia/       # amostra pronta, com config.js e fotos
scripts/new-site.mjs                   # cria uma nova pasta em sites/<slug>
prints/                                # capturas de tela da amostra (desktop e celular)
```

Os dados de cada site ficam em `config.js`: nome, região, textos, lista de atendimentos, cores, link do botão, WhatsApp opcional e consulta do mapa. A página lê esse arquivo e monta o conteúdo.

O botão **Agende sua avaliação** aponta para o valor de `ctaLink` (o padrão é `#contato`). A seção de contato mostra *Contato via WhatsApp (número a definir)* enquanto `whatsapp` estiver vazio. O mapa usa a consulta em `mapQuery` (padrão: `Vila Sônia, São Paulo - SP`) neste endereço, sem chave de API:

`https://www.google.com/maps?q=<consulta-codificada>&output=embed`

Todos os caminhos são relativos, para a prévia funcionar também em uma subpasta, por exemplo `/amostras-sites/odonto-sorriso-vila-sonia/`.

## Como criar um novo site

Na raiz do repositório:

```bash
node scripts/new-site.mjs meu-consultorio
```

O script copia o conteúdo de `template/` para `sites/meu-consultorio/` e cria a pasta `images/`. Em seguida:

1. Edite `sites/meu-consultorio/config.js`.
2. Coloque as fotos em `sites/meu-consultorio/images/`, com os nomes indicados no próprio `config.js` (`hero.jpg`, `sobre.jpg`, `atendimento.jpg`).
3. Não invente especialidades, prêmios, depoimentos, CRO, anos de experiência ou nomes de profissionais.
4. Use só a região no lugar de um endereço exato, se a prévia ainda não puder exibir o endereço real.

Para visualizar no computador, sirva a **raiz** do repositório (não abra o arquivo direto, para o mapa e os caminhos se comportarem como no ar):

```bash
python3 -m http.server 8080
```

Abra `http://127.0.0.1:8080/sites/meu-consultorio/`.

A raiz do repositório tem um `index.html` em branco de propósito: ele não lista as amostras.

## Como publicar (custo zero, sem domínio)

Nada neste repositório exige cartão ou domínio próprio. As duas opções abaixo têm plano gratuito.

### GitHub Pages (recomendado)

1. Crie um repositório público (por exemplo `peoyarzo/amostras-sites`) e envie este código na branch `main`.
2. Em **Settings → Pages**, defina a fonte como **GitHub Actions**.
3. O fluxo em `.github/workflows/pages.yml` publica a raiz do repositório a cada push em `main`.

A amostra ficará em um endereço neste formato:

`https://<usuario>.github.io/<repositorio>/sites/odonto-sorriso-vila-sonia/`

Se o repositório se chamar `amostras-sites`, o caminho será `/amostras-sites/sites/odonto-sorriso-vila-sonia/`. Os caminhos relativos já estão preparados para isso.

### Vercel

1. Entre na Vercel com a conta do GitHub (o plano gratuito não pede cartão para um site estático).
2. Importe o repositório.
3. Deixe o comando de build em branco e o diretório de publicação como a raiz (Framework Preset: Other).
4. A amostra ficará em `https://<projeto>.vercel.app/sites/odonto-sorriso-vila-sonia/`.

Não ligue um domínio pago e não ative add-ons que gerem cobrança.

## Fotos usadas na amostra

As fotos foram baixadas, conferidas e compactadas (cada uma com menos de 300 KB). Não há créditos visíveis no layout; as fontes estão só aqui.

| Arquivo | O que mostra | Fonte | Autor | Licença |
| --- | --- | --- | --- | --- |
| `sites/odonto-sorriso-vila-sonia/images/hero.jpg` | Interior claro de consultório, com cadeiras turquesa e sem pessoas | [Unsplash](https://images.unsplash.com/photo-1629909615184-74f495363b67) (`photo-1629909615184-74f495363b67`) | Não foi possível confirmar o nome do autor pela página pública no momento da montagem | [Licença Unsplash](https://unsplash.com/license) |
| `sites/odonto-sorriso-vila-sonia/images/sobre.jpg` | Sala moderna com cadeira preta e branca, sem pessoas | [Pexels — Black and White Dentist Chair](https://www.pexels.com/photo/black-and-white-dentist-chair-4269361/) | Cedric Fauntleroy | [Licença Pexels](https://www.pexels.com/license/) |
| `sites/odonto-sorriso-vila-sonia/images/atendimento.jpg` | Cadeira e equipamentos em close, sem pessoas | [Pexels — View of Clinic](https://www.pexels.com/photo/305568/) | Daniel Frank | [Licença Pexels](https://www.pexels.com/license/) |

As duas licenças permitem uso gratuito, inclusive comercial, sem exigir crédito no layout. Ao trocar as fotos de uma nova amostra, prefira bancos livres (Unsplash ou Pexels) e registre a fonte neste README.

## Capturas de tela

As imagens em `prints/desktop.png` (1280×800, página inteira) e `prints/mobile.png` (390×844, página inteira) mostram a amostra pronta.

## Observações

- Esta é uma prévia para demonstração, não o site oficial de um consultório.
- Não entre em contato com leads a partir deste repositório.
- O WhatsApp só entra no ar quando alguém preencher `whatsapp` e, se quiser, apontar `ctaLink` para o `wa.me` correspondente.
