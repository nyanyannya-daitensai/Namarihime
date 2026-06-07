// 自作アクセス解析（cookieレス・同意バナー不要）。
// データは自分の Google スプレッドシートにだけ記録されます。
// ▼ Apps Script の「ウェブアプリ URL（…/exec）」をここに貼ると計測開始。空のあいだは何もしません。
var ANALYTICS_ENDPOINT = '';

(function () {
  if (!ANALYTICS_ENDPOINT) return;
  // 端末には何も保存しない（このセッション中だけのランダムID）
  var sid = Math.random().toString(36).slice(2) + Date.now().toString(36);

  function track(type, detail) {
    try {
      var payload = JSON.stringify({
        type: type,
        detail: detail || '',
        path: location.pathname + (location.hash || ''),
        ref: document.referrer || '',
        screen: screen.width + 'x' + screen.height,
        lang: navigator.language || '',
        sid: sid
      });
      if (navigator.sendBeacon) navigator.sendBeacon(ANALYTICS_ENDPOINT, payload);
      else fetch(ANALYTICS_ENDPOINT, { method: 'POST', body: payload, mode: 'no-cors', keepalive: true });
    } catch (e) {}
  }
  window.__track = track; // 診断イベントを app.js から呼べるように

  // 1) ページビュー（流入元 referrer 付き）
  track('pageview');

  // 2) CTA・外部リンクのクリック（＝効果測定の本丸）
  document.addEventListener('click', function (e) {
    var el = e.target.closest && e.target.closest('a, button');
    if (!el) return;
    if (el.id === 'bridgeSupport') { track('cta', 'diag_support'); return; }
    if (el.id === 'bridgeListen')  { track('cta', 'diag_listen');  return; }
    if (el.id === 'shindanShare')  { track('cta', 'share_x');      return; }
    var href = (el.getAttribute && el.getAttribute('href')) || '';
    if (!href || href.charAt(0) === '#') return;
    if (/fanbox\.cc/.test(href)) track('cta', 'fanbox:' + href);
    else if (/booth\.pm|kawade\.co\.jp/.test(href)) track('cta', 'booth:' + href);
    else if (/spotify|music\.apple|music\.youtube|karent|piapro|pixiv|youtube\.com\/channel/.test(href)) track('cta', 'listen:' + href);
  }, true);

  // 3) セクション到達（スクロールでどこまで見たか＝経路）
  if ('IntersectionObserver' in window) {
    var seen = {};
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (en) {
        if (en.isIntersecting && en.target.id && !seen[en.target.id]) {
          seen[en.target.id] = 1;
          track('section', en.target.id);
        }
      });
    }, { threshold: 0.5 });
    ['featured', 'story', 'characters', 'shindan', 'support', 'fanwork', 'archive', 'links']
      .forEach(function (id) { var el = document.getElementById(id); if (el) io.observe(el); });
  }
})();
