# Amostras de sites

Prévias demonstrativas de uma página, em HTML, CSS e JavaScript, sem etapa de compilação e sem dependência de npm para abrir no navegador. Há uma amostra fictícia de odontologia e 50 prévias feitas a partir de dados públicos de estabelecimentos, em dez nichos.

Todas as páginas levam `<meta name="robots" content="noindex, nofollow">` e uma faixa visível com o texto **Prévia demonstrativa**. O `robots.txt` da raiz bloqueia a indexação (`User-agent: *` / `Disallow: /`). O `index.html` da raiz fica em branco de propósito e não lista as amostras. A lista fica em `sites/index.html`.

Não use estas páginas como site oficial. Não entre em contato com os estabelecimentos a partir deste repositório.

## Estrutura

```
template/                         # modelo (HTML, CSS, JS e config.js)
sites/assets/                     # fotos compartilhadas por nicho (WebP)
sites/<slug>/                     # uma prévia: config.js + página
sites/index.html                  # índice das 50 amostras, com noindex
scripts/new-site.mjs              # copia o template para sites/<slug>/
scripts/generate-samples.mjs      # recria as 50 prévias, o índice e o CSV
scripts/check-amostras.mjs        # confere noindex, faixa, lorem, tel/wa.me e peso das imagens
scripts/leads-data.mjs            # textos e telefones públicos usados na geração
amostras_links.csv                # nome, slug e link previsto no GitHub Pages
```

Os dados de cada prévia ficam em `config.js` (`window.SITE`): nome, região, textos, serviços genéricos, cores, layout, telefone, WhatsApp, Instagram e a busca do mapa. A página lê esse arquivo e monta o conteúdo.

O mapa usa a consulta em `mapQuery` (nome do estabelecimento + bairro + cidade), sem chave de API:

`https://www.google.com/maps?q=<consulta>&output=embed`

Não há endereço de rua inventado. O formulário não tem backend: o botão abre `https://wa.me/<número>?text=...` no celular de quem preencheu. Nada é enviado por esta página. Telefone usa `tel:`.

Os caminhos são relativos, para a prévia funcionar em subpasta (`/amostras-sites/sites/<slug>/`).

## Nichos

O template não é mais só odontológico. `config.js` escolhe paleta, fonte do sistema e um de quatro layouts (`classic`, `split`, `studio`, `panel`). Os nichos das 50 prévias:

- Odontologia
- Estética e harmonização facial
- Veterinária e pet (banho e tosa)
- Advocacia
- Contabilidade
- Fisioterapia e pilates
- Psicologia e nutrição
- Oficinas mecânicas e centros automotivos
- Arquitetura, engenharia e reformas
- Idiomas, cursos e autoescolas

O texto fala como o próprio negócio: benefício concreto, tom natural, sem citar omissão de preço, cura ou resultado. Não entram e-mail, registro de conselho, nota do Google, depoimento ou endereço inventado. O rodapé de cada prévia é só a marca e a linha "Prévia demonstrativa — página modelo."

## Como criar um site avulso

Na raiz do repositório:

```bash
node scripts/new-site.mjs meu-estabelecimento
```

O script copia `template/` para `sites/meu-estabelecimento/` e cria a pasta `images/`. Em seguida:

1. Edite `sites/meu-estabelecimento/config.js`.
2. Aponte `images` para arquivos leves (WebP ou JPG, até 150 KB) ou para `sites/assets/`.
3. Preencha `whatsapp` só com dígitos do número público (DDI 55). O formulário e os links `wa.me` / `tel:` saem daí.
4. Não invente especialidade, prêmio, depoimento, registro profissional, preço ou endereço.

Para ver no computador, sirva a raiz (não abra o arquivo direto):

```bash
python3 -m http.server 8080
```

Abra `http://127.0.0.1:8080/sites/meu-estabelecimento/`. O índice das 50 está em `http://127.0.0.1:8080/sites/`.

Para recriar as 50 prévias a partir de `scripts/leads-data.mjs`:

```bash
node scripts/generate-samples.mjs
```

## Checagem

```bash
node scripts/check-amostras.mjs
```

O script confere cada HTML em `sites/`: meta `noindex, nofollow`, a faixa **Prévia demonstrativa**, ausência de “lorem”, links `tel:` e `wa.me` quando o `config.js` tem telefone, mapa incorporado e nenhuma imagem acima de 200 KB. Também confere se `amostras_links.csv` lista as 50 amostras com o link `https://peoyarzo.github.io/amostras-sites/sites/<slug>/`.

## Como publicar (custo zero, sem domínio)

Nada neste repositório exige cartão ou domínio próprio.

### GitHub Pages

1. Envie o código para o repositório público `peoyarzo/amostras-sites`, na branch `main`.
2. Em **Settings → Pages**, defina a fonte como **GitHub Actions**.
3. O fluxo em `.github/workflows/pages.yml` publica a raiz a cada push em `main`.

Uma prévia fica em:

`https://peoyarzo.github.io/amostras-sites/sites/<slug>/`

A lista das 50 está em `amostras_links.csv` e em `sites/index.html`.

### Vercel

1. Importe o repositório no plano gratuito.
2. Deixe o comando de build em branco e o diretório de publicação como a raiz.
3. A amostra fictícia, por exemplo, fica em `https://<projeto>.vercel.app/sites/odonto-sorriso-vila-sonia/`.

Não ligue um domínio pago e não ative add-ons que gerem cobrança.

## Fotos

Não há foto dos estabelecimentos. As imagens são de banco livre, baixadas, conferidas e compactadas (cada arquivo novo tem menos de 150 KB). Leads do mesmo nicho reutilizam os arquivos em `sites/assets/`, para o repositório não guardar 150 cópias. Não há crédito no layout.

A licença da Unsplash permite uso gratuito, inclusive comercial, sem exigir crédito na página. O nome do autor não pôde ser confirmado pela página pública no momento da montagem; a foto é identificada pelo endereço abaixo.

| Arquivo | O que mostra | Fonte |
| --- | --- | --- |
| `sites/assets/odontologia/hero.webp` | Consultório odontológico claro, sem pacientes | [Unsplash](https://images.unsplash.com/photo-1629909615184-74f495363b67) |
| `sites/assets/odontologia/sala.webp` | Sala de atendimento com cadeira e bancada | [Unsplash](https://images.unsplash.com/photo-1598256989800-fe5f95da9787) |
| `sites/assets/odontologia/janela.webp` | Consultório com luz de janela | [Unsplash](https://images.unsplash.com/photo-1629909613654-28e377c37b09) |
| `sites/assets/estetica/spa.webp` | Pátio de espaço de cuidados, com plantas | [Unsplash](https://images.unsplash.com/photo-1560750588-73207b1ef5b8) |
| `sites/assets/estetica/produtos.webp` | Frasco, toalha e flores | [Unsplash](https://images.unsplash.com/photo-1540555700478-4be289fbecef) |
| `sites/assets/estetica/oleos.webp` | Frasco de óleo, sem pessoas | [Unsplash](https://images.unsplash.com/photo-1515377905703-c4788e51af15) |
| `sites/assets/vet/caes.webp` | Dois cães em um caminho | [Unsplash](https://images.unsplash.com/photo-1548199973-03cce0bbc87b) |
| `sites/assets/vet/gato.webp` | Gato preto e branco | [Unsplash](https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba) |
| `sites/assets/vet/retrato.webp` | Cachorro ao ar livre | [Unsplash](https://images.unsplash.com/photo-1587300003388-59208cc962cb) |
| `sites/assets/advocacia/livros.webp` | Estante de livros | [Unsplash](https://images.unsplash.com/photo-1521587760476-6c12a4b040da) |
| `sites/assets/advocacia/escrita.webp` | Mãos escrevendo | [Unsplash](https://images.unsplash.com/photo-1450101499163-c8848c66ca85) |
| `sites/assets/advocacia/balanca.webp` | Balança da justiça | [Unsplash](https://images.unsplash.com/photo-1589829545856-d10d557cf95f) |
| `sites/assets/contabil/documentos.webp` | Papéis e calculadora | [Unsplash](https://images.unsplash.com/photo-1554224155-6726b3ff858f) |
| `sites/assets/contabil/reuniao.webp` | Revisão de papéis com notebook | [Unsplash](https://images.unsplash.com/photo-1454165804606-c3d57bc86b40) |
| `sites/assets/contabil/planilhas.webp` | Notebook com gráficos | [Unsplash](https://images.unsplash.com/photo-1460925895917-afdab827c52f) |
| `sites/assets/fisio/treino.webp` | Orientação de exercício no solo | [Unsplash](https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b) |
| `sites/assets/fisio/aula.webp` | Aula em grupo em estúdio | [Unsplash](https://images.unsplash.com/photo-1518611012118-696072aa579a) |
| `sites/assets/fisio/yoga.webp` | Alongamento, silhueta | [Unsplash](https://images.unsplash.com/photo-1544367567-0f2fcb009e0b) |
| `sites/assets/saude/prato.webp` | Refeição com legumes e grãos | [Unsplash](https://images.unsplash.com/photo-1490645935967-10de6ba17061) |
| `sites/assets/saude/horta.webp` | Legumes e verduras | [Unsplash](https://images.unsplash.com/photo-1498837167922-ddd27525d352) |
| `sites/assets/saude/sala.webp` | Sala de espera com poltronas | [Unsplash](https://images.unsplash.com/photo-1524758631624-e2822e304c36) |
| `sites/assets/oficina/galpao.webp` | Galpão de oficina | [Unsplash](https://images.unsplash.com/photo-1530046339160-ce3e530c7d2f) |
| `sites/assets/oficina/maos.webp` | Mãos em um motor | [Unsplash](https://images.unsplash.com/photo-1619642751034-765dfdf7c58e) |
| `sites/assets/oficina/motor.webp` | Correias de motor | [Unsplash](https://images.unsplash.com/photo-1486262715619-67b85e0b08d3) |
| `sites/assets/arquitetura/casa.webp` | Casa com vidro e jardim | [Unsplash](https://images.unsplash.com/photo-1600585154340-be6161a56a0c) |
| `sites/assets/arquitetura/estar.webp` | Sala de estar | [Unsplash](https://images.unsplash.com/photo-1600607687939-ce8a6c25118c) |
| `sites/assets/arquitetura/planta.webp` | Desenho de planta | [Unsplash](https://images.unsplash.com/photo-1503387762-592deb58ef4e) |
| `sites/assets/cursos/volante.webp` | Direção, vista de dentro do carro | [Unsplash](https://images.unsplash.com/photo-1449965408869-eaa3f722e40d) |
| `sites/assets/cursos/fusca.webp` | Fusca na rua | [Unsplash](https://images.unsplash.com/photo-1489824904134-891ab64532f1) |
| `sites/assets/cursos/livros.webp` | Livro aberto | [Unsplash](https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8) |
| `sites/assets/cursos/turma.webp` | Adultos estudando | [Unsplash](https://images.unsplash.com/photo-1523240795612-9a054b0db644) |
| `sites/assets/cursos/caderno.webp` | Caderno de estudo | [Unsplash](https://images.unsplash.com/photo-1434030216411-0b793f4b4173) |

Licença: [Unsplash](https://unsplash.com/license).

A amostra fictícia **Odonto Sorriso Vila Sônia** continua em `sites/odonto-sorriso-vila-sonia/` e não entra na lista das 50. As fotos dela:

| Arquivo | O que mostra | Fonte | Autor | Licença |
| --- | --- | --- | --- | --- |
| `sites/odonto-sorriso-vila-sonia/images/hero.jpg` | Interior claro de consultório, sem pessoas | [Unsplash](https://images.unsplash.com/photo-1629909615184-74f495363b67) | Não confirmado na página pública | [Unsplash](https://unsplash.com/license) |
| `sites/odonto-sorriso-vila-sonia/images/sobre.jpg` | Sala com cadeira preta e branca, sem pessoas | [Pexels](https://www.pexels.com/photo/black-and-white-dentist-chair-4269361/) | Cedric Fauntleroy | [Pexels](https://www.pexels.com/license/) |
| `sites/odonto-sorriso-vila-sonia/images/atendimento.jpg` | Cadeira e equipamentos em close, sem pessoas | [Pexels](https://www.pexels.com/photo/305568/) | Daniel Frank | [Pexels](https://www.pexels.com/license/) |

## Observações

- Prévia para demonstração, não site oficial.
- Não entre em contato com leads a partir deste repositório.
- O WhatsApp da página usa apenas o número público já listado no `config.js`.
