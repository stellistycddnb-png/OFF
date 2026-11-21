'use strict';
/* КОЛ-ЦЕНТР: СМЕНА — игровая логика и интерфейс. MADE BY PESSIMIST */
const $ = id => document.getElementById(id);
const rnd = (a, b) => a + Math.random() * (b - a), ri = (a, b) => Math.floor(rnd(a, b + 1)), pick = a => a[Math.floor(Math.random() * a.length)], clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const fmt = n => '₴' + Math.round(n).toLocaleString('ru-RU');
const fmtTime = m => String(Math.floor(m / 60)).padStart(2, '0') + ':' + String(Math.floor(m % 60)).padStart(2, '0');
const lsGet = (k, d) => {try {const v = localStorage.getItem(k); return v ? JSON.parse(v) : d;} catch (e) {return d;}};
const lsSet = (k, v) => {try {localStorage.setItem(k, JSON.stringify(v));} catch (e) {}};
let S = null, setg = Object.assign({music: .6, sfx: .9}, lsGet(SET_KEY, {})), tickT = null, ringTO = null, T0 = 0, running = false;

function newState() {return {day: 1, min: DAY_START, money: 800, cons: 80, heat: 0, boss: 70, energy: 100, rank: 0, xp: 0, pmode: 1, flags: {}, life: {h: 1, n: 1, f: 1}, pets: [], evidence: 0, closed: 0, turnover: 0, upg: {}, mode: 'idle', call: null, nextCall: DAY_START + 12, total: 0, spared: 0, log: [], daily: {calls: 0, spared: 0, fix: 0}};}
const quota = d => Math.min(10000 + d * 1100, 36000);
const hasU = id => !!S.upg[id];
const RK = () => RANKS[S.rank || 0], planNow = () => Math.round(quota(S.day) * RK().plan), gap = (a, b) => Math.round(ri(a, b) * (S.rank >= 4 ? 1.5 : 1));
const bills = () => ({h: HOUSES[S.life.h].c, n: NETS[S.life.n].c, f: FOODS[S.life.f].c, p: carUp() + S.pets.reduce((a, id) => a + PETS.find(x => x.id === id).up, 0)});
const billsSum = () => {const b = bills(); return Math.round((b.h + b.n + b.f + b.p) * 1.2) + (typeof gearUp === 'function' ? gearUp() : 0) + (typeof staffWage === 'function' ? staffWage() : 0);};
const lifeEn = () => clamp(100 + homeEn() + HOUSES[S.life.h].en + FOODS[S.life.f].en + S.pets.reduce((a, id) => a + PETS.find(x => x.id === id).en, 0), 40, 100);
const lifeCons = () => homeCons() + HOUSES[S.life.h].cons + FOODS[S.life.f].cons + S.pets.reduce((a, id) => a + PETS.find(x => x.id === id).cons, 0);
const SALARY = [450, 550, 700, 850, 1000];
function save() {if (S && S.mode !== 'ending') lsSet(SAVE_KEY, Object.assign({}, S, {mode: 'idle', call: null}));}

/* ---------- экраны ---------- */
function showScr(html, dim) {$('scr').innerHTML = '<div class="scr' + (dim ? ' dim' : '') + '">' + html + '</div>';}
function hideScr() {$('scr').innerHTML = '';}
const TGB = '<a class="btn sm" href="' + TG_CHANNEL + '" target="_blank" rel="noopener">📣 Канал разработчика</a> <a class="btn sm" href="' + TG_USER_URL + '" target="_blank" rel="noopener">✈ ' + TG_USER + '</a>';
const ACH = [
  {id: 'first', n: 'Первая «сделка»', d: 'Закрыть первую «сделку»', c: () => S.total >= 1},
  {id: 'warn1', n: 'Совесть жива', d: 'Предупредить первого человека', c: () => S.spared >= 1},
  {id: 'spare10', n: 'Тихий спаситель', d: 'Предупредить 10 человек', c: () => S.spared >= 10},
  {id: 'deals10', n: 'Набил руку', d: '10 «сделок» за игру', c: () => S.total >= 10},
  {id: 'r1', n: 'Растём', d: 'Стать Второй холодкой', c: () => S.rank >= 1},
  {id: 'r2', n: 'Клоузер', d: 'Достичь должности Клоузер', c: () => S.rank >= 2},
  {id: 'r3', n: 'Свой человек', d: 'Стать «Мусором»', c: () => S.rank >= 3},
  {id: 'r4', n: 'За пультом', d: 'Дойти до должности Пульт', c: () => S.rank >= 4},
  {id: 'ev5', n: 'Папка готова', d: 'Собрать 5 улик', c: () => S.evidence >= 5},
  {id: 'rich', n: 'Тугой кошелёк', d: 'Иметь ₴20 000', c: () => S.money >= 20000},
  {id: 'press', n: 'Анонимный источник', d: 'Поговорить с журналистом', c: () => S.flags && S.flags.journo},
  {id: 'clean', n: 'Чистые руки', d: 'Дожить до 7 дня с риском <20 и совестью >60', c: () => S.day >= 7 && S.heat < 20 && S.cons > 60}];
let achDone = lsGet('cc_ach', {});
function checkAch() {if (!S) return; ACH.forEach(a => {if (!achDone[a.id] && a.c()) {achDone[a.id] = 1; lsSet('cc_ach', achDone); toast('🏆 ' + a.n, 'ok'); Snd.sfx('good'); vib(40);}});}
function scrAch(from) {showScr('<div class="box" data-from="' + from + '"><h2>🏆 Достижения</h2><p style="color:#9a8fb8">' + ACH.filter(a => achDone[a.id]).length + ' / ' + ACH.length + '</p>' + ACH.map(a => '<div class="tech" style="' + (achDone[a.id] ? '' : 'opacity:.45') + '"><div>' + (achDone[a.id] ? '🏆' : '🔒') + ' <b>' + a.n + '</b><br><small>' + a.d + '</small></div></div>').join('') + '<div class="row" style="margin-top:8px"><button class="btn" data-a="back">← Назад</button></div></div>', from !== 'title');}
const vib = p => {try {navigator.vibrate && navigator.vibrate(p);} catch (e) {}};
function floatText(m, k) {const e = document.createElement('div'); e.className = 'fl ' + (k || ''); e.textContent = m; document.body.appendChild(e); setTimeout(() => e.remove(), 1500);}
function shake() {const a = $('app'); a.classList.remove('shake'); void a.offsetWidth; a.classList.add('shake'); setTimeout(() => a.classList.remove('shake'), 450);}
let dMoney = 0;
function toast(m, k) {const t = document.createElement('div'); t.className = 'toast ' + (k || ''); t.textContent = m; $('toasts').appendChild(t); setTimeout(() => t.remove(), 2600);}

function showTitle() {
  running = false; Snd.ringStop(); $('app').classList.add('hide'); $('title').classList.remove('hide'); hideScr(); const has = !!lsGet(SAVE_KEY, null);
  $('tbtn').innerHTML = (has ? '<button class="btn pri" data-m="cont">▶ Продолжить</button>' : '') + '<button class="btn' + (has ? '' : ' pri') + '" data-m="new">🆕 Новая игра</button><button class="btn" data-m="help">❔ Как играть</button><div class="row two"><button class="btn" data-m="set">⚙ Настройки</button><button class="btn" data-m="ach">🏆 Награды</button></div><div class="row two"><button class="btn" data-m="about">ℹ Об игре</button><button class="btn" data-m="priv">🔒 Политика</button></div>';
}
function scrHelp(from) {showScr('<div class="box" data-from="' + from + '"><h2>❔ Как играть</h2><p>Вы — новичок-оператор в вымышленной конторе <b>' + COMPANY + '</b>. Игра — чёрная комедия про то, как устроен такой «бизнес» и сколько он стоит живым людям.</p><h3>Смена</h3><p>• Принимайте звонки и ведите разговор. Выбирайте манеру: <b>давление, лесть, термины, сочувствие</b>. Каждому человеку подходит своя.<br>• Полоска «убеждённость» растёт — «успех». Полоска «подозрение» растёт — человек бросит трубку.<br>• Кофе, обед, перекур помогают с усталостью.<br>• В конце дня — итоги, зарплата, аренда и магазин улучшений.</p><h3>Показатели</h3><p>🧠 <b>Совесть</b> — упадёт до нуля, и вы уже не человек. 🚨 <b>Риск</b> — дойдёт до 100: обыск. 😠 <b>Босс</b> — упадёт до нуля: увольнение. ⚡ <b>Энергия</b> — влияет на убедительность.</p><h3>Выбор</h3><p>В любой момент можно <b>предупредить человека</b> и сорвать «сделку». Это снижает прибыль, но возвращает совесть и даёт материалы для киберполиции. Собрав их достаточно, можно «сдать» контору.</p><p style="color:#9a8fb8">Игра сатирическая. Все «схемы» вымышленные и нарочито абсурдные.</p><div class="row"><button class="btn pri" data-a="back">' + (from === 'first' ? '▶ Играть' : '← Назад') + '</button></div></div>', from !== 'title');}
function scrAbout(from) {showScr('<div class="box" data-from="' + from + '"><h2>ℹ КОЛ-ЦЕНТР: СМЕНА</h2><p style="color:#ff7adf;font-weight:800">' + VERSION + '</p><p>Сатирическая симуляция смены в мошенническом кол-центре. Игра не учит обманывать: она показывает цену. Все названия, компания и «схемы» вымышлены.</p><h3>MADE BY PESSIMIST</h3><div class="row">' + TGB + '</div><p style="margin-top:10px">Telegram автора: <b>' + TG_USER + '</b><br>Канал: ' + TG_CHANNEL + '</p><p style="color:#c9bfe6">' + HELP_TEXT + '</p><div class="row"><button class="btn" data-a="back">← Назад</button></div></div>', from !== 'title');}
function scrPrivacy(from) {showScr('<div class="box priv" data-from="' + from + '"><h2>🔒 Политика конфиденциальности</h2><p style="color:#9a8fb8">Вступает в силу: 20 ноября 2026 г.</p><p>Эта политика описывает, как игра «Кол-центр: Смена» (разработчик — PESSIMIST, Telegram: @Izzolentaaa) обращается с данными.</p><h3>1. Какие данные мы собираем</h3><p>Никакие. Игра не требует регистрации и не запрашивает доступ к контактам, камере, микрофону, геолокации, файлам и другим данным устройства. В игре нет рекламы, аналитики, встроенных покупок и сторонних SDK. Игра не отправляет данные на серверы и не требует интернета.</p><h3>2. Данные на устройстве</h3><p>Сохранение прогресса и настройки (громкость) хранятся только локально в памяти приложения и удаляются при удалении приложения или очистке его данных. Если на устройстве включено резервное копирование Android, система может включить данные приложения в резервную копию вашего аккаунта Google — это определяется настройками устройства и политикой Google.</p><h3>3. Ссылки на сторонние сервисы</h3><p>В игре есть ссылки на Telegram (канал разработчика и профиль автора). На эти сервисы распространяется их собственная политика конфиденциальности.</p><h3>4. Дети</h3><p>Мы не собираем персональные данные ни от кого, включая детей. Игра содержит тёмный юмор на взрослую тему (мошенничество), рекомендуется для 16+.</p><h3>5. Изменения</h3><p>Политика может обновляться вместе с новыми версиями игры. Актуальный текст всегда доступен в игре.</p><h3>6. Контакты</h3><p>Telegram: ' + TG_USER + '.</p><div class="row">' + TGB + '</div><div class="row" style="margin-top:8px"><button class="btn" data-a="back">← Назад</button></div></div>', from !== 'title');}
function scrSet(from) {showScr('<div class="box" data-from="' + from + '"><h2>⚙ Настройки</h2><div class="sl"><span style="width:90px">🎵 Музыка</span><input type="range" min="0" max="100" value="' + setg.music * 100 + '" data-s="music"></div><div class="sl"><span style="width:90px">🔊 Звуки</span><input type="range" min="0" max="100" value="' + setg.sfx * 100 + '" data-s="sfx"></div><p style="color:#9a8fb8">Игра сохраняется автоматически в начале каждого дня.</p><div class="row"><button class="btn" data-a="back">← Назад</button></div></div>', from !== 'title');}
function scrTeam() {
  running = false; const nx = RANKS[S.rank + 1], R = RK();
  const crew = TEAM.map(t => '<div class="tech"><div>' + t.ic + ' <b>' + t.n + '</b> · ' + RANKS[t.r].ic + ' ' + RANKS[t.r].n + '<br><small>' + pick(t.q) + '</small></div><button class="btn sm" data-a="x_chat0" data-v="' + TEAM.indexOf(t) + '">💬</button></div>').join('');
  const fix = S.rank >= 3 ? '<div class="tech"><div>🚔 <b>Договориться с «крышей»</b><br><small>₴1200: риск −15, совесть −3. Раз в день.</small></div><button class="btn sm" data-a="fix"' + (S.money < 1200 || S.daily.fix ? ' disabled' : '') + '>₴1 200</button></div>' : '';
  const pm = S.rank >= 4 ? '<h3>🎛 Режим смены</h3><div class="col">' + PULT_MODES.map((m, i) => '<button class="btn' + (i === S.pmode ? ' pri' : '') + '" data-a="pmode" data-v="' + i + '">' + m.n + '<br><small>' + m.d + '</small></button>').join('') + '</div>' : '';
  showScr('<div class="box"><h2>👥 Команда</h2><p>Вы: ' + R.ic + ' <b>' + R.n + '</b><br><small style="color:#9a8fb8">' + R.d + '</small></p><p>Оклад: ' + fmt(SALARY[S.rank]) + ' · доля комиссии ×' + R.credit + ' · план ×' + R.plan + '</p>' + (nx ? '<div class="bar yel"><i style="width:' + clamp((S.xp - R.need) / (nx.need - R.need) * 100, 0, 100) + '%"></i></div><p style="color:#9a8fb8">До «' + nx.n + '»: ' + Math.max(0, nx.need - S.xp) + ' оч. (+1 за «сделку», +1 за день)</p>' : '<p style="color:#9a8fb8">Вы на вершине лестницы.</p>') + fix + pm + '<h3>Лестница</h3>' + crew + '<div class="row" style="margin-top:8px"><button class="btn" data-a="h_hr" data-v="team">💘 HR-отдел</button><button class="btn" data-a="h_home" data-v="team">🏡 Дом</button><button class="btn pri" data-a="tclose">← К работе</button></div></div>', true);
}
function scrLife() {
  const sec = (t, arr, k) => '<h3>' + t + '</h3>' + arr.map((o, i) => '<div class="tech" style="' + (S.life[k] === i ? 'border-color:#ffd23a' : '') + '"><div>' + o.ic + ' <b>' + o.n + '</b><br><small>' + o.d + '</small></div><button class="btn sm' + (S.life[k] === i ? ' pri' : '') + '" data-a="life" data-v="' + k + ':' + i + '">' + (S.life[k] === i ? '✔' : fmt(o.c)) + '</button></div>').join('');
  const pets = '<h3>🐾 Питомцы (' + S.pets.length + '/3)</h3>' + PETS.map(p => {const own = S.pets.includes(p.id); return '<div class="tech"><div>' + p.ic + ' <b>' + p.n + '</b><br><small>Корм ' + fmt(p.up) + '/день · +' + p.cons + ' совести' + (p.en ? ' · +' + p.en + ' энергии' : '') + '</small></div><button class="btn sm" data-a="' + (own ? 'petgive' : 'pet') + '" data-v="' + p.id + '"' + (!own && (S.money < p.price || S.pets.length >= 3) ? ' disabled' : '') + '>' + (own ? 'Отдать' : fmt(p.price)) + '</button></div>';}).join('');
  showScr('<div class="box"><h2>🏠 Быт</h2><p>Деньги: <b>' + fmt(S.money) + '</b><br>Расходы в день: <b>' + fmt(billsSum()) + '</b> (оклад ' + fmt(SALARY[S.rank]) + ')</p>' + sec('Жильё', HOUSES, 'h') + sec('Интернет', NETS, 'n') + sec('Питание', FOODS, 'f') + pets + '<div class="row" style="margin-top:8px"><button class="btn pri" data-a="lifeback">← Готово</button></div></div>', true);
}
function scrMenu() {running = false; showScr('<div class="box" style="max-width:380px"><h2>☰ Меню</h2><div class="col"><button class="btn pri" data-a="resume">▶ Продолжить</button><button class="btn" data-a="helpm">❔ Как играть</button><button class="btn" data-a="achm">🏆 Достижения</button><button class="btn" data-a="setm">⚙ Настройки</button><button class="btn" data-a="privm">🔒 Политика</button><div class="row">' + TGB + '</div><button class="btn dng" data-a="quit">⌂ В главное меню</button></div></div>', true);}
$('tbtn').addEventListener('click', e => {const b = e.target.closest('button'); if (!b) return; Snd.resume(); Snd.sfx('click'); const m = b.dataset.m;
  if (m === 'new') startNew(); else if (m === 'cont') {S = Object.assign(newState(), lsGet(SAVE_KEY, {})); begin();} else if (m === 'help') scrHelp('title'); else if (m === 'set') scrSet('title'); else if (m === 'about') scrAbout('title'); else if (m === 'priv') scrPrivacy('title'); else if (m === 'ach') scrAch('title');});
$('scr').addEventListener('click', e => {
  const b = e.target.closest('button'); if (!b) return; Snd.resume(); Snd.sfx('click'); const d = b.dataset, from = (b.closest('[data-from]') || {dataset: {}}).dataset.from || 'title';
  switch (d.a) {
    case 'back': hideScr(); if (from === 'pause') scrMenu(); else if (from === 'first') running = true; break;
    case 'resume': hideScr(); running = true; T0 = performance.now(); break;
    case 'achm': scrAch('pause'); break; case 'helpm': scrHelp('pause'); break; case 'setm': scrSet('pause'); break; case 'privm': scrPrivacy('pause'); break;
    case 'quit': save(); showTitle(); break;
    case 'ev': applyEvent(d.v); break;
    case 'life': {const [k, v] = d.v.split(':'); S.life[k] = +v; Snd.sfx('click'); scrLife(); break;}
    case 'pet': {const pt = PETS.find(x => x.id === d.v); if (pt && !S.pets.includes(pt.id) && S.pets.length < 3 && S.money >= pt.price) {S.money -= pt.price; S.pets.push(pt.id); Snd.sfx('good'); toast(pt.ic + ' ' + pt.n + ' теперь с вами!', 'ok');} scrLife(); break;}
    case 'petgive': S.pets = S.pets.filter(x => x !== d.v); S.cons = clamp(S.cons - 2, 0, 100); scrLife(); break;
    case 'lifeback': daySummaryRerender(); break;
    case 'lifeopen': scrLife(); break;
    case 'tclose': hideScr(); running = true; T0 = performance.now(); break;
    case 'pmode': S.pmode = +d.v; scrTeam(); break;
    case 'fix': if (S.money >= 1200 && !S.daily.fix) {S.money -= 1200; S.daily.fix = 1; S.heat = clamp(S.heat - 15, 0, 100); S.cons = clamp(S.cons - 3, 0, 100); Snd.sfx('cash'); toast('Палыч «решил вопрос». Риск снижен.', 'ok'); renderHud();} scrTeam(); break;
    case 'buy': buy(d.v); break;
    case 'next': nextDay(); break;
    case 'whistle': ending('whistle'); break;
    case 'story': hideScr(); afterCall(); break;
    case 'menu': showTitle(); break;
  }
});
$('scr').addEventListener('input', e => {const s = e.target.dataset.s; if (s) {setg[s] = e.target.value / 100; lsSet(SET_KEY, setg); Snd.setVol(setg.music, setg.sfx);}});

/* ---------- игра ---------- */
function startNew() {S = newState(); lsSet(SAVE_KEY, null); try {localStorage.removeItem(SAVE_KEY);} catch (e) {} begin(true);}
function begin(first) {
  hideScr(); $('title').classList.add('hide'); $('app').classList.remove('hide'); S.mode = 'idle'; S.call = null; running = true; T0 = performance.now(); resizeScene(); render(); Snd.resume(); Snd.setMood('calm');
  if (first && !lsGet('cc_seen_help', false)) {lsSet('cc_seen_help', true); running = false; scrHelp('first');} toast('MADE BY PESSIMIST · ' + TG_USER); S.min = Math.max(S.min, DAY_START); S.nextCall = Math.max(S.nextCall, S.min + 4);
}
function setBar(id, v, inv) {const e = $(id); e.firstElementChild.style.width = clamp(v, 0, 100) + '%'; e.className = 'bar ' + (inv ? (v > 66 ? 'red' : v > 33 ? 'yel' : 'grn') : (v < 25 ? 'red' : v < 55 ? 'yel' : 'grn'));}
function renderHud() {
  $('hDay').textContent = 'День ' + S.day + '/' + DAYS + ' · ' + RK().ic + ' ' + RK().n; $('hTime').textContent = fmtTime(S.min); 
  setBar('bCons', S.cons); setBar('bHeat', S.heat, true); setBar('bBoss', S.boss); setBar('bEn', S.energy);
  const q = planNow(); $('hPlan').textContent = 'План: ' + fmt(S.turnover) + ' / ' + fmt(q); $('hPlanBar').firstElementChild.style.width = clamp(S.turnover / q * 100, 0, 100) + '%';
}
function render() {
  if (!S) return; renderHud(); const m = $('main'), c = S.call; let h = '';
  if (S.mode === 'idle') h = '<div class="idle"><div class="big">📞</div><b>Ждём звонка…</b><p>' + TIPS[S.day % TIPS.length] + '</p></div>';
  else if (S.mode === 'ring') h = '<div class="idle"><button class="btn pri huge pulse" data-c="answer">📞 ВЗЯТЬ ТРУБКУ</button><button class="btn sm" data-c="reject">Сбросить</button></div>';
  else if (S.mode === 'call') {
    const P = c.p; h = '<div class="caller"><div class="av talk">' + P.ic + '</div><div><b>' + P.name + ', ' + P.age + '</b><div class="bio">' + P.bio + '</div></div></div><div class="lg">' + c.log.slice(-3).map(l => '<div class="' + l.w + '">' + l.t + '</div>').join('') + '</div>' +
      '<div class="meters"><div><small>' + (S.rank < 2 ? 'Заинтересованность' : 'Убеждённость') + ' · ' + STAGES[stageOf(c)] + '</small><div class="bar grn" id="mP"><i style="width:' + clamp(c.pers / c.target * 100, 0, 100) + '%"></i></div></div><div><small>Подозрение</small><div class="bar red" id="mS"><i style="width:' + clamp(c.susp, 0, 100) + '%"></i></div></div></div>' +
      (c.open ? '<div class="dil"><b>🎙 Как начнёте разговор?</b><div class="col" style="margin-top:6px">' + OPENERS.map((o, k) => '<button class="btn' + (k ? '' : ' pri') + '" data-c="open:' + k + '">' + o.ic + ' <b>' + o.n + '</b> <small>' + o.d + '</small></button>').join('') + '</div></div>' : c.dil ? '<div class="dil"><b>⚡ ' + c.dil.t + '</b><p>' + c.dil.d + '</p><div class="col">' + c.dil.ch.map((x, k) => '<button class="btn' + (k ? '' : ' pri') + '" data-c="dil:' + k + '">' + x.a + '</button>').join('') + '</div></div>' : '<div class="opts">' + [['pressure', '😠', 'Давить'], ['flattery', '😍', 'Льстить'], ['jargon', '🤓', 'Термины'], ['empathy', '🤝', 'Сочувствие'], ['bluff', '🎭', 'Легенда'], ['delay', '⏳', 'Тянуть время'], ['ask', '❓', 'Спросить'], ['pause', '🤐', 'Пауза']].concat((RANK_ACTS[S.rank] || []).map(a => ['r:' + a.id, a.ic, a.n])).map(o => '<button class="opt" data-c="' + o[0] + '"' + ((o[0] === 'delay' && c.delays >= 2) || (o[0] === 'ask' && c.asked) || (o[0].startsWith('r:') && c.rused && c.rused[o[0].slice(2)] && (RANK_ACTS[S.rank].find(x => x.id === o[0].slice(2)) || {}).once) ? ' disabled' : '') + '><i>' + o[1] + '</i>' + o[2] + '</button>').join('') + (c.pers >= 30 ? '<button class="opt wide" data-c="transfer"><i>📲</i>Передать коллеге (бонус ₴' + (60 + S.rank * 20) + ')</button>' : '') + '</div>') + '<div class="row two"><button class="btn warn" data-c="warn">⚠ Предупредить</button><button class="btn" data-c="hang">☎ Положить</button></div>';
  }
  m.innerHTML = h; $('bar').classList.toggle('off', S.mode !== 'idle' && S.mode !== 'ring');
}
$('main').addEventListener('click', e => {const b = e.target.closest('button'); if (!b || !S) return; const a = b.dataset.c; if (!a) return; Snd.resume();
  if (a === 'answer') answer(); else if (a === 'reject') {Snd.ringStop(); clearTimeout(ringTO); S.mode = 'idle'; S.boss = clamp(S.boss - 3, 0, 100); S.nextCall = S.min + gap(25, 40); render();} else if (a.startsWith('open:')) resolveOpen(+a.slice(5)); else if (a.startsWith('r:')) choose(a); else if (a.startsWith('dil:')) resolveDil(+a.slice(4)); else if (['pressure', 'flattery', 'jargon', 'empathy', 'bluff', 'delay', 'transfer', 'ask', 'pause'].includes(a)) choose(a); else if (a === 'warn') warn(); else if (a === 'hang') hang();});
$('bar').addEventListener('click', e => {const b = e.target.closest('button'); if (!b || !S) return; Snd.resume(); const a = b.dataset.b; if (a === 'menu') {scrMenu(); return;} if (a === 'team') {if (S.mode === 'idle') scrTeam(); return;} if (S.mode !== 'idle' && S.mode !== 'ring') return;
  if (a === 'coffee') {const c = hasU('coffee') ? 15 : 30; if (S.money < c) return toast('Нет денег на кофе', 'bad'); S.money -= c; S.energy = clamp(S.energy + (hasU('coffee') ? 40 : 28), 0, 100); S.min += 8; Snd.sfx('coffee'); toast('☕ Бодрит');}
  else if (a === 'lunch') {if (S.money < 80) return toast('Нет денег на обед', 'bad'); S.money -= 80; S.energy = clamp(S.energy + 50, 0, 100); S.min += 30; Snd.sfx('coffee'); toast('🍜 Сыт и доволен');}
  else if (a === 'smoke') {S.energy = clamp(S.energy + 12, 0, 100); S.min += 10; S.boss = clamp(S.boss - 2, 0, 100); Snd.sfx('click'); toast('🚬 Перекур'); if (Math.random() < .35) return doEvent();}
  checkDayEnd(); render();});

function answer() {
  Snd.ringStop(); clearTimeout(ringTO); Snd.sfx('pick'); let P = pick(PEOPLE); if (Math.random() < .08 + S.day * .006) P = PEOPLE.find(p => p.mood === 'cop'); else while (P.mood === 'cop') P = pick(PEOPLE);
  const mood = MOODS[P.mood], POLC = S.rank >= 3 && Math.random() < .75, PI = POLC ? pick(POL_PRE) : pick(PRE_INFO); S.call = {p: P, delays: 0, dil: null, dilDone: false, pre: PI.hook, info: PI, pol: POLC, target: RK().target, pers: 10, susp: P.mood === 'cop' ? (POLC ? 30 : 15) : 0, turn: 0, log: []};
  S.call.log = [{w: 'me', t: (S.call.pol ? '«Добрый день. ' : '«' + COMPANY + ', добрый день! ') + S.call.pre + '»'}, {w: 'them', t: P.mood === 'elder' ? '«Алё? Говорите громче, пожалуйста…»' : P.mood === 'cop' ? '«Так-так. Продолжайте. А кто вы по должности?»' : '«Да, слушаю вас.»'}]; S.mode = 'call'; S.call.open = true; Snd.setMood('tense'); render();
}
function resolveOpen(k) {const c = S.call, o = OPENERS[k], f = o.fx[c.p.mood]; c.pers += f[0]; c.susp += f[1]; c.open = false; S.min += 2; c.log.push({w: 'me', t: o.d}); Snd.sfx('key'); render();}
function resolveDil(k) {
  const c = S.call, ch = c.dil.ch[k], fx = ch.fx || {}; let extra = '';
  if (fx.pers) c.pers = Math.max(0, c.pers + fx.pers); if (fx.susp) c.susp = Math.max(0, c.susp + fx.susp);
  const add = f => {['cons', 'heat', 'boss', 'energy'].forEach(q => {if (f[q]) S[q] = clamp(S[q] + f[q], 0, 100);}); if (f.money) S.money += f.money; if (f.evidence) S.evidence += f.evidence; if (f.susp && f !== fx) c.susp += f.susp;};
  add(fx); if (ch.risk && Math.random() < ch.risk.p) {add(ch.risk.fx); extra = ' ' + ch.risk.r; Snd.sfx('bad');}
  c.dil = null; c.dilN = (c.dilN || 0) + 1; S.min += 3; c.log.push({w: 'me', t: ch.a}); if (extra) c.log.push({w: 'them', t: extra});
  if (S.cons <= 0) return ending('conscience'); if (S.heat >= 100) return ending('raid'); if (S.boss <= 0) return ending('fired');
  if (ch.end === 'hang') return hang(); if (ch.end === 'warn') return warn();
  if (c.pers >= c.target) return success(); if (c.susp >= 100) return fail('Человек бросил трубку: «Это обман!»'); render();
}
function choose(type) {
  const c = S.call, P = c.p;
  if (type === 'transfer') {const b = 60 + S.rank * 20; S.money += b; S.boss = clamp(S.boss + 1, 0, 100); S.min += 3; Snd.sfx('cash'); toast('📲 Контакт передан коллеге. Бонус ' + fmt(b)); return endCall();}
  if (type === 'delay') {c.delays++; c.susp = Math.max(0, c.susp - ri(10, 20)); c.pers += ri(0, 5); S.min += 10; S.energy = clamp(S.energy - 1, 0, 100); Snd.sfx('key'); c.log.push({w: 'me', t: pick(['«Минуточку, уточню детали…»', '«Давайте я вам перезвоню по защищённой линии… нет, подождите».', '«Сейчас сверю данные по вашему обращению».'])}); c.log.push({w: 'them', t: pick(['«Хорошо, жду…»', '«Угу…»', '«А долго ещё?»'])}); return render();}
  if (type === 'bluff') {const sm = P.mood === 'cop' ? 2.2 : P.mood === 'elder' ? .7 : 1; let p = rnd(14, 30), s = rnd(5, 22) * sm; if (Math.random() < .25) {s += 30; c.log.push({w: 'them', t: '«Что-то у вас легенда не сходится…»'});} c.pers += p; c.susp += s; c.turn++; S.min += 5; S.energy = clamp(S.energy - 2, 0, 100); Snd.sfx('key'); c.log.push({w: 'me', t: pick(c.pol ? POL_BLUFF : BLUFF_LINES)}); if (c.pers >= c.target) return success(); if (c.susp >= 100) return fail('Легенда рассыпалась. Человек бросил трубку.'); if (c.turn >= 6) return fail('Человек сказал «мне некогда» и отключился.'); return render();}
  const st0 = stageOf(c), fx = MOODS[P.mood].fx[type]; let p = fx[0] + rnd(-5, 5), s = fx[1] + rnd(-4, 4); if (c.pol) {if (type === 'pressure') p *= 1.35; if (type === 'flattery') p *= .6; if (type === 'jargon') p *= 1.15;} const sk = 1 + (hasU('headset') ? .08 : 0); const tired = S.energy < 30 ? 1 : 0;
  p = Math.max(0, p * sk * (tired ? .75 : 1) * [.92, 1, 1.06][S.life.n]); if (S.life.n === 0 && Math.random() < .1) {s += 6; c.log.push({w: 'them', t: '«Вас плохо слышно… связь…»'});} s = Math.max(0, s * (tired ? 1.2 : 1)); c.pers += p; c.susp += s; c.turn++; S.min += 5; S.energy = clamp(S.energy - (hasU('chair') ? 1.5 : 2), 0, 100); Snd.sfx('key');
  c.log.push({w: 'me', t: lineFor(c, type, st0)}); c.log.push({w: 'them', t: replyFor(c, p > s, st0)}); Snd.sfx('voice');
  if (c.pers >= c.target) return success(); if (c.susp >= 100) return fail('Человек бросил трубку: «Это обман!»'); if (c.turn >= 6) return fail('Человек сказал «мне некогда» и отключился.'); if (!c.dil && (c.dilN || 0) < 2 && c.turn >= 2 + (c.dilN || 0) * 2 && Math.random() < .5) {c.seen = c.seen || []; const pool = DILEMMAS.filter(x => (!x.m || x.m.includes(P.mood)) && !c.seen.includes(x.t) && stageOf(c) >= (DIL_MIN[x.t] || 0)); if (pool.length) {c.dil = pick(pool); c.seen.push(c.dil.t); Snd.sfx('bad');}} render();
}
function warn() {
  const c = S.call, P = c.p; S.cons = clamp(S.cons + 7, 0, 100); S.boss = clamp(S.boss - 1, 0, 100); S.spared++; S.daily.spared++; S.min += 5; let ev = ''; if (c.turn >= 1) {S.evidence++; ev = ' Вы записали детали разговора (улика +1).';} Snd.sfx('good'); Snd.ringStop(); floatText('🧠 +7 совесть', 'g');
  endCall(); toast('Вы предупредили: ' + P.name + '.' + ev, 'ok');
}
function hang() {S.min += 3; S.boss = clamp(S.boss - 1, 0, 100); Snd.sfx('hang'); endCall(); toast('Вы положили трубку.');}
function success() {
  const c = S.call, P = c.p, amt = Math.round((1500 + rnd(0, 6500)) * (1 + S.day * .08) / 50) * 50, com = Math.round(amt * .15 * RK().credit);
  if (c.pol) {S.heat = clamp(S.heat + 2, 0, 100); S.cons = clamp(S.cons - 1.5, 0, 100);} S.turnover += amt; S.money += com; S.boss = clamp(S.boss + 3, 0, 100); S.closed++; S.total++; S.xp++; S.cons = clamp(S.cons - (1.5 + ri(0, 2)) * (hasU('psy') ? .6 : 1) * [.5, .75, 1, 1, 1][S.rank], 0, 100); S.heat = clamp(S.heat + (1 + amt / 6000) * (hasU('vpn') ? .7 : 1), 0, 100); Snd.sfx('cash'); Snd.ringStop(); S.mode = 'story'; floatText('+' + fmt(com), 'g'); vib(35);
  showScr('<div class="box story"><div class="av big">' + P.ic + '</div><h2>' + (S.rank === 0 ? 'Контакт передан' : S.rank === 1 ? 'Передано клоузеру' : '«Сделка» закрыта') + '</h2><p>' + (S.rank < 2 ? 'Дальше клоузер «дожмёт»: <b>' + P.name + '</b> в итоге потеряет(ет) около <b>' : '<b>' + P.name + '</b> потерял(а) <b>') + fmt(amt) + '</b>.</p><p class="sad">' + pick(STORIES) + '</p><p>Ваша комиссия: <b>' + fmt(com) + '</b></p><div class="row"><button class="btn pri" data-a="story">Продолжить</button></div></div>', true);
  Snd.sfx('sad');
}
function fail(msg) {const c = S.call; S.boss = clamp(S.boss - 1, 0, 100); if (c.p.mood === 'cop') {S.heat = clamp(S.heat + (S.rank >= 3 ? 5 : 10), 0, 100); msg += ' Этот человек явно из органов — риск растёт!';} Snd.sfx('bad'); Snd.ringStop(); toast(msg, 'bad'); shake(); vib([40, 30, 40]); endCall();}
function endCall() {S.call = null; S.mode = 'idle'; Snd.setMood('calm'); S.nextCall = S.min + gap(25, 45); afterCall();}
function afterCall() {
  checkAch();
  if (S.mode === 'story') S.mode = 'idle'; S.call = null; Snd.setMood('calm'); S.nextCall = Math.max(S.nextCall, S.min + gap(25, 45));
  if (S.cons <= 0) return ending('conscience'); if (S.heat >= 100) return ending('raid'); if (S.boss <= 0) return ending('fired');
  if (Math.random() < .24) return doEvent(); checkDayEnd(); render(); save();
}
function doEvent() {const ok = EVENTS.map((e, k) => k).filter(k => !EVENTS[k].req || EVENTS[k].req()), i = pick(ok), e = EVENTS[i]; S.mode = 'event'; running = false; showScr('<div class="box"><h2>' + e.t + '</h2><p>' + e.d + '</p><div class="col">' + e.ch.map((c, k) => '<button class="btn' + (k ? '' : ' pri') + '" data-a="ev" data-v="' + i + ':' + k + '"' + (c.need && c.need.money > S.money ? ' disabled' : '') + '>' + c.a + (c.need ? ' <small>(₴' + c.need.money + ')</small>' : '') + '</button>').join('') + '</div></div>', true); render();}
function applyEvent(v) {
  const [i, k] = String(v).split(':').map(Number), chx = EVENTS[i].ch[k], fx = chx.fx; if (fx.flag) S.flags[fx.flag] = 1; if (chx.risk && Math.random() < chx.risk.p) {const f2 = chx.risk.fx; ['boss', 'heat', 'cons'].forEach(q => {if (f2[q]) S[q] = clamp(S[q] + f2[q], 0, 100);}); toast(chx.risk.r, 'bad');} else if (chx.r) toast(chx.r); if (fx.boss) S.boss = clamp(S.boss + fx.boss, 0, 100); if (fx.heat) S.heat = clamp(S.heat + fx.heat, 0, 100); if (fx.cons) S.cons = clamp(S.cons + fx.cons, 0, 100); if (fx.energy) S.energy = clamp(S.energy + fx.energy, 0, 100); if (fx.money) S.money += fx.money; if (fx.evidence) S.evidence += fx.evidence;
  hideScr(); S.mode = 'idle'; running = true; T0 = performance.now(); if (S.cons <= 0) return ending('conscience'); if (S.heat >= 100) return ending('raid'); if (S.boss <= 0) return ending('fired'); checkDayEnd(); render(); save();
}
function checkDayEnd() {if (S.mode === 'idle' && S.min >= DAY_END) daySummary();}
function daySummary() {
  checkAch();
  running = false; Snd.ringStop(); S.mode = 'summary'; const q = planNow(), ratio = S.turnover / q; let bossD = ratio >= 1 ? 8 : ratio >= .5 ? -2 : -5; S.boss = clamp(S.boss + bossD, 0, 100);
  const salary = SALARY[S.rank], cost = billsSum(), net = salary - cost; S.money += net; const petMsg = S.pets.length ? PETS.find(x => x.id === pick(S.pets)).q : null; const debt = S.money < 0; S.heat = clamp(S.heat - 3 - (hasU('lawyer') ? 3 : 0) - (S.rank >= 3 ? 2 : 0), 0, 100); S.boss = clamp(S.boss + (styleScore() >= 4 ? 1 : 0), 0, 100); hrDaily(); teamDaily(); S.xp++; let promo = ''; S.maxRank = Math.max(S.maxRank | 0, S.rank); while (S.maxRank < 4 && S.xp >= RANKS[S.maxRank + 1].need) {S.maxRank++; S.rank = S.maxRank; promo = '<div class="help" style="margin:6px 0">🎉 <b>ПОВЫШЕНИЕ!</b> Теперь вы — ' + RK().ic + ' <b>' + RK().n + '</b>.<br>' + RK().d + '</div>'; Snd.sfx('good');} S.energy = lifeEn(); S.cons = clamp(S.cons + 2 + (S.daily.spared > 0 ? 2 : 0) + lifeCons() - (debt ? 4 : 0), 0, 100); if (debt) S.boss = clamp(S.boss - 3, 0, 100);
  if (S.boss <= 0) return ending('fired'); if (S.heat >= 100) return ending('raid');
  const shop = UPGRADES.filter(u => !hasU(u.id)).map(u => '<div class="tech"><div>' + u.ic + ' <b>' + u.n + '</b><br><small>' + u.d + '</small></div><button class="btn sm" data-a="buy" data-v="' + u.id + '"' + (S.money < u.cost ? ' disabled' : '') + '>' + fmt(u.cost) + '</button></div>').join('');
  const last = S.day >= DAYS; showScr('<div class="box"><h2>🌙 День ' + S.day + ' окончен</h2>' + promo + '<div class="stat"><span>Оборот / план</span><b class="' + (ratio >= 1 ? 'win' : 'lose') + '">' + fmt(S.turnover) + ' / ' + fmt(q) + '</b><span>«Сделок» закрыто</span><b>' + S.closed + '</b><span>Людей предупредили</span><b>' + S.daily.spared + '</b><span>Оклад − расходы</span><b>' + fmt(salary) + ' − ' + fmt(cost) + '</b><span style="color:#9a8fb8">жильё · связь · еда · питомцы</span><span style="color:#9a8fb8">' + fmt(bills().h) + ' · ' + fmt(bills().n) + ' · ' + fmt(bills().f) + ' · ' + fmt(bills().p) + '</span><span>Босс</span><b>' + (bossD > 0 ? '😊 доволен' : bossD > -10 ? '😠 недоволен' : '🤬 в ярости') + '</b><span>Деньги</span><b>' + fmt(S.money) + '</b></div>' + (debt ? '<p class="sad">⚠ Вы в долгах: совесть и расположение босса падают.</p>' : '') + (petMsg ? '<p class="help">' + pick(petMsg) + '</p>' : '') + '<div class="row" style="margin:8px 0"><button class="btn" data-a="h_home" data-v="summary">🏡 Прийти домой</button><button class="btn" data-a="h_home" data-v="summary">🏡 Домой</button><button class="btn" data-a="lifeopen">🏠 Быт и питомцы</button></div>' + (shop ? '<h3>🛒 Улучшения</h3>' + shop : '') +
    (S.evidence >= 5 ? '<div class="row" style="margin-top:8px"><button class="btn warn" data-a="whistle">📁 Передать материалы в киберполицию (' + S.evidence + ')</button></div>' : '<p style="color:#9a8fb8">Улик: ' + S.evidence + '/5. Предупреждая людей и находя документы, вы собираете материалы.</p>') + '<div class="row" style="margin-top:8px"><button class="btn pri" data-a="next">' + (last ? 'Подвести итоги' : 'Следующий день ▶') + '</button></div></div>', true);
}
function buy(id) {const u = UPGRADES.find(x => x.id === id); if (!u || hasU(id) || S.money < u.cost) return; S.money -= u.cost; S.upg[id] = 1; Snd.sfx('cash'); daySummaryRerender();}
function daySummaryRerender() {const m = S.money, h = S.heat, bs = S.boss, mode = S.mode; S.mode = 'summary'; const keep = $('scr').innerHTML; /* перерисовать магазин без повторного начисления */ const q = planNow(), ratio = S.turnover / q, last = S.day >= DAYS;
  const shop = UPGRADES.filter(u => !hasU(u.id)).map(u => '<div class="tech"><div>' + u.ic + ' <b>' + u.n + '</b><br><small>' + u.d + '</small></div><button class="btn sm" data-a="buy" data-v="' + u.id + '"' + (S.money < u.cost ? ' disabled' : '') + '>' + fmt(u.cost) + '</button></div>').join('');
  showScr('<div class="box"><h2>🛒 Улучшения</h2><p>Деньги: <b>' + fmt(S.money) + '</b> · расходы в день: ' + fmt(billsSum()) + '</p><div class="row" style="margin:6px 0"><button class="btn" data-a="lifeopen">🏠 Быт и питомцы</button></div>' + (shop || '<p>Всё куплено.</p>') + (S.evidence >= 5 ? '<div class="row" style="margin-top:8px"><button class="btn warn" data-a="whistle">📁 Передать материалы в киберполицию (' + S.evidence + ')</button></div>' : '') + '<div class="row" style="margin-top:8px"><button class="btn pri" data-a="next">' + (last ? 'Подвести итоги' : 'Следующий день ▶') + '</button></div></div>', true);}
function nextDay() {
  if (S.day >= DAYS) {return ending(S.money >= 30000 && S.heat < 90 ? 'rich' : 'survive');} S.day++; S.min = DAY_START; S.closed = 0; S.turnover = 0; S.daily = {calls: 0, spared: 0, fix: 0}; S.mode = 'idle'; S.nextCall = DAY_START + ri(8, 20); hideScr(); running = true; T0 = performance.now(); save(); render(); toast('День ' + S.day + '. План: ' + fmt(planNow()));
}
function ending(k) {
  vib(k === 'whistle' || k === 'conscience' ? 80 : [100, 60, 100]);
  running = false; Snd.ringStop(); S.mode = 'ending'; const E = ENDINGS[k]; try {localStorage.removeItem(SAVE_KEY);} catch (e) {} Snd.sfx(E.c === 'good' ? 'good' : 'sad');
  showScr('<div class="box" style="text-align:center"><div class="big ' + E.c + '">' + E.t + '</div><p>' + E.d + '</p><div class="stat"><span style="text-align:left">Дней отработано</span><b>' + Math.min(S.day, DAYS) + '</b><span style="text-align:left">Должность</span><b>' + RK().ic + ' ' + RK().n + '</b><span style="text-align:left">«Сделок» закрыто</span><b>' + S.total + '</b><span style="text-align:left">Людей предупреждено</span><b>' + S.spared + '</b><span style="text-align:left">Совесть</span><b>' + Math.round(S.cons) + '%</b><span style="text-align:left">Деньги</span><b>' + fmt(S.money) + '</b></div><p class="help">' + HELP_TEXT + '</p><p>Спасибо за игру! Мой канал: <a href="' + TG_CHANNEL + '" target="_blank" rel="noopener">t.me/+OlavQF1edndlOWY1</a> · ' + TG_USER + '</p><div class="row" style="justify-content:center"><button class="btn pri" data-a="menu">⌂ В меню</button></div></div>', true);
}

/* ---------- цикл ---------- */
function tick() {
  if (!S || !running) return; if (S.mode === 'idle') {
    if (S.rank >= 4) {const PM = PULT_MODES[S.pmode], r = (20 + S.day * 2.4) * PM.t; S.turnover += r; S.money += r * .04; S.heat = clamp(S.heat + PM.heat / 337, 0, 100); S.cons = clamp(S.cons - PM.cons / 337, 0, 100); if (S.cons <= 0) {running = false; return ending('conscience');} if (S.heat >= 100) {running = false; return ending('raid');}}
    S.min += 1.6; S.energy = clamp(S.energy - .09 * (hasU('chair') ? .75 : 1), 0, 100);
    if (S.min >= S.nextCall && S.min < DAY_END - 10) {S.mode = 'ring'; Snd.ringStart(); vib([200, 100, 200]); render(); clearTimeout(ringTO); ringTO = setTimeout(() => {if (S && S.mode === 'ring') {Snd.ringStop(); S.mode = 'idle'; S.boss = clamp(S.boss - 3, 0, 100); S.nextCall = S.min + gap(25, 40); toast('Звонок пропущен. Босс недоволен.', 'bad'); render();}}, 9000);}
    if (S.min >= DAY_END) {checkDayEnd(); return;}
  }
  renderHud();
}
let scCtx = null, scW = 0, scH = 0;
function resizeScene() {const c = $('scene'), r = c.getBoundingClientRect(), d = Math.min(devicePixelRatio || 1, 2); scW = Math.max(200, Math.round(r.width)); scH = Math.max(100, Math.round(r.height)); c.width = scW * d; c.height = scH * d; scCtx = c.getContext('2d'); scCtx.setTransform(d, 0, 0, d, 0, 0);}
function frame(ts) {
  requestAnimationFrame(frame); if (!S || $('app').classList.contains('hide')) return; if (!scCtx) resizeScene();
  dMoney += (S.money - dMoney) * .12; if (Math.abs(S.money - dMoney) < 1) dMoney = S.money; $('hMoney').textContent = fmt(dMoney); Gfx.scene(scCtx, scW, scH, ts / 1000, {mode: S.mode, pets: S.pets, nick: S.nick || 'ВЫ', out: [tier('w', 'top'), tier('w', 'shoes'), tier('w', 'acc')], kr: S.kr || 0, col: S.eqCol || null, heat: S.heat, cons: S.cons, energy: S.energy, mr: S.maxRank || 0, prog: S.turnover / Math.max(1, planNow()), staff: (S.rank === 4 && S.staff) ? S.staff.map(p => ({n: p.n, role: p.role, skin: p.skin})) : null, p: clamp((S.min - DAY_START) / (DAY_END - DAY_START), 0, 1), min: S.min, ring: S.mode === 'ring', rank: S.rank || 0});
}
addEventListener('resize', () => {if (S) resizeScene();});
document.addEventListener('visibilitychange', () => {if (document.hidden && S && S.mode !== 'ending') {save(); if (running && $('app') && !$('app').classList.contains('hide')) scrMenu();}});

/* ---------- интро ---------- */
function drawTitle() {const c = $('tcv'); c.width = innerWidth; c.height = innerHeight; c.getContext('2d').drawImage(Gfx.splash(innerWidth, innerHeight, true), 0, 0);}
function endIntro() {const i = $('intro'); if (!i || i.dataset.done) return; i.dataset.done = 1; i.style.opacity = 0; setTimeout(() => i.remove(), 650); Snd.resume(); drawTitle(); showTitle();}
Snd.setVol(setg.music, setg.sfx); tickT = setInterval(tick, 250); requestAnimationFrame(frame); addEventListener('resize', () => {if (!$('title').classList.contains('hide')) drawTitle();});
$('intro').addEventListener('pointerdown', e => {if (e.target.closest('a')) return; endIntro();}); setTimeout(endIntro, 4600);
