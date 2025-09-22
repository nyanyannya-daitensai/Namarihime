// 事前リスト（順不同・必要に応じて自由に増減してください）
const FANBOX_POOL = [
  {
    title: "設定資料：奇械（マキナ）について",
    url: "https://nyanyannya.fanbox.cc/posts/9210030",
    excerpt: "物語の根幹にある奇械（マキナ）の一覧資料",
    image: null
  },
  {
    title: "小説：ノエル・デ・フィガロ　「少年とプリエスト」",
    url: "https://nyanyannya.fanbox.cc/posts/1281051",
    excerpt: "ノエル＝バイテルの少年時代を描く短編",
    image: null
  },
  {
    title: "小説：クラブ＝マジェスティ『シリング＝ショット』【01】（旧約版）",
    url: "https://nyanyannya.fanbox.cc/posts/2112083",
    excerpt: "クラブ＝マジェスティのアクション長編",
    image: null
  },
  {
    title: "音源配布：魂流し ストリングスアレンジ",
    url: "https://nyanyannya.fanbox.cc/posts/270793",
    excerpt: "ファンクビート（VO.KAITO）「魂流し」のストリングスアレンジ版",
    image: null
  },
  {
    title: "小説：フロイライン＝ビブリォチカ【01】「淑女たれ」",
    url: "https://nyanyannya.fanbox.cc/posts/346435",
    excerpt: "フロイライン＝ビブリォチカより、掌編小説",
    image: null
  },
  {
    title: "設定資料： アークヨルム教導十八部隊",
    url: "https://nyanyannya.fanbox.cc/posts/469142",
    excerpt: "十八部隊の詳細設定資料",
    image: null
  },
    {
    title: " 音源配布：吹奏楽『色偸るセカイの鉛姫』",
    url: "https://nyanyannya.fanbox.cc/posts/9003268",
    excerpt: "吹奏楽に編曲した「色偸るセカイの鉛姫」の音源配布",
    image: null
  },
   {
    title: " 配信アーカイブ：１２月８日 公式配信のアーカイブ",
    url: "  https://nyanyannya.fanbox.cc/posts/9003268",
    excerpt: "世界観、設定について説明した配信のアーカイブ",
    image: null
  },
   {
    title: " 音源配布　カドワナルカ＝ギャラルホルン",
    url: "  https://nyanyannya.fanbox.cc/posts/7654358",
    excerpt: "過去にリリースした十八部隊関連アルバムの音源配布",
    image: null
  },

  // --- 必要に応じて追加 ---
  // { title:"...", url:"...", excerpt:"...", image:"https://..." },
];

// ユーティリティ：シャッフル（Fisher–Yates）
function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// DOMにカード追加（※ 日付は扱わない）
function appendFanboxCards(items) {
  const track = document.getElementById('fanboxTrack');
  if (!track) return;
  track.innerHTML = ""; // 念のため空に

  items.forEach(({ title, url, excerpt, image }) => {
    const article = document.createElement('article');
    article.className = 'card';

    // サムネがあれば上部に表示（なければ本文のみ）
    if (image) {
      const img = document.createElement('img');
      img.src = image;
      img.alt = title;
      img.loading = "lazy";
      article.appendChild(img);
    }

    const body = document.createElement('div');
    body.className = 'body';

    const h3 = document.createElement('h3');
    const a = document.createElement('a');
    a.href = url;
    a.target = "_blank";
    a.rel = "noopener";
    a.textContent = title;
    h3.appendChild(a);

    body.appendChild(h3);
    if (excerpt) {
      const p = document.createElement('p');
      p.textContent = excerpt;
      body.appendChild(p);
    }

    article.appendChild(body);
    track.appendChild(article);
  });
}

// アクセス毎に3件をランダム選択（重複なし）
document.addEventListener('DOMContentLoaded', () => {
  const pool = Array.isArray(FANBOX_POOL) ? FANBOX_POOL : [];
  if (pool.length === 0) return;

  const picked = shuffle(pool).slice(0, 3);
  appendFanboxCards(picked);
});
