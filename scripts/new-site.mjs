#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const slug = process.argv[2];

function fail(message) {
  console.error(message);
  process.exit(1);
}

if (!slug) {
  fail("Uso: node scripts/new-site.mjs <slug>\nExemplo: node scripts/new-site.mjs odonto-centro");
}

if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
  fail("O slug deve ter só letras minúsculas, números e hífens. Ex.: odonto-centro");
}

const dest = path.join(root, "sites", slug);
if (fs.existsSync(dest)) {
  fail(`A pasta já existe: sites/${slug}`);
}

const templateDir = path.join(root, "template");
const files = ["index.html", "styles.css", "app.js", "config.js", "favicon.svg"];

fs.mkdirSync(path.join(dest, "images"), { recursive: true });

for (const file of files) {
  const from = path.join(templateDir, file);
  if (!fs.existsSync(from)) {
    fail(`Arquivo ausente no template: ${file}`);
  }
  fs.copyFileSync(from, path.join(dest, file));
}

const keep = path.join(dest, "images", ".gitkeep");
fs.writeFileSync(keep, "");

console.log(`Site criado em sites/${slug}/`);
console.log("");
console.log("Próximos passos:");
console.log(`  1. Edite sites/${slug}/config.js com o nome, a região e os textos.`);
console.log(`  2. Coloque as fotos em sites/${slug}/images/ (hero.jpg, sobre.jpg, atendimento.jpg).`);
console.log("  3. Na raiz do repositório, sirva os arquivos e abra:");
console.log(`     python3 -m http.server 8080`);
console.log(`     http://127.0.0.1:8080/sites/${slug}/`);
