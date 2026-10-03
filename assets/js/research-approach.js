/* Approach animations for the Research page: one step player per paper (SCOUT, Hermes, MILO),
   after the method figures on each project page. A stage is an SVG whose elements are tagged
   with the steps they appear in; the player toggles them, so every step is also a static,
   readable state. Autoplay starts when the box scrolls into view and is off under
   prefers-reduced-motion. Colours come from CSS custom properties on .fig-card. */
(function () {
  'use strict';

  var NS = 'http://www.w3.org/2000/svg';
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function htmlEl(tag, cls, parent, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text !== undefined) n.textContent = text;
    if (parent) parent.appendChild(n);
    return n;
  }

  /* ---------- step player ---------- */

  // cfg: { steps: [{ tag, title, desc }], legend: [{ label, kind, color }], draw(E, C), dur }
  function player(fig, cfg) {
    var cs = getComputedStyle(fig);
    var C = {};
    ['c1', 'c2', 'c3', 'teacher', 'base', 'ink', 'muted', 'surface', 'olive', 'sand'].forEach(function (k) {
      C[k] = cs.getPropertyValue('--' + k).trim();
    });

    var root = fig.querySelector('[data-role="approach"]');
    var stepsBox = htmlEl('div', 'ap-steps', root);
    var stageWrap = htmlEl('div', 'ap-stage-wrap', root);
    var stage = htmlEl('div', 'ap-stage', stageWrap);
    var legendBox = htmlEl('div', 'fig-legend ap-legend', stageWrap);
    var controls = htmlEl('div', 'ap-controls', stepsBox);

    var svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('viewBox', '0 0 600 320');
    svg.setAttribute('role', 'img');
    stage.appendChild(svg);

    // arrowheads
    var defs = document.createElementNS(NS, 'defs');
    svg.appendChild(defs);
    var uid = fig.id;
    [['a', C.c1], ['m', C.muted], ['t', C.teacher]].forEach(function (p) {
      var mk = document.createElementNS(NS, 'marker');
      mk.setAttribute('id', uid + '-' + p[0]);
      mk.setAttribute('viewBox', '0 0 10 10');
      mk.setAttribute('refX', '8'); mk.setAttribute('refY', '5');
      mk.setAttribute('markerWidth', '7'); mk.setAttribute('markerHeight', '7');
      mk.setAttribute('orient', 'auto-start-reverse');
      var path = document.createElementNS(NS, 'path');
      path.setAttribute('d', 'M0 0 L10 5 L0 10 z');
      path.setAttribute('fill', p[1]);
      mk.appendChild(path);
      defs.appendChild(mk);
    });

    // E(tag, attrs, show, text): show = { from, to, dim: [steps], hot: [steps], d: delay ms, pop: bool }
    var els = [];
    function E(tag, attrs, show, text) {
      var n = document.createElementNS(NS, tag);
      for (var k in attrs) {
        var v = attrs[k];
        if (k === 'arrow') { n.setAttribute('marker-end', 'url(#' + uid + '-' + v + ')'); continue; }
        if (v !== undefined && v !== null) n.setAttribute(k, v);
      }
      if (text !== undefined) n.textContent = text;
      var sh = show || {};
      n.classList.add('ps-el');
      if (sh.pop) n.classList.add('ps-pop');
      if (sh.d) n.style.setProperty('--d', sh.d + 'ms');
      svg.appendChild(n);
      els.push({ n: n, from: sh.from || 1, to: sh.to || 99, dim: sh.dim || [], hot: sh.hot || [] });
      return n;
    }
    cfg.draw(E, C);

    (cfg.legend || []).forEach(function (it) {
      var s = htmlEl('span', 'fig-legend-item', legendBox);
      var k = htmlEl('i', 'fig-legend-key fig-legend-' + (it.kind || 'rect'), s);
      if (it.kind === 'ring' || it.kind === 'outline') k.style.borderColor = it.color;
      else if (it.kind === 'dashline') k.style.borderTopColor = it.color;
      else if (it.color) k.style.background = it.color;
      s.appendChild(document.createTextNode(it.label));
    });

    var buttons = cfg.steps.map(function (st, i) {
      var b = htmlEl('button', 'ap-step', null);
      b.type = 'button';
      var head = htmlEl('span', 'ap-step-head', b, 'Step ' + (i + 1));
      if (st.tag) htmlEl('span', 'ap-step-tag' + (st.ours ? ' ours' : ''), head, st.tag);
      htmlEl('span', 'ap-step-title', b, st.title);
      htmlEl('span', 'ap-step-desc', b, st.desc);
      htmlEl('span', 'ap-step-bar', b);
      b.addEventListener('click', function () { pause(); go(i + 1); });
      stepsBox.insertBefore(b, controls);
      return b;
    });

    var playBtn = htmlEl('button', 'fig-btn ap-play', controls);
    playBtn.type = 'button';
    htmlEl('span', 'ap-hint', controls, 'or click a step to pause on it');

    var step = 1, playing = false, timer = null, visible = false, userPaused = false;
    var dur = cfg.dur || 3800;
    fig.style.setProperty('--ap-dur', dur + 'ms');

    function go(n) {
      step = n;
      buttons.forEach(function (b, i) {
        if (i + 1 === n) b.setAttribute('aria-current', 'step');
        else b.removeAttribute('aria-current');
        b.classList.remove('is-running');
      });
      els.forEach(function (e) {
        var on = n >= e.from && n <= e.to;
        e.n.classList.toggle('on', on);
        e.n.classList.toggle('dim', on && e.dim.indexOf(n) >= 0);
        e.n.classList.toggle('hot', e.hot.indexOf(n) >= 0);
      });
      svg.setAttribute('aria-label', 'Step ' + n + ' of ' + cfg.steps.length + ': ' + cfg.steps[n - 1].title + '. ' + cfg.steps[n - 1].desc);
      if (playing) {
        var b = buttons[n - 1];
        void b.offsetWidth; // restart the progress bar animation
        b.classList.add('is-running');
        clearTimeout(timer);
        timer = setTimeout(function () { go(n % cfg.steps.length + 1); }, n === cfg.steps.length ? dur + 1600 : dur);
      }
    }
    function setBtn() {
      playBtn.textContent = '';
      htmlEl('span', 'fig-btn-icon', playBtn, playing ? '❚❚' : '▶').setAttribute('aria-hidden', 'true');
      playBtn.appendChild(document.createTextNode(playing ? ' Pause' : ' Play'));
    }
    function play() { playing = true; userPaused = false; setBtn(); go(step); }
    function pause(byUser) {
      playing = false; clearTimeout(timer);
      if (byUser !== false) userPaused = true;
      buttons.forEach(function (b) { b.classList.remove('is-running'); });
      setBtn();
    }
    playBtn.addEventListener('click', function () { if (playing) pause(); else play(); });

    setBtn();
    go(1);
    // Autoplay while the box is on screen, unless the reader paused it or prefers reduced motion
    if (!reduced && 'IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          visible = en.isIntersecting;
          if (visible && !playing && !userPaused) play();
          else if (!visible && playing) pause(false);
        });
      }, { threshold: 0.35 }).observe(fig);
    }
  }

  /* ---------- SCOUT: train the teacher to continue the student's prefixes ---------- */

  function drawScout(E, C) {
    var tokX = function (i) { return 74 + i * 38; };
    var cut = 5, cutX = tokX(cut) - 4;
    // teacher
    E('rect', { x: 150, y: 16, width: 300, height: 38, rx: 9, fill: C.c2, 'class': 'ap-teacher' }, { dim: [1], hot: [4] });
    E('text', { x: 300, y: 41, 'text-anchor': 'middle', 'class': 'ap-label-strong' }, { dim: [1] }, 'Teacher');
    // problem + student response
    E('text', { x: 22, y: 116, 'class': 'ap-label-small' }, {}, 'Problem');
    E('rect', { x: 22, y: 124, width: 38, height: 38, rx: 8, 'class': 'ap-box' }, {});
    E('text', { x: 41, y: 149, 'text-anchor': 'middle', 'class': 'ap-label-strong' }, {}, 'Q');
    for (var i = 0; i < 11; i++) {
      E('rect', { x: tokX(i), y: 124, width: 31, height: 38, rx: 7, fill: C.olive }, { pop: true, d: i * 70, dim: i >= cut ? [3, 4] : [] });
    }
    E('text', { x: tokX(0), y: 184, 'class': 'ap-label-olive' }, { to: 2, d: 500 }, 'Student response');
    // step 2: token-level supervision
    for (var j = 0; j < 11; j++) {
      E('line', { x1: 150 + (j + 0.5) * 300 / 11, y1: 56, x2: tokX(j) + 15.5, y2: 122, 'class': 'ap-supervise' }, { from: 2, to: 2, d: j * 45 });
    }
    E('text', { x: 300, y: 214, 'text-anchor': 'middle', 'class': 'ap-label' }, { from: 2, to: 2, d: 500 }, 'Student updated to match the teacher, token by token');
    // step 3: cut the response, teacher continues
    E('line', { x1: cutX, y1: 108, x2: cutX, y2: 304, 'class': 'ap-cut' }, { from: 3 });
    E('text', { x: (tokX(0) + cutX) / 2, y: 112, 'text-anchor': 'middle', 'class': 'ap-label-olive' }, { from: 3 }, 'Student prefix');
    var rows = [196, 236, 276], marks = ['✓', '✕', '✓'];
    rows.forEach(function (ry, r) {
      E('path', { d: 'M' + cutX + ' 168 C ' + (cutX + 4) + ' ' + (ry + 4) + ', ' + (cutX + 8) + ' ' + (ry + 14) + ', ' + (cutX + 16) + ' ' + (ry + 14), 'class': 'ap-branch' }, { from: 3, d: r * 180 });
      for (var k = 0; k < 6; k++) {
        E('rect', { x: cutX + 18 + k * 30, y: ry, width: 25, height: 28, rx: 6, fill: C.c2 }, { from: 3, pop: true, d: 200 + r * 180 + k * 60, dim: r === 1 ? [4] : [] });
      }
      E('text', { x: cutX + 18 + 6 * 30 + 6, y: ry + 21, 'class': r === 1 ? 'ap-mark-no' : 'ap-mark-ok' }, { from: 3, d: 650 + r * 180, dim: r === 1 ? [4] : [] }, marks[r]);
    });
    E('text', { x: cutX + 18, y: 190, 'class': 'ap-label-teacher' }, { from: 3, to: 3, d: 250 }, 'Teacher continuations');
    // step 4: reward -> RL -> update teacher
    E('rect', { x: 490, y: 226, width: 100, height: 34, rx: 9, 'class': 'ap-box ap-box-brick' }, { from: 4, d: 150 });
    E('text', { x: 540, y: 248, 'text-anchor': 'middle', 'class': 'ap-label-strong' }, { from: 4, d: 150 }, 'Reward');
    E('rect', { x: 490, y: 128, width: 100, height: 34, rx: 9, 'class': 'ap-box ap-box-brick' }, { from: 4, d: 450 });
    E('text', { x: 540, y: 150, 'text-anchor': 'middle', 'class': 'ap-label-strong' }, { from: 4, d: 450 }, 'RL (GRPO)');
    E('path', { d: 'M485 210 L 500 228', 'class': 'ap-flow', arrow: 'a' }, { from: 4, d: 100 });
    E('path', { d: 'M485 290 L 500 260', 'class': 'ap-flow', arrow: 'a' }, { from: 4, d: 100 });
    E('path', { d: 'M540 224 V 166', 'class': 'ap-flow', arrow: 'a' }, { from: 4, d: 350 });
    E('path', { d: 'M540 126 V 35 H 456', 'class': 'ap-flow ap-flow-strong', arrow: 'a' }, { from: 4, d: 700 });
    E('text', { x: 548, y: 84, 'class': 'ap-label-brick' }, { from: 4, d: 800 }, 'update');
  }

  /* ---------- Hermes: the model decides how to use each fresh context ---------- */

  function drawHermes(E, C) {
    // root agent: one 8K context
    E('rect', { x: 18, y: 88, width: 206, height: 144, rx: 12, 'class': 'ap-box ap-box-root' }, { hot: [1, 4] });
    E('text', { x: 34, y: 116, 'class': 'ap-label-strong' }, {}, 'Root agent');
    E('text', { x: 34, y: 136, 'class': 'ap-label-small' }, {}, 'Qwen3-4B, one 8K context');
    E('rect', { x: 34, y: 150, width: 174, height: 30, rx: 7, fill: C.sand }, {});
    E('text', { x: 46, y: 170, 'class': 'ap-label' }, {}, 'Problem: AIME 2026, #4');
    // state chip, one per step
    var chip = [[2, 'Majority says 69'], [3, 'Verified: 70'], [4, 'Answer 70 ✓']];
    chip.forEach(function (c) {
      E('text', { x: 34, y: 210, 'class': c[0] === 4 ? 'ap-answer' : 'ap-label-brick' }, { from: c[0], to: c[0], d: c[0] === 2 ? 1500 : 1300 }, c[1]);
    });
    // subagents in fresh contexts
    var tasks = { 2: ['Search · same', 'Search · same', 'Search · same'], 3: ['Verify · steps', 'Verify · steps', 'Search · same'] };
    var reports = { 2: ['69 ✗', '71 ✗', '69 ✗'], 3: ['70 ✓', '70 ✓', '70 ✓'] };
    [0, 1, 2].forEach(function (k) {
      var y = 18 + k * 100;
      E('rect', { x: 318, y: y, width: 186, height: 76, rx: 10, 'class': 'ap-box ap-box-sub' }, { from: 2, d: 300 + k * 120, dim: [4] });
      E('text', { x: 334, y: y + 27, 'class': 'ap-label-strong' }, { from: 2, d: 300 + k * 120, dim: [4] }, 'Subagent ' + (k + 1));
      E('text', { x: 492, y: y + 27, 'text-anchor': 'end', 'class': 'ap-label-small' }, { from: 2, d: 300 + k * 120, dim: [4] }, 'fresh 8K');
      [2, 3].forEach(function (s) {
        E('text', { x: 334, y: y + 52, 'class': 'ap-label' }, { from: s, to: s, d: 400 + k * 120 }, tasks[s][k]);
        E('text', { x: 516, y: y + 46, 'class': s === 2 ? 'ap-report-no' : 'ap-report-ok' }, { from: s, to: s, d: 1000 + k * 200 }, reports[s][k]);
        E('path', { d: 'M226 ' + (150 + (k - 1) * 22) + ' C 272 ' + (150 + (k - 1) * 22) + ', 272 ' + (y + 38) + ', 314 ' + (y + 38), 'class': 'ap-flow', arrow: 'a' }, { from: s, to: s, d: 150 + k * 120 });
      });
    });
    // digestion into the next window
    E('rect', { x: 18, y: 254, width: 206, height: 50, rx: 10, 'class': 'ap-box ap-box-next' }, { from: 4, d: 500 });
    E('text', { x: 34, y: 276, 'class': 'ap-label-teacher' }, { from: 4, d: 500 }, 'Digest');
    E('text', { x: 34, y: 294, 'class': 'ap-label-small' }, { from: 4, d: 500 }, 'opens the next window');
    E('path', { d: 'M121 234 V 250', 'class': 'ap-flow ap-flow-teacher', arrow: 't' }, { from: 4, d: 400 });
  }

  /* ---------- MILO: the evolution loop, then the orchestrator ---------- */

  function drawMilo(E, C) {
    // orchestrator
    E('rect', { x: 210, y: 8, width: 180, height: 40, rx: 10, 'class': 'ap-box ap-box-orch' }, { dim: [1, 2, 3, 4], hot: [6] });
    E('text', { x: 300, y: 33, 'text-anchor': 'middle', 'class': 'ap-label-strong' }, { dim: [1, 2, 3, 4] }, 'Orchestrator');
    // islands
    E('rect', { x: 14, y: 66, width: 276, height: 246, rx: 12, 'class': 'ap-island' }, {});
    E('text', { x: 30, y: 90, 'class': 'ap-label-strong' }, {}, 'Island 1');
    E('rect', { x: 310, y: 66, width: 276, height: 246, rx: 12, 'class': 'ap-island' }, { dim: [1, 2, 3, 4, 5] });
    E('text', { x: 326, y: 90, 'class': 'ap-label-strong' }, { dim: [1, 2, 3, 4, 5] }, 'Island 2');

    function edge(a, b, show, cls) { E('line', { x1: a[0], y1: a[1], x2: b[0], y2: b[1], 'class': cls || 'ap-edge' }, show); }
    function node(p, kind, show) { E('circle', { cx: p[0], cy: p[1], r: kind === 'big' ? 11 : 9, 'class': 'ap-node-' + (kind === 'big' ? 'graft' : kind) }, show); }

    // island 1 lineage: seed, an admitted child, a rejected child
    var A0 = [150, 286], A1 = [110, 232], A2 = [186, 232], A3 = [110, 176], A4 = [110, 118];
    edge(A0, A1, {}); edge(A0, A2, {});
    node(A0, 'ok', {}); node(A1, 'ok', {}); node(A2, 'no', {});
    // island 2 lineage, with a stronger harness at the top
    var B0 = [448, 286], B1 = [408, 232], B2 = [488, 232], B3 = [448, 176];
    edge(B0, B1, { dim: [1, 2, 3, 4, 5] }); edge(B0, B2, { dim: [1, 2, 3, 4, 5] }); edge(B1, B3, { dim: [1, 2, 3, 4, 5] });
    node(B0, 'ok', { dim: [1, 2, 3, 4, 5] }); node(B1, 'ok', { dim: [1, 2, 3, 4, 5] }); node(B2, 'no', { dim: [1, 2, 3, 4, 5] }); node(B3, 'best', { dim: [1, 2, 3, 4, 5], hot: [6] });

    // 1 parent selection
    E('circle', { cx: A1[0], cy: A1[1], r: 16, 'class': 'ap-ring' }, { from: 1, to: 2 });
    E('text', { x: 62, y: 236, 'text-anchor': 'end', 'class': 'ap-label-brick' }, { from: 1, to: 1, d: 200 }, 'parent');
    // 2 mutation: the mutator agent rewrites the parent into a child
    E('rect', { x: 18, y: 134, width: 84, height: 28, rx: 14, 'class': 'ap-box' }, { from: 2, dim: [3, 4, 5], hot: [6] });
    E('text', { x: 60, y: 153, 'text-anchor': 'middle', 'class': 'ap-label-small' }, { from: 2, to: 5, dim: [3, 4, 5] }, 'mutator');
    E('text', { x: 60, y: 153, 'text-anchor': 'middle', 'class': 'ap-label-brick ap-label-tight' }, { from: 6, d: 1100 }, 'new mutator');
    E('path', { d: 'M80 164 Q 92 174 100 174', 'class': 'ap-flow', arrow: 'a' }, { from: 2, to: 2, d: 200 });
    edge(A1, A3, { from: 2, d: 300 });
    E('text', { x: 118, y: 208, 'class': 'ap-label-small' }, { from: 2, to: 2, d: 400 }, 'patch');
    E('circle', { cx: A3[0], cy: A3[1], r: 9, 'class': 'ap-node-eval' }, { from: 2, to: 3, d: 450, pop: true });
    // 3 fitness evaluation: accuracy, tokens, latency
    [['accuracy', 64], ['tokens', 40], ['latency', 52]].forEach(function (m, k) {
      E('text', { x: 134, y: 150 + k * 18, 'class': 'ap-label-small' }, { from: 3, to: 3, d: k * 120 }, m[0]);
      E('rect', { x: 196, y: 141 + k * 18, width: m[1], height: 10, rx: 3, fill: C.c2 }, { from: 3, to: 3, d: 100 + k * 120 });
    });
    // 4 child acceptance
    E('circle', { cx: A3[0], cy: A3[1], r: 9, 'class': 'ap-node-ok' }, { from: 4 });
    E('text', { x: 130, y: 172, 'class': 'ap-label-strong' }, { from: 4, to: 4, d: 150 }, 'admitted');
    E('text', { x: 130, y: 190, 'class': 'ap-label-small' }, { from: 4, to: 4, d: 150 }, 'grows the Pareto front');
    E('text', { x: 200, y: 254, 'class': 'ap-label-small' }, { from: 4, to: 4, d: 350 }, 'rejected, kept');
    E('text', { x: 200, y: 270, 'class': 'ap-label-small' }, { from: 4, to: 4, d: 350 }, 'as evidence');
    // 5 progress monitoring: held-out accuracy goes flat
    E('rect', { x: 168, y: 98, width: 108, height: 56, rx: 6, 'class': 'ap-mini' }, { from: 5, to: 5 });
    E('rect', { x: 214, y: 104, width: 56, height: 44, fill: C.sand }, { from: 5, to: 5, d: 300 });
    E('path', { d: 'M174 142 L 192 128 L 212 120 L 268 120', 'class': 'ap-mini-line' }, { from: 5, to: 5, d: 150 });
    E('text', { x: 242, y: 116, 'text-anchor': 'middle', 'class': 'ap-label-teacher' }, { from: 5, to: 5, d: 450 }, 'stall');
    E('text', { x: 222, y: 170, 'text-anchor': 'middle', 'class': 'ap-label-small' }, { from: 5, to: 5, d: 450 }, 'held-out accuracy');
    E('path', { d: 'M222 96 C 222 70, 240 52, 262 46', 'class': 'ap-flow', arrow: 'a' }, { from: 5, to: 5, d: 700 });
    // 6 orchestrator diagnoses and intervenes: graft island 2's best into island 1
    E('path', { d: 'M260 50 C 200 80, 150 100, 118 114', 'class': 'ap-watch' }, { from: 6 });
    E('path', { d: 'M340 50 C 400 80, 440 130, 448 162', 'class': 'ap-watch' }, { from: 6 });
    E('path', { d: 'M436 168 C 360 120, 220 100, 124 116', 'class': 'ap-graft', arrow: 'a' }, { from: 6, d: 400 });
    E('text', { x: 300, y: 112, 'text-anchor': 'middle', 'class': 'ap-label-brick' }, { from: 6, d: 600 }, 'graft');
    edge(A3, A4, { from: 6, d: 700 });
    node(A4, 'big', { from: 6, d: 900, pop: true });
  }

  /* ---------- boot ---------- */

  var CONFIGS = {
    'ap-scout': {
      dur: 3800,
      draw: drawScout,
      legend: [
        { label: 'Teacher', color: 'var(--c2)' },
        { label: 'Student', color: 'var(--olive)' },
        { label: 'Token-level supervision', kind: 'dashline', color: 'var(--teacher)' },
        { label: 'Teacher update', kind: 'line', color: 'var(--c1)' }
      ],
      steps: [
        { tag: 'Standard OPD', title: 'Student writes a response', desc: 'The student samples its own response to the problem, so it learns from its own text.' },
        { tag: 'Standard OPD', title: 'Teacher scores every token', desc: 'The teacher reads the student\'s response and scores each token given the text before it. The student is updated to match the teacher, token by token.' },
        { tag: 'SCOUT · every 10 steps', ours: true, title: 'Teacher continues a student prefix', desc: 'SCOUT cuts the student\'s response and asks the teacher to finish it from there, several times. The cut starts early and moves later as training goes on.' },
        { tag: 'SCOUT', ours: true, title: 'Correct answers train the teacher', desc: 'Continuations that reach the right answer are rewarded. The teacher is updated with RL on its own continuation only, then goes back to scoring the student.' }
      ]
    },
    'ap-hermes': {
      dur: 4200,
      draw: drawHermes,
      legend: [
        { label: 'Language model in one context', kind: 'outline', color: 'var(--c1)' },
        { label: 'Fresh context', kind: 'outline', color: 'var(--muted)' },
        { label: 'Task sent', kind: 'line', color: 'var(--c1)' }
      ],
      steps: [
        { tag: 'One window', title: 'A small model in one 8K context', desc: 'The root agent works in a single 8K-token context. It sees the problem and the short reports that come back, never the subagents\' full reasoning.' },
        { tag: 'Delegate', ours: true, title: 'It decides what fresh contexts should do', desc: 'Here it asks three subagents, each in a fresh 8K context, to solve the problem independently. Two report 69 and one 71, so the majority is wrong.' },
        { tag: 'Delegate', ours: true, title: 'It checks instead of trusting the majority', desc: 'Next it asks two subagents to verify the steps behind 69 and one to solve again. All three return 70.' },
        { tag: 'Digest', ours: true, title: 'It answers, or digests and keeps going', desc: 'The root returns 70, the correct answer. On longer problems a full window is digested into a short summary that opens the next window, so reasoning continues across many small contexts.' }
      ]
    },
    'ap-milo': {
      dur: 3400,
      draw: drawMilo,
      legend: [
        { label: 'Admitted harness', kind: 'dot', color: 'var(--ink)' },
        { label: 'Rejected, kept as evidence', kind: 'ring', color: 'var(--muted)' },
        { label: 'Child under evaluation', kind: 'dot', color: 'var(--c2)' },
        { label: 'Graft', kind: 'dashline', color: 'var(--c1)' }
      ],
      steps: [
        { tag: 'Evolution loop', title: 'Parent selection', desc: 'Each island picks a parent harness from its admitted set, trading exploitation against exploration.' },
        { tag: 'Evolution loop', title: 'Mutation', desc: 'The island\'s mutator, a coding agent, reads the parent\'s source and failure traces, diagnoses why it fails, and rewrites it into a child harness.' },
        { tag: 'Evolution loop', title: 'Fitness evaluation', desc: 'The child runs several attempts per search task. Accuracy, tokens and latency form its fitness.' },
        { tag: 'Evolution loop', title: 'Child acceptance', desc: 'The child is admitted only if it grows the island\'s Pareto front. Rejected children stay in memory as negative evidence.' },
        { tag: 'Evolution loop', title: 'Progress monitoring', desc: 'Held-out accuracy is tracked. An island that stalls for several rounds is escalated to the orchestrator.' },
        { tag: 'Orchestrator', ours: true, title: 'Diagnose, then intervene', desc: 'One agent sees every island. It diagnoses the bottleneck and intervenes: grafting another island\'s best harness, reassigning the mutator, splitting off a new island, or changing the task curriculum.' }
      ]
    }
  };

  Object.keys(CONFIGS).forEach(function (id) {
    var fig = document.getElementById(id);
    if (!fig) return;
    try { player(fig, CONFIGS[id]); } catch (e) {
      if (window.console) console.error('Approach ' + id + ' failed:', e);
    }
  });
})();
