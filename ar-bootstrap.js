/* AR initialization independent of Leaflet/map startup. */
(() => {
  'use strict';
  const fallbackFix = () => null;
  const getFix = () => {
    // Map GPS remains private to its controller; until a shared service exists,
    // AR may open camera/diagnostics but must not fabricate a usable fix.
    return fallbackFix();
  };
  if (!window.ZooARPreview) {
    const button = document.getElementById('ar-open');
    if (button) button.addEventListener('click', () => {
      const panel = document.getElementById('ar-panel');
      if (panel) { panel.hidden = false; document.getElementById('ar-status').textContent = 'AR module unavailable. Reload the page.'; }
    });
    return;
  }
  window.ZooARPreview.mount(getFix);
})();
