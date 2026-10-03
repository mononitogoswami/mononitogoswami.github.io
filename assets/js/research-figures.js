/* Interactive figures for the Research page: MILO search dynamics, Hermes main results,
   SCOUT's prefix experiment and headline result. Numbers are transcribed from each paper's
   project page (which transcribes the paper). Plain SVG, no dependencies.
   Each figure has a stat row that updates on slider, hover and tap, so nothing depends on
   hover alone. Colours come from CSS custom properties on .fig-card (_sass/_research.scss). */
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
      6: { g: [[3, 2, false]], m: [[1, 'Claude Code', 'Codex']] },
      9: { g: [[3, 1, false], [3, 2, false]] },
      12: { g: [[2, 3, false]], m: [[1, 'Codex', 'DeepAgents (GPT-5.5)'], [2, 'Claude Code', 'DeepAgents (Qwen3-Coder)']] },
      15: { g: [[3, 1, true]], m: [[3, 'Claude Code', 'Codex']] },
      18: { g: [[1, 3, false]], m: [[2, 'DeepAgents (Qwen3-Coder)', 'Claude Code']] },
      21: { g: [[1, 2, true], [1, 3, true]] },
      25: { g: [[3, 1, false], [2, 1, false]] },
      28: { g: [[3, 1, false], [3, 2, false]] }
    }
  };

  // Hermes, Table 3 (Qwen3-4B-Instruct-2507). Per stage: [single 8K context, Hermes], each [mean, sd].
  // ref = one 56K-token context [Base, GRPO]: the same total budget as Hermes.
  var HERMES = {
    benches: [
      { key: 'pooled', label: 'AIME + HMMT' },
      { key: 'synthetic', label: 'Synthetic' },
      { key: 'beyond', label: 'BeyondAIME' },
      { key: 'imo', label: 'IMO-AnswerBench' },
      { key: 'science', label: 'FrontierScience' }
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

  // SCOUT Figure 1: the teacher continues a cut student response. AIME 2025, 30 problems.
  var SCOUT = {
    ratios: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90],
    acc: [47.5, 46.67, 44.17, 39.17, 39.58, 36.67, 35.62, 34.79, 32.29, 30.21],
    prefixTok: [0, 274.5, 549.4, 824.3, 1099, 1374, 1649, 1924, 2199, 2474],
    contTok: [7258, 6847, 6730, 6950, 6763, 6903, 6775, 6720, 6351, 6119],
    budget: 16384,
    // Tables 1-3 / appendix Tables 10-13: benchmark-averaged student accuracy, mean of 3 runs
    settings: [
      { task: 'Math', label: '4B → 1.7B', teacher: 'Qwen3-4B-Instruct-2507', student: 'Qwen3-1.7B', opd: 49.21, scout: 51.39 },
      { task: 'Code', label: '4B → 1.7B', teacher: 'Qwen3-4B-Instruct-2507', student: 'Qwen3-1.7B', opd: 56.62, scout: 59.74 },
      { task: 'Math', label: '8B → 1.7B', teacher: 'Qwen3-8B-DAPO', student: 'Qwen3-1.7B', opd: 49.02, scout: 51.59 },
      { task: 'Math', label: 'Skywork-7B → DeepSeek-1.5B', teacher: 'Skywork-OR1-Math-7B', student: 'DeepSeek-R1-Distill-Qwen-1.5B', opd: 52.40, scout: 53.58 }
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
    return function (v) { return r0 + (v - d0) / (d1 - d0) * (r1 - r0); };
  }
  function f1(v) { return (Math.round(v * 10) / 10).toFixed(1); }
  function signed(v) { return (v >= 0 ? '+' : '−') + f1(Math.abs(v)); }
  function num(v) { return Math.round(v).toLocaleString('en-US'); }
  function role(fig, r) { return fig.querySelector('[data-role="' + r + '"]'); }
  function easeOut(t) { return 1 - Math.pow(1 - t, 3); }

  function colors(fig) {
    var cs = getComputedStyle(fig);
    var g = function (n) { return cs.getPropertyValue(n).trim(); };
    return { c1: g('--c1'), c2: g('--c2'), c3: g('--c3'), teacher: g('--teacher'), base: g('--base'), ink: g('--ink'), muted: g('--muted') };
  }

  // Column with a 4px rounded data end and a square baseline
  function columnPath(x, y, w, h) {
    if (h <= 0) return '';
    var r = Math.min(4, w / 2, h);
    return 'M' + x + ' ' + (y + h) + ' V' + (y + r) + ' Q' + x + ' ' + y + ' ' + (x + r) + ' ' + y +
      ' H' + (x + w - r) + ' Q' + (x + w) + ' ' + y + ' ' + (x + w) + ' ' + (y + r) + ' V' + (y + h) + ' Z';
  }

  function onResize(el, fn) {
    var last = el.clientWidth;
    var handler = function () { if (el.clientWidth && el.clientWidth !== last) { last = el.clientWidth; fn(); } };
    if ('ResizeObserver' in window) new ResizeObserver(handler).observe(el);
    else window.addEventListener('resize', handler);
  }

  // Pointer position -> SVG user units
  function svgX(svg, W, clientX) {
    var bb = svg.getBoundingClientRect();
    return (clientX - bb.left) * (W / (bb.width || W));
  }

  // Stat row: [{ label, value, small, color, key: 'line'|'sq'|'dash', wide }]
  function stats(container, items) {
    container.textContent = '';
    items.forEach(function (it) {
      var s = htmlEl('div', 'fig-stat' + (it.wide ? ' fig-stat-wide' : ''), container);
      var l = htmlEl('div', 'fig-stat-label', s);
      if (it.color) {
        var k = htmlEl('i', it.key === 'sq' ? 'sq' : null, l);
        if (it.key === 'dash') { k.style.borderTop = '1.5px dashed ' + it.color; k.style.height = '0'; }
        else k.style.background = it.color;
      }
      l.appendChild(document.createTextNode(it.label));
      var v = htmlEl('div', 'fig-stat-value', s, it.value);
      if (it.small) htmlEl('small', null, v, it.small);
    });
  }

  function legend(container, items) {
    container.textContent = '';
    items.forEach(function (it) {
      var s = htmlEl('span', 'fig-legend-item', container);
      var k = htmlEl('i', 'fig-legend-key fig-legend-' + (it.kind || 'line'), s);
      if (it.kind === 'ring') k.style.borderColor = it.color;
      else if (it.color) k.style.background = it.color;
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

  // "Table" button swaps the chart for its data table
  function tableToggle(fig, onShowChart) {
    var btn = fig.querySelector('[data-action="table"]'), tb = role(fig, 'table');
    if (!btn || !tb) return;
    btn.addEventListener('click', function () {
      var on = btn.getAttribute('aria-pressed') !== 'true';
      btn.setAttribute('aria-pressed', String(on));
      fig.classList.toggle('is-table', on);
      tb.hidden = !on;
      if (!on && onShowChart) onShowChart();
    });
  }

  // Range input: keep the filled part of the track in sync (WebKit has no ::range-progress)
  function syncFill(input) {
    var p = (input.value - input.min) / (input.max - input.min) * 100;
    input.style.setProperty('--fill', p + '%');
  }

  /* ---------- tooltip (Hermes bars only; one per page) ---------- */
  var tip = htmlEl('div', 'fig-tip', document.body);
  tip.setAttribute('role', 'tooltip');
  function showTip(clientX, clientY, title, rows, note) {
    tip.textContent = '';
    htmlEl('div', 'fig-tip-title', tip, title);
    rows.forEach(function (r) {
      var row = htmlEl('div', 'fig-tip-row', tip);
      var k = htmlEl('i', 'fig-tip-key' + (r.line ? ' fig-tip-key-line' : ''), row);
      k.style.background = r.color;
      htmlEl('span', 'fig-tip-val', row, r.value);
      htmlEl('span', 'fig-tip-label', row, r.label);
    });
    if (note) htmlEl('div', 'fig-tip-note', tip, note);
    tip.classList.add('on');
    var tw = tip.offsetWidth, th = tip.offsetHeight;
    tip.style.left = Math.max(8, Math.min(window.innerWidth - tw - 8, clientX - tw / 2)) + 'px';
    var y = clientY - th - 14;
    tip.style.top = (y < 8 ? clientY + 18 : y) + 'px';
  }
  function hideTip() { tip.classList.remove('on'); }
  window.addEventListener('scroll', hideTip, { passive: true });
  document.addEventListener('pointerdown', function (e) {
    if (!e.target.closest || !e.target.closest('.fig-chart')) hideTip();
  });

  /* ================= MILO ================= */

  function miloValueAt(steps, r) {
    var v = steps[0][1];
    for (var i = 0; i < steps.length; i++) if (steps[i][0] <= r) v = steps[i][1];
    return v;
  }
  function miloNotes(r) {
    var ev = MILO.events[r], out = [];
    if (!ev) return out;
    (ev.g || []).forEach(function (g) { out.push('Graft island ' + g[0] + ' → ' + g[1] + (g[2] ? ' admitted' : ' rejected')); });
    (ev.m || []).forEach(function (m) { out.push('Island ' + m[0] + ' mutator ' + m[1] + ' → ' + m[2]); });
    return out;
  }

  function initMilo(fig) {
    var C = colors(fig), series = [C.c1, C.c2, C.c3];
    var chart = role(fig, 'chart'), slider = role(fig, 'slider'), out = role(fig, 'slider-val');
    var statBox = role(fig, 'stats'), playBtn = fig.querySelector('[data-action="play"]');
    var state = { round: MILO.rounds, preview: -1, timer: null };

    legend(role(fig, 'legend'), MILO.islands.map(function (isl, k) {
      return { label: isl.name + ' (seed ' + f1(isl.seed) + ')', color: series[k] };
    }).concat([
      { label: 'Stall', kind: 'band' },
      { label: 'Graft admitted', color: C.ink, kind: 'dot' },
      { label: 'Graft rejected', color: C.muted, kind: 'ring' },
      { label: 'Mutator reassigned', color: C.muted, kind: 'diamond' }
    ]));

    function showStats(r) {
      var stalled = r >= MILO.stall[0] && r <= MILO.stall[1];
      var notes = miloNotes(r);
      stats(statBox, [{ label: 'Round', value: String(r), small: 'of ' + MILO.rounds }]
        .concat(MILO.islands.map(function (isl, k) {
          return { label: isl.name, value: f1(miloValueAt(isl.steps, r)) + '%', color: series[k] };
        }))
        .concat([{ label: 'Orchestrator', wide: true,
          value: notes.length ? notes.join(' · ') : (stalled ? 'No call this round. All islands stalled.' : 'No call this round.') }]));
    }

    function render() {
      chart.textContent = '';
      var W = chart.clientWidth || 640, narrow = W < 560;
      var r = state.preview >= 0 ? state.preview : state.round;
      var m = { l: 34, r: narrow ? 40 : 48, t: 22 };
      var plotH = narrow ? 200 : 260;
      var laneTop = m.t + plotH + 44, laneH = 36, H = laneTop + laneH + 4;
      var x = linear(0, MILO.rounds, m.l, W - m.r), y = linear(38, 62, m.t + plotH, m.t);
      var svg = svgEl('svg', { viewBox: '0 0 ' + W + ' ' + H, width: W, height: H, role: 'img',
        'aria-label': 'Pass-rate per island over 28 rounds of MILO search, with orchestrator interventions' }, chart);

      svgEl('rect', { x: x(MILO.stall[0]), y: m.t, width: x(MILO.stall[1]) - x(MILO.stall[0]), height: plotH, 'class': 'fig-band' }, svg);
      svgEl('text', { x: (x(MILO.stall[0]) + x(MILO.stall[1])) / 2, y: m.t - 8, 'text-anchor': 'middle', 'class': 'fig-band-label' }, svg,
        narrow ? 'Stalled' : 'All islands stalled');
      [40, 45, 50, 55, 60].forEach(function (v) {
        svgEl('line', { x1: m.l, x2: W - m.r, y1: y(v), y2: y(v), 'class': 'fig-grid' }, svg);
        svgEl('text', { x: m.l - 8, y: y(v) + 4, 'text-anchor': 'end', 'class': 'fig-tick' }, svg, v + (v === 60 ? '%' : ''));
      });
      Object.keys(MILO.events).forEach(function (er) {
        svgEl('line', { x1: x(+er), x2: x(+er), y1: m.t, y2: laneTop + laneH, 'class': 'fig-guide' }, svg);
      });
      svgEl('line', { x1: m.l, x2: W - m.r, y1: m.t + plotH, y2: m.t + plotH, 'class': 'fig-axis' }, svg);
      for (var t = 0; t <= MILO.rounds; t += 4) {
        svgEl('text', { x: x(t), y: m.t + plotH + 16, 'text-anchor': 'middle', 'class': 'fig-tick' }, svg, t);
      }
      svgEl('text', { x: W - m.r, y: m.t + plotH + 32, 'text-anchor': 'end', 'class': 'fig-axis-title' }, svg, 'Evolution round');
      svgEl('text', { x: m.l, y: laneTop - 6, 'class': 'fig-axis-title' }, svg, 'Orchestrator');

      // islands: solid up to the current round, faint after it
      MILO.islands.forEach(function (isl, k) {
        var pts = [[0, isl.steps[0][1]]];
        isl.steps.forEach(function (s, i) { if (i) { pts.push([s[0], pts[pts.length - 1][1]]); pts.push([s[0], s[1]]); } });
        pts.push([MILO.rounds, pts[pts.length - 1][1]]);
        function path(from, to) {
          var d = '', started = false;
          for (var i = 0; i < pts.length - 1; i++) {
            var a = pts[i], b = pts[i + 1];
            if (a[0] === b[0]) { // vertical step
              if (a[0] >= from && a[0] <= to && (a[0] > from || from === 0)) {
                d += (started ? ' L' : 'M') + x(a[0]) + ' ' + y(a[1]) + ' L' + x(b[0]) + ' ' + y(b[1]);
                started = true;
              }
              continue;
            }
            var x0 = Math.max(a[0], from), x1 = Math.min(b[0], to);
            if (x1 < x0) continue;
            d += (started ? ' L' : 'M') + x(x0) + ' ' + y(a[1]) + ' L' + x(x1) + ' ' + y(a[1]);
            started = true;
          }
          return d;
        }
        if (r < MILO.rounds) svgEl('path', { d: path(r, MILO.rounds), 'class': 'fig-line fig-line-future', stroke: series[k] }, svg);
        svgEl('path', { d: path(0, r), 'class': 'fig-line', stroke: series[k] }, svg);
        isl.steps.forEach(function (s) {
          if (s[0] <= r) svgEl('circle', { cx: x(s[0]), cy: y(s[1]), r: 4, fill: series[k], 'class': 'fig-dot' }, svg);
        });
        svgEl('circle', { cx: x(r), cy: y(miloValueAt(isl.steps, r)), r: 5, fill: series[k], 'class': 'fig-dot' }, svg);
      });

      // end labels at the final round, pushed apart with leader lines when they collide
      if (r === MILO.rounds) {
        var ends = MILO.islands.map(function (isl, k) {
          var v = isl.steps[isl.steps.length - 1][1];
          return { k: k, v: v, y0: y(v), y: y(v) };
        }).sort(function (a, b) { return a.y0 - b.y0; });
        for (var i = 1; i < ends.length; i++) if (ends[i].y - ends[i - 1].y < 14) ends[i].y = ends[i - 1].y + 14;
        var best = Math.max.apply(null, ends.map(function (e) { return e.v; }));
        ends.forEach(function (e) {
          var x0 = x(MILO.rounds) + 7;
          if (Math.abs(e.y - e.y0) > 1) svgEl('path', { d: 'M' + (x0 - 2) + ' ' + e.y0 + ' L' + (x0 + 3) + ' ' + e.y, 'class': 'fig-leader' }, svg);
          svgEl('text', { x: x0 + 5, y: e.y + 4, 'class': 'fig-end-label' + (e.v === best ? ' strong' : '') }, svg, f1(e.v));
        });
      } else {
        svgEl('line', { x1: x(r), x2: x(r), y1: m.t, y2: laneTop + laneH, 'class': 'fig-cursor' }, svg);
      }

      // orchestrator lane, faint after the current round
      Object.keys(MILO.events).forEach(function (er) {
        var ev = MILO.events[er], cx = x(+er), row = 0;
        var g = svgEl('g', { opacity: +er <= r ? 1 : 0.25 }, svg);
        function cy() { return laneTop + 7 + 11 * row++; }
        (ev.g || []).forEach(function (gr) { svgEl('circle', { cx: cx, cy: cy(), r: 4, 'class': gr[2] ? 'fig-ev-ok' : 'fig-ev-no' }, g); });
        (ev.m || []).forEach(function () {
          var c = cy();
          svgEl('path', { d: 'M' + cx + ' ' + (c - 4.5) + ' L' + (cx + 4.5) + ' ' + c + ' L' + cx + ' ' + (c + 4.5) + ' L' + (cx - 4.5) + ' ' + c + ' Z', 'class': 'fig-ev-mut' }, g);
        });
      });

      // pointer layer: hover previews a round, tap or click selects it
      var ov = svgEl('rect', { x: m.l - 8, y: m.t, width: W - m.l - m.r + 16, height: laneTop + laneH - m.t, fill: 'transparent', 'class': 'fig-overlay', 'aria-hidden': 'true' }, svg);
      function roundAt(e) { return Math.max(0, Math.min(MILO.rounds, Math.round((svgX(svg, W, e.clientX) - m.l) / (x(1) - x(0))))); }
      ov.addEventListener('pointermove', function (e) {
        if (state.timer || e.pointerType === 'touch') return;
        var rr = roundAt(e);
        if (rr !== state.preview) { state.preview = rr; showStats(rr); render(); }
      });
      ov.addEventListener('pointerleave', function () {
        if (state.preview < 0) return;
        state.preview = -1; showStats(state.round); render();
      });
      ov.addEventListener('pointerdown', function (e) { stop(); setRound(roundAt(e)); });
    }

    function setRound(r) {
      state.round = r; state.preview = -1;
      slider.value = r; out.textContent = r; syncFill(slider);
      showStats(r); render();
    }
    function stop() {
      if (!state.timer) return;
      clearInterval(state.timer); state.timer = null;
      playBtn.classList.remove('is-on');
    }
    slider.addEventListener('input', function () { stop(); setRound(+slider.value); });
    playBtn.addEventListener('click', function () {
      if (state.timer) { stop(); return; }
      playBtn.classList.add('is-on');
      setRound(0);
      state.timer = setInterval(function () {
        if (state.round >= MILO.rounds) { stop(); return; }
        setRound(state.round + 1);
      }, 190);
    });

    var change = {};
    MILO.islands.forEach(function (isl) { isl.steps.forEach(function (s) { change[s[0]] = 1; }); });
    Object.keys(MILO.events).forEach(function (r) { change[r] = 1; });
    table(role(fig, 'table'), ['Round', 'Island 1 (%)', 'Island 2 (%)', 'Island 3 (%)', 'Orchestrator'],
      Object.keys(change).map(Number).sort(function (a, b) { return a - b; }).map(function (r) {
        return [String(r)].concat(MILO.islands.map(function (isl) { return f1(miloValueAt(isl.steps, r)); }), [miloNotes(r).join('; ') || '—']);
      }));
    tableToggle(fig, render);

    setRound(MILO.rounds);
    onResize(chart, render);
  }

  /* ================= Hermes ================= */

  function initHermes(fig) {
    var C = colors(fig);
    var chart = role(fig, 'chart'), tabs = role(fig, 'tabs'), statBox = role(fig, 'stats');
    var cur = null, shown = null, anim = null, hoverIdx = -1;

    legend(role(fig, 'legend'), [
      { label: 'One 8K context', color: C.base, kind: 'rect' },
      { label: 'Hermes (up to 7 × 8K contexts)', color: C.c1, kind: 'rect' },
      { label: 'One 56K context, same total budget', kind: 'dash' }
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
      var bt = htmlEl('button', 'fig-seg-btn', tabs, b.label);
      bt.type = 'button';
      bt.setAttribute('aria-pressed', 'false');
      bt.addEventListener('click', function () { select(b.key); });
    });

    function showStats(key) {
      var d = HERMES.main[key], ref = Math.max(d.ref[0], d.ref[1]), ours = d['SFT+RL'][1][0];
      stats(statBox, [
        { label: 'Untrained, one context', value: f1(d.Base[0][0]) + '%', color: C.base, key: 'sq' },
        { label: 'Untrained, Hermes', value: f1(d.Base[1][0]) + '%', small: signed(d.Base[1][0] - d.Base[0][0]), color: C.c1, key: 'sq' },
        { label: 'After Hermes-Learn, Hermes', value: f1(ours) + '%', small: signed(ours - ref) + ' vs 56K', color: C.c1, key: 'sq' },
        { label: 'One 56K context', value: f1(ref) + '%', color: C.ink, key: 'dash' }
      ]);
    }

    function select(key) {
      if (key === cur) return;
      cur = key;
      Array.prototype.forEach.call(tabs.children, function (b, i) { b.setAttribute('aria-pressed', String(HERMES.benches[i].key === key)); });
      showStats(key);
      hideTip();
      var to = target(key);
      if (!shown || reduced) { shown = to; render(); return; }
      var from = shown, t0 = performance.now(), dur = 460;
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
      var W = chart.clientWidth || 640;
      var m = { l: 34, r: 8, t: 18, b: 50 };
      var plotH = W < 560 ? 200 : 240, H = m.t + plotH + m.b;
      var y = linear(0, 80, m.t + plotH, m.t);
      var band = (W - m.l - m.r) / HERMES.stages.length;
      var colW = Math.min(26, band * 0.28), gap = 2;
      var svg = svgEl('svg', { viewBox: '0 0 ' + W + ' ' + H, width: W, height: H, role: 'img',
        'aria-label': 'Accuracy with one context and with Hermes, by training stage' }, chart);

      [0, 20, 40, 60, 80].forEach(function (v) {
        svgEl('line', { x1: m.l, x2: W - m.r, y1: y(v), y2: y(v), 'class': v === 0 ? 'fig-axis' : 'fig-grid' }, svg);
        svgEl('text', { x: m.l - 8, y: y(v) + 4, 'text-anchor': 'end', 'class': 'fig-tick' }, svg, v + (v === 80 ? '%' : ''));
      });

      var groups = [];
      HERMES.stages.forEach(function (s, i) {
        var cx = m.l + band * (i + 0.5);
        var g = svgEl('g', { opacity: hoverIdx >= 0 && hoverIdx !== i ? 0.4 : 1 }, svg);
        groups.push(g);
        [0, 1].forEach(function (j) {
          var v = shown.vals[i][j], sd = shown.sd[i][j];
          var x0 = j === 0 ? cx - gap / 2 - colW : cx + gap / 2;
          svgEl('path', { d: columnPath(x0, y(v), colW, y(0) - y(v)), fill: j === 0 ? C.base : C.c1 }, g);
          if (sd) {
            var xc = x0 + colW / 2;
            svgEl('path', { d: 'M' + xc + ' ' + y(v + sd) + ' V' + y(v - sd) + ' M' + (xc - 3) + ' ' + y(v + sd) + ' H' + (xc + 3) +
              ' M' + (xc - 3) + ' ' + y(v - sd) + ' H' + (xc + 3), 'class': 'fig-whisker' }, g);
          }
          if (j === 1) svgEl('text', { x: x0 + colW / 2, y: y(v + (sd || 0)) - 6, 'text-anchor': 'middle', 'class': 'fig-cap-label' }, g, f1(v));
        });
        svgEl('text', { x: cx, y: m.t + plotH + 18, 'text-anchor': 'middle', 'class': 'fig-cat' }, svg, s.label);
      });

      var bx0 = m.l + band * 2 + band * 0.1, bx1 = m.l + band * 4 - band * 0.1, by = m.t + plotH + 29;
      svgEl('path', { d: 'M' + bx0 + ' ' + (by - 4) + ' V' + by + ' H' + bx1 + ' V' + (by - 4), 'class': 'fig-bracket' }, svg);
      svgEl('text', { x: (bx0 + bx1) / 2, y: by + 15, 'text-anchor': 'middle', 'class': 'fig-axis-title' }, svg, 'Hermes-Learn');

      var ry = y(shown.ref);
      svgEl('line', { x1: m.l, x2: W - m.r, y1: ry, y2: ry, 'class': 'fig-ref' }, svg);
      svgEl('text', { x: m.l + 6, y: ry - 6, 'class': 'fig-ref-label' }, svg, 'One 56K context ' + f1(shown.ref));

      // one hit target per group: hover shows a tooltip, tap shows it too
      HERMES.stages.forEach(function (s, i) {
        var cx = m.l + band * (i + 0.5);
        var hit = svgEl('rect', { x: cx - band / 2, y: m.t, width: band, height: plotH + 24, fill: 'transparent', 'class': 'fig-hit', tabindex: 0,
          'aria-label': s.label + ': one context ' + f1(shown.vals[i][0]) + '%, Hermes ' + f1(shown.vals[i][1]) + '%' }, svg);
        function enter(e) {
          hoverIdx = i;
          groups.forEach(function (g, k) { g.setAttribute('opacity', k === i ? 1 : 0.4); });
          var d = HERMES.main[cur][s.key], bb = hit.getBoundingClientRect();
          var note = s.learn ? 'Hermes-Learn stage ' + (s.key === 'SFT' ? 'I (SFT)' : 'I + II (SFT, then RL)') :
            (s.key === 'GRPO' ? 'RL on single-context reasoning only' : 'Qwen3-4B-Instruct-2507, no training');
          showTip(e && e.clientX ? e.clientX : bb.left + bb.width / 2, bb.top + 10, s.label, [
            { value: f1(d[1][0]) + (d[1][1] ? ' ± ' + f1(d[1][1]) : '') + '%', label: 'Hermes', color: C.c1 },
            { value: f1(d[0][0]) + (d[0][1] ? ' ± ' + f1(d[0][1]) : '') + '%', label: 'One 8K context', color: C.base }
          ], note);
        }
        function leave() {
          hoverIdx = -1;
          groups.forEach(function (g) { g.setAttribute('opacity', 1); });
          hideTip();
        }
        hit.addEventListener('pointerenter', function (e) { if (e.pointerType !== 'touch') enter(e); });
        hit.addEventListener('pointerleave', function (e) { if (e.pointerType !== 'touch') leave(); });
        hit.addEventListener('pointerdown', function (e) { if (e.pointerType === 'touch') enter(e); });
        hit.addEventListener('focus', function () { enter(); });
        hit.addEventListener('blur', leave);
      });
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
    tableToggle(fig, render);

    select('pooled');
    onResize(chart, render);
  }

  /* ================= SCOUT: prefix experiment ================= */

  function initScout(fig) {
    var C = colors(fig);
    var chart = role(fig, 'chart'), slider = role(fig, 'slider'), out = role(fig, 'slider-val');
    var statBox = role(fig, 'stats'), budgetBox = role(fig, 'budget'), sweepBtn = fig.querySelector('[data-action="play"]');
    var idx = 0, preview = -1, timer = null;

    // token budget bar
    var label = htmlEl('div', 'fig-budget-label', budgetBox);
    var track = htmlEl('div', 'fig-budget-track', budgetBox);
    var segS = htmlEl('div', 'fig-budget-seg', track); segS.style.background = C.c3;
    var segT = htmlEl('div', 'fig-budget-seg', track); segT.style.background = C.c2;
    htmlEl('div', 'fig-budget-cap', track);
    var keys = htmlEl('div', 'fig-budget-keys', budgetBox);
    function key(color) { var k = htmlEl('span', null, keys); htmlEl('i', null, k).style.background = color; return htmlEl('span', null, k); }
    var kS = key(C.c3), kT = key(C.c2);

    function show(i) {
      var total = SCOUT.prefixTok[i] + SCOUT.contTok[i];
      stats(statBox, [
        { label: 'Student prefix', value: SCOUT.ratios[i] + '%', small: i === 0 ? 'teacher alone' : null, color: C.c3, key: 'sq' },
        { label: 'Teacher accuracy', value: f1(SCOUT.acc[i]) + '%', small: i === 0 ? null : signed(SCOUT.acc[i] - SCOUT.acc[0]) + ' vs alone', color: C.teacher },
        { label: 'Tokens used', value: num(total), small: 'of ' + num(SCOUT.budget) }
      ]);
      segS.style.width = (SCOUT.prefixTok[i] / SCOUT.budget * 100) + '%';
      segT.style.width = (SCOUT.contTok[i] / SCOUT.budget * 100) + '%';
      label.textContent = 'Budget ' + num(SCOUT.budget);
      kS.textContent = 'Student prefix ' + num(SCOUT.prefixTok[i]);
      kT.textContent = 'Teacher continuation ' + num(SCOUT.contTok[i]);
    }

    function render() {
      chart.textContent = '';
      var W = chart.clientWidth || 640, narrow = W < 560;
      var i = preview >= 0 ? preview : idx;
      var m = { l: 34, r: 14, t: 26, b: 36 };
      var plotH = narrow ? 170 : 200, H = m.t + plotH + m.b;
      var x = linear(0, 90, m.l, W - m.r), y = linear(25, 50, m.t + plotH, m.t);
      var svg = svgEl('svg', { viewBox: '0 0 ' + W + ' ' + H, width: W, height: H, role: 'img',
        'aria-label': 'Teacher accuracy falls from 47.5% to 30.2% as the student prefix grows from 0% to 90%' }, chart);
      [30, 40, 50].forEach(function (v) {
        svgEl('line', { x1: m.l, x2: W - m.r, y1: y(v), y2: y(v), 'class': 'fig-grid' }, svg);
        svgEl('text', { x: m.l - 8, y: y(v) + 4, 'text-anchor': 'end', 'class': 'fig-tick' }, svg, v + '%');
      });
      svgEl('line', { x1: m.l, x2: W - m.r, y1: y(25), y2: y(25), 'class': 'fig-axis' }, svg);
      SCOUT.ratios.forEach(function (rr) {
        if (narrow && rr % 30) return;
        svgEl('text', { x: x(rr), y: m.t + plotH + 16, 'text-anchor': 'middle', 'class': 'fig-tick' }, svg, rr + '%');
      });
      svgEl('text', { x: (m.l + W - m.r) / 2, y: m.t + plotH + 33, 'text-anchor': 'middle', 'class': 'fig-axis-title' }, svg, 'Student prefix length (% of response)');

      var d = SCOUT.ratios.map(function (rr, k) { return (k ? 'L' : 'M') + x(rr) + ' ' + y(SCOUT.acc[k]); }).join(' ');
      svgEl('path', { d: d, 'class': 'fig-line', stroke: C.teacher }, svg);
      SCOUT.ratios.forEach(function (rr, k) {
        if (k !== i) svgEl('circle', { cx: x(rr), cy: y(SCOUT.acc[k]), r: 4, fill: C.teacher, 'class': 'fig-dot' }, svg);
      });

      var sx = x(SCOUT.ratios[i]), sy = y(SCOUT.acc[i]);
      svgEl('line', { x1: sx, x2: sx, y1: m.t - 6, y2: y(25), 'class': 'fig-drop' }, svg);
      svgEl('circle', { cx: sx, cy: sy, r: 6.5, fill: C.teacher, 'class': 'fig-dot' }, svg);
      var right = SCOUT.ratios[i] > 55;
      svgEl('text', { x: sx + (right ? -11 : 11), y: sy - 10, 'text-anchor': right ? 'end' : 'start', 'class': 'fig-end-label strong fig-halo' }, svg,
        f1(SCOUT.acc[i]) + '%' + (i === 0 ? ' teacher alone' : ''));

      var ov = svgEl('rect', { x: m.l - 12, y: m.t - 10, width: W - m.l - m.r + 24, height: plotH + 10, fill: 'transparent', 'class': 'fig-overlay', 'aria-hidden': 'true' }, svg);
      function near(e) { return Math.max(0, Math.min(9, Math.round((svgX(svg, W, e.clientX) - m.l) / (x(10) - x(0))))); }
      ov.addEventListener('pointermove', function (e) {
        if (timer || e.pointerType === 'touch') return;
        var k = near(e);
        if (k !== preview) { preview = k; show(k); render(); }
      });
      ov.addEventListener('pointerleave', function () { if (preview < 0) return; preview = -1; show(idx); render(); });
      ov.addEventListener('pointerdown', function (e) { stop(); set(near(e)); });
    }

    function set(i) {
      idx = i; preview = -1;
      slider.value = SCOUT.ratios[i]; out.textContent = SCOUT.ratios[i] + '%'; syncFill(slider);
      show(i); render();
    }
    function stop() {
      if (!timer) return;
      clearInterval(timer); timer = null;
      sweepBtn.classList.remove('is-on');
    }
    slider.addEventListener('input', function () { stop(); set(Math.round(slider.value / 10)); });
    sweepBtn.addEventListener('click', function () {
      if (timer) { stop(); return; }
      sweepBtn.classList.add('is-on');
      set(0);
      timer = setInterval(function () {
        if (idx >= 9) { stop(); return; }
        set(idx + 1);
      }, 480);
    });

    table(role(fig, 'table'), ['Student prefix', 'Teacher accuracy (%)', 'Prefix tokens', 'Continuation tokens'],
      SCOUT.ratios.map(function (rr, k) { return [rr + '%', f1(SCOUT.acc[k]), num(SCOUT.prefixTok[k]), num(SCOUT.contTok[k])]; }));
    tableToggle(fig, render);

    set(0);
    onResize(chart, render);
  }

  /* ================= SCOUT: headline result ================= */

  function initScoutResult(fig) {
    var C = colors(fig), chart = role(fig, 'chart'), hoverRow = -1;
    legend(role(fig, 'legend'), [
      { label: 'OPD, frozen teacher', color: C.base, kind: 'dot' },
      { label: 'SCOUT, teacher adapted with RL', color: C.c1, kind: 'dot' }
    ]);

    function render() {
      chart.textContent = '';
      var W = chart.clientWidth || 640, narrow = W < 560;
      var labelW = narrow ? 0 : 230, valW = 100, rowH = narrow ? 52 : 40;
      var m = { t: 4, b: 28 };
      var n = SCOUT.settings.length, H = m.t + n * rowH + m.b;
      var x = linear(46, 62, labelW + 14, W - valW);
      var svg = svgEl('svg', { viewBox: '0 0 ' + W + ' ' + H, width: W, height: H, role: 'img',
        'aria-label': 'SCOUT improves over OPD in all four distillation settings' }, chart);
      var axisY = m.t + n * rowH;
      [46, 50, 54, 58, 62].forEach(function (v) {
        svgEl('line', { x1: x(v), x2: x(v), y1: m.t, y2: axisY, 'class': 'fig-grid' }, svg);
        svgEl('text', { x: x(v), y: axisY + 16, 'text-anchor': 'middle', 'class': 'fig-tick' }, svg, v + '%');
      });
      SCOUT.settings.forEach(function (s, i) {
        var top = m.t + i * rowH, cy = narrow ? top + 36 : top + rowH / 2;
        if (hoverRow === i) svgEl('rect', { x: 0, y: top + 2, width: W, height: rowH - 4, rx: 8, 'class': 'fig-row-band' }, svg);
        var tl = svgEl('text', { x: narrow ? 0 : labelW, y: narrow ? top + 15 : cy + 4, 'text-anchor': narrow ? 'start' : 'end', 'class': 'fig-cat' }, svg);
        svgEl('tspan', { 'font-weight': 700 }, tl, s.task + '  ');
        svgEl('tspan', { 'font-weight': 500 }, tl, s.label);
        svgEl('line', { x1: x(s.opd), x2: x(s.scout), y1: cy, y2: cy, 'class': 'fig-connector' }, svg);
        svgEl('circle', { cx: x(s.opd), cy: cy, r: 5, fill: C.base, 'class': 'fig-dot' }, svg);
        svgEl('circle', { cx: x(s.scout), cy: cy, r: 6, fill: C.c1, 'class': 'fig-dot' }, svg);
        var vt = svgEl('text', { x: W, y: cy + 4, 'text-anchor': 'end', 'class': 'fig-value' }, svg);
        svgEl('tspan', null, vt, f1(s.opd) + ' → ' + f1(s.scout) + ' ');
        svgEl('tspan', { 'class': 'fig-gain' }, vt, signed(s.scout - s.opd));
        var hit = svgEl('rect', { x: 0, y: top, width: W, height: rowH, fill: 'transparent', 'class': 'fig-hit', tabindex: 0,
          'aria-label': s.task + ' ' + s.label + ': OPD ' + f1(s.opd) + '%, SCOUT ' + f1(s.scout) + '%' }, svg);
        svgEl('title', null, hit, 'Teacher ' + s.teacher + ', student ' + s.student);
        hit.addEventListener('pointerenter', function () { if (hoverRow !== i) { hoverRow = i; render(); } });
        hit.addEventListener('focus', function () { hoverRow = i; render(); });
      });
      svg.addEventListener('pointerleave', function () { if (hoverRow >= 0) { hoverRow = -1; render(); } });
    }

    table(role(fig, 'table'), ['Task', 'Teacher → student', 'OPD (%)', 'SCOUT (%)', 'Gain'],
      SCOUT.settings.map(function (s) { return [s.task, s.teacher + ' → ' + s.student, f1(s.opd), f1(s.scout), signed(s.scout - s.opd)]; }));
    tableToggle(fig, render);
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
