/* Rise Personal v3 · shared behaviour: WhatsApp links, mobile menu, reveal, magnetic buttons */
(function () {
  "use strict";
  var WA = "971506832835";
  var reduced = !!(window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches);
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  function waUrl(msg) { return "https://wa.me/" + WA + "?text=" + encodeURIComponent(msg); }
  var DEFAULT_MSG = "Hello Sawaf, I'd like to talk about personal branding.";
  function setWa(msg) { $$("[data-wa]").forEach(function (a) { a.href = waUrl(a.dataset.msg || msg); }); }
  window.RP = { WA: WA, reduced: reduced, $: $, $$: $$, waUrl: waUrl, setWa: setWa, DEFAULT_MSG: DEFAULT_MSG };
  document.documentElement.classList.remove("no-js");
  setWa(DEFAULT_MSG);

  /* mobile menu */
  var burger = $(".burger"), menu = $("#menu");
  if (burger && menu) {
    var open = false, t = null;
    var set = function (v) {
      if (v === open) return; open = v; clearTimeout(t);
      burger.setAttribute("aria-expanded", v ? "true" : "false");
      burger.setAttribute("aria-label", v ? "Close menu" : "Open menu");
      document.body.classList.toggle("menu-open", v);
      if (v) { menu.hidden = false; requestAnimationFrame(function () { requestAnimationFrame(function () { menu.classList.add("open"); }); }); }
      else { menu.classList.remove("open"); t = setTimeout(function () { menu.hidden = true; }, 260); }
    };
    burger.addEventListener("click", function () { set(!open); });
    menu.addEventListener("click", function (e) { if (e.target.closest("a")) set(false); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && open) { set(false); burger.focus(); } });
    document.addEventListener("click", function (e) { if (open && !menu.contains(e.target) && !burger.contains(e.target)) set(false); });
    var mq = matchMedia("(min-width:62rem)");
    var f = function () { if (mq.matches) set(false); };
    if (mq.addEventListener) mq.addEventListener("change", f);
  }

  /* reveal fallback for browsers without scroll-driven animations */
  var supportsView = window.CSS && CSS.supports && CSS.supports("animation-timeline: view()");
  if (!supportsView && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (en) { en.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }); }, { threshold: 0.12 });
    $$(".reveal").forEach(function (el) { io.observe(el); });
  } else if (!supportsView) { $$(".reveal").forEach(function (el) { el.classList.add("in"); }); }

  /* header gets a shadow once scrolled */
  var top = $(".top");
  if (top) { var onS = function () { top.classList.toggle("scrolled", window.scrollY > 8); }; onS(); window.addEventListener("scroll", onS, { passive: true }); }

  /* magnetic buttons (pointer devices only) */
  if (!reduced && matchMedia("(hover:hover) and (pointer:fine)").matches) {
    $$(".magnet").forEach(function (b) {
      b.addEventListener("pointermove", function (e) {
        var r = b.getBoundingClientRect();
        b.style.transform = "translate(" + ((e.clientX - r.left - r.width / 2) * 0.12) + "px," + ((e.clientY - r.top - r.height / 2) * 0.2) + "px)";
      });
      b.addEventListener("pointerleave", function () { b.style.transform = ""; });
    });
  }
})();
