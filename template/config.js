/**
 * Dados do site. A página lê window.SITE.
 * Preencha só com dados públicos: nome, região, telefone, Instagram e serviços genéricos.
 * Deixe whatsapp vazio até ter um número público. Sem e-mail e sem registro de conselho.
 */
window.SITE = {
  name: "Nome do consultório",
  shortName: "Consultório",
  region: "Bairro, Cidade",
  tagline: "Uma frase curta sobre o atendimento.",
  heroText: "Um texto curto, no tom de quem recebe a pessoa e explica o atendimento.",
  aboutKicker: "A clínica",
  aboutTitle: "Sobre",
  aboutLead: "Onde fica e para quem é o atendimento.",
  aboutText: "Segundo parágrafo. Sem nomes de equipe, sem registro profissional e sem anos de mercado inventados.",
  servicesKicker: "Atendimentos",
  servicesTitle: "Atendimentos",
  servicesIntro: "Serviços genéricos. O que será feito depende da avaliação.",
  services: [
    {
      title: "Avaliação",
      description: "Conversa inicial para entender a demanda."
    },
    {
      title: "Rotina",
      description: "Cuidados de manutenção, quando indicados."
    },
    {
      title: "Orientação",
      description: "A gente explica as opções com calma, para você decidir."
    },
    {
      title: "Retorno",
      description: "Remarcação pelo telefone ou pelo WhatsApp."
    }
  ],
  locationKicker: "Região",
  locationTitle: "Onde fica",
  locationText: "Só a região. O endereço completo fica para o agendamento.",
  hoursLabel: "Horário",
  hours: "Horário combinado pelo WhatsApp",
  contactKicker: "Contato",
  contactTitle: "Contato",
  contactLead: "Conte rapidinho o que você precisa e a gente responde pelo WhatsApp.",
  navAbout: "Sobre",
  navServices: "Atendimentos",
  navLocation: "Localização",
  navContact: "Contato",
  ctaLabel: "Agende uma avaliação",
  ctaLink: "#contato",
  formButton: "Falar no WhatsApp",
  whatsapp: "",
  phoneDisplay: "",
  phones: [],
  instagram: [],
  facebook: [],
  mapQuery: "São Paulo - SP",
  banner: "Prévia demonstrativa",
  footerNote: "Prévia demonstrativa — página modelo.",
  layout: "classic",
  font: "odonto",
  radius: "14px",
  images: {
    hero: {
      src: "images/hero.jpg",
      alt: "Ambiente de atendimento"
    },
    about: {
      src: "images/sobre.jpg",
      alt: "Detalhe do espaço"
    },
    services: {
      src: "images/atendimento.jpg",
      alt: "Outro ângulo do espaço"
    }
  },
  colors: {
    primary: "#0c6b6e",
    primaryDark: "#084f52",
    accent: "#1d8aa3",
    bg: "#fbfcfb",
    muted: "#eef4f3",
    text: "#1c2b2e",
    textMuted: "#5c6c70",
    bannerBg: "#e7f0ef",
    bannerText: "#3e5554",
    hero: "#0c3336",
    line: "#d5e4e2"
  }
};
