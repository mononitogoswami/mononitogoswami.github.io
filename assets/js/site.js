/* Site-wide progressive enhancement: navbar shadow + reading progress, scroll reveal,
   highlighter sweep, "new" news markers, and the sparklines on the home page cards.
   Everything reads fine without JavaScript; motion is skipped under prefers-reduced-motion. */
(function () {
  'use strict';

  // Tell the inline failsafe in head.html that the reveal script is running
  window.__siteReady = true;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var SVGNS = 'http://www.w3.org/2000/svg';

  /* ---------- navbar shadow and reading progress ---------- */
  var nav = document.querySelector('.navbar');
  var bar = nav ? nav.querySelector('.nav-progress') : null;
  var pending = false;
  function onScroll() {
    if (pending) return;
    pending = true;
    requestAnimationFrame(function () {
      pending = false;
      if (!nav) return;
      nav.classList.toggle('scrolled', window.scrollY > 10);
      if (bar) {
        var max = document.documentElement.scrollHeight - window.innerHeight;
        // Only show progress on pages long enough to need it
        var p = max > 400 ? Math.min(1, window.scrollY / max) : 0;
        bar.style.transform = 'scaleX(' + p + ')';
      }
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();

  /* ---------- reveal once in view (sections, cards, highlighter marks) ---------- */
  var targets = document.querySelectorAll('.reveal, mark.hl.sweep, .spark');
  function reveal(el) {
    el.classList.add('in');
    if (el.classList.contains('spark')) drawSpark(el, true);
  }
  if (reduced || !('IntersectionObserver' in window)) {
    targets.forEach(function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        // Let highlighter marks sweep after their card has risen in
        var el = e.target;
        if (el.tagName === 'MARK') setTimeout(function () { reveal(el); }, 350);
        else reveal(el);
        io.unobserve(el);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    targets.forEach(function (el) { io.observe(el); });
  }

  /* ---------- mark news from the last 60 days ---------- */
  var now = Date.now();
  document.querySelectorAll('.news-item[data-date]').forEach(function (li) {
    var t = Date.parse(li.getAttribute('data-date'));
    if (!isNaN(t) && now - t < 60 * 864e5 && now >= t) li.classList.add('is-new');
  });

  /* ---------- sparklines ---------- */
  function el(name, attrs, parent) {
    var n = document.createElementNS(SVGNS, name);
    for (var k in attrs) n.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(n);
    return n;
  }
  function fmt(v) { return (Math.round(v * 10) / 10).toFixed(1); }

  function drawSpark(svg, animate) {
    var vals = (svg.getAttribute('data-values') || '').split(',').map(Number).filter(function (v) { return !isNaN(v); });
    if (vals.length < 2) return;
    var ref = svg.hasAttribute('data-ref') ? Number(svg.getAttribute('data-ref')) : null;
    var steps = svg.getAttribute('data-steps') === 'true';
    var w = svg.clientWidth || svg.parentNode.clientWidth || 300;
    var h = svg.clientHeight || 44;
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    svg.setAttribute('viewBox', '0 0 ' + w + ' ' + h);

    var padL = 34, padR = 36, padT = 6, padB = 6;
    var lo = Math.min.apply(null, vals.concat(ref === null ? [] : [ref]));
    var hi = Math.max.apply(null, vals.concat(ref === null ? [] : [ref]));
    var span = (hi - lo) || 1;
    function x(i) { return padL + (w - padL - padR) * i / (vals.length - 1); }
    function y(v) { return padT + (h - padT - padB) * (1 - (v - lo) / span); }

    var d = 'M' + x(0) + ' ' + y(vals[0]);
    for (var i = 1; i < vals.length; i++) {
      d += steps ? ' H' + x(i) + ' V' + y(vals[i]) : ' L' + x(i) + ' ' + y(vals[i]);
    }
    var base = h - padB;
    el('path', { d: d + ' V' + base + ' H' + x(0) + ' Z', 'class': 'spark-area' }, svg);

    if (ref !== null) {
      el('line', { x1: padL, x2: w - padR, y1: y(ref), y2: y(ref), 'class': 'spark-ref' }, svg);
      var rl = el('text', { x: w - padR + 6, y: y(ref) + 4, 'class': 'spark-ref-label' }, svg);
      rl.textContent = fmt(ref);
    }

    var line = el('path', { d: d, 'class': 'spark-line' }, svg);
    var first = el('text', { x: padL - 6, y: y(vals[0]) + 4, 'text-anchor': 'end', 'class': 'spark-ref-label' }, svg);
    first.textContent = fmt(vals[0]);
    var last = vals[vals.length - 1];
    var dot = el('circle', { cx: x(vals.length - 1), cy: y(last), r: 4, 'class': 'spark-dot' }, svg);
    var lab = el('text', { x: w - padR + 6, y: y(last) + 4, 'class': 'spark-end-label' }, svg);
    // If the end value sits near the reference label, tuck it just left of the end dot instead
    if (ref !== null && Math.abs(y(ref) - y(last)) < 12) {
      lab.setAttribute('x', x(vals.length - 1) - 8);
      lab.setAttribute('y', y(last) + (y(last) < y(ref) ? 0 : 10));
      lab.setAttribute('text-anchor', 'end');
    }
    lab.textContent = fmt(last);

    if (animate && !reduced && line.getTotalLength) {
      var len = line.getTotalLength();
      line.style.strokeDasharray = len;
      line.style.strokeDashoffset = len;
      dot.style.opacity = 0;
      lab.style.opacity = 0;
      line.getBoundingClientRect();
      line.style.transition = 'stroke-dashoffset 1.4s cubic-bezier(0.22, 1, 0.36, 1)';
      line.style.strokeDashoffset = 0;
      dot.style.transition = lab.style.transition = 'opacity 0.4s ease 1.1s';
      dot.style.opacity = 1;
      lab.style.opacity = 1;
    }
  }

  var sparks = document.querySelectorAll('.spark');
  sparks.forEach(function (s) { drawSpark(s, false); });
  var rw;
  window.addEventListener('resize', function () {
    clearTimeout(rw);
    rw = setTimeout(function () { sparks.forEach(function (s) { drawSpark(s, false); }); }, 150);
  });
})();
