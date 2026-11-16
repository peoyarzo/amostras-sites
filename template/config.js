/**
 * Dados do site — edite este arquivo para criar uma nova amostra.
 * A página lê window.SITE e monta o conteúdo automaticamente.
 * Deixe whatsapp vazio até ter um número. O botão CTA usa ctaLink.
 */
window.SITE = {
  name: "Nome do consultório",
  shortName: "Nome curto",
  region: "Bairro, Cidade/UF",
  tagline: "Uma frase curta e acolhedora sobre o consultório.",
  heroText: "Texto breve do destaque, sem promessas, prêmios ou especialidades inventadas.",
  aboutTitle: "Sobre",
  aboutLead: "Parágrafo de abertura, genérico e convidativo.",
  aboutText: "Segundo parágrafo. Explique o ambiente e a forma de atender, sem nomes de profissionais, CRO, anos de experiência, depoimentos ou prêmios.",
  servicesTitle: "Atendimentos odontológicos",
  servicesIntro: "Frase curta sobre os atendimentos, sempre após avaliação.",
  services: [
    {
      title: "Avaliação e consulta",
      description: "Conversa inicial para entender suas necessidades e indicar o caminho mais adequado."
    },
    {
      title: "Prevenção e limpeza",
      description: "Cuidados de rotina para manter a saúde bucal em dia."
    },
    {
      title: "Restaurações",
      description: "Reparos em dentes danificados, sempre após avaliação."
    },
    {
      title: "Clareamento (sob avaliação)",
      description: "Orientação sobre clareamento, indicado somente quando for adequado ao seu caso."
    },
    {
      title: "Orientação para tratamentos",
      description: "Explicamos as opções com clareza, para que você decida com tranquilidade."
    }
  ],
  locationTitle: "Onde estamos",
  locationText: "Informe só a região. O endereço exato pode ficar para o agendamento.",
  hoursLabel: "Horário",
  hours: "A confirmar",
  contactTitle: "Contato",
  contactPlaceholder: "Contato via WhatsApp (número a definir)",
  ctaLabel: "Agende sua avaliação",
  ctaLink: "#contato",
  whatsapp: "",
  mapQuery: "Vila Sônia, São Paulo - SP",
  banner: "Prévia demonstrativa",
  footerNote: "Prévia demonstrativa. Página modelo, sem indexação em buscadores.",
  images: {
    hero: {
      src: "images/hero.jpg",
      alt: "Consultório odontológico em ambiente claro"
    },
    about: {
      src: "images/sobre.jpg",
      alt: "Sala de atendimento odontológico"
    },
    services: {
      src: "images/atendimento.jpg",
      alt: "Equipamentos odontológicos em consultório"
    }
  },
  colors: {
    primary: "#0c6b6e",
    primaryDark: "#084f52",
    accent: "#1d8aa3",
    bg: "#ffffff",
    muted: "#f3f8f8",
    text: "#1a2c33",
    textMuted: "#5a6b73",
    bannerBg: "#eef4f4",
    bannerText: "#4a5f5f"
  }
};
