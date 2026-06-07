// 応援セクションに「たとえばこんな記事が読めます」の実例を注入する。
// ※ URLはすべて実在のFANBOX記事。自由に増減できます。
const FANBOX_POOL = [
  {
    title: "設定資料：奇械（マキナ）について",
    url: "https://nyanyannya.fanbox.cc/posts/9210030",
    excerpt: "物語の根幹にある奇械（マキナ）の一覧資料",
  },
  {
    title: "小説：ノエル・デ・フィガロ「少年とプリエスト」",
    url: "https://nyanyannya.fanbox.cc/posts/1281051",
    excerpt: "ノエル＝バイテルの少年時代を描く短編",
  },
  {
    title: "小説：クラブ＝マジェスティ『シリング＝ショット』【01】（旧約版）",
    url: "https://nyanyannya.fanbox.cc/posts/2112083",
    excerpt: "クラブ＝マジェスティのアクション長編",
  },
  {
    title: "音源配布：魂流し ストリングスアレンジ",
    url: "https://nyanyannya.fanbox.cc/posts/270793",
    excerpt: "ファンクビート（VO.KAITO）「魂流し」のストリングスアレンジ版",
  },
  {
    title: "小説：フロイライン＝ビブリォチカ【01】「淑女たれ」",
    url: "https://nyanyannya.fanbox.cc/posts/346435",
    excerpt: "フロイライン＝ビブリォチカより、掌編小説",
  },
  {
    title: "設定資料：アークヨルム教導十八部隊",
    url: "https://nyanyannya.fanbox.cc/posts/469142",
    excerpt: "十八部隊の詳細設定資料",
  },
  {
    title: "音源配布：吹奏楽『色偸るセカイの鉛姫』",
    url: "https://nyanyannya.fanbox.cc/posts/9003268",
    excerpt: "吹奏楽に編曲した「色偸るセカイの鉛姫」の音源配布",
  },
  {
    title: "音源配布：カドワナルカ＝ギャラルホルン",
    url: "https://nyanyannya.fanbox.cc/posts/7654358",
    excerpt: "十八部隊関連アルバムの音源配布",
  },
];

// Fisher–Yates シャッフル
function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function appendFanboxCards(items) {
  const track = document.getElementById('fanboxTrack');
  if (!track) return;
  track.innerHTML = "";
  items.forEach(({ title, url, excerpt }) => {
    const article = document.createElement('article');
    article.className = 'card';

    const h3 = document.createElement('h3');
    const a = document.createElement('a');
    a.href = (url || '').trim();
    a.target = "_blank";
    a.rel = "noopener";
    a.textContent = title;
    h3.appendChild(a);
    article.appendChild(h3);

    if (excerpt) {
      const p = document.createElement('p');
      p.textContent = excerpt;
      article.appendChild(p);
    }
    track.appendChild(article);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const pool = Array.isArray(FANBOX_POOL) ? FANBOX_POOL : [];
  if (pool.length === 0) return;
  appendFanboxCards(shuffle(pool).slice(0, 3));
});
