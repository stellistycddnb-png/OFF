'use strict';
/* v142: Лесной как отдельный персонаж — комментирует происходящее и подъёбывает по ходу всей игры. */
(function () {
  const KEY = 'cc_lesq', cfg = () => Object.assign({off: 0}, lsGet(KEY, {})), $q = s => document.querySelector(s);
  const P = {
    success: ['Закрыл «сделку»! Вот это пиздато, прямо горжусь тобой.', 'Комиссия в кармане, шеф доволен. Так держать, красавчик!', 'Ну ты даёшь, блядь! С таким подходом далеко пойдёшь.', 'Чётко сработал. Мне бы такого ученика лет двадцать назад, ёпта.', 'Золотой язык, не иначе. Пиздатая работа, продолжай!'],
    fail: ['Слился? Бывает, не переживай. В следующий раз выйдет, я в тебя верю.', 'Клиент попался хитрый, ничего. Главное не расстраивайся, звонок за звонком.', 'Не вышло. Зато опыт! Следующего дожмёшь, ёпта.', 'Не всё сразу, красавчик. Соберись, и поехали дальше.'],
    warn: ['Предупредил? Ну, бывает, у тебя своя голова на плечах. Подозрения вниз, и то хлеб.', 'Совесть чиста, подозрения упали. Тоже вариант, главное в плане не отстань.', 'Решил подстраховаться, и это умно. Только про оборот не забывай, блядь.'],
    hang: ['Положил трубку? Тоже способ экономить время. Только не злоупотребляй, шеф смотрит.', 'Бросил трубку. Ладно, следующий клиент будет лучше.', 'Трубка на рычаге. Не вышло, так не вышло, идём дальше.'],
    day: ['Новый день! Погнали, у тебя сегодня всё получится.', 'Утро доброе! Кофе выпил? Пей, и в бой. Сегодня будет пиздато.', 'Опять на работу? Вот это боевой дух, мне нравится!', 'Свежий день, свежие звонки. Покажи им, на что ты способен.'],
    en: ['Силы на нуле. Выпей кофе или перекуси, и снова станешь машиной.', 'Устал? Это нормально. Кофе, обед, и ты снова огонь.', 'Ты не железный, отдохни пять минут, а то клиенты почувствуют.'],
    heat: ['Подозрения растут. Глянь на «Палыча» и на адвоката, это решаемо.', 'Красная полоса ползёт вверх. Не паникуй, сделай что-нибудь, и всё обойдётся.', 'Надо бы сбросить подозрения. Ты справишься, я видел и посложнее.'],
    cons: ['Совесть просела. Предупреди кого-нибудь, и полегчает. Это бесплатно, ёпта.', 'С совестью надо аккуратно, не доводи до нуля. Подзаряди её, и дальше в бой.'],
    poor: ['С деньгами туго, но ничего, одна «сделка», и ты снова в плюсе.', 'Кошелёк пустоват. Зато впереди ещё весь день, закроешь пару «сделок», и порядок.', 'Начинай с малого, всё получится. Все с этого начинали.'],
    rich: ['Ого, сколько денег! Вот это пиздато, молодец!', 'Богатенький Буратино! Угости пивом, что ли, а я тебя похвалю ещё.', 'Деньги у тебя водятся. Вложи в дом, магазин или навыки.'],
    idle: ['Тишина. Выпей чаю, потом звонки снова польются.', 'Затишье. Отдохни, силы пригодятся.', 'Никто не звонит. Это ненадолго, будь начеку.'],
    wife: ['Жена у тебя пиздатая, береги её. Домой с хорошей новостью приходи.', 'Жена тобой гордится, я уверен. Ты у нас молодец.'],
    pets: ['Питомцы у тебя огонь. Накорми и погладь, они тебя обожают.', 'Кот довольный, и ты довольный. Красота, ёпта!'],
    sting: ['Слышь, этот клиент слишком любознательный. Я бы насторожился.', 'Что-то он подозрительно вежливый. Такие бывают с корочками.', 'Нюх подсказывает, что этому голосу верить не стоит.'],
    ent: ['Предприниматель. Много говорит, но платить умеет. Дави аккуратно, и всё получится.'],
    hak: ['Студент-хакер. Следи за языком: он всё записывает. Но ты справишься.'],
    vet: ['Ветеран. Говори уважительно, и он тебя выслушает. У тебя получится.'],
    blog: ['Блогерша. Аккуратнее, она может всё выложить. Но ты парень ловкий, выкрутишься.']
  };
  const last = {}; let lastT = 0, tmr = 0, lastK = '';
  const css = document.createElement('style'); css.textContent = '#lesq{position:fixed;left:50%;top:84px;transform:translateX(-50%);z-index:8800;width:min(92vw,400px);display:flex;gap:10px;align-items:center;background:#241852f2;border:2px solid #ffd23a;border-radius:14px;padding:8px 12px;color:#f2ecff;font:600 13px/1.4 sans-serif;box-shadow:0 6px 24px rgba(0,0,0,.55);animation:lqin .25s ease-out;touch-action:manipulation}#lesq .a{flex:none;width:38px;height:38px;border-radius:50%;background:#2c1d5e;border:2px solid #ffd23a;display:flex;align-items:center;justify-content:center;font-size:22px}#lesq b{color:#ffd23a;font-size:11px;display:block}@keyframes lqin{from{opacity:0;transform:translate(-50%,-10px)}}body.perf2 #lesq{animation:none}';
  document.head.appendChild(css);
  function say(k, force) {
    if (cfg().off || !S || document.getElementById('lesn') || document.getElementById('mini')) return; const now = Date.now(); if (!force && now - lastT < 24000) return; if (!force && Math.random() > .6) return;
    const a = P[k]; if (!a) return; let t, n = 0; do {t = a[Math.floor(Math.random() * a.length)];} while (t === last[k] && a.length > 1 && ++n < 6); last[k] = t; lastT = now; lastK = k;
    const old = document.getElementById('lesq'); if (old) old.remove(); const d = document.createElement('div'); d.id = 'lesq'; d.innerHTML = '<div class="a">🧔</div><div><b>Лесной</b>' + t + '</div>'; d.onclick = () => d.remove(); document.body.appendChild(d); clearTimeout(tmr); tmr = setTimeout(() => {try {d.remove();} catch (e) {}}, 5200);
    try {Snd.sfx('pop');} catch (e) {}
  }
  window.__lesnSay = say;
  const _su = success; success = function () {const c = S && S.call; _su.apply(this, arguments); setTimeout(() => say('success'), 900); if (c && c.arch === 'sting') setTimeout(() => say('sting', true), 4200);};
  const _fl = fail; fail = function () {_fl.apply(this, arguments); setTimeout(() => say('fail'), 700);};
  const _wn = warn; warn = function () {_wn.apply(this, arguments); setTimeout(() => say('warn'), 700);};
  const _hg = hang; hang = function () {_hg.apply(this, arguments); setTimeout(() => say('hang'), 600);};
  const _nd = nextDay; nextDay = function () {_nd.apply(this, arguments); setTimeout(() => say('day', true), 1200);};
  const _ch = choose; choose = function (t) {const c = S && S.call; _ch.apply(this, arguments); if (c && S.call === c && S.mode === 'call' && c.turn >= 2 && ['sting', 'ent', 'hak', 'vet', 'blog'].includes(c.arch) && !c._ls) {c._ls = 1; setTimeout(() => say(c.arch, c.arch === 'sting'), 600);}};
  let idleT = 0;
  setInterval(() => {
    if (!S || document.getElementById('lesn') || $('app').classList.contains('hide')) return; const m = S.mode;
    if (m === 'idle' && !$('scr').innerHTML) {idleT++; if (idleT > 18) {idleT = 0; say('idle');}} else idleT = 0;
    if (m !== 'idle' || $('scr').innerHTML) return;
    if (S.energy < 20) say('en'); else if (S.heat > 70) say('heat'); else if (S.cons < 25) say('cons'); else if (S.money < 150) say('poor'); else if (S.money > 20000) say('rich'); else if (Math.random() < .08) {let h = null; try {h = H();} catch (e) {} if (h && h.wife) say('wife'); else if (S.pets && S.pets.length) say('pets');}
  }, 2000);

  /* настройка: Лесной подъёбывает */
  const _ss = scrSet;
  scrSet = function (from) {_ss(from); try {const bk = $q('#scr [data-a="back"]'); if (bk) bk.parentNode.insertAdjacentHTML('beforebegin', '<button class="btn sm" data-a="lesqt" style="width:100%;margin-bottom:8px">🧔 Лесной подбадривает по ходу игры: ' + (cfg().off ? 'выкл' : 'вкл') + '</button>');} catch (e) {}};
  document.addEventListener('click', e => {const b = e.target.closest('[data-a="lesqt"]'); if (!b) return; e.preventDefault(); e.stopImmediatePropagation(); lsSet(KEY, {off: cfg().off ? 0 : 1}); const bx = $q('#scr .box'); scrSet(bx ? bx.dataset.from : 'title');}, true);
})();
