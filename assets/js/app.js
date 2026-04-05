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

// 診断（5問式）
(() => {
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

  const CHARACTERS = {
    money:     { name:"キャッシュ", theme:"大切なもの：お金",   vocal:"VOCAL: 鏡音レン", song:"クラブ＝マジェスティ", img:"assets/img/split_1.png",
                 desc:"「では御支払いを──」\n商会きっての優雅で皮肉屋な取り立て屋。\n金こそが世界を動かす真理だと知っている。",
                 color:"#EF9F27", colorDark:"#BA7517", gradient:"linear-gradient(135deg,#412402 0%,#854F0B 50%,#EF9F27 100%)" },
    love:      { name:"フィロ",     theme:"大切なもの：愛",     vocal:"VOCAL: 鏡音リン", song:"エンプレス＝ディスコ", img:"assets/img/split_2.png",
                 desc:"嘘と残忍さの裏側に\n愛と弱さを背負う皇女。\nその手が求めるのは、ただひとつの温もり。",
                 color:"#ED93B1", colorDark:"#D4537E", gradient:"linear-gradient(135deg,#4B1528 0%,#993556 50%,#ED93B1 100%)" },
    rule:      { name:"チキータ",   theme:"大切なもの：規則",   vocal:"VOCAL: MEIKO",     song:"フロイライン＝ビブリォチカ", img:"assets/img/split_3.png",
                 desc:"「仕方ないね規則だもん」\n誓いの書に秘密を携えて規則を護る審問官。\nルールは絶対。違えるな。",
                 color:"#85B7EB", colorDark:"#378ADD", gradient:"linear-gradient(135deg,#042C53 0%,#185FA5 50%,#85B7EB 100%)" },
    happiness: { name:"ファン",     theme:"大切なもの：幸福",   vocal:"VOCAL: KAITO",     song:"ドクター＝ファンクビート", img:"assets/img/split_4.png",
                 desc:"「お幸せにどうぞ」\n不幸という病を治す自称大天才。\n満身創痍の医者だった――",
                 color:"#5DCAA5", colorDark:"#1D9E75", gradient:"linear-gradient(135deg,#04342C 0%,#0F6E56 50%,#5DCAA5 100%)" },
    faith:     { name:"ルージュ",   theme:"大切なもの：信仰",   vocal:"VOCAL: 巡音ルカ", song:"シスター＝セクトルージュ", img:"assets/img/split_5.png",
                 desc:"「信じたんでしょう？ いいじゃない」\n修道女の衣に身を隠す、魂を狩る元死神。\n祈りの先にあるのは救済か、それとも――",
                 color:"#AFA9EC", colorDark:"#7F77DD", gradient:"linear-gradient(135deg,#26215C 0%,#534AB7 50%,#AFA9EC 100%)" },
    song:      { name:"ライカ",     theme:"大切なもの：歌",     vocal:"VOCAL: 初音ミク", song:"シング＝ライカマジク", img:"assets/img/split_6.png",
                 desc:"「名前が歌詞なら、\nきっとその人生は旋律だ」\n西の森で歌う元革命の歌姫。",
                 color:"#F09595", colorDark:"#E24B4A", gradient:"linear-gradient(135deg,#501313 0%,#A32D2D 50%,#F09595 100%)" },
  };

  let currentQ = 0;
  let answers = [];

  const $ = id => document.getElementById(id);
  const body      = $('shindanBody');
  const intro     = $('shindanIntro');
  const question  = $('shindanQuestion');
  const resultEl  = $('shindanResultPhase');
  const progress  = $('shindanProgress');
  const qLabel    = $('shindanQLabel');
  const qText     = $('shindanQText');
  const choices   = $('shindanChoices');

  function showPhase(phase) {
    intro.hidden    = phase !== 'intro';
    question.hidden = phase !== 'question';
    resultEl.hidden = phase !== 'result';
  }

  function fadeTransition(callback) {
    body.style.opacity = '0';
    setTimeout(() => { callback(); body.style.opacity = '1'; }, 500);
  }

  function renderQuestion() {
    const q = QUESTIONS[currentQ];
    // progress dots
    progress.innerHTML = '';
    for (let i = 0; i < QUESTIONS.length; i++) {
      const dot = document.createElement('div');
      dot.className = 'shindan-dot' + (i === currentQ ? ' active' : i < currentQ ? ' done' : '');
      progress.appendChild(dot);
    }
    qLabel.textContent = 'QUESTION ' + (currentQ + 1) + ' / ' + QUESTIONS.length;
    qText.textContent = q.q;
    choices.innerHTML = '';
    choices.style.opacity = '1';
    q.choices.forEach((c, i) => {
      const btn = document.createElement('button');
      btn.className = 'shindan-choice-btn';
      btn.textContent = c.text;
      btn.style.animationDelay = (i * 0.06) + 's';
      btn.addEventListener('click', () => handleAnswer(c.value));
      choices.appendChild(btn);
    });
  }

  function handleAnswer(value) {
    choices.style.opacity = '0';
    answers.push(value);
    setTimeout(() => {
      if (currentQ < QUESTIONS.length - 1) {
        currentQ++;
        renderQuestion();
      } else {
        showResult();
      }
    }, 400);
  }

  function showResult() {
    const counts = {};
    answers.forEach(a => counts[a] = (counts[a] || 0) + 1);
    const winner = Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
    const ch = CHARACTERS[winner];

    fadeTransition(() => {
      showPhase('result');

      // character image
      const orb = $('shindanOrb');
      orb.style.background = 'none';
      orb.style.boxShadow = '0 0 40px ' + ch.color + '33, 0 0 80px ' + ch.color + '15';
      orb.style.border = '2px solid ' + ch.color + '60';
      orb.innerHTML = '<img src="' + ch.img + '" alt="' + ch.name + '" class="shindan-result-img">';
      $('shindanCharName').textContent = ch.name;

      const tag = $('shindanTag');
      tag.textContent = ch.theme;
      tag.style.background = ch.color + '20';
      tag.style.color = ch.color;
      tag.style.border = '1px solid ' + ch.color + '40';

      const divider = $('shindanResultDivider');
      divider.style.background = 'linear-gradient(90deg,transparent,' + ch.color + '60,transparent)';

      $('shindanDesc').textContent = ch.desc;
      $('shindanVocal').textContent = ch.vocal;

      const songEl = $('shindanSongName');
      songEl.textContent = ch.song;
      songEl.style.color = ch.color;

      const guideLink = $('shindanGuideLink');
      guideLink.style.color = ch.color;

      // share URL
      const shareText = '鉛姫シリーズ「大切なもの」診断の結果、私は【' + ch.name + '】タイプでした。\n大切なもの：' + ch.theme.replace('大切なもの：','') + '\n\n▶ あなたも診断する\nhttps://nyanyannya-daitensai.github.io/Namarihime/#shindan';
      $('shindanShare').href = 'https://x.com/intent/tweet?text=' + encodeURIComponent(shareText);
    });
  }

  // イベント
  document.addEventListener('click', (e) => {
    if (e.target.closest('#shindanStart')) {
      fadeTransition(() => {
        currentQ = 0;
        answers = [];
        showPhase('question');
        renderQuestion();
      });
    }
    if (e.target.closest('#shindanRetry')) {
      fadeTransition(() => {
        currentQ = 0;
        answers = [];
        showPhase('intro');
      });
    }
  });
})();

// 最新情報：空なら非表示
document.addEventListener('DOMContentLoaded', () => {
  const bar = document.querySelector('.newsbar');
  const track = bar?.querySelector('.news-track');
  if (!bar || !track) return;

  const items = Array.from(track.querySelectorAll('.news-item'))
    .filter(a => (a.textContent || '').trim().length > 0);
  if (items.length === 0) bar.hidden = true;
});
