#!/usr/bin/env python3
"""Build the embedded approach animations for the Research page.

Each embed is a copy of a project page (SCOUT, Hermes, MILO) cut down to its main
animation: the rest of the page is hidden, the embedded paper PDF and analytics are
dropped, and a small script reports the animation's height to the parent page so the
iframe can size itself. Re-run this when a project page changes:

    python3 _tools/make_embeds.py

Output goes to embeds/ (published as-is; the files have no front matter).
"""
import os
import re
import urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'embeds')

# target: JS expression for the element to keep. css: per-site overrides.
SPECS = [
    {
        'name': 'scout',
        'url': 'https://shrango.github.io/scout/',
        'target': "document.getElementById('diagram').closest('.card') || document.getElementById('diagram').parentNode",
        'head': "<script>try { localStorage.setItem('scout-theme', 'light'); } catch (e) {}</script>",
        # Diagram and legend only: no step list, curriculum slider or caption
        'css': '''
          .embed-target { border: 0 !important; padding: 0 !important; background: transparent !important; }
          .method-grid { display: block !important; }
          .curriculum, .embed-target p.caption, .player > span { display: none !important; }
          .diagram-wrap { position: relative; max-width: 760px; margin: 0 auto !important; }
          .diagram-legend { justify-content: center; max-width: 760px; margin: 8px auto 0 !important; }
          .diagram-wrap > .player { position: absolute; top: 10px; right: 10px; z-index: 2; margin: 0 !important; width: auto !important; height: auto !important; }
          .diagram-wrap > .player svg { width: 14px !important; height: 14px !important; }
          .diagram-wrap > .player .tbl-btn { background: #fff; }
        ''',
        # The page's own on-screen check misses once the rest of the page is hidden; start the
        # walkthrough here (its observer still pauses it when the box scrolls out of view)
        'post': '''
          var steps = document.getElementById('steps'), b = document.getElementById('step-play'), wrap = document.querySelector('.diagram-wrap');
          if (b && wrap) wrap.appendChild(b.closest('.player') || b);   // keep play/pause on the diagram itself
          if (steps) steps.parentNode.style.display = 'none';
          setTimeout(function () { if (b && /Play/.test(b.textContent)) b.click(); }, 700);
        ''',
    },
    {
        'name': 'hermes',
        'url': 'https://rachellxy.github.io/blog/2026/hermes',
        'target': "document.getElementById('fig-overview')",
        'head': '',
        # Diagram, play button and the phase name only: no phase pills, narration or caption
        'css': '''
          #ov-phases, #fig-overview > figcaption { display: none !important; }
          .ov-panel { border: 0 !important; padding: 0 !important; background: transparent !important; box-shadow: none !important; }
          .ov-top { justify-content: flex-start; margin-bottom: 0 !important; }
          #ov-narr { font-size: 0 !important; min-height: 0 !important; height: auto !important; padding: 8px 0 0 !important; margin: 0 !important; background: transparent !important; border: 0 !important; }
          #ov-narr .bn { font-size: 12px !important; }
          #ov-narr > b:first-of-type { font-size: 16px !important; margin-left: 8px; }
          #ov-narr > b:not(:first-of-type) { display: none !important; }
          .ov-top { display: flex; align-items: center; gap: 12px; }
        ''',
        'post': '''
          var top = document.querySelector('.ov-top'), narr = document.getElementById('ov-narr');
          if (top && narr) top.appendChild(narr);       // phase name sits next to the play button
        ''',
    },
    {
        'name': 'milo',
        'url': 'https://jprithwish.github.io/MILO/',
        'target': "document.getElementById('demo').closest('figure') || document.getElementById('demo')",
        'head': '',
        # Lineage trees, pass-rate chart, legend and play/scrub only; the narration panel is cropped
        # out of the SVG and replaced by a one-line readout
        'css': '''
          .embed-target { border: 0 !important; background: transparent !important; box-shadow: none !important; }
          .chart-head, .embed-target > figcaption, .demo-restart, .demo-speed { display: none !important; }
          .embed-target .legend { justify-content: center; border: 0 !important; padding: 0 0 4px !important; }
          .demo-status { font: 600 13px/1.4 Inter, system-ui, sans-serif; color: #52514e; text-align: center; margin: 2px 0 0; font-variant-numeric: tabular-nums; }
          .demo-status b { color: #b4321f; }
          .demo-ctl { padding-top: 4px !important; }
        ''',
        'post': '''
          var svg = document.querySelector('.demo-svg');
          if (svg) {
            var vb = svg.viewBox.baseVal, panel = null;
            Array.prototype.forEach.call(svg.querySelectorAll('rect'), function (r) {
              if (+r.getAttribute('height') === 108 && +r.getAttribute('rx') === 12) panel = r;
            });
            if (panel) svg.setAttribute('viewBox', '0 0 ' + vb.width + ' ' + (+panel.getAttribute('y') - 6));
            var texts = Array.prototype.slice.call(svg.querySelectorAll('text'));
            var status = document.createElement('p'); status.className = 'demo-status';
            svg.parentNode.insertBefore(status, svg.nextSibling);
            var update = function () {
              var ro = texts.filter(function (t) { return /POPULATION BEST/.test(t.textContent); })[0];
              var tag = texts.filter(function (t) { return /^ORCHESTRATOR/.test(t.textContent); })[0];
              if (!ro) return;
              var m = ro.textContent.match(/ROUND (\d+) \/ (\d+).*BEST ([\d.]+)%/);
              if (!m) return;
              status.innerHTML = (tag ? '<b>Orchestrator steps in</b> · ' : '') + 'Round ' + m[1] + ' of ' + m[2] + ' · best pass-rate ' + m[3] + '%';
            };
            new MutationObserver(update).observe(svg, { subtree: true, characterData: true, childList: true });
            update();
          }
        ''',
        # local copies of the page's own assets, kept next to the embed
        'assets': ['style.css', 'static/demo-run.js', 'demo.js', 'app.js'],
        'drop_scripts': ['einstein', 'googletagmanager', 'gtag('],
        # images and the hidden method iframe live on the project site, not in the copy
        'rewrite': [(r'(src|href)="static/(?!demo-run)', r'\1="https://jprithwish.github.io/MILO/static/'),
                    (r'<iframe\b.*?</iframe>', '')],
    },
]

ISOLATE = r"""
<style>
  html, body { background: transparent !important; margin: 0 !important; padding: 0 !important; min-height: 0 !important; }
  html { overflow-y: hidden; }
  .reveal { opacity: 1 !important; transform: none !important; translate: none !important; }
  .embed-target { margin: 0 !important; box-shadow: none !important; }
</style>
<script>
/* Keep only the animation: hide everything else on the page and collapse its ancestors. */
(function () {
  var keepIds = { tip: 1, peek: 1 };
  var t = (TARGET);
  if (!t) return;
  t.classList.add('embed-target');
  for (var n = t; n && n !== document.body; n = n.parentNode) {
    var p = n.parentNode;
    Array.prototype.forEach.call(p.children, function (c) {
      if (c === n || keepIds[c.id] || /^(SCRIPT|STYLE|LINK|TEMPLATE)$/.test(c.tagName)) return;
      c.style.setProperty('display', 'none', 'important');
    });
    if (p !== document.body) {
      p.style.setProperty('padding', '0', 'important');
      p.style.setProperty('margin', '0', 'important');
      p.style.setProperty('max-width', 'none', 'important');
      p.style.setProperty('min-height', '0', 'important');
      p.style.setProperty('background', 'transparent', 'important');
      p.style.setProperty('border', '0', 'important');
    }
  }
  // Report our height so the parent page can size the iframe (once per frame, only on change)
  var last = 0, queued = false;
  function report() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(function () {
      queued = false;
      var h = Math.ceil(t.getBoundingClientRect().height + t.offsetTop + 4);
      if (Math.abs(h - last) < 2) return;
      last = h;
      if (window.parent !== window) window.parent.postMessage({ embed: NAME, height: h }, '*');
    });
  }
  if ('ResizeObserver' in window) new ResizeObserver(report).observe(t);
  window.addEventListener('load', report);
  setTimeout(report, 300);
})();
</script>
"""


def fetch(url):
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (site embed builder)'})
    with urllib.request.urlopen(req, timeout=60) as r:
        return r.read().decode('utf-8')


def build(spec):
    html = fetch(spec['url'])
    # Drop the embedded paper PDF (megabytes of base64) and its download handler
    html = re.sub(r'<script[^>]*type="application/octet-stream"[^>]*>.*?</script>', '', html, flags=re.S)
    html = re.sub(r"<script>\s*document\.getElementById\('paper-btn'\).*?</script>", '', html, flags=re.S)
    for pat in spec.get('drop_scripts', []):
        html = re.sub(r'<script[^>]*>[^<]*?' + re.escape(pat) + r'.*?</script>', '', html, flags=re.S)
        html = re.sub(r'<script[^>]*src="[^"]*' + re.escape(pat) + r'[^"]*"[^>]*>\s*</script>', '', html, flags=re.S)
    head = '<meta name="robots" content="noindex">\n' + spec['head']
    html = re.sub(r'<head([^>]*)>', lambda m: '<head' + m.group(1) + '>\n' + head, html, count=1)
    for pat, rep in spec.get('rewrite', []):
        html = re.sub(pat, rep, html, flags=re.S)
    iso = ISOLATE.replace('TARGET', spec['target']).replace('NAME', repr(spec['name']))
    if spec.get('post'):
        iso += '<script>window.addEventListener("load", function () { ' + spec['post'] + ' });</script>'
    if spec['css']:
        iso = '<style>' + spec['css'] + '</style>' + iso
    # Insert before the page's own scripts at the end of <body>, after all content
    idx = html.rfind('</body>')
    html = html[:idx] + iso + html[idx:]

    if spec.get('assets'):
        folder = os.path.join(OUT, spec['name'])
        os.makedirs(folder, exist_ok=True)
        base = spec['url'] if spec['url'].endswith('/') else spec['url'] + '/'
        for a in spec['assets']:
            path = os.path.join(folder, a)
            os.makedirs(os.path.dirname(path), exist_ok=True)
            with open(path, 'w', encoding='utf-8') as f:
                f.write(fetch(base + a))
        dest = os.path.join(folder, 'index.html')
    else:
        os.makedirs(OUT, exist_ok=True)
        dest = os.path.join(OUT, spec['name'] + '.html')
    with open(dest, 'w', encoding='utf-8') as f:
        f.write(html)
    print('%-7s %7.0f KB  %s' % (spec['name'], os.path.getsize(dest) / 1024, os.path.relpath(dest, ROOT)))


if __name__ == '__main__':
    for s in SPECS:
        build(s)
