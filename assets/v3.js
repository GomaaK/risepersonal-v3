(function () {
  "use strict";
  var WA = "201099000280";
  var reduced = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* WhatsApp links carry a prefilled message that knows the visitor's role */
  var ROLES = {
    founder:    { label: "founder",    line: "Investors and partners back the founder first.", sub: "We position founders as the credible, visible face of the company, in the room and online, before they go to market.", msg: "Hello Sawaf, I'm a founder and I'd like to talk about my positioning." },
    exec:       { label: "executive",  line: "A company’s reputation is its leaders’ reputation.", sub: "We make boards and senior managers known beyond the industry they already lead, so the business benefits from their names.", msg: "Hello Sawaf, I'm an executive and I'd like to talk about positioning for me and my leadership team." },
    consultant: { label: "consultant", line: "Your work travels by introduction. Let’s widen the room.", sub: "We take consultants from a trusted network to a recognised public name, with a wider network than they started with.", msg: "Hello Sawaf, I'm a consultant and I'd like to talk about building my public profile." },
    expert:     { label: "expert",     line: "Be known for what you stand for.", sub: "For doctors and experts, we build a clear reputation within the rules of your profession. Visible, credible, never loud.", msg: "Hello Sawaf, I'm a doctor/expert and I'd like to talk about my professional reputation." }
  };
  var base = "I'd like to talk about personal branding.";
  function waUrl(msg) { return "https://wa.me/" + WA + "?text=" + encodeURIComponent(msg); }
  function setWa(msg) {
    $$("[data-wa]").forEach(function (a) { a.href = waUrl(a.dataset.msg || msg); });
  }
  setWa("Hello Sawaf, " + base);

  /* guided picker */
  var chips = $$(".chip"), answer = $("#answer");
  function pick(key, silent) {
    var r = ROLES[key]; if (!r) return;
    var apply = function () {
      chips.forEach(function (c) {
        var on = c.dataset.role === key;
        c.setAttribute("aria-checked", on ? "true" : "false");
        c.tabIndex = on ? 0 : -1;
      });
      $("#answer-line").textContent = r.line;
      $("#answer-sub").textContent = r.sub;
      answer.hidden = false;
      setWa(r.msg);
      $$(".story").forEach(function (s) {
        s.classList.toggle("match", s.dataset.for === key);
      });
      var first = $('.story[data-for="' + key + '"]');
      $("#answer-story").textContent = "See a story like yours →";
      try { sessionStorage.setItem("rp-role", key); } catch (e) {}
    };
    if (!silent && document.startViewTransition && !reduced) document.startViewTransition(apply); else apply();
  }
  chips.forEach(function (c, i) {
    c.addEventListener("click", function () { pick(c.dataset.role); });
    c.addEventListener("keydown", function (e) {
      var k = e.key, n = null;
      if (k === "ArrowRight" || k === "ArrowDown") n = (i + 1) % chips.length;
      if (k === "ArrowLeft" || k === "ArrowUp") n = (i - 1 + chips.length) % chips.length;
      if (n !== null) { e.preventDefault(); chips[n].focus(); pick(chips[n].dataset.role); }
    });
  });
  $("#answer-story").addEventListener("click", function (e) {
    var k; try { k = sessionStorage.getItem("rp-role"); } catch (x) {}
    if (k) { filter(k); }
  });
  chips[0].tabIndex = 0; chips.slice(1).forEach(function (c) { c.tabIndex = 0; });
  try { var saved = sessionStorage.getItem("rp-role"); if (saved) pick(saved, true); } catch (e) {}

  /* tabs */
  var tabs = $$(".tab");
  function selectTab(t) {
    tabs.forEach(function (x) {
      var on = x === t;
      x.setAttribute("aria-selected", on ? "true" : "false");
      x.tabIndex = on ? 0 : -1;
      $("#" + x.getAttribute("aria-controls")).hidden = !on;
    });
  }
  tabs.forEach(function (t, i) {
    t.addEventListener("click", function () {
      if (document.startViewTransition && !reduced) document.startViewTransition(function () { selectTab(t); }); else selectTab(t);
    });
    t.addEventListener("keydown", function (e) {
      var n = null;
      if (e.key === "ArrowRight") n = (i + 1) % tabs.length;
      if (e.key === "ArrowLeft") n = (i - 1 + tabs.length) % tabs.length;
      if (n !== null) { e.preventDefault(); tabs[n].focus(); selectTab(tabs[n]); }
    });
  });

  /* story filter */
  var fs = $$(".f"), stories = $$(".story");
  function filter(key) {
    fs.forEach(function (b) { var on = b.dataset.f === key; b.classList.toggle("on", on); b.setAttribute("aria-pressed", on ? "true" : "false"); });
    stories.forEach(function (s) {
      var show = key === "all" || s.dataset.for === key || s.dataset.for === "all";
      s.classList.toggle("dim", !show);
    });
    var rail = $(".rail");
    var target = key === "all" ? null : $('.story[data-for="' + key + '"]');
    if (target && rail) rail.scrollTo({ left: Math.max(0, target.offsetLeft - rail.offsetLeft - 16), behavior: reduced ? "auto" : "smooth" });
  }
  fs.forEach(function (b) { b.addEventListener("click", function () { filter(b.dataset.f); }); });

  /* mobile dock appears after the hero */
  var dock = $(".dock"), hero = $(".hero");
  if (dock && hero && "IntersectionObserver" in window) {
    new IntersectionObserver(function (en) { dock.classList.toggle("on", !en[0].isIntersecting); }, { threshold: 0.05 }).observe(hero);
  } else if (dock) dock.classList.add("on");

  /* reveal fallback for browsers without scroll-driven animations */
  if (!(window.CSS && CSS.supports && CSS.supports("animation-timeline: view()")) && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (en) { en.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }); }, { threshold: 0.12 });
    $$(".reveal").forEach(function (el) { io.observe(el); });
  } else if (!("IntersectionObserver" in window)) {
    $$(".reveal").forEach(function (el) { el.classList.add("in"); });
  }

  /* magnetic buttons (pointer devices only) */
  if (!reduced && matchMedia("(hover:hover) and (pointer:fine)").matches) {
    $$(".magnet").forEach(function (b) {
      b.addEventListener("pointermove", function (e) {
        var r = b.getBoundingClientRect();
        b.style.transform = "translate(" + ((e.clientX - r.left - r.width / 2) * 0.14) + "px," + ((e.clientY - r.top - r.height / 2) * 0.22) + "px)";
      });
      b.addEventListener("pointerleave", function () { b.style.transform = ""; });
    });
  }
})();
