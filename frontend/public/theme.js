// Apply the saved preference before rendering to avoid a light flash.
(function () {
  var mode = 'system';
  try {
    var saved = localStorage.getItem('nekonoha-color-mode');
    if (saved === 'light' || saved === 'dark') mode = saved;
  } catch (_) {}
  document.documentElement.dataset.colorMode = mode;
  var dark = mode === 'dark' || (mode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  var meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.content = dark ? '#171c29' : '#f5f0e9';
})();
