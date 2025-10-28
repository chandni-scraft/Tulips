(function () {
  if (window.__tulipsTabManagerLoaded) return;
  window.__tulipsTabManagerLoaded = true;

  function on(evt, sel, fn) {
    document.addEventListener(evt, function (e) {
      var el = e.target.closest(sel);
      if (el) fn(e, el);
    });
  }

  // Basic tab delegation (no-op placeholder for compatibility)
  on('click', '[data-tab-target]', function (e, btn) {
    var target = btn.getAttribute('data-tab-target');
    if (!target) return;
    var container = btn.closest('[data-tabs-root]') || document;
    container.querySelectorAll('[data-tab-target]').forEach(function (b) {
      b.classList.toggle('is-active', b === btn);
    });
    container.querySelectorAll('[data-tab-panel]').forEach(function (p) {
      p.classList.toggle('is-active', p.id === target.replace('#',''));
    });
  });
})();


