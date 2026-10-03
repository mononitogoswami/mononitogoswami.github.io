/* Size the embedded project-page animations (embeds/*) to their content.
   Each embed posts its height whenever its animation resizes. */
(function () {
  'use strict';
  window.addEventListener('message', function (e) {
    if (e.origin !== window.location.origin || !e.data || !e.data.embed) return;
    var frame = document.querySelector('iframe[data-embed="' + e.data.embed + '"]');
    if (frame && e.data.height > 50) frame.style.height = e.data.height + 'px';
  });
})();
