/* ======== build 1.7.0 · «ДОМ 3.0»: дела по дому, вечеринки, новая мебель, просторная раскладка ======== */
FURN.wall = {n: '🖼 Стены', t: [['Голые стены', 0], ['Постеры', 250], ['Картины', 1100], ['Галерея', 3200]]};
FURN.sound = {n: '🎧 Музыка', t: [['Тишина', 0], ['Колонка', 500], ['Hi-Fi', 2200], ['Домашний кинотеатр', 6000]]};
FURN.smart = {n: '🤖 Умный дом', t: [['Нет', 0], ['Умная лампа', 400], ['Голосовой помощник', 1800], ['Умный дом + робот-пылесос', 5500]]};
/* --- рисование новых предметов поверх плана --- */
const _hd22 = hDraw;
hDraw = function (cv) {
  _hd22(cv); const g = cv.getContext('2d'), tf = k => tier('f', k), t = HM.t, lvl = hLv(), dark = typeof hDark === 'function' && hDark() !== 0; g.save(); if (dark) g.globalAlpha = .72;
  const w = tf('wall'), snd = tf('sound'), sm = tf('smart');
  const frame = (x, y, ww, hh, c) => {g.fillStyle = '#2a1c10'; g.fillRect(x - 3, y - 3, ww + 6, hh + 6); g.fillStyle = c; g.fillRect(x, y, ww, hh); g.fillStyle = 'rgba(255,255,255,.18)'; g.fillRect(x, y, ww, 3);};
  if (w >= 1) {frame(186, 16, 26, 34, '#e0526a'); g.fillStyle = '#ffd23a'; g.beginPath(); g.arc(199, 28, 6, 0, 7); g.fill(); g.fillStyle = '#fff'; g.font = '700 7px sans-serif'; g.textAlign = 'center'; g.fillText('MAKE', 199, 42);}
  if (w >= 2 && lvl >= 2) {frame(290, 16, 34, 24, '#3a78b8'); g.fillStyle = '#9ad6ff'; g.fillRect(292, 30, 30, 8); g.fillStyle = '#ffd98a'; g.beginPath(); g.arc(310, 24, 4, 0, 7); g.fill(); frame(466, 16, 30, 40, '#5a9a5a'); g.fillStyle = '#d8f0b8'; g.beginPath(); g.arc(481, 34, 8, 0, 7); g.fill();}
  if (w >= 3 && lvl >= 2) {[[420, 12, 'sunset'], [440, 12, 'moon'], [500, 20, 'wave']].forEach(([x, y, k], i) => {frame(x + 60, 70 + i * 0, 18, 24, ['#b85a8a', '#4a4a9a', '#3a9a8a'][i]);}); }
  if (snd >= 1 && lvl >= 2) {[[272, 150], [506, 150]].forEach(([x, y], i) => {g.fillStyle = '#17121f'; g.fillRect(x - 9, y - 22, 18, 34); const pul = 1 + Math.sin(t * 7 + i) * .12 * (snd); g.strokeStyle = '#7ff3ff'; g.lineWidth = 1.5; g.beginPath(); g.arc(x, y + 2, 5 * pul, 0, 7); g.stroke(); g.beginPath(); g.arc(x, y - 12, 2.2 * pul, 0, 7); g.stroke();}); if (Math.random() < .03 * snd) hPartAdd(272 + Math.random() * 240, 130, ['♪', '♫'][Math.random() < .5 ? 0 : 1], 1.6, (Math.random() - .5) * 14, -24, 14);}
  if (snd >= 3 && lvl >= 2) {for (let i = 0; i < 12; i++) {const hh = 6 + Math.abs(Math.sin(t * 5 + i * 1.3)) * 18; g.fillStyle = 'hsl(' + (180 + i * 14) + ',90%,60%)'; g.fillRect(332 + i * 6, 190 - hh, 4, hh);}}
  if (sm >= 1) {const a = .35 + .25 * Math.sin(t * 2); g.fillStyle = 'rgba(93,255,192,' + a + ')'; g.fillRect(0, 211, 720, 2.5); g.shadowColor = '#5dffc0'; g.shadowBlur = 8; g.fillRect(0, 211, 720, 1); g.shadowBlur = 0;}
  if (sm >= 2) {g.fillStyle = '#10142a'; g.beginPath(); g.arc(236, 150, 7, 0, 7); g.fill(); g.strokeStyle = 'rgba(127,243,255,' + (.5 + .4 * Math.sin(t * 3)) + ')'; g.lineWidth = 2; g.beginPath(); g.arc(236, 150, 7, 0, 7); g.stroke();}
  if (sm >= 3) {const rx = 60 + (Math.sin(t * .35) * .5 + .5) * 600; g.font = '15px sans-serif'; g.textAlign = 'center'; g.fillText('🤖', rx, 244); g.fillStyle = 'rgba(255,255,255,.12)'; g.fillRect(rx - 14, 247, 28, 2);}
  g.restore();
};
/* --- дела по дому --- */
const CHORES = [
  {id: 'plant', ic: '🪴', t: 'Полить растения', req: () => tier('f', 'plant') > 0, rw: {energy: 3, cons: 1}},
  {id: 'pet', ic: '🐾', t: 'Покормить питомца', req: () => S.pets && S.pets.length > 0, rw: {cons: 3}},
  {id: 'cook', ic: '🍲', t: 'Приготовить ужин', req: () => tier('f', 'kit') > 0, rw: {energy: 7}},
  {id: 'clean', ic: '🧹', t: 'Убраться в комнате', rw: {cons: 2, energy: -2}},
  {id: 'mom', ic: '📞', t: 'Позвонить маме', rw: {cons: 4}},
  {id: 'trash', ic: '🗑', t: 'Вынести мусор', rw: {energy: 1, cons: 1}},
  {id: 'laundry', ic: '🧺', t: 'Постирать худи', rw: {energy: 2}},
  {id: 'sport', ic: '🏋', t: 'Сделать зарядку', rw: {energy: 6, cons: 1}},
  {id: 'bills', ic: '🧾', t: 'Оплатить квитанции', rw: {money: 120}},
  {id: 'read', ic: '📖', t: 'Почитать книжку', req: () => tier('f', 'lamp') > 0, rw: {cons: 3, energy: 2}}
];
function choresToday() {const h = H(); if (!h.chores || h.chores.day !== S.day) {const ok = CHORES.filter(c => !c.req || c.req()), pool = ok.slice().sort(() => Math.random() - .5).slice(0, 3); h.chores = {day: S.day, list: pool.map(c => ({id: c.id, done: 0}))};} return h.chores;}
function rwText(rw) {return Object.keys(rw).map(k => ({energy: '⚡', cons: '💭', money: '₴', boss: '😎'}[k] + (rw[k] > 0 ? '+' : '') + rw[k])).join(' ');}
function scrChores() {
  const ch = choresToday(), all = ch.list.every(x => x.done);
  showScr('<div class="box"><h2>📋 Дела на сегодня</h2><p>Мелочи по дому: за каждое дело небольшая награда. Выполните все три — получите бонус дня.</p><div class="col">' + ch.list.map((x, i) => {const c = CHORES.find(y => y.id === x.id); return '<button class="btn' + (x.done ? '' : ' pri') + '" data-a="chore" data-v="' + i + '"' + (x.done ? ' disabled' : '') + '>' + (x.done ? '✅ ' : c.ic + ' ') + c.t + ' <small>' + rwText(c.rw) + '</small></button>';}).join('') + '</div>' + (all ? '<p style="color:#7dffa0;font-weight:800">🌟 Идеальный день дома! Бонус получен.</p>' : '') + '<div class="row" style="margin-top:8px"><button class="btn" data-a="chore_back">← В дом</button></div></div>', true);
}
function applyFx(f) {['boss', 'heat', 'cons', 'energy'].forEach(q => {if (f[q]) S[q] = clamp(S[q] + f[q], 0, 100);}); if (f.money) S.money += f.money;}
/* --- домашняя вечеринка --- */
CORPS[1001] = {ic: '🎉', t: 'Домашняя вечеринка', d: 'Вы решили позвать коллег к себе. Кто-то принесёт торт, кто-то гитару, а кто-то — лишние вопросы.', ch: [
  {a: '🍕 Скромные посиделки (₴300)', need: 300, outs: [{p: .75, t: 'Пицца, чай и разговоры по душам. Все ушли довольными.', fx: {money: -300, boss: 3, cons: 3, energy: 4}}, {p: .25, t: 'Гости съели всё за десять минут. Но было весело.', fx: {money: -300, boss: 1, energy: 2}}]},
  {a: '🎸 Караоке-вечер (₴600)', need: 600, outs: [{p: .55, t: 'Соседи вызвали полицию, но к хору присоединились сами.', fx: {money: -600, boss: 6, heat: 3, energy: -6}}, {p: .45, t: 'Ты исполнил «Мурку» так, что стёкла дрожали. Легенда!', fx: {money: -600, boss: 8, energy: -8}}]},
  {a: '🎩 Устроить «деловой ужин» (₴900)', need: 900, outs: [{p: .6, t: 'Шеф был в восторге от канапе. «Ты умеешь принимать», — сказал он.', fx: {money: -900, boss: 12, cons: -2}}, {p: .4, t: 'Шеф ушёл после тоста, не доев. Атмосфера была слишком официальной.', fx: {money: -900, boss: 2}}]}]};
/* --- интерфейс «Дома» --- */
const _sh22 = scrHome;
scrHome = function (from) {
  _sh22(from); const box = document.querySelector('#scr .box'); if (!box) return; box.classList.add('hbox');
  const opts = box.querySelector('.opts'); if (opts && !opts.querySelector('[data-a="chores"]')) {const h = H(), done = h.chores && h.chores.day === S.day ? h.chores.list.filter(x => x.done).length : 0; opts.insertAdjacentHTML('beforeend', '<button class="btn" data-a="chores">📋 Дела (' + done + '/3)</button><button class="btn" data-a="party">🎉 Вечеринка' + (h.party === S.day ? ' ✓' : '') + '</button>');}
};
document.addEventListener('click', e => {
  const b = e.target.closest('[data-a="chores"],[data-a="chore"],[data-a="chore_back"],[data-a="party"]'); if (!b || b.disabled) return; e.preventDefault(); e.stopImmediatePropagation(); Snd.resume(); Snd.sfx('click');
  const a = b.dataset.a;
  if (a === 'chores') {HM.gen++; scrChores();}
  else if (a === 'chore_back') scrHome();
  else if (a === 'chore') {const ch = choresToday(), x = ch.list[+b.dataset.v]; if (!x || x.done) return; x.done = 1; const c = CHORES.find(y => y.id === x.id); applyFx(c.rw); Snd.sfx('coin'); toast(c.ic + ' ' + c.t + ': ' + rwText(c.rw), 'ok'); if (ch.list.every(y => y.done)) {applyFx({energy: 8, cons: 3, money: 200}); toast('🌟 Идеальный день дома! ⚡+8 💭+3 ₴+200', 'ok'); Snd.sfx('good'); try {Snd.sfx('bell');} catch (e2) {}} renderHud(); save(); scrChores();}
  else if (a === 'party') {const h = H(); if (h.party && S.day - h.party < 4) return toast('Гости ещё не отошли после прошлой вечеринки. Подождите несколько дней.', 'bad'); h.party = S.day; HM.gen++; window.__fromHome = true; S.corpDone = S.corpDone || {}; delete S.corpDone[1001]; corpShow(1001);}
}, true);
