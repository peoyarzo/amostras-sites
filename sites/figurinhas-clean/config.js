/* ============================================================
   CONFIG DA LANDING — é aqui que você troca as coisas.
   Nada fora deste arquivo precisa ser editado para ir ao ar.
   ============================================================ */
window.SITE = {
  // Nome provisório do bot. Nome definido pelo Pedro: Zapfig.
  BOT_NAME: 'Zapfig',

  // Número do chip do bot, só dígitos, com DDI+DDD (ex.: '5511999999999').
  // AINDA É PLACEHOLDER: enquanto tiver "X", o botão avisa em vez de abrir o WhatsApp.
  // NUNCA usar 5511976882096 (número do admin) — o app.js recusa.
  BOT_NUMBER: '55XXXXXXXXXXX',

  // Enquanto true: faixa "prévia", depoimentos de exemplo e aviso no botão.
  // Quando o bot entrar no ar: false (e troque o noindex do <head>).
  PREVIEW: true,

  // Depoimentos REAIS entram aqui (nome + texto + opcional cidade). Vazio = seção some.
  // Ex.: { name: 'Fulana', city: 'Campinas', text: 'Texto autorizado pela pessoa.' }
  TESTIMONIALS: [],

  // Planos (espelham o config do bot: priceCents, credits ou days).
  PLANS: [
    { id: '15',         name: '15 figurinhas', cents: 350,  credits: 15, validity: 'vale por 1 mês' },
    { id: '25',         name: '25 figurinhas', cents: 550,  credits: 25, validity: 'não vence' },
    { id: 'semanal',    name: 'Semanal',       cents: 790,  days: 7 },
    { id: '30',         name: '30 dias',       cents: 1490, days: 30 },
    { id: 'trimestral', name: '3 meses',       cents: 1990, days: 90, best: 'Melhor custo-benefício' }
  ]
};
