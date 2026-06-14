// ============ 年表示 ============
document.addEventListener('DOMContentLoaded', () => {
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
});

// ============ ストーリー タブ切替（クリック＋キーボード＋ARIA同期） ============
(() => {
  function activate(tab) {
    const target = tab.getAttribute('data-tab');
    document.querySelectorAll('.tab').forEach(t => {
      const on = t === tab;
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      t.tabIndex = on ? 0 : -1;
    });
    document.querySelectorAll('.panel[data-panel]').forEach(panel => {
      panel.hidden = panel.getAttribute('data-panel') !== target;
    });
  }
  document.addEventListener('click', (e) => {
    const tab = e.target.closest('.tab');
    if (tab) activate(tab);
  });
  document.addEventListener('keydown', (e) => {
    const tab = e.target.closest && e.target.closest('.tab');
    if (!tab) return;
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    const tabs = Array.from(document.querySelectorAll('.tab'));
    const i = tabs.indexOf(tab);
    const next = e.key === 'ArrowRight' ? tabs[(i + 1) % tabs.length] : tabs[(i - 1 + tabs.length) % tabs.length];
    e.preventDefault();
    activate(next);
    next.focus();
  });
  document.addEventListener('DOMContentLoaded', () => {
    const active = document.querySelector('.tab[aria-selected="true"]');
    if (active) activate(active);
  });
})();

// ============ 診断（5問式 ＋ 応援ブリッジ） ============
(() => {
  const REDUCE = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const QUESTIONS = [
    { q: "夜、ひとりで帰り道を歩いている。\nふと立ち止まったのは――",
      choices: [
        { text: "宝石店のショーウィンドウ", value: "money" },
        { text: "公園で手を繋ぐ恋人たち", value: "love" },
        { text: "時計塔の鐘の音", value: "rule" },
        { text: "どこからか聞こえる笑い声", value: "happiness" },
        { text: "教会のステンドグラスの灯り", value: "faith" },
        { text: "路上で弾き語る誰かの声", value: "song" },
      ] },
    { q: "大切な人に最後の手紙を書くなら、\n最初の一文は――",
      choices: [
        { text: "「あなたに残せるものがある」", value: "money" },
        { text: "「どうしても伝えたかった」", value: "love" },
        { text: "「約束を、覚えていますか」", value: "rule" },
        { text: "「笑っていてほしい」", value: "happiness" },
        { text: "「信じてくれて、ありがとう」", value: "faith" },
        { text: "「あの日の歌を覚えていますか」", value: "song" },
      ] },
    { q: "世界からひとつだけ消えるとしたら、\n一番耐えられないのは――",
      choices: [
        { text: "報酬のない世界", value: "money" },
        { text: "誰も愛さない世界", value: "love" },
        { text: "秩序のない世界", value: "rule" },
        { text: "笑顔のない世界", value: "happiness" },
        { text: "信じるもののない世界", value: "faith" },
        { text: "音楽のない世界", value: "song" },
      ] },
    { q: "あなたが許せない嘘は――",
      choices: [
        { text: "対価を偽る嘘", value: "money" },
        { text: "気持ちを偽る嘘", value: "love" },
        { text: "約束を破る嘘", value: "rule" },
        { text: "幸せなふりをする嘘", value: "happiness" },
        { text: "信頼を裏切る嘘", value: "faith" },
        { text: "言葉の意味を歪める嘘", value: "song" },
      ] },
    { q: "夢の中で見つけた扉の向こうに\n広がっていたのは――",
      choices: [
        { text: "金色に輝く都市", value: "money" },
        { text: "懐かしい人がいる部屋", value: "love" },
        { text: "完璧に整った図書館", value: "rule" },
        { text: "終わらないお祭り", value: "happiness" },
        { text: "静謐な聖堂", value: "faith" },
        { text: "誰もいない舞台", value: "song" },
      ] },
  ];

  const CHANNEL = 'https://www.youtube.com/channel/UC13cTkDWK6o_TYL2tdtpJHg';
  // 公式動画IDが未確認の曲だけCHANNELへ誘導する。
  const CHARACTERS = {
    money:     { name:"キャッシュ", theme:"お金",   vocal:"VOCAL: 鏡音レン", song:"クラブ＝マジェスティ", img:"assets/img/split_1.png", focusY:"30%",
                 desc:"「では御支払いを──」\n商会きっての優雅で皮肉屋な取り立て屋。\n金こそが世界を動かす真理だと知っている。",
                 color:"#5B9BE8", songUrl: "https://www.youtube.com/watch?v=jTHP5J61ekY", songDirect:true },
    love:      { name:"フィロ",     theme:"愛",     vocal:"VOCAL: 鏡音リン", song:"エンプレス＝ディスコ", img:"assets/img/split_2.png", focusY:"35%",
                 desc:"嘘と残忍さの裏側に\n愛と弱さを背負う皇女。\nその手が求めるのは、ただひとつの温もり。",
                 color:"#ED93B1", songUrl: "https://www.youtube.com/watch?v=6wsnmyv0g40", songDirect:true },
    rule:      { name:"チキータ",   theme:"規則",   vocal:"VOCAL: MEIKO",     song:"フロイライン＝ビブリォチカ", img:"assets/img/split_3.png", focusY:"35%",
                 desc:"「仕方ないね規則だもん」\n誓いの書に秘密を携えて規則を護る審問官。\nルールは絶対。違えるな。",
                 color:"#B07FD9", songUrl: "https://www.youtube.com/watch?v=t4gP6cC55p0", songDirect:true },
    happiness: { name:"ファン",     theme:"幸福",   vocal:"VOCAL: KAITO",     song:"ドクター＝ファンクビート", img:"assets/img/split_4.png", focusY:"30%",
                 desc:"「お幸せにどうぞ」\n不幸という病を治す自称大天才。\n満身創痍の医者だった――",
                 color:"#5DCAA5", songUrl: "https://www.youtube.com/watch?v=CPxxurEcGTw", songDirect:true },
    faith:     { name:"ルージュ",   theme:"信仰",   vocal:"VOCAL: 巡音ルカ", song:"シスター＝セクトルージュ", img:"assets/img/split_5.png", focusY:"28%",
                 desc:"「信じたんでしょう？ いいじゃない」\n修道女の衣に身を隠す、魂を狩る元死神。\n祈りの先にあるのは救済か、それとも――",
                 color:"#E14B45", songUrl: "https://www.youtube.com/watch?v=GNuS9p9Am00", songDirect:true },
    song:      { name:"ライカ",     theme:"歌",     vocal:"VOCAL: 初音ミク", song:"シング＝ライカマジク", img:"assets/img/split_6.png", focusY:"33%",
                 desc:"「名前が歌詞なら、\nきっとその人生は旋律だ」\n西の森で歌う元革命の歌姫。",
                 color:"#3EC9BD", songUrl: "https://www.youtube.com/watch?v=pUOs7Cg0XkM", songDirect:true },
  };

  let currentQ = 0;
  let answers = [];
  let answering = false;

  const $ = id => document.getElementById(id);
  const body     = $('shindanBody');
  const intro    = $('shindanIntro');
  const question = $('shindanQuestion');
  const resultEl = $('sResult');
  const progress = $('shindanProgress');
  const qLabel   = $('shindanQLabel');
  const qText    = $('shindanQText');
  const choices  = $('shindanChoices');
  if (!body) return;

  function showPhase(phase) {
    intro.hidden    = phase !== 'intro';
    question.hidden = phase !== 'question';
    resultEl.hidden = phase !== 'result';
  }
  function fadeTransition(cb) {
    if (REDUCE) { cb(); body.style.opacity = '1'; return; }
    body.style.opacity = '0';
    setTimeout(() => { cb(); body.style.opacity = '1'; }, 450);
  }

  function renderQuestion() {
    const q = QUESTIONS[currentQ];
    progress.innerHTML = '';
    for (let i = 0; i < QUESTIONS.length; i++) {
      const dot = document.createElement('div');
      dot.className = 's-dot' + (i === currentQ ? ' active' : i < currentQ ? ' done' : '');
      progress.appendChild(dot);
    }
    qLabel.textContent = 'QUESTION ' + (currentQ + 1) + ' / ' + QUESTIONS.length;
    qText.textContent = q.q;
    choices.innerHTML = '';
    choices.style.opacity = '1';
    q.choices.forEach((c, i) => {
      const btn = document.createElement('button');
      btn.className = 's-choice';
      btn.textContent = c.text;
      btn.style.animationDelay = (i * 0.06) + 's';
      btn.addEventListener('click', () => handleAnswer(c.value));
      choices.appendChild(btn);
    });
  }

  function handleAnswer(value) {
    if (answering) return;
    answering = true;
    answers.push(value);
    const advance = () => {
      answering = false;
      if (currentQ < QUESTIONS.length - 1) { currentQ++; renderQuestion(); }
      else { showResult(); }
    };
    if (REDUCE) { advance(); return; }
    choices.style.opacity = '0';
    setTimeout(advance, 380);
  }

  function pickWinner() {
    const counts = {};
    answers.forEach(a => counts[a] = (counts[a] || 0) + 1);
    const max = Math.max(...Object.values(counts));
    const tied = Object.keys(counts).filter(k => counts[k] === max);
    if (tied.length === 1) return tied[0];
    // 同票は「最後に選んだもの」を優先（直近の意思を尊重・決定的）
    for (let i = answers.length - 1; i >= 0; i--) {
      if (tied.includes(answers[i])) return answers[i];
    }
    return tied[0];
  }

  function showResult() {
    const winner = pickWinner();
    const ch = CHARACTERS[winner];
    if (window.__track) window.__track('diag', 'result:' + winner);

    fadeTransition(() => {
      showPhase('result');

      const orb = $('shindanOrb');
      orb.style.boxShadow = '0 0 42px ' + ch.color + '40, 0 0 90px ' + ch.color + '18';
      orb.style.border = '2px solid ' + ch.color + '66';
      orb.innerHTML = '<img src="' + ch.img + '" alt="' + ch.name + '" style="object-position:center ' + ch.focusY + '">';

      $('shindanCharName').textContent = ch.name;

      const tag = $('shindanTag');
      tag.textContent = '大切なもの：' + ch.theme;
      tag.style.background = ch.color + '22';
      tag.style.color = ch.color;
      tag.style.border = '1px solid ' + ch.color + '55';

      $('shindanResultDivider').style.background = 'linear-gradient(90deg,transparent,' + ch.color + '88,transparent)';
      $('shindanDesc').textContent = ch.desc;
      $('shindanVocal').textContent = ch.vocal;

      const songEl = $('shindanSongName');
      songEl.textContent = '代表曲：' + ch.song;
      songEl.style.color = ch.color;

      // ---- 応援ブリッジ（最熱量を支援へ） ----
      const bridge = $('shindanBridge');
      bridge.style.borderColor = ch.color + '44';
      bridge.style.boxShadow = '0 0 60px -20px ' + ch.color + '55, inset 0 0 0 1px ' + ch.color + '11';
      bridge.style.background = 'radial-gradient(120% 100% at 50% 0%, ' + ch.color + '14, rgba(233,228,216,.03) 60%)';

      $('bridgeHead').textContent = 'あなたの「大切なもの」は、' + ch.theme + '。';
      $('bridgeCopy').textContent = ch.name + 'たちの物語はいまも続いています。制作の裏側や設定資料、本編では読めない話をFANBOXに載せています。続きが気になったらどうぞ。';

      const support = $('bridgeSupport');
      support.textContent = 'FANBOXで続きを応援する';
      support.href = 'https://nyanyannya.fanbox.cc/';

      const listen = $('bridgeListen');
      listen.textContent = ch.songDirect ? ('「' + ch.song + '」を聴く') : ('公式チャンネルで「' + ch.song + '」を聴く');
      listen.href = ch.songUrl;

      // ---- シェア ----
      const shareText = '鉛姫シリーズ「大切なもの」診断の結果、私は【' + ch.name + '】タイプでした。\n大切なもの：' + ch.theme + '\n\n▶ あなたも診断する\n#鉛姫シリーズ\nhttps://nyanyannya-daitensai.github.io/Namarihime/#shindan';
      $('shindanShare').href = 'https://x.com/intent/tweet?text=' + encodeURIComponent(shareText);
    });
  }

  document.addEventListener('click', (e) => {
    if (e.target.closest('#shindanStart')) {
      if (window.__track) window.__track('diag', 'start');
      fadeTransition(() => { currentQ = 0; answers = []; showPhase('question'); renderQuestion(); });
    }
    if (e.target.closest('#shindanRetry')) {
      fadeTransition(() => { currentQ = 0; answers = []; showPhase('intro'); });
    }
  });
})();

// ============ 最新情報：空なら非表示 ============
document.addEventListener('DOMContentLoaded', () => {
  const bar = document.querySelector('.newsbar');
  const track = bar?.querySelector('.news-track');
  if (!bar || !track) return;
  const items = Array.from(track.querySelectorAll('.news-item')).filter(a => (a.textContent || '').trim().length > 0);
  if (items.length === 0) bar.hidden = true;
});

// ============ スクロールで「色が戻る」リビール ============
document.addEventListener('DOMContentLoaded', () => {
  const els = document.querySelectorAll('[data-reveal]');
  if (!('IntersectionObserver' in window) || !els.length) {
    els.forEach(el => el.classList.add('in'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(en => {
      if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
  els.forEach(el => io.observe(el));
});

// ============ ナビ：現在地ハイライト ============
document.addEventListener('DOMContentLoaded', () => {
  const links = Array.from(document.querySelectorAll('.menu a[href^="#"]'));
  const map = new Map();
  links.forEach(a => { const id = a.getAttribute('href').slice(1); const sec = document.getElementById(id); if (sec) map.set(sec, a); });
  if (!map.size || !('IntersectionObserver' in window)) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        links.forEach(l => l.classList.remove('active'));
        const a = map.get(en.target);
        if (a) a.classList.add('active');
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  map.forEach((_, sec) => io.observe(sec));
});
