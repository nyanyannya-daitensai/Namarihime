// 年表示
document.addEventListener('DOMContentLoaded', () => {
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
});

// タブ切替
document.addEventListener('click', (e) => {
  const tab = e.target.closest('.tab');
  if (!tab) return;
  const target = tab.getAttribute('data-tab');
  document.querySelectorAll('.tab').forEach(t => t.setAttribute('aria-selected','false'));
  tab.setAttribute('aria-selected','true');
  document.querySelectorAll('.panel[data-panel]').forEach(panel => {
    panel.hidden = panel.getAttribute('data-panel') !== target;
  });
});
document.addEventListener('DOMContentLoaded', () => {
  const active = document.querySelector('.tab[aria-selected="true"]');
  if (active) {
    const target = active.getAttribute('data-tab');
    document.querySelectorAll('.panel[data-panel]').forEach(p=>{
      p.hidden = p.getAttribute('data-panel') !== target;
    });
  }
});

// 最新情報：空なら非表示
document.addEventListener('DOMContentLoaded', () => {
  const bar = document.querySelector('.newsbar');
  const track = bar?.querySelector('.news-track');
  if (!bar || !track) return;

  const items = Array.from(track.querySelectorAll('.news-item'))
    .filter(a => (a.textContent || '').trim().length > 0);
  if (items.length === 0) bar.hidden = true;
});
