/* Interactive figures for the Research page: MILO search dynamics, Hermes main results,
   SCOUT's prefix experiment and headline result. Numbers are transcribed from the project
   pages of each paper (which transcribe the papers). Plain SVG, no dependencies.
   Colours come from CSS custom properties on .fig (see _sass/_research.scss). */
(function () {
  'use strict';

  var NS = 'http://www.w3.org/2000/svg';
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ================= data ================= */

  // MILO, Terminal-Bench 2.1 with gpt-oss-120b: population pass-rate per island (step changes).
  var MILO = {
    rounds: 28,
    stall: [6, 14],
    islands: [
      { name: 'Island 1', seed: 45.0, steps: [[0, 45.0], [5, 45.5], [15, 47.4], [17, 52.0], [19, 53.6], [20, 54.3], [23, 56.7]] },
      { name: 'Island 2', seed: 44.0, steps: [[0, 44.0], [1, 45.5], [21, 55.6]] },
      { name: 'Island 3', seed: 39.2, steps: [[0, 39.2], [1, 46.7], [3, 50.7], [21, 55.1], [27, 59.9]] }
    ],
    // Orchestrator invocations. g = graft [from, to, admitted]; m = mutator reassignment [island, from, to]
    events: {
      3: { g: [[3, 1, false]] },
      6: { g: [[3, 2, false]], m: [[1, 'Claude Code (Opus 4.8)', 'Codex (GPT-5.5)']] },
      9: { g: [[3, 1, false], [3, 2, false]] },
      12: { g: [[2, 3, false]], m: [[1, 'Codex (GPT-5.5)', 'DeepAgents (GPT-5.5)'], [2, 'Claude Code (Opus 4.8)', 'DeepAgents (Qwen3-Coder-480B)']] },
      15: { g: [[3, 1, true]], m: [[3, 'Claude Code (Opus 4.8)', 'Codex (GPT-5.5)']] },
      18: { g: [[1, 3, false]], m: [[2, 'DeepAgents (Qwen3-Coder-480B)', 'Claude Code (Opus 4.8)']] },
      21: { g: [[1, 2, true], [1, 3, true]] },
      25: { g: [[3, 1, false], [2, 1, false]] },
      28: { g: [[3, 1, false], [3, 2, false]] }
    }
  };

  // Hermes, Table 3 (Qwen3-4B-Instruct-2507). Per stage: [single 8K context, Hermes L1], each [mean, sd].
  // ref = one 56K-token context (Base, GRPO): the same total budget as Hermes.
  var HERMES = {
    benches: [
      { key: 'pooled', label: 'Pooled AIME + HMMT', short: 'AIME + HMMT' },
      { key: 'synthetic', label: 'Synthetic', short: 'Synthetic' },
      { key: 'beyond', label: 'BeyondAIME', short: 'BeyondAIME' },
      { key: 'imo', label: 'IMO-AnswerBench', short: 'IMO-Answer' },
      { key: 'science', label: 'FrontierScience (out of domain)', short: 'FrontierScience' }
    ],
    stages: [
      { key: 'Base', label: 'Untrained' },
      { key: 'GRPO', label: 'GRPO' },
      { key: 'SFT', label: 'SFT', learn: true },
      { key: 'SFT+RL', label: 'SFT + RL', learn: true }
    ],
    main: {
      pooled: { Base: [[37.1, null], [16.2, null]], GRPO: [[40.4, 1.0], [16.5, 1.6]], SFT: [[35.3, 0.3], [39.9, 0.7]], 'SFT+RL': [[36.4, 0.1], [47.3, 1.3]], ref: [41.8, 41.3] },
      synthetic: { Base: [[50.7, null], [26.8, null]], GRPO: [[61.5, 1.6], [27.9, 1.5]], SFT: [[52.7, 1.6], [57.2, 2.4]], 'SFT+RL': [[55.2, 0.9], [74.0, 2.9]], ref: [59.7, 62.2] },
      beyond: { Base: [[24.8, null], [12.2, null]], GRPO: [[31.1, 0.6], [14.1, 1.4]], SFT: [[23.5, 0.4], [31.0, 0.6]], 'SFT+RL': [[27.5, 1.3], [38.5, 0.5]], ref: [31.1, 30.9] },
      imo: { Base: [[36.2, null], [18.2, null]], GRPO: [[37.4, 0.6], [19.0, 1.4]], SFT: [[36.7, 0.5], [39.2, 0.2]], 'SFT+RL': [[36.4, 0.4], [44.0, 0.8]], ref: [40.3, 37.5] },
      science: { Base: [[23.6, null], [8.8, null]], GRPO: [[24.6, 1.5], [8.9, 0.6]], SFT: [[18.4, 1.4], [18.9, 0.5]], 'SFT+RL': [[19.1, 0.4], [24.1, 0.9]], ref: [24.6, 25.1] }
    }
  };

  // SCOUT Figure 1: teacher continues a cut student response. AIME 2025, 30 problems.
  var SCOUT = {
    ratios: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90],
    acc: [47.5, 46.67, 44.17, 39.17, 39.58, 36.67, 35.62, 34.79, 32.29, 30.21],
    prefixTok: [0, 274.5, 549.4, 824.3, 1099, 1374, 1649, 1924, 2199, 2474],
    contTok: [7258, 6847, 6730, 6950, 6763, 6903, 6775, 6720, 6351, 6119],
    budget: 16384,
    // Tables 1-3 / appendix Tables 10-13: benchmark-averaged student accuracy, mean of 3 runs
    settings: [
      { label: '4B → 1.7B · Math', teacher: 'Qwen3-4B-Instruct-2507', student: 'Qwen3-1.7B', opd: 49.21, scout: 51.39 },
      { label: '8B → 1.7B · Math', teacher: 'Qwen3-8B-DAPO', student: 'Qwen3-1.7B', opd: 49.02, scout: 51.59 },
      { label: 'Skywork-7B → DeepSeek-1.5B · Math', teacher: 'Skywork-OR1-Math-7B', student: 'DeepSeek-R1-Distill-Qwen-1.5B', opd: 52.40, scout: 53.58 },
      { label: '4B → 1.7B · Code', teacher: 'Qwen3-4B-Instruct-2507', student: 'Qwen3-1.7B', opd: 56.62, scout: 59.74 }
    ]
  };

  /* ================= helpers ================= */

  function svgEl(name, attrs, parent, text) {
    var n = document.createElementNS(NS, name);
    if (attrs) for (var k in attrs) if (attrs[k] !== undefined && attrs[k] !== null) n.setAttribute(k, attrs[k]);
    if (text !== undefined) n.textContent = text;
    if (parent) parent.appendChild(n);
    return n;
  }
  function htmlEl(tag, cls, parent, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text !== undefined) n.textContent = text;
    if (parent) parent.appendChild(n);
    return n;
  }
  function linear(d0, d1, r0, r1) {
    var f = function (v) { return r0 + (v - d0) / (d1 - d0) * (r1 - r0); };
    return f;
  }
  function f1(v) { return (Math.round(v * 10) / 10).toFixed(1); }
  function signed(v) { return (v >= 0 ? '+' : '−') + f1(Math.abs(v)); }
  function role(fig, r) { return fig.querySelector('[data-role="' + r + '"]'); }
  function easeOut(t) { return 1 - Math.pow(1 - t, 3); }

  function colors(fig) {
    var cs = getComputedStyle(fig);
    var g = function (n) { return cs.getPropertyValue(n).trim(); };
    return { c1: g('--c1'), c2: g('--c2'), c3: g('--c3'), ink: g('--ink'), muted: g('--muted'), surface: g('--surface') };
  }

  // Column with a 4px rounded data end and a square baseline
  function columnPath(x, y, w, h) {
    var r = Math.min(4, w / 2, h);
    if (h <= 0) return '';
    return 'M' + x + ' ' + (y + h) + ' V' + (y + r) + ' Q' + x + ' ' + y + ' ' + (x + r) + ' ' + y +
      ' H' + (x + w - r) + ' Q' + (x + w) + ' ' + y + ' ' + (x + w) + ' ' + (y + r) + ' V' + (y + h) + ' Z';
  }

  function onResize(el, fn) {
    var last = el.clientWidth;
    if ('ResizeObserver' in window) {
      new ResizeObserver(function () {
        if (el.clientWidth !== last) { last = el.clientWidth; fn(); }
      }).observe(el);
    } else {
      window.addEventListener('resize', fn);
    }
  }

  /* ---------- tooltip (one for the page) ---------- */
  var tip = htmlEl('div', 'fig-tip', document.body);
  tip.setAttribute('role', 'tooltip');
  // rows: [{ value, label, color, key: 'line'|'dot'|'rect' }], notes: [string]
  function showTip(clientX, clientY, title, rows, notes) {
    tip.textContent = '';
    htmlEl('div', 'fig-tip-title', tip, title);
    (rows || []).forEach(function (r) {
      var row = htmlEl('div', 'fig-tip-row', tip);
      var key = htmlEl('i', 'fig-tip-key fig-tip-key-' + (r.key || 'line'), row);
      key.style.background = r.color || 'transparent';
      if (r.key === 'ring') { key.style.background = 'transparent'; key.style.borderColor = r.color; }
      htmlEl('span', 'fig-tip-val', row, r.value);
      htmlEl('span', 'fig-tip-label', row, r.label);
    });
    (notes || []).forEach(function (n) { htmlEl('div', 'fig-tip-note', tip, n); });
    tip.classList.add('on');
    var tw = tip.offsetWidth, th = tip.offsetHeight;
    var x = Math.max(8, Math.min(window.innerWidth - tw - 8, clientX - tw / 2));
    var y = clientY - th - 14;
    if (y < 8) y = clientY + 18;
    tip.style.left = x + 'px';
    tip.style.top = y + 'px';
  }
  function hideTip() { tip.classList.remove('on'); }
  window.addEventListener('scroll', hideTip, { passive: true });

  function legend(container, items) {
    container.textContent = '';
    items.forEach(function (it) {
      var s = htmlEl('span', 'fig-legend-item', container);
      var k = htmlEl('i', 'fig-legend-key fig-legend-' + (it.kind || 'line'), s);
      if (it.kind === 'ring') k.style.borderColor = it.color;
      else k.style.background = it.color;
      s.appendChild(document.createTextNode(it.label));
    });
  }

  function table(container, head, rows) {
    container.textContent = '';
    var t = htmlEl('table', 'fig-data', container);
    var tr = htmlEl('tr', null, htmlEl('thead', null, t));
    head.forEach(function (h) { htmlEl('th', null, tr, h); });
    var tb = htmlEl('tbody', null, t);
    rows.forEach(function (r) {
      var row = htmlEl('tr', null, tb);
      r.forEach(function (c) { htmlEl('td', null, row, c); });
    });
  }

  // Make an SVG overlay keyboard-reachable: arrows move a cursor, Escape hides the tooltip
  function keyNav(target, count, getIndex, setIndex) {
    target.setAttribute('tabindex', '0');
    target.addEventListener('keydown', function (e) {
      var i = getIndex();
      if (e.key === 'ArrowRight' || e.key === 'ArrowUp') i = Math.min(count - 1, (i < 0 ? -1 : i) + 1);
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') i = Math.max(0, (i < 0 ? count : i) - 1);
      else if (e.key === 'Escape') { setIndex(-1); return; }
      else return;
      e.preventDefault();
      setIndex(i);
    });
    target.addEventListener('focus', function () { if (getIndex() < 0) setIndex(0); });
    target.addEventListener('blur', function () { setIndex(-1); });
  }

  /* ================= MILO ================= */

  function miloValueAt(steps, r) {
    var v = steps[0][1];
    for (var i = 0; i < steps.length; i++) if (steps[i][0] <= r) v = steps[i][1];
    return v;
  }
  function miloBestAt(r) {
    var best = { v: -1, isl: 0 };
    MILO.islands.forEach(function (isl, k) {
      var v = miloValueAt(isl.steps, r);
      if (v > best.v) best = { v: v, isl: k + 1 };
    });
    return best;
  }
  function miloEventNotes(r) {
    var ev = MILO.events[r];
    if (!ev) return [];
    var notes = [];
    (ev.g || []).forEach(function (g) {
      notes.push('Graft island ' + g[0] + ' → ' + g[1] + ': ' + (g[2] ? 'admitted' : 'rejected, kept as negative evidence'));
    });
    (ev.m || []).forEach(function (m) {
      notes.push('Island ' + m[0] + ' mutator: ' + m[1] + ' → ' + m[2]);
    });
    return notes;
  }

  function initMilo(fig) {
    var C = colors(fig);
    var series = [C.c1, C.c2, C.c3];
    var chart = role(fig, 'chart'), readout = role(fig, 'round');
    var state = { progress: 1, hover: -1, playing: false };

    var lg = role(fig, 'legend');
    legend(lg, MILO.islands.map(function (isl, k) {
      return { label: isl.name + ' (seed ' + f1(isl.seed) + ')', color: series[k] };
    }).concat([
      { label: 'Graft admitted', color: C.ink, kind: 'dot' },
      { label: 'Graft rejected', color: C.muted, kind: 'ring' },
      { label: 'Mutator reassigned', color: C.muted, kind: 'diamond' }
    ]));

    function setReadout(r) {
      var best = miloBestAt(r);
      readout.textContent = (r < MILO.rounds ? 'Round ' + r + ' of ' + MILO.rounds + ' · ' : '') +
        'Best so far ' + f1(best.v) + '% (island ' + best.isl + ')';
    }

    function render() {
      chart.textContent = '';
      var W = chart.clientWidth || 600;
      var narrow = W < 520;
      var m = { l: 40, r: narrow ? 50 : 62, t: 22 };
      var plotH = narrow ? 190 : 240;
      var laneTop = m.t + plotH + 44, laneH = 36;
      var H = laneTop + laneH + 6;
      var x = linear(0, MILO.rounds, m.l, W - m.r);
      var y = linear(38, 62, m.t + plotH, m.t);
      var svg = svgEl('svg', { viewBox: '0 0 ' + W + ' ' + H, width: W, height: H, role: 'img',
        'aria-label': 'Pass-rate per island over 28 rounds of MILO search, with orchestrator interventions' }, chart);

      // stall band
      svgEl('rect', { x: x(MILO.stall[0]), y: m.t, width: x(MILO.stall[1]) - x(MILO.stall[0]), height: plotH, 'class': 'fig-band' }, svg);
      svgEl('text', { x: (x(MILO.stall[0]) + x(MILO.stall[1])) / 2, y: m.t - 7, 'text-anchor': 'middle', 'class': 'fig-band-label' }, svg,
        narrow ? 'Stalled (R6–14)' : 'All islands stalled (rounds 6–14)');

      // grid + y ticks
      [40, 45, 50, 55, 60].forEach(function (v) {
        svgEl('line', { x1: m.l, x2: W - m.r, y1: y(v), y2: y(v), 'class': 'fig-grid' }, svg);
        svgEl('text', { x: m.l - 8, y: y(v) + 4, 'text-anchor': 'end', 'class': 'fig-tick' }, svg, v + (v === 60 ? '%' : ''));
      });
      // orchestrator invocations: hairline guides through plot and lane
      Object.keys(MILO.events).forEach(function (r) {
        svgEl('line', { x1: x(+r), x2: x(+r), y1: m.t, y2: laneTop + laneH, 'class': 'fig-guide' }, svg);
      });
      // x axis
      svgEl('line', { x1: m.l, x2: W - m.r, y1: m.t + plotH, y2: m.t + plotH, 'class': 'fig-axis' }, svg);
      for (var t = 0; t <= MILO.rounds; t += 4) {
        svgEl('text', { x: x(t), y: m.t + plotH + 16, 'text-anchor': 'middle', 'class': 'fig-tick' }, svg, t);
      }
      svgEl('text', { x: W - m.r, y: m.t + plotH + 32, 'text-anchor': 'end', 'class': 'fig-axis-title' }, svg, 'Evolution round');
      svgEl('text', { x: m.l, y: laneTop - 6, 'class': 'fig-axis-title' }, svg, 'Orchestrator');

      // revealed content (clipped during replay)
      var clipId = 'milo-clip';
      var defs = svgEl('defs', null, svg);
      var clip = svgEl('clipPath', { id: clipId }, defs);
      var fullW = x(MILO.rounds) - m.l;
      // At full progress the clip opens to the whole canvas so the end labels show
      function clipWidth(p) { return p >= 1 ? W : m.l + fullW * p + 8; }
      state.clipRect = svgEl('rect', { x: 0, y: 0, width: clipWidth(state.progress), height: H }, clip);
      var g = svgEl('g', { 'clip-path': 'url(#' + clipId + ')' }, svg);

      MILO.islands.forEach(function (isl, k) {
        var d = 'M' + x(0) + ' ' + y(isl.steps[0][1]);
        isl.steps.forEach(function (s, i) {
          if (i === 0) return;
          d += ' H' + x(s[0]) + ' V' + y(s[1]);
        });
        d += ' H' + x(MILO.rounds);
        svgEl('path', { d: d, 'class': 'fig-line', stroke: series[k] }, g);
        isl.steps.forEach(function (s) {
          svgEl('circle', { cx: x(s[0]), cy: y(s[1]), r: 4, fill: series[k], 'class': 'fig-dot' }, g);
        });
      });

      // end labels with a short line key; pushed apart with leader lines when they collide
      var ends = MILO.islands.map(function (isl, k) {
        var v = isl.steps[isl.steps.length - 1][1];
        return { k: k, v: v, y0: y(v), y: y(v) };
      }).sort(function (a, b) { return a.y0 - b.y0; });
      for (var i = 1; i < ends.length; i++) if (ends[i].y - ends[i - 1].y < 14) ends[i].y = ends[i - 1].y + 14;
      var bestEnd = Math.max.apply(null, ends.map(function (e) { return e.v; }));
      ends.forEach(function (e) {
        var x0 = x(MILO.rounds);
        if (Math.abs(e.y - e.y0) > 1) svgEl('path', { d: 'M' + x0 + ' ' + e.y0 + ' L' + (x0 + 6) + ' ' + e.y, 'class': 'fig-leader' }, g);
        svgEl('line', { x1: x0 + 6, x2: x0 + 16, y1: e.y, y2: e.y, stroke: series[e.k], 'stroke-width': 2, 'stroke-linecap': 'round' }, g);
        svgEl('text', { x: x0 + 20, y: e.y + 4, 'class': 'fig-end-label' + (e.v === bestEnd ? ' strong' : '') }, g, f1(e.v));
      });

      // orchestrator lane glyphs, stacked per invocation
      Object.keys(MILO.events).forEach(function (r) {
        var ev = MILO.events[r], cx = x(+r), row = 0;
        function cy() { return laneTop + 7 + 11 * row++; }
        (ev.g || []).forEach(function (gr) {
          svgEl('circle', { cx: cx, cy: cy(), r: 4, 'class': gr[2] ? 'fig-ev-ok' : 'fig-ev-no' }, g);
        });
        (ev.m || []).forEach(function () {
          var c = cy();
          svgEl('path', { d: 'M' + cx + ' ' + (c - 4.5) + ' L' + (cx + 4.5) + ' ' + c + ' L' + cx + ' ' + (c + 4.5) + ' L' + (cx - 4.5) + ' ' + c + ' Z', 'class': 'fig-ev-mut' }, g);
        });
      });

      // replay cursor, moved by setProgress()
      var px = m.l + fullW * state.progress;
      state.cursor = svgEl('line', { x1: px, x2: px, y1: m.t, y2: laneTop + laneH, 'class': 'fig-cursor', visibility: state.playing ? 'visible' : 'hidden' }, svg);
      state.setProgress = function (p) {
        state.progress = p;
        var cx = m.l + fullW * p;
        state.clipRect.setAttribute('width', clipWidth(p));
        state.cursor.setAttribute('x1', cx);
        state.cursor.setAttribute('x2', cx);
        state.cursor.setAttribute('visibility', state.playing ? 'visible' : 'hidden');
      };

      // hover layer: crosshair snaps to the nearest round
      var hoverG = svgEl('g', { 'class': 'fig-hover' }, svg);
      var overlay = svgEl('rect', { x: m.l - 6, y: m.t, width: W - m.l - m.r + 12, height: laneTop + laneH - m.t, fill: 'transparent', 'class': 'fig-overlay',
        'aria-label': 'Rounds 0 to 28. Use arrow keys to step through rounds.' }, svg);

      function drawHover(r, clientX, clientY) {
        hoverG.textContent = '';
        if (r < 0) { hideTip(); return; }
        svgEl('line', { x1: x(r), x2: x(r), y1: m.t, y2: laneTop + laneH, 'class': 'fig-crosshair' }, hoverG);
        var rows = MILO.islands.map(function (isl, k) {
          var v = miloValueAt(isl.steps, r);
          svgEl('circle', { cx: x(r), cy: y(v), r: 5, fill: series[k], 'class': 'fig-dot' }, hoverG);
          return { value: f1(v) + '%', label: isl.name, color: series[k] };
        });
        var stalled = r >= MILO.stall[0] && r <= MILO.stall[1];
        var notes = miloEventNotes(r);
        if (!notes.length) notes = [stalled ? 'All islands stalled' : 'No orchestrator call this round'];
        var bb = svg.getBoundingClientRect();
        showTip(clientX !== undefined ? clientX : bb.left + x(r), clientY !== undefined ? clientY : bb.top + y(miloBestAt(r).v),
          'Round ' + r + (stalled ? ' · stalled' : ''), rows, notes);
      }
      function roundFrom(clientX) {
        var bb = svg.getBoundingClientRect();
        var px = (clientX - bb.left) * (W / bb.width);
        return Math.max(0, Math.min(MILO.rounds, Math.round((px - m.l) / (x(1) - x(0)))));
      }
      overlay.addEventListener('pointermove', function (e) {
        if (state.playing) return;
        state.hover = roundFrom(e.clientX);
        drawHover(state.hover, e.clientX, e.clientY);
      });
      overlay.addEventListener('pointerleave', function () { state.hover = -1; drawHover(-1); });
      keyNav(overlay, MILO.rounds + 1, function () { return state.hover; }, function (i) { state.hover = i; drawHover(i); });
    }

    // replay: sweep the clip across the rounds
    var btn = fig.querySelector('[data-action="replay"]');
    if (reduced) btn.hidden = true;
    btn.addEventListener('click', function () {
      if (state.playing) return;
      state.playing = true;
      btn.disabled = true;
      readout.setAttribute('aria-live', 'off');
      hideTip();
      var t0 = performance.now(), dur = 5200, lastR = -1;
      state.setProgress(0);
      (function frame(now) {
        var t = Math.min(1, (now - t0) / dur);
        state.setProgress(t);
        var r = Math.floor(t * MILO.rounds + 1e-6);
        if (r !== lastR) { lastR = r; setReadout(Math.min(r, MILO.rounds)); }
        if (t < 1) requestAnimationFrame(frame);
        else {
          state.playing = false;
          btn.disabled = false;
          readout.setAttribute('aria-live', 'polite');
          state.setProgress(1);
          setReadout(MILO.rounds);
        }
      })(t0);
    });

    // data table
    var rows = [];
    var changeRounds = {};
    MILO.islands.forEach(function (isl) { isl.steps.forEach(function (s) { changeRounds[s[0]] = 1; }); });
    Object.keys(MILO.events).forEach(function (r) { changeRounds[r] = 1; });
    Object.keys(changeRounds).map(Number).sort(function (a, b) { return a - b; }).forEach(function (r) {
      rows.push([String(r)].concat(MILO.islands.map(function (isl) { return f1(miloValueAt(isl.steps, r)); }),
        [miloEventNotes(r).join('; ') || '—']));
    });
    table(role(fig, 'table'), ['Round', 'Island 1 (%)', 'Island 2 (%)', 'Island 3 (%)', 'Orchestrator'], rows);

    setReadout(MILO.rounds);
    render();
    onResize(chart, render);
  }

  /* ================= Hermes ================= */

  function initHermes(fig) {
    var C = colors(fig);
    var chart = role(fig, 'chart'), tabs = role(fig, 'tabs'), callout = role(fig, 'callout');
    var cur = 'pooled', shown = null, anim = null;
    var hoverIdx = -1;

    legend(role(fig, 'legend'), [
      { label: 'One 8K context', color: C.c3, kind: 'rect' },
      { label: 'Hermes, up to 7 × 8K contexts', color: C.c1, kind: 'rect' },
      { label: 'One 56K context (same total budget)', color: C.ink, kind: 'dash' }
    ]);

    function target(key) {
      var d = HERMES.main[key];
      return {
        vals: HERMES.stages.map(function (s) { return [d[s.key][0][0], d[s.key][1][0]]; }),
        sd: HERMES.stages.map(function (s) { return [d[s.key][0][1], d[s.key][1][1]]; }),
        ref: Math.max(d.ref[0], d.ref[1])
      };
    }

    HERMES.benches.forEach(function (b) {
      var bt = htmlEl('button', 'fig-seg-btn', tabs, b.short);
      bt.type = 'button';
      bt.setAttribute('aria-pressed', String(b.key === cur));
      bt.title = b.label;
      bt.addEventListener('click', function () { select(b.key); });
    });

    function setCallout(key) {
      var d = HERMES.main[key], ref = Math.max(d.ref[0], d.ref[1]);
      var base = d.Base, ours = d['SFT+RL'][1][0], diff = ours - ref;
      callout.textContent = '';
      htmlEl('strong', null, callout, f1(base[0][0]) + ' → ' + f1(base[1][0]));
      callout.appendChild(document.createTextNode(' untrained, one context vs Hermes. '));
      htmlEl('strong', null, callout, f1(ours) + ' vs ' + f1(ref));
      callout.appendChild(document.createTextNode(' after Hermes-Learn: ' +
        (diff >= 0 ? signed(diff) + ' points over' : f1(-diff) + ' points short of') + ' one 56K-token context.'));
    }

    function select(key) {
      if (key === cur && shown) return;
      cur = key;
      Array.prototype.forEach.call(tabs.children, function (b, i) {
        b.setAttribute('aria-pressed', String(HERMES.benches[i].key === key));
      });
      setCallout(key);
      var to = target(key);
      if (!shown || reduced) { shown = to; render(); return; }
      var from = shown, t0 = performance.now(), dur = 480;
      if (anim) cancelAnimationFrame(anim);
      (function frame(now) {
        var t = easeOut(Math.min(1, (now - t0) / dur));
        shown = {
          vals: to.vals.map(function (p, i) { return [from.vals[i][0] + (p[0] - from.vals[i][0]) * t, from.vals[i][1] + (p[1] - from.vals[i][1]) * t]; }),
          sd: to.sd, ref: from.ref + (to.ref - from.ref) * t
        };
        render();
        if (t < 1) anim = requestAnimationFrame(frame);
        else { shown = to; render(); anim = null; }
      })(t0);
    }

    function render() {
      chart.textContent = '';
      var W = chart.clientWidth || 600, narrow = W < 520;
      var m = { l: 36, r: 12, t: 18, b: 52 };
      var plotH = narrow ? 200 : 230, H = m.t + plotH + m.b;
      var yMax = 80;
      var y = linear(0, yMax, m.t + plotH, m.t);
      var band = (W - m.l - m.r) / HERMES.stages.length;
      var colW = Math.min(24, band * 0.28), gap = 2;
      var svg = svgEl('svg', { viewBox: '0 0 ' + W + ' ' + H, width: W, height: H, role: 'img',
        'aria-label': 'Accuracy with one context and with Hermes, by training stage' }, chart);

      [0, 20, 40, 60, 80].forEach(function (v) {
        svgEl('line', { x1: m.l, x2: W - m.r, y1: y(v), y2: y(v), 'class': v === 0 ? 'fig-axis' : 'fig-grid' }, svg);
        svgEl('text', { x: m.l - 8, y: y(v) + 4, 'text-anchor': 'end', 'class': 'fig-tick' }, svg, v + (v === 80 ? '%' : ''));
      });

      var hitG = svgEl('g', null, svg);
      HERMES.stages.forEach(function (s, i) {
        var cx = m.l + band * (i + 0.5);
        var dim = hoverIdx >= 0 && hoverIdx !== i;
        var grp = svgEl('g', { opacity: dim ? 0.45 : 1, 'class': 'fig-fade' }, svg);
        [0, 1].forEach(function (j) {
          var v = shown.vals[i][j], sd = shown.sd[i][j];
          var x0 = j === 0 ? cx - gap / 2 - colW : cx + gap / 2;
          svgEl('path', { d: columnPath(x0, y(v), colW, y(0) - y(v)), fill: j === 0 ? C.c3 : C.c1 }, grp);
          if (sd) {
            var xc = x0 + colW / 2;
            svgEl('path', { d: 'M' + xc + ' ' + y(v + sd) + ' V' + y(v - sd) + ' M' + (xc - 3) + ' ' + y(v + sd) + ' H' + (xc + 3) +
              ' M' + (xc - 3) + ' ' + y(v - sd) + ' H' + (xc + 3), 'class': 'fig-whisker' }, grp);
          }
          if (j === 1) {
            svgEl('text', { x: x0 + colW / 2, y: y(v + (sd || 0)) - 6, 'text-anchor': 'middle', 'class': 'fig-cap-label' }, grp, f1(v));
          }
        });
        svgEl('text', { x: cx, y: m.t + plotH + 18, 'text-anchor': 'middle', 'class': 'fig-cat' }, svg, s.label);
        var hit = svgEl('rect', { x: cx - band / 2, y: m.t, width: band, height: plotH + 24, fill: 'transparent', 'class': 'fig-hit', tabindex: 0,
          'aria-label': s.label + ': one context ' + f1(shown.vals[i][0]) + '%, Hermes ' + f1(shown.vals[i][1]) + '%' }, hitG);
        function enter(e) {
          hoverIdx = i;
          var bench = HERMES.benches.filter(function (b) { return b.key === cur; })[0];
          var d = HERMES.main[cur][s.key];
          var bb = hit.getBoundingClientRect();
          showTip(e && e.clientX ? e.clientX : bb.left + bb.width / 2, bb.top + (y(Math.max(d[0][0], d[1][0])) - m.t) * (bb.height / (plotH + 24)),
            s.label + ' · ' + bench.label, [
              { value: f1(d[1][0]) + (d[1][1] ? ' ± ' + f1(d[1][1]) : ''), label: 'Hermes', color: C.c1, key: 'rect' },
              { value: f1(d[0][0]) + (d[0][1] ? ' ± ' + f1(d[0][1]) : ''), label: 'One 8K context', color: C.c3, key: 'rect' },
              { value: f1(Math.max(HERMES.main[cur].ref[0], HERMES.main[cur].ref[1])), label: 'One 56K context', color: C.ink, key: 'line' }
            ], s.learn ? ['Hermes-Learn stage ' + (s.key === 'SFT' ? 'I' : 'I + II')] : (s.key === 'GRPO' ? ['RL on single-context reasoning only'] : ['Qwen3-4B-Instruct-2507, no training']));
          fadeGroups();
        }
        function leave() { hoverIdx = -1; hideTip(); fadeGroups(); }
        hit.addEventListener('pointerenter', enter);
        hit.addEventListener('pointermove', enter);
        hit.addEventListener('pointerleave', leave);
        hit.addEventListener('focus', function () { enter(); });
        hit.addEventListener('blur', leave);
      });
      function fadeGroups() {
        var groups = svg.querySelectorAll('g.fig-fade');
        Array.prototype.forEach.call(groups, function (gg, k) { gg.setAttribute('opacity', hoverIdx >= 0 && hoverIdx !== k ? 0.45 : 1); });
      }

      // Hermes-Learn bracket under the last two groups
      var bx0 = m.l + band * 2 + band * 0.12, bx1 = m.l + band * 4 - band * 0.12, by = m.t + plotH + 30;
      svgEl('path', { d: 'M' + bx0 + ' ' + (by - 4) + ' V' + by + ' H' + bx1 + ' V' + (by - 4), 'class': 'fig-bracket' }, svg);
      svgEl('text', { x: (bx0 + bx1) / 2, y: by + 15, 'text-anchor': 'middle', 'class': 'fig-axis-title' }, svg, 'Hermes-Learn');

      // reference: one 56K context
      var ry = y(shown.ref);
      svgEl('line', { x1: m.l, x2: W - m.r, y1: ry, y2: ry, 'class': 'fig-ref' }, svg);
      svgEl('text', { x: m.l + 6, y: ry - 6, 'class': 'fig-ref-label' }, svg, 'One 56K context · ' + f1(shown.ref));
      svg.appendChild(hitG);
    }

    var rows = [];
    HERMES.benches.forEach(function (b) {
      var d = HERMES.main[b.key];
      HERMES.stages.forEach(function (s) {
        rows.push([b.label, s.label + (s.learn ? ' (Hermes-Learn)' : ''),
          f1(d[s.key][0][0]) + (d[s.key][0][1] ? ' ± ' + f1(d[s.key][0][1]) : ''),
          f1(d[s.key][1][0]) + (d[s.key][1][1] ? ' ± ' + f1(d[s.key][1][1]) : '')]);
      });
      rows.push([b.label, 'One 56K context (Base / GRPO)', f1(d.ref[0]) + ' / ' + f1(d.ref[1]), '—']);
    });
    table(role(fig, 'table'), ['Benchmark', 'Model', 'One 8K context (%)', 'Hermes (%)'], rows);

    select('pooled');
    onResize(chart, render);
  }

  /* ================= SCOUT: prefix experiment ================= */

  function initScout(fig) {
    var C = colors(fig);
    var chart = role(fig, 'chart'), slider = role(fig, 'slider'), out = role(fig, 'slider-val');
    var statBox = role(fig, 'stat'), resp = role(fig, 'response');
    var idx = 3, hover = -1, sweeping = null;

    // stat tile
    htmlEl('div', 'fig-stat-label', statBox, 'Teacher accuracy');
    var statVal = htmlEl('div', 'fig-stat-value', statBox);
    var statDelta = htmlEl('div', 'fig-stat-delta', statBox);

    // response bar: student prefix + teacher continuation within the token budget
    var track = htmlEl('div', 'fig-resp-track', resp);
    var segS = htmlEl('div', 'fig-resp-seg', track); segS.style.background = C.c3;
    var segT = htmlEl('div', 'fig-resp-seg', track); segT.style.background = C.c2;
    var keys = htmlEl('div', 'fig-resp-keys', resp);
    function key(color) {
      var k = htmlEl('span', 'fig-resp-key', keys);
      var sw = htmlEl('i', null, k); sw.style.background = color;
      return htmlEl('span', null, k);
    }
    var kS = key(C.c3), kT = key(C.c2);
    var kB = htmlEl('span', 'fig-resp-key fig-resp-budget', keys);

    function update() {
      var i = idx;
      slider.value = SCOUT.ratios[i];
      out.textContent = SCOUT.ratios[i] + '%';
      statVal.textContent = f1(SCOUT.acc[i]) + '%';
      statDelta.textContent = i === 0 ? 'teacher solving alone from the problem' : signed(SCOUT.acc[i] - SCOUT.acc[0]) + ' vs. no student prefix';
      segS.style.width = (SCOUT.prefixTok[i] / SCOUT.budget * 100) + '%';
      segT.style.width = (SCOUT.contTok[i] / SCOUT.budget * 100) + '%';
      kS.textContent = 'Student prefix ' + Math.round(SCOUT.prefixTok[i]).toLocaleString() + ' tokens';
      kT.textContent = 'Teacher continuation ' + Math.round(SCOUT.contTok[i]).toLocaleString();
      kB.textContent = 'of a ' + SCOUT.budget.toLocaleString() + '-token budget';
      render();
    }

    function render() {
      chart.textContent = '';
      var W = chart.clientWidth || 600, narrow = W < 520;
      var m = { l: 36, r: 16, t: 22, b: 40 };
      var plotH = narrow ? 170 : 190, H = m.t + plotH + m.b;
      var x = linear(0, 90, m.l, W - m.r), y = linear(25, 50, m.t + plotH, m.t);
      var svg = svgEl('svg', { viewBox: '0 0 ' + W + ' ' + H, width: W, height: H, role: 'img',
        'aria-label': 'Teacher accuracy falls from 47.5% to 30.2% as the student prefix grows from 0% to 90%' }, chart);
      [25, 30, 35, 40, 45, 50].forEach(function (v) {
        svgEl('line', { x1: m.l, x2: W - m.r, y1: y(v), y2: y(v), 'class': v === 25 ? 'fig-axis' : 'fig-grid' }, svg);
        svgEl('text', { x: m.l - 8, y: y(v) + 4, 'text-anchor': 'end', 'class': 'fig-tick' }, svg, v + (v === 50 ? '%' : ''));
      });
      SCOUT.ratios.forEach(function (r) {
        if (narrow && r % 20) return;
        svgEl('text', { x: x(r), y: m.t + plotH + 16, 'text-anchor': 'middle', 'class': 'fig-tick' }, svg, r + '%');
      });
      svgEl('text', { x: W - m.r, y: m.t + plotH + 33, 'text-anchor': 'end', 'class': 'fig-axis-title' }, svg, 'Share of the student response given to the teacher');

      var d = SCOUT.ratios.map(function (r, i) { return (i ? 'L' : 'M') + x(r) + ' ' + y(SCOUT.acc[i]); }).join(' ');
      svgEl('path', { d: d + ' V' + y(25) + ' H' + x(0) + ' Z', fill: C.c1, 'fill-opacity': 0.1 }, svg);
      svgEl('path', { d: d, 'class': 'fig-line', stroke: C.c1 }, svg);

      // selected point
      var sx = x(SCOUT.ratios[idx]), sy = y(SCOUT.acc[idx]);
      svgEl('line', { x1: sx, x2: sx, y1: sy, y2: y(25), 'class': 'fig-drop' }, svg);
      svgEl('circle', { cx: sx, cy: sy, r: 5.5, fill: C.c1, 'class': 'fig-dot' }, svg);
      var left = SCOUT.ratios[idx] > 60;
      svgEl('text', { x: sx + (left ? -10 : 10), y: sy - 10, 'text-anchor': left ? 'end' : 'start', 'class': 'fig-end-label strong' }, svg, f1(SCOUT.acc[idx]) + '%');

      // hover crosshair; click selects
      var hg = svgEl('g', null, svg);
      // Pointer-only: the range input above is the keyboard control for this chart
      var ov = svgEl('rect', { x: m.l - 10, y: m.t, width: W - m.l - m.r + 20, height: plotH, fill: 'transparent', 'class': 'fig-overlay fig-clickable',
        'aria-hidden': 'true' }, svg);
      function near(clientX) {
        var bb = svg.getBoundingClientRect();
        var px = (clientX - bb.left) * (W / bb.width);
        return Math.max(0, Math.min(9, Math.round((px - m.l) / (x(10) - x(0)))));
      }
      function drawHover(i, cx, cy) {
        hg.textContent = '';
        if (i < 0) { hideTip(); return; }
        svgEl('line', { x1: x(SCOUT.ratios[i]), x2: x(SCOUT.ratios[i]), y1: m.t, y2: y(25), 'class': 'fig-crosshair' }, hg);
        svgEl('circle', { cx: x(SCOUT.ratios[i]), cy: y(SCOUT.acc[i]), r: 4.5, fill: C.c1, 'class': 'fig-dot' }, hg);
        var bb = svg.getBoundingClientRect();
        showTip(cx !== undefined ? cx : bb.left + x(SCOUT.ratios[i]) * bb.width / W, cy !== undefined ? cy : bb.top + y(SCOUT.acc[i]),
          'Student prefix ' + SCOUT.ratios[i] + '%', [
            { value: f1(SCOUT.acc[i]) + '%', label: 'Teacher accuracy', color: C.c1 },
            { value: Math.round(SCOUT.prefixTok[i]).toLocaleString(), label: 'Prefix tokens (student)', color: C.c3, key: 'rect' },
            { value: Math.round(SCOUT.contTok[i]).toLocaleString(), label: 'Continuation tokens (teacher)', color: C.c2, key: 'rect' }
          ], ['Click to select']);
      }
      ov.addEventListener('pointermove', function (e) { hover = near(e.clientX); drawHover(hover, e.clientX, e.clientY); });
      ov.addEventListener('pointerleave', function () { hover = -1; drawHover(-1); });
      ov.addEventListener('click', function (e) { stopSweep(); idx = near(e.clientX); hideTip(); update(); });
    }

    slider.addEventListener('input', function () { stopSweep(); idx = Math.round(slider.value / 10); update(); });

    var sweepBtn = fig.querySelector('[data-action="sweep"]');
    function stopSweep() {
      if (!sweeping) return;
      clearInterval(sweeping); sweeping = null;
      sweepBtn.classList.remove('is-on');
    }
    sweepBtn.addEventListener('click', function () {
      if (sweeping) { stopSweep(); return; }
      sweepBtn.classList.add('is-on');
      idx = 0; update();
      sweeping = setInterval(function () {
        if (idx >= 9) { stopSweep(); return; }
        idx++; update();
      }, reduced ? 900 : 520);
    });

    table(role(fig, 'table'), ['Student prefix', 'Prefix tokens', 'Teacher continuation tokens', 'Teacher accuracy (%)'],
      SCOUT.ratios.map(function (r, i) {
        return [r + '%', Math.round(SCOUT.prefixTok[i]).toLocaleString(), Math.round(SCOUT.contTok[i]).toLocaleString(), f1(SCOUT.acc[i])];
      }));

    update();
    onResize(chart, render);
  }

  /* ================= SCOUT: headline result (dumbbell) ================= */

  function initScoutResult(fig) {
    var C = colors(fig);
    var chart = role(fig, 'chart');
    var hoverRow = -1;
    legend(role(fig, 'legend'), [
      { label: 'OPD (fixed teacher)', color: C.c3, kind: 'dot' },
      { label: 'SCOUT (teacher adapted with RL)', color: C.c1, kind: 'dot' }
    ]);

    function render() {
      chart.textContent = '';
      var W = chart.clientWidth || 600;
      var m = { l: 12, r: 64, t: 8, b: 26 }, rowH = 46;
      var rows = SCOUT.settings.length, H = m.t + rows * rowH + m.b;
      var x = linear(44, 62, m.l, W - m.r);
      var svg = svgEl('svg', { viewBox: '0 0 ' + W + ' ' + H, width: W, height: H, role: 'img',
        'aria-label': 'SCOUT improves over OPD in all four distillation settings' }, chart);
      var axisY = m.t + rows * rowH;
      [46, 50, 54, 58, 62].forEach(function (v) {
        svgEl('line', { x1: x(v), x2: x(v), y1: m.t, y2: axisY, 'class': 'fig-grid' }, svg);
        svgEl('text', { x: x(v), y: axisY + 16, 'text-anchor': 'middle', 'class': 'fig-tick' }, svg, v + '%');
      });
      SCOUT.settings.forEach(function (s, i) {
        var top = m.t + i * rowH, cy = top + 30;
        var g = svgEl('g', { opacity: hoverRow >= 0 && hoverRow !== i ? 0.45 : 1 }, svg);
        svgEl('text', { x: m.l, y: top + 13, 'class': 'fig-cat fig-cat-left' }, g, s.label);
        svgEl('line', { x1: x(s.opd), x2: x(s.scout), y1: cy, y2: cy, 'class': 'fig-connector' }, g);
        svgEl('circle', { cx: x(s.opd), cy: cy, r: 5, fill: C.c3, 'class': 'fig-dot' }, g);
        svgEl('circle', { cx: x(s.scout), cy: cy, r: 5.5, fill: C.c1, 'class': 'fig-dot' }, g);
        svgEl('text', { x: x(s.scout) + 10, y: cy + 4, 'class': 'fig-end-label' }, g, f1(s.scout) + '  ' + signed(s.scout - s.opd));
        var hit = svgEl('rect', { x: 0, y: top, width: W, height: rowH, fill: 'transparent', tabindex: 0, 'class': 'fig-hit',
          'aria-label': s.label + ': OPD ' + f1(s.opd) + '%, SCOUT ' + f1(s.scout) + '%' }, svg);
        function enter(e) {
          hoverRow = i;
          var bb = hit.getBoundingClientRect();
          showTip(e && e.clientX ? e.clientX : bb.left + bb.width / 2, bb.top + 18, s.label, [
            { value: f1(s.scout) + '%', label: 'SCOUT', color: C.c1, key: 'dot' },
            { value: f1(s.opd) + '%', label: 'OPD', color: C.c3, key: 'dot' }
          ], ['Teacher ' + s.teacher + ', student ' + s.student]);
          fade();
        }
        function leave() { hoverRow = -1; hideTip(); fade(); }
        hit.addEventListener('pointermove', enter);
        hit.addEventListener('pointerleave', leave);
        hit.addEventListener('focus', function () { enter(); });
        hit.addEventListener('blur', leave);
      });
      function fade() {
        var gs = svg.querySelectorAll(':scope > g');
        Array.prototype.forEach.call(gs, function (g, k) { g.setAttribute('opacity', hoverRow >= 0 && hoverRow !== k ? 0.45 : 1); });
      }
    }

    table(role(fig, 'table'), ['Setting', 'Teacher → student', 'OPD (%)', 'SCOUT (%)', 'Gain'],
      SCOUT.settings.map(function (s) { return [s.label, s.teacher + ' → ' + s.student, f1(s.opd), f1(s.scout), signed(s.scout - s.opd)]; }));
    render();
    onResize(chart, render);
  }

  /* ================= boot ================= */

  function boot(id, fn) {
    var fig = document.getElementById(id);
    if (!fig) return;
    try { fn(fig); } catch (e) {
      // Leave the caption and table usable if a chart fails to draw
      if (window.console) console.error('Figure ' + id + ' failed:', e);
    }
  }
  boot('fig-milo', initMilo);
  boot('fig-hermes', initHermes);
  boot('fig-scout', initScout);
  boot('fig-scout-result', initScoutResult);
})();
