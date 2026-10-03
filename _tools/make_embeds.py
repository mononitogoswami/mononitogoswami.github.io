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
        'css': '',
        # The page's own on-screen check misses once the rest of the page is hidden; start the
        # walkthrough here (its observer still pauses it when the box scrolls out of view)
        'post': "setTimeout(function () { var b = document.getElementById('step-play'); if (b && /Play/.test(b.textContent)) b.click(); }, 700);",
    },
    {
        'name': 'hermes',
        'url': 'https://rachellxy.github.io/blog/2026/hermes',
        'target': "document.getElementById('fig-overview')",
        'head': '',
        'css': '',
    },
    {
        'name': 'milo',
        'url': 'https://jprithwish.github.io/MILO/',
        'target': "document.getElementById('demo').closest('figure') || document.getElementById('demo')",
        'head': '',
        'css': '',
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
