#!/usr/bin/env node
/**
 * Confere as prévias em sites/:
 * noindex, faixa "Prévia demonstrativa", ausência de "lorem",
 * tel: e wa.me quando há telefone, imagens até 200 KB.
 *
 * Uso: node scripts/check-amostras.mjs
 */
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const sitesDir = path.join(root, "sites");
const MAX_IMAGE = 200 * 1024;
const failures = [];

function fail(message) {
  failures.push(message);
}

function walk(dir, acc = []) {
  if (!fs.existsSync(dir)) return acc;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, acc);
    else acc.push(full);
  }
  return acc;
}

function loadSite(configPath) {
  const code = fs.readFileSync(configPath, "utf8");
  const sandbox = { window: {} };
  vm.runInNewContext(code, sandbox, { filename: configPath });
  return sandbox.window.SITE;
}

function digits(value) {
  return String(value || "").replace(/\D/g, "");
}

const htmlFiles = [];
const indexPath = path.join(sitesDir, "index.html");
if (!fs.existsSync(indexPath)) fail("sites/index.html ausente");
else htmlFiles.push(indexPath);

const sampleDirs = fs
  .readdirSync(sitesDir, { withFileTypes: true })
  .filter((entry) => entry.isDirectory() && entry.name !== "assets" && !entry.name.startsWith("figurinhas-"))
  .map((entry) => entry.name)
  .sort();

for (const name of sampleDirs) {
  const file = path.join(sitesDir, name, "index.html");
  if (!fs.existsSync(file)) fail(`${name}: index.html ausente`);
  else htmlFiles.push(file);
}

let pagesWithPhone = 0;
let imageCount = 0;
let largest = { size: 0, file: "" };

for (const file of htmlFiles) {
  const rel = path.relative(root, file);
  const html = fs.readFileSync(file, "utf8");
  const dir = path.dirname(file);
  const parts = [html];
  for (const extra of ["config.js", "app.js", "styles.css"]) {
    const extraPath = path.join(dir, extra);
    if (fs.existsSync(extraPath)) parts.push(fs.readFileSync(extraPath, "utf8"));
  }
  const blob = parts.join("\n");

  if (!/name="robots"\s+content="noindex,\s*nofollow"/.test(html)) {
    fail(`${rel}: meta robots noindex, nofollow ausente`);
  }
  if (!html.includes("Prévia demonstrativa")) {
    fail(`${rel}: faixa "Prévia demonstrativa" ausente no HTML`);
  }
  if (/lorem/i.test(blob)) {
    fail(`${rel}: contém "lorem"`);
  }
  if (/http:\/\//i.test(blob)) fail(`${rel}: URL http insegura`);
  if (/<video\b|\.mp4\b/i.test(blob)) fail(`${rel}: vídeo encontrado`);
  if (/[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}/.test(blob)) fail(`${rel}: e-mail encontrado`);
  if (/R\$\s?\d/.test(blob)) fail(`${rel}: preço em reais encontrado`);
  if (/\b(CRO|OAB|CRP|CRN|CRMV|CREFITO|CREA|CAU|CRC)[\s.:/-]*\d/i.test(blob)) {
    fail(`${rel}: número de registro profissional`);
  }
  if (/antes\s+e\s+depois|resultado garantido|aprovação garantida|ganhe sua causa/i.test(blob)) {
    fail(`${rel}: promessa ou antes/depois`);
  }

  const visibleHtml = html
    .replace(/<script\b[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ");
  const visibleBits = [visibleHtml];
  const configPathEarly = path.join(dir, "config.js");
  if (fs.existsSync(configPathEarly)) {
    const siteText = loadSite(configPathEarly);
    const collect = (value) => {
      if (typeof value === "string") visibleBits.push(value);
      else if (Array.isArray(value)) value.forEach(collect);
      else if (value && typeof value === "object") Object.values(value).forEach(collect);
    };
    collect(siteText);
  }
  const visible = visibleBits.join("\n");
  const bannedVisible = ["nesta página", "promessa", "preço", "parcel", "nada é enviado"];
  const visibleLower = visible.toLowerCase();
  for (const word of bannedVisible) {
    const at = visibleLower.indexOf(word);
    if (at === -1) continue;
    const snippet = visible.slice(Math.max(0, at - 36), at + word.length + 36).replace(/\s+/g, " ").trim();
    fail(`${rel}: texto visível contém "${word}" → ${snippet}`);
  }

  const configPath = path.join(dir, "config.js");
  if (!fs.existsSync(configPath)) continue;
  const site = loadSite(configPath);
  const phones = Array.isArray(site.phones) ? site.phones : [];
  const whatsapp = digits(site.whatsapp);
  if (!phones.length && !whatsapp) continue;
  pagesWithPhone += 1;
  const app = fs.readFileSync(path.join(dir, "app.js"), "utf8");
  if (!app.includes("wa.me") || !app.includes("tel:")) {
    fail(`${rel}: app.js não monta wa.me e tel:`);
  }
  if (!app.includes("preventDefault") || !app.includes("encodeURIComponent")) {
    fail(`${rel}: formulário não abre o WhatsApp com texto`);
  }
  for (const phone of phones) {
    const tel = String(phone.tel || "");
    if (!tel.startsWith("+") || digits(tel).length < 12) {
      fail(`${rel}: telefone inválido ${tel}`);
    }
    if (!html.includes(`tel:${tel}`) && !html.includes(`tel:${encodeURIComponent(tel)}`)) {
      fail(`${rel}: falta link tel:${tel}`);
    }
  }
  if (!whatsapp || whatsapp.length < 12) fail(`${rel}: whatsapp ausente`);
  else if (!html.includes(`https://wa.me/${whatsapp}`) && !html.includes(`wa.me/${whatsapp}`)) {
    fail(`${rel}: falta https://wa.me/${whatsapp}`);
  }
  for (const key of ["hero", "about", "services"]) {
    const src = site.images && site.images[key] && site.images[key].src;
    if (!src) {
      fail(`${rel}: imagem ${key} ausente`);
      continue;
    }
    const imgPath = path.resolve(dir, src);
    if (!fs.existsSync(imgPath)) fail(`${rel}: arquivo de imagem inexistente ${src}`);
  }
  if (!html.includes("maps?q=") || !html.includes("output=embed")) {
    fail(`${rel}: mapa incorporado ausente`);
  }
}

const images = walk(sitesDir).filter((file) => /\.(webp|jpe?g|png|gif)$/i.test(file));
for (const file of images) {
  const size = fs.statSync(file).size;
  imageCount += 1;
  if (size > largest.size) largest = { size, file: path.relative(root, file) };
  if (size > MAX_IMAGE) {
    fail(`${path.relative(root, file)}: ${(size / 1024).toFixed(1)} KB (limite 200 KB)`);
  }
}

const csvPath = path.join(root, "amostras_links.csv");
if (!fs.existsSync(csvPath)) fail("amostras_links.csv ausente");
else {
  const raw = fs.readFileSync(csvPath, "utf8").replace(/^\uFEFF/, "");
  const lines = raw.split(/\r?\n/).filter(Boolean);
  const header = lines[0];
  if (header !== "nome do lead,slug,link") fail(`cabeçalho do CSV inesperado: ${header}`);
  const rows = lines.slice(1).map((line) => {
    const cols = [];
    let cur = "";
    let quoted = false;
    for (let i = 0; i < line.length; i += 1) {
      const ch = line[i];
      if (ch === '"') {
        if (quoted && line[i + 1] === '"') {
          cur += '"';
          i += 1;
        } else quoted = !quoted;
      } else if (ch === "," && !quoted) {
        cols.push(cur);
        cur = "";
      } else cur += ch;
    }
    cols.push(cur);
    return cols;
  });
  if (rows.length !== 50) fail(`CSV deveria ter 50 linhas, tem ${rows.length}`);
  const seen = new Set();
  for (const [nome, slug, link] of rows) {
    if (!nome || !slug || !link) fail(`CSV incompleto: ${slug || nome}`);
    if (seen.has(slug)) fail(`slug repetido no CSV: ${slug}`);
    seen.add(slug);
    const expected = `https://peoyarzo.github.io/amostras-sites/sites/${slug}/`;
    if (link !== expected) fail(`${slug}: link ${link}`);
    const configPath = path.join(sitesDir, slug, "config.js");
    if (!fs.existsSync(configPath)) fail(`CSV aponta para pasta ausente: ${slug}`);
    else {
      const site = loadSite(configPath);
      if (site.name !== nome) fail(`${slug}: nome do CSV difere do config (${site.name})`);
    }
  }
}

const leadPages = htmlFiles.filter((file) => file !== indexPath).length;
console.log(`Páginas HTML em sites/: ${htmlFiles.length} (índice + ${leadPages} amostras)`);
console.log(`Amostras com telefone/WhatsApp checados: ${pagesWithPhone}`);
console.log(`Imagens: ${imageCount}; maior: ${(largest.size / 1024).toFixed(1)} KB (${largest.file})`);
if (failures.length) {
  console.log(`Falhas: ${failures.length}`);
  for (const item of failures) console.log(`- ${item}`);
  process.exit(1);
}
console.log("Resultado: ok. noindex, faixa Prévia demonstrativa, sem lorem, tel:/wa.me e imagens dentro do limite.");
