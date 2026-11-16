(function () {
  "use strict";

  var site = window.SITE;
  if (!site) {
    document.body.insertAdjacentHTML(
      "afterbegin",
      '<p class="noscript">Arquivo config.js não encontrado ou inválido.</p>'
    );
    return;
  }

  function text(value) {
    return value == null ? "" : String(value);
  }

  function digits(value) {
    return text(value).replace(/\D/g, "");
  }

  function applyColors(colors) {
    if (!colors) return;
    var root = document.documentElement.style;
    var map = {
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
    Object.keys(map).forEach(function (key) {
      if (colors[key]) root.setProperty(map[key], colors[key]);
    });
    if (site.radius) root.setProperty("--radius", text(site.radius));
  }

  function applyTheme() {
    document.body.setAttribute("data-layout", text(site.layout) || "classic");
    document.body.setAttribute("data-font", text(site.font) || "sans");
    if (text(site.name).length > 46) document.body.setAttribute("data-longname", "1");
    var mark = document.querySelector("[data-monogram]");
    var source = text(site.shortName || site.name).trim();
    if (mark && source) mark.textContent = source.charAt(0).toUpperCase();
  }

  function fillFields() {
    document.querySelectorAll("[data-field]").forEach(function (el) {
      var key = el.getAttribute("data-field");
      if (Object.prototype.hasOwnProperty.call(site, key) && text(site[key])) {
        el.textContent = text(site[key]);
      }
    });
  }

  function setCtas() {
    var href = text(site.ctaLink) || "#contato";
    document.querySelectorAll("[data-cta]").forEach(function (el) {
      el.setAttribute("href", href);
    });
  }

  function setImages() {
    var images = site.images || {};
    document.querySelectorAll("[data-image]").forEach(function (wrap) {
      var key = wrap.getAttribute("data-image");
      var conf = images[key];
      var img = wrap.querySelector("img");
      if (!conf || !conf.src || !img) return;
      img.src = conf.src;
      img.alt = text(conf.alt || "");
      img.decoding = "async";
      if (key !== "hero") img.loading = "lazy";
      wrap.hidden = false;
    });
  }

  function setMap() {
    var iframe = document.querySelector("[data-map]");
    if (!iframe) return;
    var query = text(site.mapQuery) || text(site.region) || "São Paulo - SP";
    iframe.title = "Mapa de " + (text(site.name) || "região") + " — " + (text(site.region) || "busca pela região");
    iframe.src = "https://www.google.com/maps?q=" + encodeURIComponent(query) + "&output=embed";
  }

  function phoneList() {
    var list = Array.isArray(site.phones) ? site.phones.slice() : [];
    if (!list.length && digits(site.whatsapp)) {
      list.push({
        display: text(site.phoneDisplay) || digits(site.whatsapp),
        tel: "+" + digits(site.whatsapp)
      });
    }
    return list.filter(function (item) {
      return item && digits(item.tel || item.display);
    });
  }

  function isMobileDigits(value) {
    var d = digits(value);
    return d.length === 13 && d.indexOf("55") === 0 && d.charAt(4) === "9";
  }

  function whatsappTargets(phones) {
    var fromSite = digits(site.whatsapp);
    var mobiles = phones.filter(function (item) {
      return isMobileDigits(item.tel || "");
    });
    if (mobiles.length) return mobiles;
    if (fromSite) {
      return [{ display: text(site.phoneDisplay) || fromSite, tel: "+" + fromSite }];
    }
    if (phones.length) return [phones[0]];
    return [];
  }

  function makeLink(href, label, external) {
    var a = document.createElement("a");
    a.href = href;
    a.textContent = label;
    if (external) {
      a.target = "_blank";
      a.rel = "noopener noreferrer";
    }
    return a;
  }

  function setChannels() {
    var el = document.querySelector("[data-channels]");
    if (!el) return;
    var phones = phoneList();
    var was = whatsappTargets(phones);
    el.replaceChildren();
    if (!phones.length && !was.length && !(site.instagram || []).length && !(site.facebook || []).length) {
      return;
    }
    var list = document.createElement("ul");
    list.className = "channel-list";

    phones.forEach(function (item) {
      var tel = text(item.tel);
      if (tel.charAt(0) !== "+") tel = "+" + digits(tel);
      var li = document.createElement("li");
      li.appendChild(makeLink("tel:" + tel, text(item.display) || tel, false));
      list.appendChild(li);
    });

    was.forEach(function (item) {
      var d = digits(item.tel);
      var li = document.createElement("li");
      var label = was.length > 1 ? "WhatsApp · " + text(item.display) : "WhatsApp";
      li.appendChild(makeLink("https://wa.me/" + d, label, true));
      list.appendChild(li);
    });

    (site.instagram || []).forEach(function (handle) {
      var clean = text(handle).replace(/^@/, "").trim();
      if (!clean) return;
      var li = document.createElement("li");
      li.appendChild(makeLink("https://instagram.com/" + clean, "Instagram · @" + clean, true));
      list.appendChild(li);
    });

    (site.facebook || []).forEach(function (url) {
      var href = text(url);
      if (!href) return;
      var li = document.createElement("li");
      li.appendChild(makeLink(href, "Facebook", true));
      list.appendChild(li);
    });

    el.appendChild(list);
  }

  function setQuick() {
    var quick = document.querySelector("[data-quick]");
    if (!quick) return;
    var phones = phoneList();
    var was = whatsappTargets(phones);
    quick.replaceChildren();
    if (phones.length) {
      var tel = text(phones[0].tel);
      if (tel.charAt(0) !== "+") tel = "+" + digits(tel);
      quick.appendChild(makeLink("tel:" + tel, "Ligar", false));
    }
    if (was.length) {
      quick.appendChild(makeLink("https://wa.me/" + digits(was[0].tel), "WhatsApp", true));
    }
    quick.hidden = quick.childElementCount === 0;
  }

  var ICONS = [
    '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><circle cx="12" cy="12" r="8"/><path d="M12 8v4l2.5 2"/></svg>',
    '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M5 19V7l7-3 7 3v12"/><path d="M9 19v-6h6v6"/></svg>',
    '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M6 18V8a2 2 0 012-2h8a2 2 0 012 2v10"/><path d="M8 18h8"/><path d="M9 10h6"/></svg>',
    '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M5 6h14v12H5z"/><path d="M8 10h8M8 14h5"/></svg>'
  ];

  function setServices() {
    var list = document.querySelector("[data-services]");
    if (!list) return;
    list.replaceChildren();
    (site.services || []).forEach(function (item, index) {
      var li = document.createElement("li");
      li.className = "service-card";
      var icon = document.createElement("span");
      icon.className = "service-icon";
      icon.innerHTML = ICONS[index % ICONS.length];
      var body = document.createElement("div");
      var h3 = document.createElement("h3");
      var p = document.createElement("p");
      h3.textContent = text(item.title);
      p.textContent = text(item.description);
      body.appendChild(h3);
      body.appendChild(p);
      li.appendChild(icon);
      li.appendChild(body);
      list.appendChild(li);
    });
  }

  function setForm() {
    var form = document.querySelector("[data-contact-form]");
    if (!form) return;
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var error = form.querySelector("[data-form-error]");
      var phones = phoneList();
      var was = whatsappTargets(phones);
      var number = was.length ? digits(was[0].tel) : digits(site.whatsapp);
      if (!number) {
        if (error) {
          error.hidden = false;
          error.textContent = "Este contato ainda não tem WhatsApp configurado.";
        }
        return;
      }
      if (error) error.hidden = true;
      var data = new FormData(form);
      var nome = text(data.get("nome")).trim();
      var telefone = text(data.get("telefone")).trim();
      var mensagem = text(data.get("mensagem")).trim();
      var parts = ["Olá, meu nome é " + nome + ".", mensagem];
      if (telefone) parts.push("Telefone para retorno: " + telefone);
      var url = "https://wa.me/" + number + "?text=" + encodeURIComponent(parts.join("\n\n"));
      window.open(url, "_blank", "noopener,noreferrer");
    });
  }

  function setMeta() {
    var title = [text(site.name), text(site.banner) || "Prévia demonstrativa"].filter(Boolean).join(" — ");
    document.title = title;
    var desc = document.querySelector('meta[name="description"]');
    if (desc) {
      desc.setAttribute("content", text(site.tagline) || text(site.heroText) || text(site.name));
    }
  }

  function setupNav() {
    var toggle = document.querySelector(".nav-toggle");
    var nav = document.getElementById("menu-principal");
    if (!toggle || !nav) return;

    function close() {
      document.body.classList.remove("nav-open");
      toggle.setAttribute("aria-expanded", "false");
    }

    toggle.addEventListener("click", function () {
      var open = document.body.classList.toggle("nav-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });

    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", close);
    });
  }

  applyColors(site.colors);
  applyTheme();
  setMeta();
  fillFields();
  setCtas();
  setImages();
  setMap();
  setChannels();
  setQuick();
  setServices();
  setForm();
  setupNav();
})();
