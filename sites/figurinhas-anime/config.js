/* ============================================================
   CONFIG DA LANDING — é aqui que você troca as coisas.
   Nada fora deste arquivo precisa ser editado para ir ao ar.
   ============================================================ */
window.SITE = {
  // Nome provisório do bot. Opções em estudo: Figuriz, Zapfig, Figurinha Já.
  BOT_NAME: 'Figuriz',

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
    { id: '15',        name: '15 figurinhas', cents: 350,  credits: 15 },
    { id: '25',        name: '25 figurinhas', cents: 650,  credits: 25 },
    { id: 'semanal',   name: 'Semanal',       cents: 490,  days: 7,  promo: true },
    { id: '30',        name: '30 dias',       cents: 690,  days: 30, best: 'Melhor custo-benefício' },
    { id: 'trimestral',name: '3 meses',       cents: 1790, days: 90, best2: 'Menor preço por dia' }
  ]
};
