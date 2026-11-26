(function () {
  'use strict';
  var S = window.SITE || {};
  var digits = String(S.BOT_NUMBER || '').replace(/\D/g, '');
  var isPlaceholder = /[^0-9]/.test(String(S.BOT_NUMBER || '')) || digits.length < 12;
  var BLOCKED = ['5511976882096', '11976882096'];

  if (BLOCKED.indexOf(digits) !== -1) {
    console.error('BOT_NUMBER não pode ser o número do admin.');
    S.BOT_NUMBER = '55XXXXXXXXXXX';
    digits = '';
    isPlaceholder = true;
  }

  function brl(c) { return 'R$ ' + (c / 100).toFixed(2).replace('.', ','); }
  function waLink(text) {
    var base = 'https://wa.me/' + (isPlaceholder ? String(S.BOT_NUMBER) : digits);
    return text ? base + '?text=' + encodeURIComponent(text) : base;
  }
  function $all(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  // Nome do bot
  $all('[data-bot-name]').forEach(function (el) { el.textContent = S.BOT_NAME; });
  document.title = document.title.replace('{{BOT_NAME}}', S.BOT_NAME);

  // Planos
  var plansEl = document.getElementById('plans');
  if (plansEl) {
    plansEl.innerHTML = (S.PLANS || []).map(function (p, i) {
      var unlimited = !!p.days;
      var per = unlimited
        ? 'só ' + brl(Math.round(p.cents / p.days)) + ' por dia'
        : brl(Math.round(p.cents / p.credits)) + ' por figurinha';
      var what = unlimited ? p.days + ' dias sem limite' : p.credits + ' figurinhas, ' + p.validity;
      var badge = p.best || p.best2 || (p.promo ? 'Promoção' : '');
      var cls = 'plan plan--c' + i + (p.best ? ' plan--best' : '') + (p.promo ? ' plan--promo' : '');
      return '<article class="' + cls + '">' +
        (badge ? '<span class="plan__badge">' + esc(badge) + '</span>' : '') +
        '<h3 class="plan__name">' + esc(p.name) + '</h3>' +
        '<p class="plan__price">' + brl(p.cents) + '</p>' +
        '<p class="plan__what">' + esc(what) + '</p>' +
        '<p class="plan__per">' + esc(per) + '</p>' +
        '<a class="btn btn--plan" data-wa="/comprar ' + esc(p.id) + '" href="#">Escolher</a>' +
        '</article>';
    }).join('');
  }

  // Depoimentos
  var tEl = document.getElementById('testimonials');
  if (tEl) {
    var list = S.TESTIMONIALS || [];
    if (list.length) {
      tEl.querySelector('.t-list').innerHTML = list.map(function (t) {
        return '<figure class="t-card"><blockquote>' + esc(t.text) + '</blockquote><figcaption>' + esc(t.name) + (t.city ? ' · ' + esc(t.city) : '') + '</figcaption></figure>';
      }).join('');
      tEl.hidden = false;
    } else if (S.PREVIEW) {
      tEl.hidden = false; // modo prévia: mostra os espaços de exemplo
    }
  }

  // Faixa de prévia
  var strip = document.getElementById('preview-strip');
  if (strip && !S.PREVIEW) strip.hidden = true;

  // Links do WhatsApp
  var toast = document.getElementById('toast');
  var toastTimer;
  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg; toast.classList.add('is-on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove('is-on'); }, 3800);
  }
  $all('[data-wa]').forEach(function (a) {
    var v = a.getAttribute('data-wa');
    var msg = (v === 'trial' || v === 'hi') ? 'Oi! Quero fazer figurinhas' : v;
    a.href = waLink(msg);
    a.target = '_blank';
    a.rel = 'noopener';
    a.addEventListener('click', function (e) {
      if (isPlaceholder) {
        e.preventDefault();
        showToast('Prévia: o número do bot ainda não foi configurado.');
      }
    });
  });

  // CTA fixo no mobile: aparece depois do hero
  var sticky = document.getElementById('sticky-cta');
  var hero = document.getElementById('hero');
  if (sticky && hero && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (en) {
      sticky.classList.toggle('is-on', !en[0].isIntersecting);
    }, { threshold: 0 }).observe(document.getElementById('hero-cta') || hero);
  } else if (sticky) { sticky.classList.add('is-on'); }

  // Demo do chat: mensagens entram em sequência, o bot "digita" antes de responder
  var chat = document.getElementById('chat');
  if (chat) {
    var msgs = $all('.msg', chat);
    var typing = document.getElementById('typing');
    var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    var timers = [];
    var playChat = function () {
      timers.forEach(clearTimeout); timers = [];
      msgs.forEach(function (m) { m.classList.remove('is-in'); });
      if (typing) typing.classList.remove('is-on');
      var t = 400;
      msgs.forEach(function (m) {
        var bot = m.classList.contains('msg--bot');
        if (bot && typing) {
          timers.push(setTimeout(function () { typing.classList.add('is-on'); chat.appendChild(typing); }, t));
          t += 900;
          timers.push(setTimeout(function () { typing.classList.remove('is-on'); }, t));
        }
        timers.push(setTimeout(function () { m.classList.add('is-in'); }, t));
        t += bot ? 1000 : 800;
      });
      timers.push(setTimeout(playChat, t + 5000));
    };
    if (reduce || !('IntersectionObserver' in window)) {
      msgs.forEach(function (m) { m.classList.add('is-in'); });
    } else {
      var started = false;
      new IntersectionObserver(function (en, ob) {
        if (en[0].isIntersecting && !started) { started = true; ob.disconnect(); playChat(); }
      }, { threshold: 0.3 }).observe(chat);
    }
  }
})();
