#!/usr/bin/env node
/**
 * Gera as 50 prévias com `node scripts/new-site.mjs <slug>` e grava config, índice e CSV.
 * Uso: node scripts/generate-samples.mjs
 */
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { leads } from "./leads-data.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const NICHE_LABEL = {
  odonto: "Odontologia",
  estetica: "Estética e harmonização facial",
  vet: "Veterinária e pet",
  advocacia: "Advocacia",
  contabil: "Contabilidade",
  fisio: "Fisioterapia e pilates",
  saude: "Psicologia e nutrição",
  oficina: "Oficinas e centros automotivos",
  arq: "Arquitetura, engenharia e reformas",
  cursos: "Idiomas, cursos e autoescolas"
};

const NICHE_ORDER = Object.keys(NICHE_LABEL);

const CTA = {
  odonto: "Agende uma avaliação",
  estetica: "Agende uma avaliação",
  vet: "Agende uma consulta",
  advocacia: "Fale com o escritório",
  contabil: "Peça um contato",
  fisio: "Agende uma avaliação",
  fisiofive: "Agende uma avaliação",
  pilates: "Fale no WhatsApp",
  psico: "Agende uma conversa",
  nutri: "Agende uma consulta",
  oficina: "Peça um orçamento",
  arq: "Peça um orçamento",
  reforma: "Peça um orçamento",
  autoescola: "Fale com a secretaria",
  "autoescola-moto": "Fale com a secretaria",
  idiomas: "Fale com a secretaria"
};

const CONTACT_LEAD = {
  odonto: "Conte o que você precisa e a gente responde pelo WhatsApp.",
  estetica: "Conta o cuidado que você busca. A gente te chama no WhatsApp.",
  vet: "Diz o nome do animal e o que está acontecendo. A gente responde pelo WhatsApp.",
  advocacia: "Conta o assunto em poucas linhas. O escritório retorna pelo WhatsApp.",
  contabil: "Conta o que a empresa precisa. A gente responde pelo WhatsApp.",
  fisio: "Conta a queixa e o período do dia. A gente responde pelo WhatsApp.",
  fisiofive: "Conta a queixa e o período do dia. A gente responde pelo WhatsApp.",
  pilates: "Quer saber os horários de aula? Fala com a gente pelo WhatsApp.",
  psico: "Quer marcar uma primeira conversa? Escreve aqui que a gente chama no WhatsApp.",
  nutri: "Conta se quer marcar uma consulta. A gente responde pelo WhatsApp.",
  oficina: "Diz o modelo do carro e o que ele aprontou. A gente responde pelo WhatsApp.",
  arq: "Conta o tipo de imóvel e o que você quer mudar. A gente responde pelo WhatsApp.",
  reforma: "Diz se é reparo ou reforma. A gente responde pelo WhatsApp.",
  autoescola: "Quer saber turma e horário? A gente responde pelo WhatsApp.",
  "autoescola-moto": "Diz se é carro, moto ou as duas. A gente responde pelo WhatsApp.",
  idiomas: "Diz o idioma e o período. A gente confirma pelo WhatsApp."
};

const CHROME = {
  odonto: ["A clínica", "Atendimentos", "Região", "Contato", "Sobre", "Atendimentos", "Localização", "Contato", "Atendimentos"],
  estetica: ["O espaço", "Cuidados", "Região", "Contato", "Sobre", "Cuidados", "Localização", "Contato", "Cuidados"],
  vet: ["A clínica", "Atendimento", "Região", "Contato", "Sobre", "Serviços", "Localização", "Contato", "Atendimento"],
  advocacia: ["O escritório", "Atendimento", "Região", "Contato", "Sobre", "Atuação", "Localização", "Contato", "Como é o atendimento"],
  contabil: ["O escritório", "Serviços", "Região", "Contato", "Sobre", "Serviços", "Localização", "Contato", "Serviços do escritório"],
  fisio: ["A clínica", "Atendimento", "Região", "Contato", "Sobre", "Atendimento", "Localização", "Contato", "Atendimento"],
  saude: ["O consultório", "Atendimento", "Região", "Contato", "Sobre", "Atendimento", "Localização", "Contato", "Atendimento"],
  oficina: ["A oficina", "Serviços", "Região", "Contato", "Sobre", "Serviços", "Localização", "Contato", "Serviços"],
  arq: ["O escritório", "Trabalho", "Região", "Contato", "Sobre", "Projetos", "Localização", "Contato", "Projetos"],
  cursos: ["A escola", "Aulas", "Região", "Contato", "Sobre", "Aulas", "Localização", "Contato", "Aulas"]
};

const PACKS = {
  odonto: [
    ["Avaliação", "Consulta para entender o que você precisa antes de qualquer procedimento."],
    ["Prevenção", "Limpeza e orientação de higiene, quando fizer parte do plano."],
    ["Restaurações", "Reparos indicados somente depois da avaliação."],
    ["Dúvidas", "Explicação do que pode ser feito, sem promessa de resultado."]
  ],
  estetica: [
    ["Avaliação", "Conversa para ver se algum procedimento faz sentido no seu caso."],
    ["Pele", "Limpeza e rotinas indicadas na avaliação."],
    ["Harmonização facial", "Orientação sobre procedimentos faciais. A indicação é individual."],
    ["Retorno", "Espaço para tirar dúvidas depois do atendimento."]
  ],
  vet: [
    ["Consulta", "Avaliação clínica do animal, com orientação a quem cuida dele."],
    ["Banho e tosa", "Higiene e tosa com horário marcado."],
    ["Exames", "Pedidos quando a consulta indicar."],
    ["Contato direto", "Telefone para remarcar ou avisar que está a caminho."]
  ],
  advocacia: [
    ["Conversa inicial", "Você relata a situação e o escritório diz se pode acompanhar."],
    ["Documentos", "Leitura do que você já tem, sem antecipar desfecho."],
    ["Orientação", "Explicação das opções em linguagem direta."],
    ["Andamento", "Quando existe processo, os próximos passos são combinados."]
  ],
  contabil: [
    ["Rotina contábil", "Organização de documentos e lançamentos."],
    ["Obrigações fiscais", "Apoio no calendário de impostos e declarações."],
    ["Departamento pessoal", "Folha e admissões, conforme a empresa pedir."],
    ["Abertura e alterações", "Orientação para abrir ou ajustar a empresa."]
  ],
  fisio: [
    ["Avaliação", "Primeira conversa para entender a queixa. A conduta vem depois."],
    ["Sessões", "Atendimento definido na avaliação, sem promessa de resultado."],
    ["Orientação", "Exercícios explicados para o dia a dia, quando indicados."],
    ["Remarcação", "Horários pelo telefone."]
  ],
  fisiofive: [
    ["Avaliação", "Antes de pilates ou osteopatia, uma avaliação define o caminho."],
    ["Fisioterapia", "Sessões sem promessa de resultado."],
    ["Pilates", "Aulas indicadas de forma individual."],
    ["Osteopatia", "Atendimento que consta no nome da clínica, sempre após avaliação."]
  ],
  pilates: [
    ["Primeira aula", "Um encontro para conhecer o estúdio e o ritmo."],
    ["Pilates", "Aulas no aparelho ou no solo, conforme a turma."],
    ["Horários", "Grade confirmada pelo WhatsApp."],
    ["Adaptação", "O exercício é ajustado à pessoa, sem promessa de resultado."]
  ],
  psico: [
    ["Primeira conversa", "Um encontro para entender o que você busca."],
    ["Psicoterapia", "Sessões no ritmo combinado. Não há promessa de cura."],
    ["Sigilo", "O que é dito no consultório fica no consultório."],
    ["Horários", "Marcação pelo telefone ou pelo WhatsApp."]
  ],
  nutri: [
    ["Consulta", "Conversa sobre rotina alimentar e histórico."],
    ["Orientação", "Sugestões individuais, definidas na consulta. Sem promessa de resultado."],
    ["Retorno", "Revisão do que foi combinado."],
    ["Marcação", "Horários pelo telefone ou pelo WhatsApp."]
  ],
  oficina: [
    ["Diagnóstico", "Olhada no que você relatou antes de abrir qualquer serviço."],
    ["Revisão", "Fluidos, filtros e itens de rotina, conforme o carro."],
    ["Freios e suspensão", "Verificação quando há barulho, vibração ou desgaste."],
    ["Orçamento", "O valor é passado depois da avaliação do veículo."]
  ],
  arq: [
    ["Conversa inicial", "Entendimento do espaço e do que você quer mudar."],
    ["Estudo", "Layout e referências, antes do projeto executivo."],
    ["Projeto", "Desenhos do que for contratado."],
    ["Obra", "Acompanhamento apenas se isso entrar no combinado."]
  ],
  reforma: [
    ["Visita", "Olhada no que precisa de reparo."],
    ["Orçamento", "Itens e etapas. O valor sai depois da visita."],
    ["Reparos", "Manutenção do que foi fechado no orçamento."],
    ["Reforma", "Execução do escopo combinado, com contato pelo WhatsApp."]
  ],
  autoescola: [
    ["Aulas teóricas", "Conteúdo da formação de condutores, em sala."],
    ["Aulas práticas", "Direção com hora marcada, no carro da autoescola."],
    ["Categoria B", "Aulas de carro. Outras categorias, se houver, a secretaria confirma."],
    ["Matrícula", "Etapas e documentos explicados pela secretaria. Sem promessa de aprovação."]
  ],
  "autoescola-moto": [
    ["Aulas teóricas", "Conteúdo da formação de condutores, em sala."],
    ["Aulas práticas", "Direção com hora marcada, no veículo da escola."],
    ["Categorias", "Carro e moto, como indica o nome da escola. A secretaria confirma a turma."],
    ["Matrícula", "Etapas e documentos explicados pela secretaria. Sem promessa de aprovação."]
  ],
  idiomas: [
    ["Inglês", "Aulas para quem começa ou já estuda."],
    ["Espanhol", "Turmas conforme a grade da escola."],
    ["Horários", "Presencial. A vaga é confirmada na secretaria."],
    ["Matrícula", "Conversa para indicar o nível. Sem promessa de fluência em prazo fixo."]
  ]
};

const PALETTES = {
  odonto: [
    { primary: "#0e5f63", primaryDark: "#0a3f42", accent: "#1f7a86", bg: "#fbfcfb", muted: "#eef4f3", text: "#1c2b2e", textMuted: "#5c6c70", bannerBg: "#e7f0ef", bannerText: "#3e5554", hero: "#0c3336", line: "#d3e3e1" },
    { primary: "#1f4e79", primaryDark: "#16385a", accent: "#3d6f99", bg: "#fafbfc", muted: "#eef2f6", text: "#1b2833", textMuted: "#5a6a78", bannerBg: "#e8eef4", bannerText: "#3d5166", hero: "#12283d", line: "#d5dee8" }
  ],
  estetica: [
    { primary: "#7a4a3a", primaryDark: "#4e2e24", accent: "#a56b52", bg: "#fbf7f3", muted: "#f3ebe4", text: "#2c211c", textMuted: "#6d5c54", bannerBg: "#f3ebe6", bannerText: "#6a5348", hero: "#3d261e", line: "#e6d9cf" },
    { primary: "#3f5c57", primaryDark: "#243936", accent: "#6e8b82", bg: "#f7f6f3", muted: "#eef1ef", text: "#24302d", textMuted: "#5e6d68", bannerBg: "#e7eeeb", bannerText: "#3e524c", hero: "#1d3330", line: "#d5e0dc" }
  ],
  vet: [
    { primary: "#2d6a4f", primaryDark: "#1b4332", accent: "#40916c", bg: "#fbfcfa", muted: "#eef5f0", text: "#1d2b24", textMuted: "#5c6e64", bannerBg: "#e7f2eb", bannerText: "#2f5342", hero: "#143d2c", line: "#d5e6db" },
    { primary: "#8a4e28", primaryDark: "#5c3419", accent: "#c47b45", bg: "#fbf8f4", muted: "#f6efe6", text: "#2b241e", textMuted: "#6e6256", bannerBg: "#f4eadf", bannerText: "#6b5140", hero: "#3a2618", line: "#eadfd2" }
  ],
  advocacia: [
    { primary: "#1e2a3a", primaryDark: "#121a26", accent: "#8c7348", bg: "#f7f6f3", muted: "#efeee9", text: "#1a1f26", textMuted: "#5c6370", bannerBg: "#eceae4", bannerText: "#4c463c", hero: "#121a26", line: "#e0ddd4" },
    { primary: "#243044", primaryDark: "#172033", accent: "#6d7f74", bg: "#f6f5f2", muted: "#ecebe6", text: "#1c232b", textMuted: "#5e6670", bannerBg: "#e8e6e0", bannerText: "#4a463e", hero: "#15202b", line: "#ddd9d0" }
  ],
  contabil: [
    { primary: "#1d3c6e", primaryDark: "#132848", accent: "#2f5d9f", bg: "#f8f9fb", muted: "#eef1f6", text: "#1a2330", textMuted: "#5b6778", bannerBg: "#e6ebf3", bannerText: "#3d4d66", hero: "#12243f", line: "#d8e0ea" },
    { primary: "#0f3d3e", primaryDark: "#0a2a2b", accent: "#1a6a64", bg: "#f7f8f7", muted: "#e8efee", text: "#1a2626", textMuted: "#5a6b6b", bannerBg: "#e3eeed", bannerText: "#345352", hero: "#0c2c2d", line: "#d3e2e0" }
  ],
  fisio: [
    { primary: "#0f6e7a", primaryDark: "#0a4c54", accent: "#3a94a0", bg: "#f7fbfb", muted: "#e7f3f3", text: "#163033", textMuted: "#567075", bannerBg: "#e3f0f0", bannerText: "#36585c", hero: "#0c3d44", line: "#d3e6e6" },
    { primary: "#3d5a4c", primaryDark: "#2a3f35", accent: "#6b8f71", bg: "#f8f7f4", muted: "#eef1ec", text: "#1e2923", textMuted: "#5d6b62", bannerBg: "#e7eee8", bannerText: "#3e5346", hero: "#1c3328", line: "#d7e3da" }
  ],
  saude: [
    { primary: "#5e5346", primaryDark: "#3c342b", accent: "#8c735e", bg: "#fbf8f4", muted: "#f3eee7", text: "#2a241e", textMuted: "#6b5f54", bannerBg: "#f0ebe4", bannerText: "#5c5146", hero: "#2e2822", line: "#e6dfd6" },
    { primary: "#3f6b4a", primaryDark: "#2a4a33", accent: "#6b9460", bg: "#f8faf6", muted: "#eef3ea", text: "#1e291f", textMuted: "#5c6b5c", bannerBg: "#e7f0e4", bannerText: "#3d5340", hero: "#1d3324", line: "#d5e4d4" }
  ],
  oficina: [
    { primary: "#2b2b2b", primaryDark: "#161616", accent: "#b8611a", bg: "#f6f5f2", muted: "#eeece7", text: "#1c1c1c", textMuted: "#5e5a54", bannerBg: "#eceae4", bannerText: "#4a453e", hero: "#1a1a1a", line: "#e0ddd6" },
    { primary: "#3a332c", primaryDark: "#241e1a", accent: "#8c6239", bg: "#f7f4ef", muted: "#efe8de", text: "#241e1a", textMuted: "#6a5e52", bannerBg: "#efe6da", bannerText: "#5c4e42", hero: "#2a221c", line: "#e4d9cc" }
  ],
  arq: [
    { primary: "#1a1a1a", primaryDark: "#111111", accent: "#8d5b3c", bg: "#fafafa", muted: "#f2f1ef", text: "#1a1a1a", textMuted: "#5f5e5c", bannerBg: "#f0eeeb", bannerText: "#4e4c49", hero: "#1a1a1a", line: "#e4e2de" },
    { primary: "#243044", primaryDark: "#172033", accent: "#5e7388", bg: "#f7f6f4", muted: "#eceae6", text: "#1c2128", textMuted: "#5c6570", bannerBg: "#e8e6e2", bannerText: "#454e58", hero: "#172033", line: "#ddd9d3" }
  ],
  cursos: [
    { primary: "#163e6b", primaryDark: "#0e2a4a", accent: "#c45c26", bg: "#f7f8fa", muted: "#eef2f6", text: "#172033", textMuted: "#5a6778", bannerBg: "#e6edf5", bannerText: "#3a4d66", hero: "#0e2a4a", line: "#d6e0ea" },
    { primary: "#0f4c4c", primaryDark: "#0b3333", accent: "#b07d32", bg: "#f7f6f2", muted: "#eef1ee", text: "#1a2624", textMuted: "#5c6b66", bannerBg: "#e6efec", bannerText: "#34524c", hero: "#0b3333", line: "#d5e3df" }
  ]
};

const RADIUS = {
  odonto: "14px",
  estetica: "18px",
  vet: "14px",
  advocacia: "4px",
  contabil: "6px",
  fisio: "12px",
  saude: "16px",
  oficina: "4px",
  arq: "2px",
  cursos: "10px"
};

const ALTS = {
  "odontologia/hero.webp": "Consultório odontológico claro, com cadeira e sem pacientes",
  "odontologia/sala.webp": "Sala de atendimento odontológico com cadeira e bancada",
  "odontologia/janela.webp": "Consultório odontológico com luz de janela",
  "estetica/spa.webp": "Pátio de um espaço de cuidados, com plantas e banco",
  "estetica/produtos.webp": "Frasco, toalha e flores sobre uma bancada",
  "estetica/oleos.webp": "Frasco de óleo sobre fundo escuro, sem pessoas",
  "vet/caes.webp": "Dois cães correndo em um caminho de terra",
  "vet/gato.webp": "Gato preto e branco apoiado em uma cerca",
  "vet/retrato.webp": "Cachorro de porte médio ao ar livre",
  "advocacia/livros.webp": "Estante com livros de direito",
  "advocacia/escrita.webp": "Mãos escrevendo em uma folha",
  "advocacia/balanca.webp": "Balança da justiça em bronze sobre a mesa",
  "contabil/documentos.webp": "Papéis, caneta e calculadora sobre a mesa",
  "contabil/reuniao.webp": "Duas pessoas revisando papéis ao lado de um notebook",
  "contabil/planilhas.webp": "Notebook com gráficos em uma mesa de trabalho",
  "fisio/treino.webp": "Profissional orientando um exercício no solo",
  "fisio/aula.webp": "Aula em grupo em um estúdio com tatames",
  "fisio/yoga.webp": "Silhueta de uma pessoa alongando ao fim do dia",
  "saude/prato.webp": "Tigela com legumes, grãos e ovo",
  "saude/horta.webp": "Bandejas com legumes e verduras",
  "saude/sala.webp": "Sala de espera com poltronas e janelas",
  "oficina/galpao.webp": "Galpão de oficina com peças na parede",
  "oficina/maos.webp": "Mãos trabalhando em um motor",
  "oficina/motor.webp": "Correias e polias de um motor",
  "arquitetura/casa.webp": "Casa com vidro e árvore no jardim",
  "arquitetura/estar.webp": "Sala de estar com sofá claro e madeira",
  "arquitetura/planta.webp": "Pessoa desenhando uma planta sobre a mesa",
  "cursos/volante.webp": "Motorista ao volante, visto de dentro do carro",
  "cursos/fusca.webp": "Fusca amarelo estacionado na rua",
  "cursos/livros.webp": "Livro aberto em frente a uma estante",
  "cursos/turma.webp": "Três adultos estudando juntos em uma mesa",
  "cursos/caderno.webp": "Caderno e caneta em uma mesa de estudo"
};

const IMAGE_SETS = {
  odonto: ["odontologia/hero.webp", "odontologia/sala.webp", "odontologia/janela.webp"],
  estetica: ["estetica/spa.webp", "estetica/produtos.webp", "estetica/oleos.webp"],
  vet: ["vet/caes.webp", "vet/gato.webp", "vet/retrato.webp"],
  advocacia: ["advocacia/livros.webp", "advocacia/escrita.webp", "advocacia/balanca.webp"],
  contabil: ["contabil/documentos.webp", "contabil/reuniao.webp", "contabil/planilhas.webp"],
  fisio: ["fisio/treino.webp", "fisio/aula.webp", "fisio/yoga.webp"],
  psico: ["saude/sala.webp", "saude/prato.webp", "saude/horta.webp"],
  nutri: ["saude/prato.webp", "saude/horta.webp", "saude/sala.webp"],
  oficina: ["oficina/galpao.webp", "oficina/maos.webp", "oficina/motor.webp"],
  arq: ["arquitetura/casa.webp", "arquitetura/estar.webp", "arquitetura/planta.webp"],
  reforma: ["arquitetura/planta.webp", "arquitetura/casa.webp", "arquitetura/estar.webp"],
  autoescola: ["cursos/volante.webp", "cursos/fusca.webp", "cursos/caderno.webp"],
  "autoescola-moto": ["cursos/volante.webp", "cursos/fusca.webp", "cursos/caderno.webp"],
  idiomas: ["cursos/livros.webp", "cursos/turma.webp", "cursos/caderno.webp"]
};

function digits(value) {
  return String(value || "").replace(/\D/g, "");
}

function normalizePhone(raw) {
  let d = digits(raw);
  if (d.startsWith("00")) d = d.slice(2);
  if ((d.length === 10 || d.length === 11) && !d.startsWith("55")) d = "55" + d;
  if (d.length === 12 && d.startsWith("55")) {
    const subscriber = d.slice(4);
    if (subscriber.length === 8 && subscriber.startsWith("9")) return null;
  }
  if ((d.length === 12 || d.length === 13) && d.startsWith("55")) return d;
  return null;
}

function formatPhone(d) {
  const dd = d.slice(2, 4);
  const n = d.slice(4);
  if (n.length === 9) return `(${dd}) ${n.slice(0, 5)}-${n.slice(5)}`;
  if (n.length === 8) return `(${dd}) ${n.slice(0, 4)}-${n.slice(4)}`;
  return `+${d}`;
}

function parsePhones(raw) {
  const parts = String(raw || "").split("/").map((part) => part.trim()).filter(Boolean);
  const seen = new Set();
  const phones = [];
  for (const part of parts) {
    const d = normalizePhone(part);
    if (!d || seen.has(d)) continue;
    seen.add(d);
    phones.push({ display: formatPhone(d), tel: `+${d}`, digits: d, mobile: d.length === 13 && d[4] === "9" });
  }
  return phones;
}

function parseSocial(raw) {
  const cleaned = String(raw || "").replace(/\([^)]*\)/g, " ");
  const instagram = [];
  const facebook = [];
  for (const part of cleaned.split(/[,/]/).map((item) => item.trim()).filter(Boolean)) {
    if (/facebook\.com/i.test(part)) {
      const url = part.startsWith("http") ? part : `https://${part.replace(/^\/\//, "")}`;
      facebook.push(url.replace("https://facebook.com", "https://www.facebook.com"));
    } else {
      const handle = part.replace(/^@/, "").trim();
      if (/^[A-Za-z0-9._]+$/.test(handle)) instagram.push(handle);
    }
  }
  return { instagram, facebook };
}

function rotate(list, index) {
  const n = index % list.length;
  return list.slice(n).concat(list.slice(0, n));
}

function esc(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function servicesFor(lead) {
  const source = Array.isArray(lead.services) && lead.services.length
    ? lead.services
    : (PACKS[lead.sub] || PACKS[lead.niche]);
  return source.map((item) => (
    Array.isArray(item) ? { title: item[0], description: item[1] } : item
  ));
}

function imageSetKey(lead) {
  if (IMAGE_SETS[lead.sub]) return lead.sub;
  return lead.niche;
}

function buildSite(lead, indexInNiche) {
  const phones = parsePhones(lead.phones);
  if (!phones.length) throw new Error(`Sem telefone em ${lead.slug}`);
  const social = parseSocial(lead.social);
  const whatsapp = (phones.find((item) => item.mobile) || phones[0]).digits;
  const layoutName = ["classic", "split", "studio", "panel", "studio"][indexInNiche] || "classic";
  let paletteIndex = indexInNiche === 4 ? 1 : indexInNiche % 2;
  if (lead.sub === "idiomas") paletteIndex = 1;
  const colors = PALETTES[lead.niche][paletteIndex];
  const chrome = CHROME[lead.niche];
  const imgs = rotate(IMAGE_SETS[imageSetKey(lead)], indexInNiche);
  const region = `${lead.bairro}, ${lead.cidade}`;
  let serviceTitle = chrome[8];
  let servicesKicker = chrome[1];
  let navServices = chrome[5];
  if (lead.sub === "reforma") {
    serviceTitle = "Reparos e reformas";
    servicesKicker = "Serviços";
    navServices = "Serviços";
  } else if (lead.sub === "pilates" || lead.sub === "idiomas" || lead.sub === "autoescola" || lead.sub === "autoescola-moto") {
    serviceTitle = "Aulas";
    servicesKicker = "Aulas";
    navServices = "Aulas";
  } else if (lead.sub === "nutri") {
    serviceTitle = "Consulta de nutrição";
  } else if (lead.sub === "psico") {
    serviceTitle = "Atendimento psicológico";
  }
  if (lead.servicesTitle) serviceTitle = lead.servicesTitle;
  return {
    config: {
      name: lead.nome,
      shortName: lead.shortName,
      region,
      tagline: lead.tagline,
      heroText: lead.hero,
      aboutKicker: chrome[0],
      aboutTitle: "Sobre",
      aboutLead: lead.aboutLead,
      aboutText: lead.about,
      servicesKicker,
      servicesTitle: serviceTitle,
      servicesIntro: lead.intro,
      services: servicesFor(lead),
      locationKicker: chrome[2],
      locationTitle: "Onde fica",
      locationText: lead.location,
      hoursLabel: "Horário",
      hours: lead.hours || "Horário combinado pelo WhatsApp",
      contactKicker: chrome[3],
      contactTitle: "Contato",
      contactLead: lead.contact || CONTACT_LEAD[lead.sub] || CONTACT_LEAD[lead.niche],
      navAbout: chrome[4],
      navServices,
      navLocation: chrome[6],
      navContact: chrome[7],
      ctaLabel: CTA[lead.sub] || CTA[lead.niche],
      ctaLink: "#contato",
      formButton: "Falar no WhatsApp",
      whatsapp,
      phoneDisplay: phones[0].display,
      phones: phones.map(({ display, tel }) => ({ display, tel })),
      instagram: social.instagram,
      facebook: social.facebook,
      mapQuery: `${lead.nome}, ${lead.bairro}, ${lead.cidade} - SP`,
      banner: "Prévia demonstrativa",
      footerNote: `© ${lead.shortName} · Prévia demonstrativa — página modelo.`,
      layout: layoutName,
      font: lead.niche,
      radius: RADIUS[lead.niche],
      images: {
        hero: { src: `../assets/${imgs[0]}`, alt: ALTS[imgs[0]] },
        about: { src: `../assets/${imgs[1]}`, alt: ALTS[imgs[1]] },
        services: { src: `../assets/${imgs[2]}`, alt: ALTS[imgs[2]] }
      },
      colors
    },
    phones,
    whatsapp,
    social
  };
}

function channelHtml(built) {
  const items = [];
  for (const phone of built.phones) {
    items.push(`<li><a href="tel:${esc(phone.tel)}">${esc(phone.display)}</a></li>`);
  }
  const waPhones = built.phones.filter((item) => item.mobile);
  const waList = waPhones.length ? waPhones : [built.phones[0]];
  for (const phone of waList) {
    const label = waList.length > 1 ? `WhatsApp · ${phone.display}` : "WhatsApp";
    items.push(`<li><a href="https://wa.me/${phone.digits}" target="_blank" rel="noopener noreferrer">${esc(label)}</a></li>`);
  }
  for (const handle of built.social.instagram) {
    items.push(`<li><a href="https://instagram.com/${esc(handle)}" target="_blank" rel="noopener noreferrer">Instagram · @${esc(handle)}</a></li>`);
  }
  for (const url of built.social.facebook) {
    items.push(`<li><a href="${esc(url)}" target="_blank" rel="noopener noreferrer">Facebook</a></li>`);
  }
  return `<ul class="channel-list">\n          ${items.join("\n          ")}\n        </ul>`;
}

function quickHtml(built) {
  const phone = built.phones[0];
  const wa = built.phones.find((item) => item.mobile) || built.phones[0];
  return `<a href="tel:${esc(phone.tel)}">Ligar</a><a href="https://wa.me/${wa.digits}" target="_blank" rel="noopener noreferrer">WhatsApp</a>`;
}

function cssVars(colors, radius) {
  const map = {
    primary: "--c-primary",
    primaryDark: "--c-primary-dark",
    accent: "--c-accent",
    bg: "--c-bg",
    muted: "--c-muted",
    text: "--c-text",
    textMuted: "--c-text-muted",
    bannerBg: "--c-banner-bg",
    bannerText: "--c-banner-text",
    hero: "--c-hero",
    line: "--c-line"
  };
  const lines = Object.entries(map).map(([key, css]) => `${css}:${colors[key]}`);
  lines.push(`--radius:${radius}`);
  return lines.join(";");
}

function patchHtml(html, lead, built) {
  const long = lead.nome.length > 46 ? ' data-longname="1"' : "";
  html = html.replace("<body>", `<body data-layout="${built.config.layout}" data-font="${built.config.font}"${long}>`);
  html = html.replace(
    "</head>",
    `  <style>:root{${cssVars(built.config.colors, built.config.radius)}}</style>\n</head>`
  );
  html = html.replace("<title>Prévia demonstrativa</title>", `<title>${esc(lead.nome)} — Prévia demonstrativa</title>`);
  html = html.replace('<h1 data-field="name"></h1>', `<h1 data-field="name">${esc(lead.nome)}</h1>`);
  html = html.replace(
    '<div class="contact-channels" data-channels></div>',
    `<div class="contact-channels" data-channels>\n        ${channelHtml(built)}\n      </div>`
  );
  html = html.replace(
    '<div class="quick-contact" data-quick hidden></div>',
    `<div class="quick-contact" data-quick>${quickHtml(built)}</div>`
  );
  const mapSrc = "https://www.google.com/maps?q=" + encodeURIComponent(built.config.mapQuery) + "&output=embed";
  html = html.replace('src="about:blank"', `src="${mapSrc.replace(/&/g, "&amp;")}"`);
  html = html.replace(
    '<dd data-field="hours">Horário combinado pelo WhatsApp</dd>',
    `<dd data-field="hours">${esc(built.config.hours)}</dd>`
  );
  html = html.replace(
    '<p class="footer-note" data-field="footerNote">Prévia demonstrativa — página modelo.</p>',
    `<p class="footer-note" data-field="footerNote">${esc(built.config.footerNote)}</p>`
  );
  return html;
}

function csvCell(value) {
  const text = String(value);
  if (/[",\n]/.test(text)) return `"${text.replace(/"/g, '""')}"`;
  return text;
}

function writeIndex(groups) {
  const sections = NICHE_ORDER.map((key) => {
    const items = groups[key].map((lead) => `        <li><a href="./${lead.slug}/">${esc(lead.nome)}</a></li>`).join("\n");
    return `      <section>
        <h2>${esc(NICHE_LABEL[key])}</h2>
        <ul>
${items}
        </ul>
      </section>`;
  }).join("\n");

  const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex, nofollow">
  <title>Prévias demonstrativas — 50 amostras</title>
  <style>
    :root { color-scheme: light; }
    * { box-sizing: border-box; }
    body { margin: 0; font-family: "Segoe UI", "Helvetica Neue", Arial, sans-serif; color: #1c2430; background: #f6f4f0; line-height: 1.5; }
    .preview-banner { background: #efeae2; color: #5c5146; text-align: center; font-size: 0.72rem; letter-spacing: 0.14em; text-transform: uppercase; font-weight: 700; padding: 8px 12px; }
    main { width: min(880px, calc(100% - 32px)); margin: 0 auto; padding: 36px 0 64px; }
    h1 { font-family: Palatino, "Palatino Linotype", Georgia, serif; font-size: clamp(1.8rem, 3vw, 2.4rem); letter-spacing: -0.03em; margin: 0 0 8px; }
    .intro { color: #5c6570; max-width: 62ch; }
    section { margin-top: 28px; }
    h2 { font-size: 1.05rem; margin: 0 0 8px; padding-bottom: 6px; border-bottom: 1px solid #e0dbd3; }
    ul { list-style: none; margin: 0; padding: 0; }
    li { border-bottom: 1px solid #ebe6de; }
    a { display: block; padding: 10px 2px; color: #1d3c6e; text-decoration: none; font-weight: 650; }
    a:hover { color: #0e2a4a; }
    footer { color: #6a6258; font-size: 0.85rem; margin-top: 28px; }
  </style>
</head>
<body>
  <div class="preview-banner">Prévia demonstrativa</div>
  <main>
    <h1>50 prévias demonstrativas</h1>
    <p class="intro">Uma página por estabelecimento, agrupadas por nicho. São amostras, não os sites oficiais. Entram só dados públicos: nome, bairro, telefone, Instagram e serviços genéricos do nicho.</p>
${sections}
    <footer>Prévia demonstrativa — página modelo.</footer>
  </main>
</body>
</html>
`;
  fs.writeFileSync(path.join(root, "sites", "index.html"), html);
}

function writeCsv(rows) {
  const lines = ["\uFEFFnome do lead,slug,link"];
  for (const row of rows) {
    lines.push([csvCell(row.nome), csvCell(row.slug), csvCell(row.link)].join(","));
  }
  fs.writeFileSync(path.join(root, "amostras_links.csv"), lines.join("\n") + "\n");
}

if (leads.length !== 50) {
  console.error(`Esperadas 50 amostras, encontradas ${leads.length}`);
  process.exit(1);
}

const slugs = new Set();
const groups = Object.fromEntries(NICHE_ORDER.map((key) => [key, []]));
const counts = Object.fromEntries(NICHE_ORDER.map((key) => [key, 0]));
const csvRows = [];

for (const lead of leads) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(lead.slug)) {
    throw new Error(`Slug inválido: ${lead.slug}`);
  }
  if (slugs.has(lead.slug)) throw new Error(`Slug repetido: ${lead.slug}`);
  slugs.add(lead.slug);
  const indexInNiche = counts[lead.niche];
  counts[lead.niche] += 1;
  const built = buildSite(lead, indexInNiche);
  const dest = path.join(root, "sites", lead.slug);
  fs.rmSync(dest, { recursive: true, force: true });
  const created = spawnSync(process.execPath, ["scripts/new-site.mjs", lead.slug], { cwd: root, encoding: "utf8" });
  if (created.status !== 0) {
    console.error(created.stderr || created.stdout);
    process.exit(created.status || 1);
  }
  fs.rmSync(path.join(dest, "images"), { recursive: true, force: true });
  const configText = "/* Prévia demonstrativa. Só dados públicos do estabelecimento. */\nwindow.SITE = " + JSON.stringify(built.config, null, 2) + ";\n";
  fs.writeFileSync(path.join(dest, "config.js"), configText);
  const htmlPath = path.join(dest, "index.html");
  const html = patchHtml(fs.readFileSync(htmlPath, "utf8"), lead, built);
  fs.writeFileSync(htmlPath, html);
  groups[lead.niche].push(lead);
  csvRows.push({
    nome: lead.nome,
    slug: lead.slug,
    link: `https://peoyarzo.github.io/amostras-sites/sites/${lead.slug}/`
  });
  const wa = built.phones.filter((item) => item.mobile).map((item) => item.display).join(" | ") || built.phones[0].display;
  console.log(`${lead.slug}  tel ${built.phones.map((item) => item.display).join(" · ")}  wa ${wa}`);
}

writeIndex(groups);
writeCsv(csvRows);
console.log(`\n${leads.length} amostras em sites/ e amostras_links.csv`);
