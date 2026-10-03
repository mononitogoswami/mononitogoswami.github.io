/* Site-wide progressive enhancement: navbar shadow + reading progress, scroll reveal,
   highlighter sweep, and "new" news markers.
   Everything reads fine without JavaScript; motion is skipped under prefers-reduced-motion. */
(function () {
  'use strict';

  // Tell the inline failsafe in head.html that the reveal script is running
  window.__siteReady = true;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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
  var targets = document.querySelectorAll('.reveal, mark.hl.sweep');
  function reveal(el) { el.classList.add('in'); }
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

})();
