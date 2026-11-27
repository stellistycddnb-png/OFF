'use strict';
/* v142: Лесной как отдельный персонаж — комментирует происходящее и подъёбывает по ходу всей игры. */
(function () {
  const KEY = 'cc_lesq', cfg = () => Object.assign({off: 0}, lsGet(KEY, {})), $q = s => document.querySelector(s);
  const P = {
    success: ['Ну что, душегуб, доволен? Деньги в кармане, а совесть ушла в отпуск.', 'Закрыл «сделку». Вот это профессионал, блядь, прямо горжусь.', 'Деньги не пахнут. Хорошо, а то ты бы не спал, сука.', 'Опа, комиссия! Купи себе новую совесть, а то старая вся в говне.', 'Так держать. Только потом не ной, как тебе хуёво.', 'Бабушка плачет, а ты считаешь прибыль. Баланс, ёб твою мать.'],
    fail: ['Слил. Бывает. Не со всеми, но с тобой бывает постоянно.', 'Тебя послал даже автоответчик? Охуеть, какой талант.', 'Не вышло? Зато честно. Ну, почти честно.', 'Ты звонишь людям, а не в пустоту, мудила. Хотя результат одинаковый.', 'Если бы лажа была профессией, ты бы уже стал директором.'],
    warn: ['Предупредил? Ты что, святой? Святые здесь не задерживаются.', 'Совесть проснулась. Усыпи её нахуй, пока шеф не заметил.', 'Хороший ты человек. Денег от этого не прибавится, зато спать будешь спокойно.', 'В раю тебя запомнят. Здесь тебя уволят. Но в раю запомнят, блядь.'],
    hang: ['Положил трубку? Трус. Хотя нет, это называется «стратегия».', 'Бросил трубку. Клиент плачет, тебе похуй. Красота!', 'Трубка на рычаге, а мозги в отпуске. Классика.'],
    day: ['Новый день. Всё то же говно, только свежее.', 'Опять на работу? Ты точно не передумал, а?', 'Кофе выпил? Нет? Ну и хуй с тобой, звонки сами себя не примут.', 'Я бы пожелал тебе удачи, но мы оба знаем, как это работает.', 'Вставай, красавчик, ипотека сама себя не заплатит.'],
    en: ['Ты выглядишь как варёный хуй. Выпей кофе или хотя бы притворись живым.', 'Силы на нуле. Иди поспи, не позорься, блядь.', 'Ты выглядишь как мои понедельники, то есть никак.'],
    heat: ['Подозрения зашкаливают. Если что, я тебя не знаю, понял?', 'Красная полоса растёт. Мне пора звонить адвокату. А тебе?', 'Я уже чую запах масок в воздухе. Это не шутка, это пиздец как близко.'],
    cons: ['Совесть на дне. Зато тебе легко: ничего не давит, сука.', 'Ещё чуть-чуть, и ты станешь как шеф. Мечта, ага, блядь.'],
    poor: ['Денег нет. Зато и красть нечего, так что ты в безопасности.', 'Нищий оператор — это не профессия, это приговор, ёб твою мать.', 'С такой зарплатой я бы тоже подался в криминал. А, ты уже подался.'],
    rich: ['Богатенький Буратино! Угости пивом, что ли, хуле жмотишься.', 'Столько денег, а выглядишь как студент после сессии.'],
    idle: ['Тишина… Позвони маме, что ли, пока никого нет.', 'Никто не звонит. Наслаждайся, пока шеф не пришёл.', 'Скучно? Это нормально. Это затишье перед пиздецом.'],
    wife: ['Жена, поди, думает, что ты работаешь в банке.', 'Жена ждёт тебя дома, а ты здесь людей разводишь. Красота, блядь.'],
    pets: ['Питомцы у тебя лучше всех: они не спрашивают, откуда деньги.', 'Кот осуждает тебя. Молча, как мы любим.'],
    sting: ['Слышь, этот клиент слишком любознательный. Я бы насторожился.', 'Что-то он подозрительно вежливый. Такие бывают с корочками.', 'Нюх мне подсказывает, что этому голосу верить нельзя, блядь.'],
    ent: ['Предприниматель. Много говорит и мало слушает, как и ты, мудила.'],
    hak: ['Студент-хакер? Следи за языком: он тебя записывает, сука.'],
    vet: ['Ветеран. Не хами: у них память лучше, чем у меня на долги.'],
    blog: ['Блогерша. Если что, ты здесь не работаешь, ты уборщик, понял?']
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
  scrSet = function (from) {_ss(from); try {const bk = $q('#scr [data-a="back"]'); if (bk) bk.parentNode.insertAdjacentHTML('beforebegin', '<button class="btn sm" data-a="lesqt" style="width:100%;margin-bottom:8px">🧔 Лесной подъёбывает по ходу игры: ' + (cfg().off ? 'выкл' : 'вкл') + '</button>');} catch (e) {}};
  document.addEventListener('click', e => {const b = e.target.closest('[data-a="lesqt"]'); if (!b) return; e.preventDefault(); e.stopImmediatePropagation(); lsSet(KEY, {off: cfg().off ? 0 : 1}); const bx = $q('#scr .box'); scrSet(bx ? bx.dataset.from : 'title');}, true);
})();
