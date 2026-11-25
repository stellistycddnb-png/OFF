/* ======== ПАТЧ 4: дом, мебель, одежда, транспорт, HR ======== */
const FURN = {
  bed: {n: '🛏 Кровать', t: [['Раскладушка', 0], ['Кровать', 1200], ['Ортопедическая', 3500], ['Королевская', 9000]]},
  sofa: {n: '🛋 Диван', t: [['Нет', 0], ['Диван б/у', 900], ['Кожаный диван', 3500], ['Угловой диван', 7000]]},
  tv: {n: '📺 Телевизор', t: [['Нет', 0], ['Старый ТВ', 700], ['Smart-TV', 2800], ['OLED + саундбар', 8000]]},
  lamp: {n: '💡 Свет', t: [['Лампочка', 0], ['Лампа', 150], ['Торшер', 600], ['Неон «MAKE MONEY»', 1800]]},
  plant: {n: '🪴 Растения', t: [['Нет', 0], ['Кактус', 80], ['Фикус', 300], ['Мини-сад', 900]]},
  rug: {n: '🧶 Ковёр', t: [['Нет', 0], ['Коврик', 200], ['Ковёр', 900], ['Персидский ковёр', 3500]]},
  kit: {n: '🍳 Кухня', t: [['Чайник', 0], ['Плитка и стол', 400], ['Нормальная кухня', 2500], ['Кухня-остров', 8000]]}
};
const WARD = {
  top: {n: '👔 Одежда', t: [['Спортивки и худи', 0], ['Рубашка', 600], ['Пиджак', 2200], ['Костюм на заказ', 7000]]},
  shoes: {n: '👟 Обувь', t: [['Кроссовки', 0], ['Туфли', 900], ['Брендовые туфли', 3500]]},
  acc: {n: '⌚ Аксессуары', t: [['Нет', 0], ['Часы', 1500], ['Золотая цепь', 5000], ['Швейцарские часы', 12000]]}
};
const CARS = [
  {n: 'Пешком', ic: '🚶', c: 0, up: 0, en: -6, d: 'Бесплатно, но устаёте: −6 энергии.'},
  {n: 'Велосипед', ic: '🚲', c: 600, up: 0, en: -3, d: '−3 энергии, бесплатно.'},
  {n: 'Электросамокат', ic: '🛴', c: 1800, up: 5, en: -2, d: '−2 энергии, зарядка ₴5/день.'},
  {n: 'Старая «Лада»', ic: '🚗', c: 5000, up: 60, en: 0, d: 'Без штрафов, но иногда ломается. ₴60/день.'},
  {n: 'Подержанный Golf', ic: '🚙', c: 14000, up: 90, en: 3, d: '+3 энергии, +1 к шарму. ₴90/день.'},
  {n: 'BMW на кредит', ic: '🏎', c: 30000, up: 200, en: 5, d: '+5 энергии, +2 к шарму. ₴200/день.'}
];
const HRS = [
  {id: 'alina', n: 'Алина', role: 'HR-менеджер', ic: '👩‍💼', d: 'Строгая и вежливая. Ценит стиль, аккуратность и внимание. Лесть и давление не любит.', base: {compliment: .35, joke: .2, coffee: .4, gift: .5, honest: .3}, ref: ['«Алина мягко улыбается: «Спасибо, но давайте оставим это для перерыва».»', '«Алина: «У меня сегодня много резюме. Не сейчас».»', '«Алина вздыхает: «Мне это неловко».»'], ok: ['«Алина смеётся: «Ладно, это было мило».»', '«Алина: «Вы неожиданно приятный человек».»', '«Алина слегка краснеет и отводит взгляд.»']},
  {id: 'vika', n: 'Вика', role: 'Рекрутер', ic: '👱‍♀️', d: 'Весёлая и язвительная. Любит юмор и живое общение, но «просто так» не ведётся.', base: {compliment: .25, joke: .55, coffee: .4, gift: .35, honest: .3}, ref: ['«Вика закатывает глаза: «Это всё, на что ты способен?»»', '«Вика: «Ха. Слабовато. Попробуй ещё».»', '«Вика: «Мне нужно закрыть три вакансии. Давай потом».»'], ok: ['«Вика хохочет: «Ладно, засчитано!»»', '«Вика: «С тобой неожиданно весело».»', '«Вика подмигивает: «Продолжай в том же духе».»']},
  {id: 'yulia', n: 'Юлия', role: 'Комплаенс-офицер', ic: '👩‍⚖️', d: 'Холодная и принципиальная. Ценит честность и порядочность. Подарки считает конфликтом интересов.', base: {compliment: .12, joke: .18, coffee: .2, gift: .05, honest: .6}, ref: ['«Юлия: «Это неуместно на рабочем месте».»', '«Юлия не поднимает глаз: «Я на работе».»', '«Юлия: «Прошу вас прекратить».»'], ok: ['«Юлия на секунду теряется: «Это… неожиданно приятно».»', '«Юлия слегка улыбается: «Хорошо. Немного».»', '«Юлия: «Вы честный человек. Это редкость здесь».»']}
];
const ACTS = {
  compliment: {n: '💬 Комплимент', cost: 0, aff: [3, 7], ann: 12},
  joke: {n: '😄 Шутка', cost: 0, aff: [3, 7], ann: 10},
  coffee: {n: '☕ Позвать на кофе', cost: 80, aff: [5, 9], ann: 12},
  gift: {n: '🎁 Подарок', cost: 300, aff: [7, 12], ann: 15},
  honest: {n: '🤝 Честный разговор', cost: 0, aff: [5, 9], ann: 10},
  date: {n: '🌹 Свидание', cost: 600, aff: [12, 18], ann: 20, min: 55},
  home: {n: '🏠 Пригласить к себе', cost: 0, aff: [10, 15], ann: 25, min: 75}
};
const H = () => {if (!S.home) S.home = {f: {}, w: {}, car: 0, hr: {}, gf: null, eve: 0, log: ''}; HRS.forEach(g => {if (!S.home.hr[g.id]) S.home.hr[g.id] = {aff: 0, ann: 0, dates: 0, blocked: false, today: 0, last: 0};}); return S.home;};
const tier = (grp, k) => (H()[grp][k] || 0);
const comfortScore = () => Object.keys(FURN).reduce((a, k) => a + tier('f', k), 0);
const styleScore = () => Object.keys(WARD).reduce((a, k) => a + tier('w', k), 0);
const charm = () => styleScore() + (H().car >= 4 ? H().car - 3 : 0);
const carUp = () => CARS[H().car].up;
const homeEn = () => Math.floor(comfortScore() / 4) + CARS[H().car].en + (typeof skillEn === 'function' ? skillEn() : 0) + (S.nextEn || 0);
const homeCons = () => Math.floor(comfortScore() / 6) + (H().gf ? 3 : 0);
const hrDaily = () => {const h = H(); HRS.forEach(g => {const r = h.hr[g.id]; if (r.last < S.day && r.aff > 0) r.aff = Math.max(0, r.aff - (h.gf === g.id ? 4 : 2)); r.today = 0; r.ann = Math.max(0, r.ann - 20); if (h.gf === g.id && r.aff < 60) {h.gf = null; toast('💔 Отношения с ' + g.n + ' закончились: вы пропали.', 'bad');}}); h.eve = h.eve; if (h.car === 3 && Math.random() < .15) {S.money -= 400; toast('🚗 «Лада» сломалась. Ремонт ₴400.', 'bad');}};
const stageName = a => a < 20 ? 'Едва знакомы' : a < 40 ? 'Приятели' : a < 60 ? 'Симпатия' : a < 80 ? 'Можно на свидание' : 'Очень близки';
const homeBack = () => {const f = H().from; if (f === 'summary') daySummaryRerender(); else if (f === 'idle') {hideScr(); running = true; T0 = performance.now();} else scrTeam();};

/* --- рисование дома --- */
function drawHome(cv, t) {
  const g = cv.getContext('2d'), w = cv.width, h = cv.height, hm = H(), s = h / 200; g.clearRect(0, 0, w, h);
  const wl = g.createLinearGradient(0, 0, 0, h * .66); wl.addColorStop(0, '#2d2350'); wl.addColorStop(1, '#3a2c66'); g.fillStyle = wl; g.fillRect(0, 0, w, h * .66);
  const fl = g.createLinearGradient(0, h * .66, 0, h); fl.addColorStop(0, '#5a4030'); fl.addColorStop(1, '#3a281c'); g.fillStyle = fl; g.fillRect(0, h * .66, w, h * .34);
  g.fillStyle = 'rgba(0,0,0,.25)'; g.fillRect(0, h * .66, w, 3 * s);
  // окно с улицей и транспортом
  const wx = w * .05, wy = h * .1, ww = w * .24, wh = h * .38; g.fillStyle = '#08122a'; g.fillRect(wx, wy, ww, wh); for (let i = 0; i < 5; i++) {g.fillStyle = '#151f3f'; g.fillRect(wx + i * ww * .2, wy + wh * (.4 + (i % 3) * .1), ww * .16, wh * .6);} g.fillStyle = '#ffe9a0'; g.beginPath(); g.arc(wx + ww * .8, wy + wh * .2, 6 * s, 0, 7); g.fill();
  for (let i = 0; i < 6; i++) {g.fillStyle = 'rgba(255,255,255,' + (.4 + Math.sin(t * 2 + i) * .3) + ')'; g.fillRect(wx + (i * 37 % 100) / 100 * ww, wy + (i * 53 % 40) / 100 * wh, 1.5 * s, 1.5 * s);}
  g.font = 22 * s + 'px sans-serif'; g.textAlign = 'center'; g.fillStyle = '#fff'; g.fillText(CARS[hm.car].ic, wx + ww * .5, wy + wh * .95);
  g.strokeStyle = '#8a7a50'; g.lineWidth = 3 * s; g.strokeRect(wx, wy, ww, wh); g.beginPath(); g.moveTo(wx + ww / 2, wy); g.lineTo(wx + ww / 2, wy + wh); g.stroke();
  // телевизор
  const tv = tier('f', 'tv'); if (tv) {const tw = [0, 38, 54, 70][tv] * s, th = tw * .56, tx = w * .4, ty = h * .18; g.fillStyle = '#111'; g.fillRect(tx, ty, tw, th); g.fillStyle = 'hsl(' + (t * 40 % 360) + ',70%,45%)'; g.fillRect(tx + 2, ty + 2, tw - 4, th - 4); if (tv === 3) {g.fillStyle = '#222'; g.fillRect(tx, ty + th + 2 * s, tw, 4 * s);}}
  // свет
  const lp = tier('f', 'lamp'); if (lp === 3) {g.save(); g.shadowColor = '#ff3ac8'; g.shadowBlur = 14 * s; g.fillStyle = '#ff7adf'; g.font = '900 ' + 12 * s + 'px Impact,sans-serif'; g.textAlign = 'center'; g.fillText('MAKE MONEY', w * .53, h * .12); g.restore();} else if (lp) {g.font = 20 * s + 'px sans-serif'; g.textAlign = 'center'; g.fillText(lp === 1 ? '💡' : '🪔', w * .5, h * .5);}
  // ковёр
  const rg = tier('f', 'rug'); if (rg) {g.fillStyle = ['', '#7a3a3a', '#3a5a7a', '#8a6a2a'][rg]; g.beginPath(); g.ellipse(w * .42, h * .86, w * (.1 + rg * .03), h * .07, 0, 0, 7); g.fill(); if (rg === 3) {g.strokeStyle = '#ffd23a'; g.lineWidth = 1.5 * s; g.stroke();}}
  // диван
  const sf = tier('f', 'sofa'); if (sf) {const cols = ['', '#6a6a7a', '#7a4a2a', '#9a2a3a'][sf]; g.fillStyle = cols; g.fillRect(w * .05, h * .62, w * (.2 + (sf === 3 ? .08 : 0)), h * .12); g.fillRect(w * .05, h * .54, w * .2, h * .1); if (sf === 3) g.fillRect(w * .25, h * .54, w * .08, h * .2);}
  // кровать
  const bd = tier('f', 'bed'), bx = w * .62, by = h * .62; if (bd === 0) {g.fillStyle = '#6a6a6a'; g.fillRect(bx, by + h * .07, w * .3, h * .04); g.fillStyle = '#aaa'; g.fillRect(bx, by + h * .04, w * .3, h * .03);} else {g.fillStyle = ['', '#6a4a2a', '#e8e0f0', '#4a2a7a'][bd]; g.fillRect(bx, by, w * .33, h * .14); g.fillStyle = bd === 3 ? '#ffd23a' : '#4a3020'; g.fillRect(bx - 4 * s, by - h * .1, 6 * s, h * .24); g.fillStyle = '#f0f0ff'; g.fillRect(bx + 6 * s, by + 4 * s, w * .08, h * .05); if (bd === 3) {g.fillStyle = 'rgba(255,210,58,.5)'; g.fillRect(bx - 4 * s, by - h * .1, w * .33, 4 * s);}}
  // кухня
  const kt = tier('f', 'kit'); g.fillStyle = ['#3a3a4a', '#5a4a3a', '#6a6a7a', '#2a2a3a'][kt]; g.fillRect(w * .83, h * .3, w * .16, h * (.12 + kt * .06)); if (kt >= 2) {g.font = 18 * s + 'px sans-serif'; g.fillText('🧊', w * .91, h * .5);} if (kt === 3) {g.fillStyle = '#c0b090'; g.fillRect(w * .66, h * .8, w * .3, h * .08);}
  // растения
  const pl = tier('f', 'plant'); if (pl) {g.font = (14 + pl * 4) * s + 'px sans-serif'; g.textAlign = 'center'; g.fillText(pl === 1 ? '🌵' : pl === 2 ? '🪴' : '🌴', w * .34, h * .6); if (pl === 3) g.fillText('🌿', w * .57, h * .6);}
  // питомцы
  (S.pets || []).forEach((id, i) => {g.font = 18 * s + 'px sans-serif'; g.textAlign = 'center'; g.fillText({fish: '🐟', ham: '🐹', cat: '🐈', dog: '🐕'}[id] || '🐾', w * (.5 + i * .06), h * .8 + Math.sin(t * 3 + i) * 2);});
  // герой
  const px = w * .36, py = h * .66, top = tier('w', 'top'), sh = tier('w', 'shoes'), ac = tier('w', 'acc');
  g.fillStyle = ['#6a6a7a', '#e8e8f0', '#1a2a4a', '#111'][top]; g.fillRect(px - 9 * s, py - 26 * s, 18 * s, 26 * s); if (top === 3) {g.fillStyle = '#ffd23a'; g.fillRect(px - 1 * s, py - 24 * s, 2 * s, 12 * s);} if (top === 2) {g.fillStyle = '#f0f0f0'; g.fillRect(px - 3 * s, py - 26 * s, 6 * s, 10 * s);}
  g.fillStyle = '#e0b090'; g.beginPath(); g.arc(px, py - 33 * s, 8 * s, 0, 7); g.fill(); g.fillStyle = '#3a2a1a'; g.fillRect(px - 8 * s, py - 42 * s, 16 * s, 6 * s);
  g.fillStyle = ['#e8e8e8', '#4a3020', '#c0a040'][sh]; g.fillRect(px - 9 * s, py, 8 * s, 4 * s); g.fillRect(px + 1 * s, py, 8 * s, 4 * s);
  if (ac >= 1) {g.fillStyle = ac === 3 ? '#9ad0ff' : '#ffd23a'; g.fillRect(px + 9 * s, py - 14 * s, 4 * s, 4 * s);} if (ac === 2) {g.strokeStyle = '#ffd23a'; g.lineWidth = 2 * s; g.beginPath(); g.arc(px, py - 24 * s, 6 * s, 0, 3.14); g.stroke();}
  if (hm.gf) {const gg = HRS.find(x => x.id === hm.gf); g.font = 26 * s + 'px sans-serif'; g.textAlign = 'center'; g.fillText(gg.ic, px + 26 * s, py - 6 * s); g.font = 12 * s + 'px sans-serif'; g.fillText('❤', px + 13 * s, py - 38 * s + Math.sin(t * 3) * 2);}
}
function homeStatus() {
  const h = H(), L = []; if (S.pets.length) L.push(pick(S.pets.map(id => PETS.find(x => x.id === id).ic + ' ' + {fish: 'Рыбки плавают в аквариуме', ham: 'Хомяк крутит колесо', cat: tier('f', 'sofa') ? 'Кот спит на диване' : 'Кот спит на вашей куртке', dog: 'Пёс встречает у двери'}[id])));
  if (h.gf) L.push('❤ ' + HRS.find(x => x.id === h.gf).n + ' ' + pick(['ждёт вас с ужином', 'смотрит сериал', 'пишет вам сообщения']));
  if (tier('f', 'tv')) L.push('📺 Телевизор показывает сериал'); L.push(pick(['🌃 За окном горят огни города', '🔌 Холодильник тихо гудит', '🕯 В квартире тихо']));
  return L.slice(0, 3).join('<br>');
}
function scrHome(from) {
  const h = H(); if (from) h.from = from; const tm = setInterval(() => {const cv = document.getElementById('hc'); if (!cv) return clearInterval(tm); drawHome(cv, performance.now() / 1000);}, 120);
  showScr('<div class="box"><h2>🏠 Дом</h2><canvas id="hc" width="720" height="400" style="width:100%;border-radius:12px;border:1.5px solid #4a3a82"></canvas><p style="margin:6px 0">' + homeStatus() + '</p><p style="color:#9a8fb8;font-size:12.5px">Уют: ' + comfortScore() + '/21 · Стиль: ' + styleScore() + '/9 · Транспорт: ' + CARS[h.car].ic + ' ' + CARS[h.car].n + (h.gf ? ' · ❤ ' + HRS.find(x => x.id === h.gf).n : '') + '</p>' + (h.log ? '<p class="help">' + h.log + '</p>' : '') + '<div class="opts"><button class="btn" data-a="h_shop" data-v="furn">🛋 Мебель</button><button class="btn" data-a="h_shop" data-v="ward">👔 Гардероб</button><button class="btn" data-a="h_shop" data-v="car">🚗 Транспорт</button><button class="btn" data-a="h_eve">' + (h.eve === S.day ? '🌙 Вечер проведён' : '🌙 Провести вечер') + '</button>' + (h.from === 'summary' ? '<button class="btn" data-a="lifeopen">🐾 Быт и питомцы</button>' : '') + '<button class="btn" data-a="h_hr">💘 HR-отдел</button></div><div class="row" style="margin-top:8px"><button class="btn pri" data-a="h_back">← Назад</button></div></div>', true);
}
function scrShop(kind) {
  const h = H(); let html = '<h2>' + {furn: '🛋 Мебель', ward: '👔 Гардероб', car: '🚗 Транспорт'}[kind] + '</h2><p>Деньги: <b>' + fmt(S.money) + '</b></p>';
  if (kind === 'car') {html += CARS.map((c, i) => '<div class="tech" style="' + (h.car === i ? 'border-color:#ffd23a' : '') + '"><div>' + c.ic + ' <b>' + c.n + '</b><br><small>' + c.d + '</small></div><button class="btn sm' + (h.car === i ? ' pri' : '') + '" data-a="h_car" data-v="' + i + '"' + (h.car === i || S.money < Math.max(0, c.c - Math.round(CARS[h.car].c * .4)) ? ' disabled' : '') + '>' + (h.car === i ? '✔' : fmt(Math.max(0, c.c - Math.round(CARS[h.car].c * .4)))) + '</button></div>').join('') + '<p style="color:#9a8fb8;font-size:12px">Старый транспорт принимают за 40% цены.</p>';}
  else {const grp = kind === 'furn' ? 'f' : 'w', cat = kind === 'furn' ? FURN : WARD; Object.keys(cat).forEach(k => {const cur = tier(grp, k); html += '<h3>' + cat[k].n + '</h3>' + cat[k].t.map((it, i) => '<div class="tech" style="' + (cur === i ? 'border-color:#ffd23a' : '') + '"><div><b>' + it[0] + '</b></div><button class="btn sm' + (cur === i ? ' pri' : '') + '" data-a="h_buy" data-v="' + kind + ':' + k + ':' + i + '"' + (i <= cur || S.money < it[1] - Math.round(cat[k].t[cur][1] * .5) ? ' disabled' : '') + '>' + (i === cur ? '✔' : i < cur ? '—' : fmt(it[1] - Math.round(cat[k].t[cur][1] * .5))) + '</button></div>').join('');}); html += '<p style="color:#9a8fb8;font-size:12px">При улучшении старую вещь принимают за 50% цены.</p>';}
  showScr('<div class="box">' + html + '<div class="row" style="margin-top:8px"><button class="btn pri" data-a="h_home">← В дом</button></div></div>', true);
}
const HOME_EVENTS = [
  {t: 'Шумные соседи', d: 'Сверху играет музыка. Время позднее.', ch: [{a: 'Постучать в потолок', fx: {energy: -3}}, {a: 'Надеть наушники', fx: {energy: 3}}, {a: 'Подняться и поговорить', fx: {cons: 1, energy: -2}}]},
  {t: 'Звонит мама', d: '«Сынок, откуда у тебя деньги? Чем ты занимаешься?»', ch: [{a: 'Соврать: «Всё честно»', fx: {cons: -3}}, {a: 'Сказать часть правды', fx: {cons: 2, energy: -4}}, {a: 'Не брать трубку', fx: {cons: -1}}]},
  {t: 'Отключили свет', d: 'В доме темно. Остались телефон и свеча.', ch: [{a: 'Посидеть при свече', fx: {energy: 5, cons: 1}}, {a: 'Ругаться с ЖЭКом', fx: {energy: -4}}]},
  {t: 'Друг из прошлой жизни', d: '«Слышал, ты работаешь в странном месте. Всё нормально?»', ch: [{a: 'Рассказать правду', fx: {cons: 4, energy: -3}}, {a: 'Отшутиться', fx: {cons: -1}}]},
  {t: 'Питомец требует внимания', req: () => S.pets.length > 0, d: 'Питомец смотрит на вас, как на самого главного.', ch: [{a: 'Поиграть', fx: {cons: 2, energy: -2}}, {a: 'Покормить и спать', fx: {cons: 1, energy: 3}}]},
  {t: '«Лада» не заводится', req: () => H().car === 3, d: 'Утром машина кашляет и молчит.', ch: [{a: 'Вызвать эвакуатор (₴400)', fx: {money: -400}}, {a: 'Чинить самому', fx: {energy: -8}}]},
  {t: 'Штраф за парковку', req: () => H().car >= 4, d: 'Под дворником записка о штрафе.', ch: [{a: 'Заплатить ₴200', fx: {money: -200}}, {a: 'Выбросить', fx: {heat: 1, cons: -1}}]},
  {t: 'Уютный вечер', req: () => comfortScore() >= 6, d: 'Дома тепло, чисто и тихо.', ch: [{a: 'Посмотреть кино', fx: {energy: 6, cons: 1}}, {a: 'Прибраться', fx: {cons: 2, energy: -2}}]},
  {t: 'Ужин вдвоём', req: () => !!H().gf, d: 'Вторая половина предлагает поужинать вместе.', ch: [{a: 'Приготовить самому', fx: {energy: -3, cons: 3}}, {a: 'Заказать доставку (₴300)', fx: {money: -300, cons: 2}}]},
  {t: 'Вопрос о работе', req: () => !!H().gf, d: '«Чем ты на самом деле занимаешься на работе?»', ch: [{a: 'Сказать правду', fx: {cons: 4, energy: -3}}, {a: 'Соврать', fx: {cons: -3}}]}
];
function homeFx(fx) {['cons', 'heat', 'boss', 'energy'].forEach(q => {if (fx[q]) S[q] = clamp(S[q] + fx[q], 0, 100);}); if (fx.money) S.money += fx.money;}
function scrEvening() {
  const h = H(); if (h.eve === S.day) {h.log = 'Вечер уже прошёл. Завтра будет новый.'; return scrHome();}
  const pool = HOME_EVENTS.filter(e => !e.req || e.req()), e = pick(pool); h.curEv = HOME_EVENTS.indexOf(e);
  showScr('<div class="box"><h2>🌙 ' + e.t + '</h2><p>' + e.d + '</p><div class="col">' + e.ch.map((c, k) => '<button class="btn' + (k ? '' : ' pri') + '" data-a="h_ev" data-v="' + k + '">' + c.a + '</button>').join('') + '</div></div>', true);
}
function scrHR(id) {
  const h = H(); if (!id) {showScr('<div class="box"><h2>💘 HR-отдел</h2><p style="color:#9a8fb8">Девушки не соглашаются просто так: навязчивость приведёт к жалобе. Не больше двух попыток в день на каждую.</p>' + HRS.map(g => {const r = h.hr[g.id]; return '<div class="tech"><div>' + g.ic + ' <b>' + g.n + '</b> · ' + g.role + '<br><small>' + (r.blocked ? '🚫 Подала жалобу — общаться больше нельзя' : h.gf === g.id ? '❤ Вы вместе' : stageName(r.aff)) + '</small></div><button class="btn sm" data-a="h_girl" data-v="' + g.id + '"' + (r.blocked ? ' disabled' : '') + '>Подойти</button></div>';}).join('') + '<div class="row" style="margin-top:8px"><button class="btn pri" data-a="h_hrback">← Назад</button></div></div>', true); return;}
  const g = HRS.find(x => x.id === id), r = h.hr[id], left = 3 - r.today;
  showScr('<div class="box"><div class="av big">' + g.ic + '</div><h2 style="text-align:center">' + g.n + '</h2><p style="text-align:center;color:#9a8fb8">' + g.role + '</p><p>' + g.d + '</p><p>Отношение: <b>' + stageName(r.aff) + '</b></p><div class="bar ' + (r.aff > 60 ? 'grn' : 'yel') + '"><i style="width:' + r.aff + '%"></i></div><p style="color:' + (r.ann > 35 ? '#ff5a6a' : '#9a8fb8') + '">' + (r.ann > 35 ? '😠 Она явно раздражена' : r.ann > 15 ? '😐 Немного напряжена' : '🙂 Спокойна') + ' · попыток сегодня: ' + left + '</p>' + (h.log2 ? '<p class="help">' + h.log2 + '</p>' : '') + '<div class="opts">' + Object.keys(ACTS).filter(k => k !== 'home' || comfortScore() >= 3).map(k => {const a = ACTS[k]; const dis = left <= 0 || S.money < a.cost || (a.min && r.aff < a.min) || (k === 'date' && styleScore() < 1); return '<button class="opt" data-a="h_act" data-v="' + id + ':' + k + '"' + (dis ? ' disabled' : '') + '>' + a.n + (a.cost ? ' <small>' + fmt(a.cost) + '</small>' : '') + '</button>';}).join('') + '</div><div class="row" style="margin-top:8px"><button class="btn pri" data-a="h_hr">← К списку</button></div></div>', true);
}
function hrAct(id, k) {
  const h = H(), g = HRS.find(x => x.id === id), r = h.hr[id], a = ACTS[k]; if (r.today >= 3 || r.blocked) return;
  S.money -= a.cost; S.energy = clamp(S.energy - 3, 0, 100); r.today++; r.last = S.day; let p = (g.base[k] || .35) + .12 + styleScore() * .03 + (H().car >= 4 ? .03 : 0) + r.aff / 250 - r.ann / 200; if (k === 'date') p = .35 + styleScore() * .03 + CARS[h.car].en * .01 + r.aff / 300 - r.ann / 200; if (k === 'home') p = .3 + comfortScore() * .015 + r.aff / 300 - r.ann / 200;
  if (id === 'yulia') {if (k === 'honest') p = S.cons >= 60 ? .65 : .1; if (k === 'gift') p = .03; if (S.cons < 40) p -= .1;} if (id === 'alina' && (k === 'coffee' || k === 'gift')) p += .1; if (id === 'vika' && k === 'joke') p += .1; if (id === 'vika' && k === 'compliment') p -= .05;
  p = clamp(p, .04, .8); const okk = Math.random() < p; let msg;
  if (okk) {r.aff = clamp(r.aff + Math.round(ri(a.aff[0], a.aff[1]) * 1.6), 0, 100); msg = pick(g.ok); Snd.sfx('good'); if (k === 'date') r.dates++; if (k === 'home' && r.aff >= 70 && r.dates >= 1) {h.gf = id; msg = '❤ ' + g.n + ' согласна быть с вами. Теперь вы пара.'; S.cons = clamp(S.cons + 4, 0, 100); toast('❤ Вы теперь с ' + g.n, 'ok'); Snd.sfx('good');}}
  else {r.ann = clamp(r.ann + Math.round(a.ann * .7) + (r.today >= 3 ? 8 : 0), 0, 100); if (k === 'date' || k === 'home') r.aff = Math.max(0, r.aff - 5); msg = pick(g.ref); Snd.sfx('bad'); if (id === 'yulia' && k === 'gift') {r.ann += 20; msg = '«Юлия: «Это конфликт интересов. Заберите».»';}}
  if (r.ann >= 75 && !h.gf) {r.blocked = true; S.boss = clamp(S.boss - 12, 0, 100); S.cons = clamp(S.cons - 1, 0, 100); msg += ' 🚫 Она подала жалобу в комплаенс. Босс недоволен.'; toast('🚫 Жалоба от ' + g.n + '. Босс −12', 'bad');}
  h.log2 = msg; renderHud(); checkAch && checkAch(); if (r.blocked) scrHR(); else scrHR(id);
}
document.addEventListener('click', e => {
  const b = e.target.closest('[data-a^="h_"]'); if (!b || b.disabled) return; const a = b.dataset.a, v = b.dataset.v, h = H(); Snd.sfx && Snd.sfx('click'); if ((a === 'h_home' || a === 'h_hr') && (v === 'team' || v === 'summary')) h.from = v;
  if (a === 'h_home') scrHome(); else if (a === 'h_back') homeBack(); else if (a === 'h_shop') scrShop(v); else if (a === 'h_eve') scrEvening();
  else if (a === 'h_hr') scrHR(); else if (a === 'h_hrback') scrHome(); else if (a === 'h_girl') scrHR(v);
  else if (a === 'h_car') {const i = +v, price = Math.max(0, CARS[i].c - Math.round(CARS[h.car].c * .4)); if (S.money >= price) {S.money -= price; h.car = i; Snd.sfx('cash'); toast(CARS[i].ic + ' ' + CARS[i].n + ' — ваш транспорт!', 'ok'); checkAch && checkAch();} scrShop('car');}
  else if (a === 'h_buy') {const [kind, k, i] = v.split(':'), grp = kind === 'furn' ? 'f' : 'w', cat = kind === 'furn' ? FURN : WARD, cur = tier(grp, k), price = cat[k].t[+i][1] - Math.round(cat[k].t[cur][1] * .5); if (+i > cur && S.money >= price) {S.money -= price; h[grp][k] = +i; Snd.sfx('cash'); toast('Куплено: ' + cat[k].t[+i][0], 'ok'); checkAch && checkAch();} scrShop(kind);}
  else if (a === 'h_ev') {const e2 = HOME_EVENTS[h.curEv], c = e2.ch[+v]; homeFx(c.fx); h.eve = S.day; h.log = '🌙 ' + e2.t + ': ' + c.a + '.'; renderHud(); scrHome();}
  else if (a === 'h_act') {const [id, k] = v.split(':'); hrAct(id, k);}
});
ACH.push({id: 'home1', n: 'Свой уголок', d: 'Купить мебель', c: () => comfortScore() >= 3}, {id: 'home2', n: 'Дом, милый дом', d: 'Уют 12 и выше', c: () => comfortScore() >= 12}, {id: 'suit', n: 'Встречают по одёжке', d: 'Купить костюм на заказ', c: () => tier('w', 'top') >= 3}, {id: 'car', n: 'За рулём', d: 'Купить Golf или лучше', c: () => H().car >= 4}, {id: 'love', n: 'Не всё продаётся', d: 'Начать отношения с HR', c: () => !!H().gf});
