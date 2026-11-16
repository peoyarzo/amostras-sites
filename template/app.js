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
      bannerText: "--c-banner-text"
    };
    Object.keys(map).forEach(function (key) {
      if (colors[key]) root.setProperty(map[key], colors[key]);
    });
  }

  function fillFields() {
    document.querySelectorAll("[data-field]").forEach(function (el) {
      var key = el.getAttribute("data-field");
      if (Object.prototype.hasOwnProperty.call(site, key) && text(site[key])) {
        el.textContent = text(site[key]);
      }
    });

    document.querySelectorAll("[data-nav]").forEach(function (el) {
      var key = el.getAttribute("data-nav");
      if (site[key]) el.textContent = text(site[key]);
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
      wrap.hidden = false;
    });
  }

  function setMap() {
    var iframe = document.querySelector("[data-map]");
    if (!iframe) return;
    var query = text(site.mapQuery) || text(site.region) || "São Paulo - SP";
    iframe.src =
      "https://www.google.com/maps?q=" + encodeURIComponent(query) + "&output=embed";
  }

  function digits(value) {
    return text(value).replace(/\D/g, "");
  }

  function setContact() {
    var el = document.querySelector("[data-contact]");
    if (!el) return;
    var number = digits(site.whatsapp);
    if (number) {
      var href = "https://wa.me/" + number;
      var label = text(site.contactPlaceholder) || "Contato via WhatsApp";
      el.innerHTML = "";
      var link = document.createElement("a");
      link.href = href;
      link.textContent = label;
      el.appendChild(link);
    } else {
      el.textContent =
        text(site.contactPlaceholder) || "Contato via WhatsApp (número a definir)";
    }
  }

  var ICONS = [
    '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="11" cy="11" r="6"/><path d="M16 16l4 4"/><path d="M9 11h4M11 9v4"/></svg>',
    '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M4 15c2-5 4-7 8-7s6 2 8 7"/><path d="M8 15.5c.6 1.2 1.8 2 4 2s3.4-.8 4-2"/></svg>',
    '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" aria-hidden="true"><path d="M12 4.7c-2 0-3.5 1.5-3.5 3.6 0 1.5.4 2.9.7 4.3.2 1.1-.1 2.5-.8 3.6-.3.5.1 1.1.7 1.1.6 0 1-.7 1.3-1.4.3-1.1.8-2.5 1.6-3.4.8.9 1.3 2.3 1.6 3.4.3.7.7 1.4 1.3 1.4.6 0 .9-.6.7-1.1-.7-1.1-1-2.5-.8-3.6.3-1.4.7-2.8.7-4.3 0-2.1-1.5-3.6-3.5-3.6z"/></svg>',
    '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M12 3v2M12 19v2M5 12H3M21 12h-2M6.5 6.5l-1.4-1.4M19 19l-1.5-1.5M17.5 6.5l1.4-1.4M5 19l1.5-1.5"/><circle cx="12" cy="12" r="4"/></svg>',
    '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M5 18V8a3 3 0 013-3h8a3 3 0 013 3v6a3 3 0 01-3 3H9l-4 3z"/></svg>'
  ];

  function setServices() {
    var list = document.querySelector("[data-services]");
    if (!list) return;
    list.innerHTML = "";
    (site.services || []).forEach(function (item, index) {
      var li = document.createElement("li");
      li.className = "service-card";
      li.innerHTML =
        '<span class="service-icon">' +
        ICONS[index % ICONS.length] +
        "</span><div><h3></h3><p></p></div>";
      li.querySelector("h3").textContent = text(item.title);
      li.querySelector("p").textContent = text(item.description);
      list.appendChild(li);
    });
  }

  function setMeta() {
    var title = [text(site.name), text(site.banner) || "Prévia demonstrativa"]
      .filter(Boolean)
      .join(" — ");
    document.title = title;
    var desc = document.querySelector('meta[name="description"]');
    if (desc) {
      desc.setAttribute(
        "content",
        text(site.tagline) || text(site.heroText) || text(site.name)
      );
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
  setMeta();
  fillFields();
  setCtas();
  setImages();
  setMap();
  setContact();
  setServices();
  setupNav();
})();
