/* Rise Personal v3 · The Snapshot. 20 statements (Big Five) + 2 choices -> archetype + three words. Runs in the browser; nothing is sent anywhere. */
(function () {
  "use strict";
  var RP = window.RP, $ = RP.$, $$ = RP.$$, reduced = RP.reduced, waUrl = RP.waUrl;
  if (!$("#s-quiz")) return;

  var QUESTIONS = [
    { f: "O", r: 1, t: "I have a vivid imagination and can lose myself in new ideas." },
    { f: "C", r: 1, t: "I follow through on my plans, even after the first excitement fades." },
    { f: "E", r: 1, t: "I feel energized after spending time in a lively group of people." },
    { f: "A", r: 1, t: "I naturally tune in to how the people around me are feeling." },
    { f: "N", r: 0, t: "I stay calm and clear-headed under pressure." },
    { f: "O", r: 1, t: "I am drawn to unusual ideas, art, and perspectives others find strange." },
    { f: "C", r: 1, t: "People can rely on me to deliver what I promised, on time." },
    { f: "E", r: 1, t: "I am comfortable speaking first in a room full of people." },
    { f: "A", r: 1, t: "I give people the benefit of the doubt." },
    { f: "N", r: 1, t: "I replay worries in my mind long after the moment has passed." },
    { f: "O", r: 0, t: "I prefer familiar routines over experimenting with new approaches." },
    { f: "C", r: 0, t: "I often leave important things until the last minute." },
    { f: "E", r: 0, t: "I would rather observe quietly than take the stage." },
    { f: "A", r: 0, t: "I enjoy a sharp debate, even when it makes waves." },
    { f: "N", r: 1, t: "A small setback can colour my entire day." },
    { f: "O", r: 1, t: "I often question the usual way of doing things and imagine a better one." },
    { f: "C", r: 1, t: "I work best with structure — lists, systems, and clear next steps." },
    { f: "E", r: 0, t: "Long stretches around many people leave me drained." },
    { f: "A", r: 1, t: "People often come to me for comfort or support." },
    { f: "N", r: 0, t: "Criticism rarely rattles me." }
  ];

  var LIKERT = ["Strongly disagree", "Disagree", "Neutral", "Agree", "Strongly agree"];

  /* Final perception picks — the word pools for the 3-Word generator */
  var PICKS = [
    {
      id: "feel",
      tag: "Almost there · choice 1 of 2",
      t: "Pick the word people should FEEL when they meet your brand:",
      opts: [
        { k: "inspired", label: "Inspired", sub: "moved to think bigger", role: "essence" },
        { k: "comforted", label: "Comforted", sub: "safe and at ease", role: "human" },
        { k: "impressed", label: "Impressed", sub: "struck by your presence", role: "impact" }
      ]
    },
    {
      id: "remember",
      tag: "Almost there · choice 2 of 2",
      t: "Pick the word people should REMEMBER after they meet your brand:",
      opts: [
        { k: "authentic", label: "Authentic", sub: "the real thing", role: "essence" },
        { k: "trusted", label: "Trusted", sub: "the one they rely on", role: "human" },
        { k: "bold", label: "Bold", sub: "the one who dares", role: "impact" }
      ]
    }
  ];

  /* ---------- Data: the 12 archetypes (profile = ideal O/C/E/A/N 0–100) ---------- */
  var ARCHETYPES = [
    { id: "sage", num: 1, name: "The Sage", essence: "The thought leader and teacher — people come to you to understand what things mean.", work: "Sharing your ideas publicly — the world needs your thinking out loud.", wellness: "Deep work & meditation", words: ["Insightful", "Grounded", "Wise"], roles: ["essence", "human", "impact"], profile: { O: 80, C: 75, E: 30, A: 55, N: 45 }, keys: ["O", "C"], fusion: "Deep work and meditation keep your clarity sharp — a Sage’s brand only holds when the mind behind it is rested." },
    { id: "creator", num: 2, name: "The Creator", essence: "The artist and builder — you exist to make things that didn’t exist before.", work: "Finishing and shipping — done is the masterpiece your ideas are waiting for.", wellness: "Flow states", words: ["Original", "Visionary", "Crafted"], roles: ["essence", "impact", "human"], profile: { O: 95, C: 50, E: 45, A: 78, N: 55 }, keys: ["O", "A"], fusion: "Flow states are your strategy — your best brand moves arrive when the making feels like play." },
    { id: "ruler", num: 3, name: "The Ruler", essence: "The executive authority — composed command is your natural register.", work: "Generous leadership — share the stage, and the crown grows.", wellness: "Energy management", words: ["Commanding", "Composed", "Sovereign"], roles: ["impact", "human", "essence"], profile: { O: 55, C: 88, E: 82, A: 45, N: 20 }, keys: ["C", "E", "N"], fusion: "Energy management is the crown jewel — protect it, and composure becomes your brand signature." },
    { id: "hero", num: 4, name: "The Hero", essence: "The achiever — proof, momentum and results follow you.", work: "Sustainable pace — a long campaign beats a brilliant sprint.", wellness: "Discipline & fitness", words: ["Relentless", "Bold", "Proven"], roles: ["essence", "impact", "human"], profile: { O: 55, C: 85, E: 78, A: 50, N: 75 }, keys: ["C", "E", "N"], fusion: "Discipline and fitness keep the engine honest — your brand promises proof, so train like it." },
    { id: "explorer", num: 5, name: "The Explorer", essence: "The founder-nomad — new territory is your natural habitat.", work: "Rooted storytelling — bring the journey home so people can follow it.", wellness: "Nature & movement", words: ["Free", "Curious", "Untamed"], roles: ["essence", "human", "impact"], profile: { O: 85, C: 45, E: 55, A: 25, N: 50 }, keys: ["O", "A"], fusion: "Nature and movement reset your compass — the Explorer’s brand stays true only at full breath." },
    { id: "magician", num: 6, name: "The Magician", essence: "The innovator — you see around corners and make the impossible feel inevitable.", work: "Focus over novelty — choose the one trick and master it.", wellness: "Creation rituals", words: ["Transformative", "Magnetic", "Visionary"], roles: ["impact", "human", "essence"], profile: { O: 95, C: 50, E: 80, A: 45, N: 50 }, keys: ["O", "E"], fusion: "Creation rituals turn sparks into fire — ritual, not mood, feeds the Magician’s brand." },
    { id: "lover", num: 7, name: "The Lover", essence: "The aesthetic and lifestyle authority — beauty is how you make people feel valued.", work: "Discernment — say no beautifully, so every yes means more.", wellness: "Self-care as strategy", words: ["Magnetic", "Refined", "Warm"], roles: ["impact", "essence", "human"], profile: { O: 82, C: 50, E: 75, A: 85, N: 45 }, keys: ["O", "E", "A"], fusion: "Self-care is your strategy, not your indulgence — the Lover’s brand glows from the inside out." },
    { id: "jester", num: 8, name: "The Jester", essence: "The entertainer — light is your tool and joy your medium.", work: "Depth alongside humour — let them laugh, then let them think.", wellness: "Play & joy", words: ["Electric", "Witty", "Alive"], roles: ["impact", "essence", "human"], profile: { O: 65, C: 45, E: 88, A: 55, N: 25 }, keys: ["E", "N"], fusion: "Play and joy are the maintenance plan — a Jester running on empty loses the spark that makes the brand." },
    { id: "everyman", num: 9, name: "The Everyman", essence: "The relatable expert — you lead by being real, and real is rare.", work: "Standing out — your plain-spoken clarity is the differentiator; own it.", wellness: "Rhythm & balance", words: ["Real", "Trusted", "Grounded"], roles: ["essence", "impact", "human"], profile: { O: 50, C: 55, E: 50, A: 85, N: 45 }, keys: ["A"], fusion: "Rhythm and balance keep you credible — the Everyman’s brand is a marathon walked with your people." },
    { id: "caregiver", num: 10, name: "The Caregiver", essence: "The coach and healer — people feel safer having you in their corner.", work: "Boundaries and visibility — you can’t pour from a brand that hides.", wellness: "Rest & boundaries", words: ["Caring", "Wise", "Safe"], roles: ["essence", "impact", "human"], profile: { O: 55, C: 60, E: 50, A: 92, N: 70 }, keys: ["A", "N"], fusion: "Rest and boundaries are part of the work — a Caregiver with margins can hold everyone, including themselves." },
    { id: "innocent", num: 11, name: "The Innocent", essence: "The optimistic minimalist — clarity and honesty are your aesthetic.", work: "A bolder voice — your calm deserves volume, too.", wellness: "Mindfulness & simplicity", words: ["Pure", "Honest", "Calm"], roles: ["impact", "essence", "human"], profile: { O: 60, C: 55, E: 45, A: 65, N: 15 }, keys: ["N", "O"], fusion: "Mindfulness and simplicity are your competitive edge — in a noisy market, your calm is the brand." },
    { id: "outlaw", num: 12, name: "The Outlaw", essence: "The disruptor — you break the pattern so something better can take its place.", work: "Coalition-building — even revolutions need allies.", wellness: "Channeling intensity", words: ["Fearless", "Unfiltered", "Disruptive"], roles: ["essence", "impact", "human"], profile: { O: 90, C: 45, E: 80, A: 20, N: 55 }, keys: ["O", "E", "A"], fusion: "Channel the intensity — an Outlaw’s brand burns bright only when the fire is aimed." }
  ];

  var FACTOR_NAMES = { O: "Openness", C: "Conscientiousness", E: "Extraversion", A: "Agreeableness", N: "Emotional intensity" };
  var TRAIT_BARS = [
    { f: "O", label: "Openness — imagination & ideas" },
    { f: "C", label: "Conscientiousness — follow-through" },
    { f: "E", label: "Extraversion — energy with people" },
    { f: "A", label: "Agreeableness — warmth & trust" },
    { f: "N", label: "Composure — calm under pressure", invert: true }
  ];
  var DRIVE_POOL = {
    O: ["Visionary", "Curious", "Original"],
    C: ["Proven", "Precise", "Dependable"],
    E: ["Magnetic", "Alive", "Dynamic"],
    A: ["Trusted", "Warm", "Generous"],
    N: ["Attuned", "Driven", "Instinctive"]
  };
  var GLOBAL_FALLBACK = ["Vivid", "Steady", "Radiant"];
  var PHRASES = {
    O: { high: "your wide-open imagination", low: "your practical, grounded taste", mid: "your measured openness to ideas" },
    C: { high: "your dependable follow-through", low: "your flexible, improvisational style", mid: "your balanced approach to structure" },
    E: { high: "your energy with people", low: "your thoughtful quiet", mid: "your easy balance of stage and study" },
    A: { high: "your warmth and trust in people", low: "your independent edge", mid: "your even-handed way with people" },
    N: { high: "your driven, restless intensity", low: "your steady calm", mid: "your even keel" }
  };



  var KEY = "rp3_journey", KEY_RES = "rp3_result";
  var TOTAL = QUESTIONS.length + PICKS.length; // 22
  var state = load();
  function load() {
    try { var j = JSON.parse(localStorage.getItem(KEY)); if (j && j.v === 1) return j; } catch (e) {}
    return { v: 1, step: 0, answers: [], picks: {} };
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {} }
  function reset() { state = { v: 1, step: 0, answers: [], picks: {} }; save(); }

  var screens = { intro: $("#s-intro"), quiz: $("#s-quiz"), res: $("#s-res") };
  var qcard = $("#qcard"), qfill = $("#qfill"), qlabel = $("#qlabel"), qpct = $("#qpct"), qbar = $("#qbar"), qnote = $("#qnote");
  var cur = 0, lock = false, noteT = null, shownPct = 0;

  function show(name) {
    var apply = function () {
      Object.keys(screens).forEach(function (k) { screens[k].hidden = k !== name; });
      var top = $("#app"); if (top) top.scrollIntoView({ behavior: "auto", block: "start" });
    };
    if (document.startViewTransition && !reduced) document.startViewTransition(apply); else apply();
  }

  /* ---------- intro ---------- */
  var resume = $("#resume");
  function initIntro() {
    var has = state.step > 0 && state.step < TOTAL + 1;
    if (resume) resume.hidden = !has;
    if (state.step >= TOTAL) { var r = null; try { r = localStorage.getItem(KEY_RES); } catch (e) {} if (r) { renderResults(); show("res"); return; } }
  }
  $("#btn-begin").addEventListener("click", function () { reset(); show("quiz"); renderStep(0); });
  if ($("#btn-resume")) $("#btn-resume").addEventListener("click", function () { show("quiz"); renderStep(Math.min(state.step, TOTAL - 1)); });

  /* ---------- steps ---------- */
  var TAGS = { O: "Ideas and imagination", C: "Focus and follow-through", E: "Energy and people", A: "Warmth and trust", N: "Steadiness under pressure" };
  var NOTES = { 5: "A quarter done. First instincts are the most honest ones.", 10: "Halfway. Your pattern is starting to show.", 15: "Three quarters in. Five to go.", 19: "Last statement. Then two quick choices.", 20: "Two choices left: how you want people to feel, and what they should remember." };

  function stepHTML(i) {
    var h;
    if (i < QUESTIONS.length) {
      var q = QUESTIONS[i];
      h = '<span class="tag">' + TAGS[q.f] + '</span><p class="q-q" id="qtext">' + q.t + '</p><div class="q-opts" role="group" aria-labelledby="qtext">';
      LIKERT.forEach(function (label, idx) {
        var v = idx + 1, sel = state.answers[i] === v ? " sel" : "";
        h += '<button type="button" class="q-opt' + sel + '" style="--n:' + idx + '" data-i="' + i + '" data-v="' + v + '"><i></i><span class="k">' + v + '</span>' + label + "</button>";
      });
      h += "</div>";
    } else {
      var p = PICKS[i - QUESTIONS.length];
      h = '<span class="tag">' + p.tag + '</span><p class="q-q" id="qtext">' + p.t + '</p><div class="q-opts" role="group" aria-labelledby="qtext">';
      p.opts.forEach(function (o, idx) {
        var sel = state.picks[p.id] === o.k ? " sel" : "";
        h += '<button type="button" class="q-opt big' + sel + '" style="--n:' + idx + '" data-pick="' + p.id + '" data-k="' + o.k + '"><i></i><span><b>' + o.label + "</b><small>" + o.sub + "</small></span></button>";
      });
      h += "</div>";
    }
    var back = i > 0 ? '<button type="button" class="btn-link" data-back="' + (i - 1) + '">← Back</button>' : "<span></span>";
    return h + '<div class="q-foot">' + back + '<span class="hint">' + (i < QUESTIONS.length ? "Keys 1 to 5 answer. Left arrow goes back." : "Pick the one that feels most like you.") + "</span></div>";
  }

  function meta(i, instant) {
    var pct = Math.round(((i + 1) / TOTAL) * 100);
    qfill.style.inlineSize = pct + "%";
    qbar.setAttribute("aria-valuenow", String(pct));
    var label = i < QUESTIONS.length ? "Question " + (i + 1) + " of 20" : "Final choices";
    if (instant || reduced) { qlabel.textContent = label; qpct.textContent = pct + "%"; shownPct = pct; return; }
    qlabel.classList.add("swap");
    setTimeout(function () { qlabel.textContent = label; qlabel.classList.remove("swap"); }, 150);
    var from = shownPct, t0 = null;
    (function tick(ts) {
      if (!t0) t0 = ts;
      var k = Math.min((ts - t0) / 420, 1), e = 1 - Math.pow(1 - k, 3);
      shownPct = Math.round(from + (pct - from) * e); qpct.textContent = shownPct + "%";
      if (k < 1) requestAnimationFrame(tick); else { shownPct = pct; qpct.textContent = pct + "%"; }
    })(performance.now());
  }
  function note(i, dir) {
    clearTimeout(noteT);
    if (dir > 0 && NOTES[i]) { qnote.textContent = NOTES[i]; qnote.classList.add("show"); noteT = setTimeout(function () { qnote.classList.remove("show"); }, 3200); }
    else qnote.classList.remove("show");
  }

  function renderStep(i) {
    lock = false; cur = i; meta(i, true); note(i, 0);
    qcard.style.blockSize = "";
    qcard.innerHTML = '<div class="qin in">' + stepHTML(i) + "</div>";
  }
  function goTo(i, dir) {
    if (i < 0) i = 0;
    if (i >= TOTAL) { state.step = TOTAL; save(); finish(); return; }
    if (reduced) { renderStep(i); return; }
    lock = true; cur = i; meta(i, false);
    var old = qcard.firstElementChild, h0 = qcard.offsetHeight;
    qcard.style.blockSize = h0 + "px";
    if (old) { old.style.setProperty("--dir", dir); old.classList.add("out"); }
    setTimeout(function () {
      var inner = document.createElement("div");
      inner.className = "qin pre"; inner.style.setProperty("--dir", dir); inner.innerHTML = stepHTML(i);
      qcard.innerHTML = ""; qcard.appendChild(inner);
      qcard.style.blockSize = "auto"; var h1 = qcard.offsetHeight;
      qcard.style.blockSize = h0 + "px"; void qcard.offsetHeight; qcard.style.blockSize = h1 + "px";
      requestAnimationFrame(function () { requestAnimationFrame(function () { inner.classList.remove("pre"); inner.classList.add("in"); }); });
      note(i, dir);
      setTimeout(function () { lock = false; }, 300);
      setTimeout(function () { qcard.style.blockSize = ""; var qt = $(".q-q", qcard); if (qt) { qt.setAttribute("tabindex", "-1"); try { qt.focus({ preventScroll: true }); } catch (e) {} } }, 440);
    }, 210);
  }

  qcard.addEventListener("click", function (ev) {
    var t = ev.target.closest("button"); if (!t || lock) return;
    if (t.dataset.back !== undefined) { goTo(parseInt(t.dataset.back, 10), -1); return; }
    if (t.dataset.v) {
      var i = parseInt(t.dataset.i, 10);
      state.answers[i] = parseInt(t.dataset.v, 10); state.step = Math.max(state.step, i + 1); save();
      $$(".q-opt", qcard).forEach(function (b) { b.classList.toggle("sel", b === t); });
      lock = true; setTimeout(function () { lock = false; goTo(i + 1, 1); }, reduced ? 120 : 340);
    } else if (t.dataset.pick) {
      var id = t.dataset.pick; state.picks[id] = t.dataset.k;
      var idx = QUESTIONS.length + PICKS.findIndex(function (p) { return p.id === id; });
      state.step = Math.max(state.step, idx + 1); save();
      $$(".q-opt", qcard).forEach(function (b) { b.classList.toggle("sel", b === t); });
      lock = true; setTimeout(function () { lock = false; goTo(idx + 1, 1); }, reduced ? 120 : 380);
    }
  });
  document.addEventListener("keydown", function (ev) {
    if (screens.quiz.hidden || lock) return;
    var n = parseInt(ev.key, 10);
    if (cur < QUESTIONS.length && n >= 1 && n <= 5) { var b = $('.q-opt[data-v="' + n + '"]', qcard); if (b) b.click(); }
    else if (ev.key === "ArrowLeft" && cur > 0) goTo(cur - 1, -1);
  });

  function finish() { renderResults(); show("res"); }

  /* ---------- scoring ---------- */
  function scores() {
    var sums = { O: 0, C: 0, E: 0, A: 0, N: 0 };
    QUESTIONS.forEach(function (q, i) { var raw = state.answers[i] || 3; sums[q.f] += q.r ? raw : 6 - raw; });
    var out = {}; Object.keys(sums).forEach(function (f) { out[f] = Math.round(((sums[f] - 4) / 16) * 100); }); return out;
  }
  function matchArchetypes(sc) {
    var ranked = ARCHETYPES.map(function (a) {
      var d = 0; ["O", "C", "E", "A", "N"].forEach(function (f) { var w = a.keys.indexOf(f) >= 0 ? 2 : 1; d += w * Math.pow(sc[f] - a.profile[f], 2); });
      return { a: a, d: Math.sqrt(d) };
    });
    ranked.sort(function (x, y) { return x.d - y.d || x.a.num - y.a.num; });
    return { primary: ranked[0].a, secondary: ranked[1].a };
  }
  function matchNote(arch, sc) {
    var bits = arch.keys.map(function (f) {
      var diff = Math.abs(sc[f] - arch.profile[f]), dir = arch.profile[f] >= 65 ? "high" : (arch.profile[f] <= 35 ? "low" : "mid");
      return { diff: diff, txt: PHRASES[f][dir] };
    }).sort(function (x, y) { return x.diff - y.diff; }).slice(0, 2);
    return "Matched by <b>" + bits[0].txt + "</b>" + (bits[1] ? " and <b>" + bits[1].txt + "</b>" : "") + ", the defining notes of " + arch.name + ".";
  }
  function threeWords(prim, sec, sc) {
    var feel = PICKS[0].opts.find(function (o) { return o.k === state.picks.feel; }) || PICKS[0].opts[0];
    var rem = PICKS[1].opts.find(function (o) { return o.k === state.picks.remember; }) || PICKS[1].opts[0];
    var w1 = prim.words[prim.roles.indexOf(feel.role)], w2 = sec.words[sec.roles.indexOf(rem.role)];
    var topF = ["O", "C", "E", "A", "N"].slice().sort(function (x, y) { return sc[y] - sc[x]; })[0];
    var used = [w1.toLowerCase(), w2.toLowerCase()];
    function pickFrom(pool) { for (var i = 0; i < pool.length; i++) if (used.indexOf(pool[i].toLowerCase()) < 0) return pool[i]; return null; }
    var w3 = pickFrom(DRIVE_POOL[topF]) || pickFrom(GLOBAL_FALLBACK) || "Vivid";
    return [
      { w: w1, why: "From your primary current, " + prim.name + ". You want people to feel “" + feel.label.toLowerCase() + "”, and “" + w1 + "” carries exactly that." },
      { w: w2, why: "Your secondary current, " + sec.name + ". You want to be remembered as “" + rem.label.toLowerCase() + "”, and “" + w2 + "” is that note in you." },
      { w: w3, why: "Your strongest trait: " + FACTOR_NAMES[topF] + " at " + sc[topF] + "/100. “" + w3 + "” is its word." }
    ];
  }
  function pad(n) { return n < 10 ? "0" + n : String(n); }

  /* ---------- results ---------- */
  function renderResults() {
    var sc = scores(), m = matchArchetypes(sc), p = m.primary, s = m.secondary, words = threeWords(p, s, sc), nt = matchNote(p, sc);
    try { localStorage.setItem(KEY_RES, JSON.stringify({ primary: p.id, secondary: s.id, words: words.map(function (x) { return x.w; }), scores: sc })); } catch (e) {}
    var bars = TRAIT_BARS.map(function (t) {
      var val = t.invert ? 100 - sc[t.f] : sc[t.f];
      return '<div class="trait"><span class="tname">' + t.label + '</span><span class="tscore">' + val + '</span><div class="tbar"><i data-w="' + val + '"></i></div></div>';
    }).join("");
    var why = words.map(function (x) { return "<li><b>" + x.w + "</b><span>" + x.why + "</span></li>"; }).join("");
    var msg = "Hello Sawaf, I took the Snapshot. My archetype is " + p.name + " (secondary: " + s.name + "). My three words: " + words[0].w + ", " + words[1].w + ", " + words[2].w + ". I'd like to talk about my positioning.";
    var out = $("#res-body");
    out.innerHTML =
      '<p class="eyebrow">Your Snapshot is ready</p>' +
      '<div class="arch-card"><span class="arch-num">Archetype ' + pad(p.num) + ' of 12</span>' +
      '<h2 class="arch-name">' + p.name + '</h2><p class="arch-essence">' + p.essence + "</p>" +
      '<p class="words-head">Your 3 words</p><p class="threewords"><em>' + words[0].w + "</em> · <em>" + words[1].w + "</em> · <em>" + words[2].w + "</em></p>" +
      '<ul class="word-why">' + why + "</ul>" +
      '<div class="arch-split"><div class="arch-box"><h4>What to work on</h4><p>' + p.work + '</p></div><div class="arch-box"><h4>Wellness pairing</h4><p>' + p.wellness + "</p></div></div>" +
      '<div class="fusion"><div class="fx">Wellness × Brand</div><p>' + p.fusion + "</p></div>" +
      '<p class="match-note">' + nt + "</p></div>" +
      '<div class="res-two"><div class="traits-card"><h3>Your five currents</h3><p class="sub">Normalised from your 20 answers (0 to 100). They chose your archetype.</p>' + bars + "</div>" +
      '<div class="second-card"><h3>Your secondary current</h3><p class="sc-name">' + s.name + "</p><p>" + s.essence + " Its notes, " + s.words.join(", ") + ", colour your brand at the edges.</p>" +
      '<a class="btn-link" href="archetypes.html#' + s.id + '">Read about ' + s.name + " →</a></div></div>" +
      '<div class="res-cta-card"><h3>Now turn it into a position.</h3><p>Send your result to Sawaf and we will talk about what it means for your name, your company and your market.</p>' +
      '<div class="res-actions"><a class="btn btn-wa" data-wa href="' + waUrl(msg) + '" data-msg="' + msg.replace(/"/g, "&quot;") + '" rel="noopener">Send my result to Sawaf</a>' +
      '<button class="btn btn-ghost" id="btn-png" type="button">Download my card</button><button class="btn btn-ghost" id="btn-retake" type="button">Retake</button></div>' +
      '<p class="res-foot">Your answers stayed in this browser. <a href="archetypes.html#' + p.id + '">Read about ' + p.name + "</a> · <a href=\"archetypes.html\">All 12 archetypes</a></p></div>";
    requestAnimationFrame(function () { setTimeout(function () { $$(".tbar i", out).forEach(function (el) { el.style.inlineSize = el.dataset.w + "%"; }); }, 150); });
    $("#btn-retake").addEventListener("click", function () { reset(); show("quiz"); renderStep(0); });
    $("#btn-png").addEventListener("click", function () { downloadCard(p, words); });
  }

  /* ---------- shareable PNG ---------- */
  function wrapText(x, text, cx, y, maxW, lh) {
    var ws = text.split(" "), line = "", lines = [];
    for (var i = 0; i < ws.length; i++) { var t = line ? line + " " + ws[i] : ws[i]; if (x.measureText(t).width > maxW && line) { lines.push(line); line = ws[i]; } else line = t; }
    if (line) lines.push(line);
    lines.forEach(function (l, k) { x.fillText(l, cx, y + k * lh); });
  }
  function downloadCard(p, words) {
    var W = 1080, H = 1350, c = document.createElement("canvas"); c.width = W; c.height = H;
    var x = c.getContext("2d"), blue = "#6FB0FF", ivory = "#E6E6E6", mut = "rgba(230,230,230,.8)";
    x.fillStyle = "#1A1A1A"; x.fillRect(0, 0, W, H);
    var g = x.createRadialGradient(W * .2, 0, 0, W * .2, 0, W); g.addColorStop(0, "rgba(1,112,253,.35)"); g.addColorStop(1, "rgba(1,112,253,0)"); x.fillStyle = g; x.fillRect(0, 0, W, H);
    var g2 = x.createRadialGradient(W * .9, H * .2, 0, W * .9, H * .2, W * .8); g2.addColorStop(0, "rgba(119,16,209,.35)"); g2.addColorStop(1, "rgba(119,16,209,0)"); x.fillStyle = g2; x.fillRect(0, 0, W, H);
    x.strokeStyle = "rgba(111,176,255,.5)"; x.lineWidth = 2; x.strokeRect(40, 40, W - 80, H - 80);
    x.textAlign = "center";
    x.fillStyle = blue; x.font = "600 26px 'Source Sans 3', Arial, sans-serif"; x.fillText("R I S E   P E R S O N A L   ·   T H E   S N A P S H O T", W / 2, 150);
    x.font = "600 32px 'Alumni Sans', Arial, sans-serif"; x.fillText("Archetype " + pad(p.num) + " of 12", W / 2, 330);
    var bg = x.createLinearGradient(W * .2, 460, W * .8, 320); bg.addColorStop(0, "#0170FD"); bg.addColorStop(1, "#B070FF");
    x.fillStyle = bg; x.font = "800 130px 'Alumni Sans', Arial, sans-serif"; x.fillText(p.name, W / 2, 460);
    x.font = "400 34px 'Source Sans 3', Arial, sans-serif"; x.fillStyle = mut; wrapText(x, p.essence, W / 2, 545, W - 300, 44);
    x.fillStyle = "rgba(111,176,255,.6)"; x.fillRect(W / 2 - 60, 720, 120, 2);
    x.fillStyle = blue; x.font = "600 26px 'Source Sans 3', Arial, sans-serif"; x.fillText("Y O U R   3   W O R D S", W / 2, 800);
    x.fillStyle = ivory; x.font = "800 86px 'Alumni Sans', Arial, sans-serif"; x.fillText(words[0].w + "  ·  " + words[1].w + "  ·  " + words[2].w, W / 2, 910);
    x.fillStyle = blue; x.font = "600 24px 'Source Sans 3', Arial, sans-serif"; x.fillText("WELLNESS × BRAND", W / 2, 1035);
    x.font = "400 32px 'Source Sans 3', Arial, sans-serif"; x.fillStyle = mut; wrapText(x, p.wellness + ". " + p.fusion, W / 2, 1088, W - 260, 42);
    x.fillStyle = blue; x.font = "600 24px 'Source Sans 3', Arial, sans-serif"; x.fillText("risepersonal.com", W / 2, H - 100);
    var a = document.createElement("a"); a.download = "risepersonal-snapshot-" + p.id + ".png"; a.href = c.toDataURL("image/png");
    document.body.appendChild(a); a.click(); a.remove();
  }

  initIntro();
})();
