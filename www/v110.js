/* ======== БОЛЬШАЯ ПЕРЕМЕНА · build 1.9.15 ======== */
const BUILD10 = 'build 1.9.15', TITLE10 = 'ЗОЛОТОЙ КОРПОРАТИВ', ECON = .72;
const X2 = () => {X1(); if (!S.gear) S.gear = {}; if (!S.eq) S.eq = {}; if (!S.st) S.st = []; if (!S.q) S.q = []; if (!S.cand) S.cand = null; if (S.teamAcc === undefined) S.teamAcc = 0; if (!S.desks) S.desks = 8; if (S.maxRank >= 4 && !S.staff) mkStaff(); return S;};
/* ---------- снаряжение с баффами и дебаффами ---------- */
const FXN = {talk: ['убеждение', 1], calm: ['подозрение', -1], en: ['энергия в день', 1], inc: ['доход', 100], heat: ['риск в день', 1], cons: ['совесть в день', 1], boss: ['босс в день', 1]};
const fxText = fx => Object.keys(fx).map(k => {const n = FXN[k]; if (!n) return ''; let v = fx[k]; const good = k === 'heat' ? v < 0 : v > 0; const sh = k === 'inc' ? Math.round(v * 100) + '%' : (k === 'calm' ? (v > 0 ? '−' : '+') + Math.abs(v) : (v > 0 ? '+' : '−') + Math.abs(v)); return '<span style="color:' + (good ? '#6dffb0' : '#ff8a8a') + '">' + sh + ' ' + n[0] + '</span>';}).filter(Boolean).join(' · ');
const GEAR = {
  car: {n: '🚗 Транспорт', it: [
    ['🚲', 'Электровелосипед', 2500, 10, {en: 2}], ['🚙', 'Старая «Нива»', 6000, 55, {en: 2, cons: .5}], ['🚘', 'Skoda Octavia', 16000, 110, {en: 3, calm: 1}],
    ['🚐', 'Фургон курьера', 12000, 90, {inc: .05, heat: 1}], ['🚖', 'Мерседес «бабушкин»', 40000, 240, {talk: 2, calm: 2, heat: 1}], ['🛻', 'Тонированный джип', 65000, 380, {inc: .08, boss: 1, heat: 2, cons: -.5}], ['🚍', 'Лимузин на прокат', 120000, 700, {inc: .12, talk: 3, heat: 3}]]},
  phone: {n: '📱 Телефоны', it: [
    ['📟', 'Кнопочная «Нокия»', 300, 0, {calm: -1, heat: -.5}], ['📱', 'Смартфон-середняк', 3500, 0, {talk: 1}], ['🎧', 'Планшет с гарнитурой', 6000, 0, {calm: 2, en: -1}],
    ['📲', 'Флагман «iFruit»', 15000, 0, {talk: 2, calm: 1, heat: .5}], ['☎', 'Два телефона', 9000, 0, {inc: .06, heat: 1}], ['🔐', 'Шифрофон', 25000, 0, {heat: -2, calm: 1, cons: -.3}]]},
  cloth: {n: '👔 Шмотки', it: [
    ['🧥', 'Худи с капюшоном', 400, 0, {heat: -.5, boss: -.5}, '#5a5a6a'], ['👔', 'Рубашка и галстук', 1500, 0, {boss: .5, talk: 1}, '#dfe6f0'], ['🏃', 'Спортивный костюм', 2200, 0, {en: 2, boss: -.5}, '#1a3a8a'],
    ['🤵', 'Деловой костюм', 6000, 0, {talk: 2, boss: 1}, '#22263a'], ['🥼', 'Белый халат «менеджер»', 1800, 0, {calm: 2, cons: -.3}, '#f2f2f2'], ['🧣', 'Малиновый пиджак', 4000, 0, {talk: 1, inc: .04, heat: 1}, '#a01c4a'],
    ['🧥', 'Кожанка', 3000, 0, {calm: 1, boss: -1, heat: .5}, '#1a1a1a'], ['📿', 'Золотая цепь и спортивка', 7000, 0, {inc: .06, heat: 1.5, boss: -1}, '#c8a020']]},
  furn: {n: '🛋 Мебель', it: [
    ['☕', 'Кофемашина', 1800, 0, {en: 2}], ['💆', 'Массажное кресло', 6000, 0, {en: 3, cons: .3}], ['🐠', 'Аквариум', 1500, 0, {cons: .5, calm: .5}], ['🎬', 'Домашний кинотеатр', 9000, 0, {en: 1, cons: .7}],
    ['💡', 'Рабочий уголок с лампой', 2200, 0, {talk: 1}], ['🏋', 'Гантели и турник', 1200, 0, {en: 2}], ['🗄', 'Сейф за картиной', 7000, 0, {heat: -1.5}], ['🎮', 'Игровой компьютер', 8000, 0, {cons: .5, en: -1}], ['🍸', 'Мини-бар', 3500, 0, {cons: .3, en: -1, calm: .5}]]}
};
const gid = (c, i) => c + i;
function allFx() {
  const r = {talk: 0, calm: 0, en: 0, inc: 0, heat: 0, cons: 0, boss: 0}; if (!S) return r; const add = fx => Object.keys(fx).forEach(k => {if (k in r) r[k] += fx[k];});
  if (S.gear) {Object.keys(GEAR).forEach(c => GEAR[c].it.forEach((it, i) => {const id = gid(c, i); if (!S.gear[id]) return; if (c === 'furn' || (S.eq && S.eq[c] === id)) add(it[4]);}));}
  (S.st || []).forEach(s => add(s.fx)); if (S.resp >= 25) r.boss += .5; if (S.resp >= 45) r.inc += .04; if (S.resp >= 70) {r.inc += .04; r.heat -= .5;} return r;
}
const gearUp = () => {let u = 0; if (S && S.eq && S.eq.car) {const i = +S.eq.car.slice(3); u += GEAR.car.it[i][3];} return u;};
const stText = () => (S.st || []).map(s => '<div class="tech" style="padding:6px 10px"><div>' + s.ic + ' <b>' + s.n + '</b> · ' + s.d + ' дн.<br><small>' + fxText(s.fx) + '</small></div></div>').join('');
function addSt(n, ic, d, fx) {X2(); const ex = S.st.find(s => s.n === n); if (ex) {ex.d = Math.max(ex.d, d); return;} S.st.push({n, ic, d, fx}); toast(ic + ' ' + n + ' (' + d + ' дн.)', Object.keys(fx).some(k => (k === 'heat' ? fx[k] > 0 : fx[k] < 0)) ? 'bad' : 'ok');}
function scrGear(cat) {
  X2(); cat = cat || 'car'; const G = GEAR[cat];
  const tabs = Object.keys(GEAR).map(k => '<button class="btn sm' + (k === cat ? ' pri' : '') + '" data-a="w_gear" data-v="' + k + '">' + GEAR[k].n.split(' ')[0] + '</button>').join('');
  const rows = G.it.map((it, i) => {const id = gid(cat, i), own = S.gear[id], eq = cat === 'furn' ? own : S.eq[cat] === id; return '<div class="tech" style="' + (eq ? 'border-color:#ffd23a' : '') + '"><div>' + it[0] + ' <b>' + it[1] + '</b><br><small>' + fxText(it[4]) + (it[3] ? ' · содержание ₴' + it[3] + '/день' : '') + '</small></div>' + (own ? (cat === 'furn' ? '<span>✔</span>' : '<button class="btn sm' + (eq ? ' pri' : '') + '" data-a="w_eq" data-v="' + cat + ':' + i + '">' + (eq ? 'Снять' : 'Надеть') + '</button>') : '<button class="btn sm" data-a="w_buy" data-v="' + cat + ':' + i + '"' + (S.money < it[2] ? ' disabled' : '') + '>' + fmt(it[2]) + '</button>') + '</div>';}).join('');
  showScr('<div class="box"><h2>🛍 Магазин</h2><p>Деньги: <b>' + fmt(S.money) + '</b> · вещи дают баффы и дебаффы каждый день</p><div class="row" style="margin-bottom:8px">' + tabs + '</div><h3>' + G.n + '</h3>' + rows + '<div class="row" style="margin-top:8px"><button class="btn pri" data-a="' + (S.mode === 'summary' ? 'v_hub' : 'resume') + '">← Назад</button></div></div>', true);
}
const _scrShop = scrShop; scrShop = function (k) {if (k === 'gear') return scrGear('cloth'); return _scrShop(k);};
CITY[2].acts.push({a: '🛍 Магазин техники и одежды', open: 'gear'});
/* ---------- события: баффы, дебаффы, последствия ---------- */
const BUFFS = [{n: 'Прилив сил', ic: '⚡', fx: {en: 6}}, {n: 'Бодрый голос', ic: '🎤', fx: {calm: 4}}, {n: 'Лёгкая рука', ic: '🍀', fx: {talk: 3}}, {n: 'Хорошее настроение', ic: '😊', fx: {inc: .1}}, {n: 'Спокойствие', ic: '🧘', fx: {heat: -1}}];
const DEBUFFS = [{n: 'Усталость', ic: '🥱', fx: {en: -6}}, {n: 'Нервный тик', ic: '😬', fx: {calm: -4}}, {n: 'Путаница в мыслях', ic: '🌀', fx: {talk: -3}}, {n: 'Плохая слава', ic: '📉', fx: {inc: -.1}}, {n: 'Хвост за спиной', ic: '👀', fx: {heat: 1.5}}, {n: 'Тяжёлые мысли', ic: '😞', fx: {cons: -1}}];
const CONS_BAD = [['Слух дошёл до начальства', {boss: -4}], ['К вам присматриваются снаружи', {heat: 4}], ['Вчерашний выбор вылез боком', {money: -250}], ['Кто-то стукнул боссу', {boss: -3, cons: -1}]];
const CONS_OK = [['Ваше решение заметили и оценили', {boss: 3}], ['Коллега вернул должок', {money: 250}], ['О вас тепло отозвались', {cons: 2}], ['Вам дали лёгкий день', {energy: 8}]];
const _applyEv10 = applyEvent;
applyEvent = function (v) {
  const [i, k] = String(v).split(':').map(Number), ch = EVENTS[i] && EVENTS[i].ch[k], fx = (ch && ch.fx) || {}; _applyEv10(v); if (!ch || !S || S.mode === 'ending') return; X2();
  let sc = (fx.cons || 0) * .5 + (fx.boss || 0) + (fx.energy || 0) * .4 + (fx.money || 0) / 200 - (fx.heat || 0) * 1.5, b = ch.buf;
  if (!b) {const r = Math.random(); b = sc >= 2 ? pick(BUFFS) : sc <= -2 ? pick(DEBUFFS) : r < .35 ? pick(BUFFS) : r < .7 ? pick(DEBUFFS) : null;}
  if (b) addSt(b.n, b.ic, ri(2, 3), b.fx);
  if (Math.random() < (sc <= -1 ? .45 : sc >= 2 ? .3 : .15)) {const q = sc >= 0 ? pick(CONS_OK) : pick(CONS_BAD); S.q.push({day: S.day + ri(1, 2), t: q[0], fx: q[1]});}
  renderHud();
};
const stDaily = () => {X2(); const f = {heat: 0, cons: 0}; S.st.forEach(s => {if (s.fx.heat) S.heat = clamp(S.heat + s.fx.heat, 0, 100); if (s.fx.cons) S.cons = clamp(S.cons + s.fx.cons, 0, 100); s.d--;}); S.st = S.st.filter(s => s.d > 0);};
/* ---------- логика в диалогах ---------- */
const LEG_N = ['Андрей Тапкин', 'Ольга Бульбина', 'Максим Золотов', 'Инга Пряник', 'Виталий Сыров'], LEG_D = ['отдел «Север»', 'отдел «Восток»', 'отдел сопровождения', 'отдел «Тапок»', 'служба контроля'];
const RULES = [
  {q: 'Если вы из «Золотого Бульбаша», почему номер не из вашего офиса?', ok: 'Звоню с корпоративной линии: номер выделен отделу, а не офису.', b: ['Это неважно, давайте о деле.', 'А вы проверяли?']},
  {q: 'Я не оставлял никаких заявок. Откуда у вас мои данные?', ok: 'Данные из общей базы партнёров. Вы можете потребовать их удаления.', b: ['Это закрытая информация.', 'Вы сами нам давали.']},
  {q: 'Почему вы просите решение сегодня, а не завтра?', ok: 'Условие действует до конца дня, завтра будут другие условия.', b: ['Потому что так надо.', 'Завтра всё сгорит безвозвратно.']},
  {q: 'Можно мне посоветоваться с сыном?', ok: 'Конечно, но условие будет действовать только до вечера: перезвоните мне.', b: ['Не надо ни с кем советоваться.', 'Он вас только запутает.']},
  {q: 'Пришлите документы на почту, я изучу.', ok: 'Отправлю описание условий, а согласие мы оформим после вашего прочтения.', b: ['Документов нет, всё на словах.', 'Почта не работает.']}
];
const mkLogic = c => {
  const kinds = ['legend', 'math', 'topic', 'time', 'rule'].filter(k => k !== c.lastLg); const k = pick(kinds); c.lastLg = k; let ch = [], t = '🧩 ', d = '';
  const wr = '«Стоп. Вы же говорили другое…»', okr = '«Хм, всё сходится. Продолжайте».';
  if (k === 'legend') {c.legend = c.legend || {n: pick(LEG_N), d: pick(LEG_D)}; const L = c.legend, on = LEG_N.find(x => x !== L.n), od = LEG_D.find(x => x !== L.d); t += 'Проверка легенды'; d = 'Человек уточняет: «Как вы, говорите, вас зовут и из какого вы отдела?» Вспомните, как вы представились в начале.'; ch = [{a: '«' + L.n + ', ' + L.d + '»', ok: 1}, {a: '«' + L.n + ', ' + od + '»'}, {a: '«' + on + ', ' + L.d + '»'}];}
  else if (k === 'math') {const A = pick([12000, 8000, 15000, 6000]), pc = pick([10, 20, 25]), ok = A * (100 - pc) / 100; t += 'Посчитайте'; d = 'Человек не дурак: «Сумма ' + fmt(A) + ', удержание ' + pc + '%. Сколько мне придёт?»'; ch = [{a: '«' + fmt(ok) + '»', ok: 1}, {a: '«' + fmt(A * pc / 100) + '»'}, {a: '«' + fmt(A * (100 + pc) / 100) + '»'}];}
  else if (k === 'topic') {t += 'Не сбейтесь'; d = 'Человек заметил: «Вы начали с «' + (c.pre || 'вопроса').slice(0, 55) + '…», а теперь говорите о другом. О чём вы звоните?»'; ch = [{a: '«Вернусь к началу: я звоню именно по этому вопросу».', ok: 1}, {a: '«Это неважно, главное — срочность».'}, {a: '«Давайте не отвлекаться на детали».'}];}
  else if (k === 'time') {const left = Math.max(10, 18 * 60 - S.min), f = m => Math.floor(m / 60) + ' ч ' + (m % 60) + ' мин'; t += 'Время'; d = 'Человек смотрит на часы: «Сейчас ' + fmtTime(S.min) + ', офис закрывается в 18:00. Сколько у нас времени?»'; ch = [{a: '«Около ' + f(left) + '»', ok: 1}, {a: '«Около ' + f(left + 60) + '»'}, {a: '«Около ' + f(Math.max(5, left - 45)) + '»'}];}
  else {const R = pick(RULES); t += 'Неудобный вопрос'; d = 'Человек: «' + R.q + '»'; ch = [{a: '«' + R.ok + '»', ok: 1}, {a: '«' + R.b[0] + '»'}, {a: '«' + R.b[1] + '»'}];}
  ch.sort(() => Math.random() - .5); ch.forEach(x => {x.fx = x.ok ? {pers: 20, susp: -6} : {susp: 16, pers: -4}; x.r = x.ok ? okr : wr;}); return {t, d, ch};
};
RANK_ACTS.forEach(a => a.push({id: 'logic', ic: '🧩', n: 'Довод (логика)'}));
const COACH_CALL = [['«Не торопись, дыши и слушай человека».', '«Скрипт — это основа, держись его».', '«Не повторяйся: меняй подход».'], ['«Не дави раньше времени».', '«Покажи, что помнишь прошлый разговор».', '«Ищи слабое место, а не давай эмоции».']];
const LOGIC_LN = ['«Смотрите: вы уже в системе — значит, вопрос решается сегодня».', '«Если письмо у вас на руках, то заявка уже одобрена. Логично?»', '«Раз вы не отказались сразу, значит, вопрос вам интересен».', '«Сначала факты: условие, срок, сумма. Остальное — потом».', '«Давайте по порядку: что вам неясно в пункте номер два?»'];
const _choose10 = choose;
choose = function (type) {
  const c = S && S.call; if (!c) return; X2();
  if (type === 'r:logic') {if (c.dil) return; c.rused = c.rused || {}; if (c.rused.logic >= 2) return toast('Больше двух доводов за разговор не нужно.', 'bad'); c.rused.logic = (c.rused.logic || 0) + 1; c.dil = mkLogic(c); c.logicUsed = 1; S.min += 2; Snd.sfx('key'); return render();}
  const normal = ['pressure', 'flattery', 'jargon', 'empathy'].includes(type), p0 = c.pers, f = allFx();
  _choose10(type);
  if (!normal || S.call !== c || S.mode !== 'call') return;
  const d = c.pers - p0; if (d > 0) c.pers = p0 + d * .7; c.pers += f.talk * .6; c.susp = Math.max(0, c.susp - f.calm * .6);
  c.hist = (c.hist || []).concat(type);
  {const h = c.hist, n = h.length; if (n >= 2 && h[n - 1] === h[n - 2]) {c.pers = Math.max(0, c.pers - 4); c.log.push({w: 'them', t: '«Вы повторяетесь. Скажите что-нибудь новое».'}); toast('Вы повторяетесь: −4 к убеждению', 'bad');} else if (Math.random() < .3) c.log.push({w: 'them', t: pick(LOGIC_LN)}); else if (typeof whisper === 'function' && S.rank <= 2 && Math.random() < .15) whisper(c);}
  render();
};
const _rd10 = resolveDil; resolveDil = function (k) {const c = S.call, ch = c && c.dil && c.dil.ch[k]; _rd10(k); if (ch && ch.r && S.call === c && S.mode === 'call') {c.log.push({w: 'them', t: ch.r}); render();}};
const _ans10 = answer; answer = function () {_ans10(); const c = S && S.call; if (!c) return; X2(); const f = allFx(); c.pers += f.talk * 1.5; c.legend = {n: pick(LEG_N), d: pick(LEG_D)}; c.log.push({w: 'me', t: '«Меня зовут ' + c.legend.n + ', ' + c.legend.d + '.»'});};
const _suc10 = success; success = function () {const m0 = S.money; _suc10(); X2(); const d = S.money - m0; if (d > 0) S.money = m0 + d * ECON * (1 + allFx().inc);};
/* ---------- собрания у коучей (холодка) ---------- */
const MEET_C = [{n: 'Тренер Скриптов', ic: '🧑‍🏫'}, {n: 'Леся Дожим', ic: '👩‍🏫'}];
const MEET_TIPS = ['Запоминай, как представился: проверят.', 'Не бей одним приёмом дважды подряд.', 'Считай суммы в голове, но не торопись.', 'Если человек отвлёкся, вернись к исходной теме.', 'Короткая фраза сильнее длинной.'];
function scrMeet() {
  X2(); const C = MEET_C[S.rank] || MEET_C[0], r = S.turnover / planNow(), verdict = r >= 1 ? 'План выполнен, но не расслабляйтесь.' : r >= .5 ? 'План недобрали. Разберём ошибки.' : 'Провал по плану. Будем разбирать каждый звонок.';
  showScr('<div class="box"><div class="av big">' + C.ic + '</div><h2 style="text-align:center">📣 Собрание: ' + C.n + '</h2><p>После работы коуч собрал всех: «Сегодня передано контактов: <b>' + S.closed + '</b>. ' + verdict + '»</p><div class="col"><button class="btn pri" data-a="w_meet" data-v="0">✍ Записывать <small>бафф «Разбор полётов», энергия −5</small></button><button class="btn" data-a="w_meet" data-v="1">🙋 Задать вопрос коучу <small>совет и спокойствие, энергия −3</small></button><button class="btn" data-a="w_meet" data-v="2">😤 Спорить <small>босс −3, но характер виден</small></button><button class="btn" data-a="w_meet" data-v="3">🚪 Улизнуть <small>энергия +4, босс −2</small></button></div></div>', true);
}
/* ---------- офис, персонал, соревнования ---------- */
const ROLES = [{n: 'Первая холодка', ic: '📞', m: .8, heat: .2, cons: .1, col: '#7a5ac8'}, {n: 'Вторая холодка', ic: '🔥', m: 1, heat: .3, cons: .15, col: '#c8507a'}, {n: 'Клоузер', ic: '💼', m: 1.5, heat: .5, cons: .25, col: '#2a6a9a'}, {n: '«Мусор»', ic: '🚔', m: 1.8, heat: 1, cons: .3, col: '#3a4a3a'}];
const SN = ['Андрей', 'Оксана', 'Влад', 'Марина', 'Тарас', 'Люба', 'Игорь', 'Настя', 'Богдан', 'Юля', 'Стас', 'Олеся', 'Паша', 'Вика', 'Костя', 'Ира'], SK = ['Тапок', 'Кот', 'Шило', 'Рыжий', 'Сова', 'Щука', 'Гвоздь', 'Малой'];
const SKIN = ['#e0b090', '#b98c6c', '#f0c8a8', '#d8b090', '#e0c0a0'];
const mkP = (role, skill) => {const r = role === undefined ? ri(0, 3) : role, s = skill || ri(1, 3) + (S.day > 12 ? 1 : 0); return {id: Math.random().toString(36).slice(2, 7), n: pick(SN), nick: pick(SK), role: r, skill: Math.min(5, s), loy: ri(45, 70), warns: 0, fear: 0, skin: pick(SKIN)};};
const wageOf = p => 40 + p.skill * 20 + p.role * 10;
function mkStaff() {S.staff = TEAM.filter(t => t.r < 4).map(t => ({id: 't' + t.r, n: t.n, nick: '', role: Math.min(3, t.r), skill: 3, loy: 60, warns: 0, fear: 0, skin: SKIN[t.r]}));}
const staffWage = () => (S && S.rank === 4 && S.staff ? S.staff.reduce((a, p) => a + wageOf(p), 0) : 0);
const RIV = [{n: '«Красные тапки»', ic: '🔴', b: 800}, {n: '«Бульба-Экспресс»', ic: '🚚', b: 1100}, {n: '«Золотая рыбка»', ic: '🐟', b: 1500}];
const INCID = [p => [p.n + ' опоздал и проспал созвон', p, 'loy', -4], p => [p.n + ' принёс всем пирожки', p, 'loy', 3], p => [p.n + ' поругался с соседом по столу', p, 'loy', -5], p => [p.n + ' получил благодарность от клиента', p, 'skill', 0]];
function staffDaily() {
  X2(); if (S.rank !== 4 || !S.staff) return null; const f = allFx(); let inc = 0, heat = 0, cons = 0; const lines = [];
  S.staff.slice().forEach(p => {const R = ROLES[p.role]; inc += (60 + p.skill * 40) * R.m * (.5 + p.loy / 100) * ECON * (1 + f.inc) * (1 + S.day * .015) * (p.fear ? 1.25 : 1); heat += R.heat * .35; cons += R.cons * .2; p.fear = 0; p.loy = clamp(p.loy - 3, 0, 100);
    if (p.loy < 15) {S.staff = S.staff.filter(x => x !== p); lines.push('🚪 ' + p.n + ' уволился: «Надоело».');}});
  inc = Math.round(inc); S.money += inc; S.turnover += inc / .15; S.teamAcc += inc; S.heat = clamp(S.heat + heat, 0, 100); S.cons = clamp(S.cons - cons, 0, 100);
  if (S.staff.length && Math.random() < .35) {const p = pick(S.staff), t = pick(INCID)(p); lines.push('👥 ' + t[0]); if (t[2] === 'loy') p.loy = clamp(p.loy + t[3], 0, 100);}
  S.cand = null; const out = {inc, lines};
  if (S.day % 5 === 0) {const rs = RIV.map(r => Math.round(r.b * 5 * (1 + S.day * .025) * rnd(.85, 1.15))), you = Math.round(S.teamAcc), place = 1 + rs.filter(x => x > you).length, prize = [3000, 1500, 0, -500][place - 1], bd = [6, 2, -2, -6][place - 1]; S.money += prize; S.boss = clamp(S.boss + bd, 0, 100); S.lastContest = {day: S.day, you, rs, place, prize}; S.teamAcc = 0; out.contest = S.lastContest; Snd.sfx(place < 3 ? 'cheer' : 'sad');}
  return out;
}
const _td10 = teamDaily; let sumExtra = null;
teamDaily = function () {_td10(); X2(); stDaily(); sumExtra = {lines: []}; const hf = allFx(); S.heat = clamp(S.heat + hf.heat, 0, 100); S.cons = clamp(S.cons + hf.cons, 0, 100); S.boss = clamp(S.boss + hf.boss, 0, 100); sumExtra.staff = staffDaily();};
const _ds10 = daySummary; daySummary = function () {sumExtra = null; _ds10(); X2(); const bx = document.querySelector('#scr .box'); if (!bx || S.mode !== 'summary') return; const h2 = bx.querySelector('h2'); let html = '';
  if (sumExtra && sumExtra.staff) {const o = sumExtra.staff; html += '<div class="help" style="margin:6px 0">👥 <b>Команда принесла ' + fmt(o.inc) + '</b> (зарплаты команды ' + fmt(staffWage()) + ' уже вычтены)' + (o.lines.length ? '<br>' + o.lines.join('<br>') : '') + '</div>'; if (o.contest) {const c = o.contest; html += '<div class="help" style="margin:6px 0">🏆 <b>Соревнование команд: ' + c.place + '-е место</b> · ваша ' + fmt(c.you) + ' · соперники ' + c.rs.map(fmt).join(', ') + (c.prize ? ' · ' + (c.prize > 0 ? '+' : '') + fmt(c.prize) : '') + '</div>';}}
  if (S.st.length) html += '<div style="font-size:12px;color:#9a8fb8">Эффекты: ' + S.st.map(s => s.ic + s.n).join(' · ') + '</div>';
  if (h2 && html) h2.insertAdjacentHTML('afterend', html);};
const _nd10 = nextDay; nextDay = function () {X2(); const dd = S.day; const r = _nd10(); if (S && S.day > dd) {const keep = []; S.q.forEach(q => {if (q.day <= S.day) {toast('📌 ' + q.t, Object.values(q.fx).some(v => v < 0) ? 'bad' : 'ok'); ['boss', 'heat', 'cons', 'energy'].forEach(k => {if (q.fx[k]) S[k] = clamp(S[k] + q.fx[k], 0, 100);}); if (q.fx.money) S.money += q.fx.money;} else keep.push(q);}); S.q = keep; renderHud();} return r;};
/* офис: холст с людьми */
let ofSel = -1, ofRects = [];
function drawOffice(cv, t) {
  const g = cv.getContext('2d'), w = cv.width, h = cv.height; X2(); g.clearRect(0, 0, w, h); const bg = g.createLinearGradient(0, 0, 0, h); bg.addColorStop(0, '#3b3558'); bg.addColorStop(1, '#262040'); g.fillStyle = bg; g.fillRect(0, 0, w, h);
  g.fillStyle = 'rgba(255,255,255,.04)'; for (let i = 0; i < 18; i++) g.fillRect(i * 42, 0, 2, h);
  g.fillStyle = '#18142a'; g.fillRect(0, 0, w, 96); g.fillStyle = 'rgba(160,210,230,.15)'; g.fillRect(14, 8, 210, 80); g.strokeStyle = '#9bb'; g.lineWidth = 3; g.strokeRect(14, 8, 210, 80);
  const man = (x, y, sc, skin, col, nm, sub, sel, empty, lock) => {g.save(); g.translate(x, y); g.scale(sc, sc); g.fillStyle = '#6a4a2c'; g.fillRect(-30, 18, 60, 8); g.fillStyle = '#222'; g.fillRect(-12, -2, 24, 18); g.fillStyle = 'rgba(110,255,170,' + (.5 + Math.sin(t * 3 + x) * .1) + ')'; g.fillRect(-10, 0, 20, 12);
    if (!empty) {g.fillStyle = col; g.beginPath(); g.roundRect ? g.roundRect(-10, -4, 20, 22, 6) : g.rect(-10, -4, 20, 22); g.fill(); g.fillStyle = skin; g.beginPath(); g.arc(0, -12, 8, 0, 6.28); g.fill(); g.fillStyle = 'rgba(0,0,0,.45)'; g.beginPath(); g.arc(0, -14, 8.4, 3.2, 6.2); g.fill();} else {g.fillStyle = 'rgba(255,255,255,' + (lock ? .06 : .14) + ')'; g.font = '700 14px sans-serif'; g.textAlign = 'center'; g.fillText(lock ? '🔒' : '＋', 0, 4);}
    g.restore(); g.textAlign = 'center'; g.font = '700 11px sans-serif'; if (sel) {g.strokeStyle = '#ffd23a'; g.lineWidth = 2; g.strokeRect(x - 38, y - 30 * sc, 76, 64 * sc);} g.fillStyle = empty ? 'rgba(255,255,255,.25)' : '#e8e0ff'; g.fillText(nm, x, y + 36); if (sub) {g.fillStyle = '#9a8fb8'; g.font = '10px sans-serif'; g.fillText(sub, x, y + 47);}};
  man(119, 40, 1.4, '#e8b898', S.eqCol || '#22263a', '★ ' + (S.nick || 'ВЫ'), '', false, false, false);
  g.fillStyle = '#ffd23a'; g.font = '800 12px sans-serif'; g.textAlign = 'left'; g.fillText(RK().ic + ' ' + RK().n, 240, 30); g.fillStyle = '#9a8fb8'; g.font = '11px sans-serif'; g.fillText('День ' + S.day + '/' + DAYS + ' · план ' + fmt(planNow()), 240, 50);
  g.fillStyle = '#e8e0ff'; g.fillText(S.rank === 4 ? 'Сотрудников: ' + (S.staff || []).length + '/' + S.desks : 'Офис: ' + (TEAM.length - 1) + ' коллеги', 240, 70);
  ofRects = []; const pult = S.maxRank >= 4, list = pult ? (S.staff || []) : TEAM.filter(x => x.r !== S.rank).map(x => ({n: x.n, role: Math.min(3, x.r), skill: 3, loy: 60, skin: SKIN[x.r], tm: x})), cap = pult ? S.desks : 4;
  for (let i = 0; i < 12; i++) {const col = i % 4, row = Math.floor(i / 4), x = 90 + col * 180, y = 150 + row * 110, p = list[i], lock = i >= cap; ofRects.push([x - 38, y - 30, 76, 70, i]);
    if (p && !lock) {const R = ROLES[p.role] || ROLES[0]; man(x, y, 1.15, p.skin, p.tm ? ['#7a5ac8', '#c8507a', '#2a6a9a', '#3a4a3a', '#202020'][p.tm.r] : R.col, p.n, R.ic + ' ' + R.n.replace('«', '').replace('»', ''), ofSel === i, false);} else man(x, y, 1.15, '#aaa', '#444', lock ? 'закрыто' : 'свободно', '', ofSel === i, true, lock);}
}
function scrOffice() {
  X2(); running = false; const pult = S.maxRank >= 4, from = S.mode === 'summary' ? 'v_hub' : 'resume'; const list = pult ? (S.staff || []) : TEAM.filter(x => x.r !== S.rank);
  let card = '<p style="color:#9a8fb8">Нажмите на человека за столом.</p>';
  if (ofSel >= 0 && ofSel < list.length) {const p = list[ofSel];
    if (pult) {const R = ROLES[p.role], inc = Math.round((60 + p.skill * 40) * R.m * (.5 + p.loy / 100) * ECON); card = '<div class="tech"><div><b>' + p.n + (p.nick ? ' «' + p.nick + '»' : '') + '</b> · ' + R.ic + ' ' + R.n + '<br><small>Навык ' + '★'.repeat(p.skill) + '☆'.repeat(5 - p.skill) + ' · Лояльность ' + Math.round(p.loy) + '% · Выговоров ' + p.warns + '/3<br>Оклад ₴' + wageOf(p) + '/день · приносит ≈ ₴' + inc + '/день</small></div></div><div class="opts"><button class="btn" data-a="w_st" data-v="rep">📣 Выговор</button><button class="btn" data-a="w_st" data-v="bonus"' + (S.money < 300 ? ' disabled' : '') + '>💰 Премия ₴300</button><button class="btn" data-a="w_st" data-v="train"' + (p.skill >= 5 || S.money < 300 + p.skill * 250 ? ' disabled' : '') + '>🎓 Обучить ₴' + (300 + p.skill * 250) + '</button><button class="btn" data-a="w_st" data-v="role">🔄 Сменить роль</button><button class="btn warn" data-a="w_st" data-v="fire">🚪 Уволить</button></div>';}
    else {const t = p; card = '<div class="tech"><div>' + t.ic + ' <b>' + t.n + '</b> · ' + RANKS[t.r].ic + ' ' + RANKS[t.r].n + '<br><small>' + pick(t.q) + '</small></div><button class="btn sm" data-a="x_chat0" data-v="' + TEAM.indexOf(t) + '">💬</button></div>';}}
  let hire = '', rank = '', ctrl = '';
  if (pult) {if (!S.cand) S.cand = [mkP(), mkP(), mkP()]; hire = '<h3>👥 Кандидаты на собеседовании</h3>' + (S.staff.length >= S.desks ? '<p style="color:#9a8fb8">Все столы заняты. ' + (S.desks < 12 ? 'Расширьтесь:' : '') + '</p>' : '') + S.cand.map((p, i) => '<div class="tech"><div><b>' + p.n + ' «' + p.nick + '»</b> · ' + ROLES[p.role].ic + ' ' + ROLES[p.role].n + '<br><small>Навык ' + '★'.repeat(p.skill) + '☆'.repeat(5 - p.skill) + ' · оклад ₴' + wageOf(p) + '/день</small></div><button class="btn sm" data-a="w_hire" data-v="' + i + '"' + (S.staff.length >= S.desks || S.money < wageOf(p) * 3 ? ' disabled' : '') + '>Нанять ₴' + wageOf(p) * 3 + '</button></div>').join('') + '<div class="row" style="margin:6px 0"><button class="btn sm" data-a="w_hire" data-v="re"' + (S.money < 100 ? ' disabled' : '') + '>🔄 Другие кандидаты ₴100</button>' + (S.desks < 12 ? '<button class="btn sm" data-a="w_hire" data-v="desk"' + (S.money < 5000 ? ' disabled' : '') + '>🪑 +2 стола ₴5000</button>' : '') + '</div>';
    const lc = S.lastContest; rank = '<h3>🏆 Соревнование команд (раз в 5 дней)</h3>' + (lc ? '<div class="help">День ' + lc.day + ': ' + lc.place + '-е место. Вы ' + fmt(lc.you) + ' · ' + RIV.map((r, i) => r.ic + r.n + ' ' + fmt(lc.rs[i])).join(' · ') + '</div>' : '<p style="color:#9a8fb8">Ещё не проводилось. Сумма выручки за 5 дней против трёх команд. 1-е место: +₴3000 и босс +6. Последнее: босс −6.</p>') + '<p style="color:#9a8fb8">Выручка за эти дни: ' + fmt(S.teamAcc) + '</p>';
    if (S.rank === 4) ctrl = '<h3>🎛 Режим смены</h3><div class="col">' + PULT_MODES.map((m, i) => '<button class="btn' + (i === S.pmode ? ' pri' : '') + '" data-a="pmode" data-v="' + i + '">' + m.n + '<br><small>' + m.d + '</small></button>').join('') + '</div>'; else ctrl = '<p style="color:#9a8fb8">Команда работает, только когда вы сидите на позиции «Пульт».</p>';}
  else rank = '<p style="color:#9a8fb8">Станьте «Пультом» (' + (RANKS[4].need - S.xp > 0 ? 'ещё ' + (RANKS[4].need - S.xp) + ' оч.' : 'доступно за ₴10 000 в «Должности»') + '), чтобы нанимать и увольнять людей, давать выговоры и соревноваться с другими командами.</p>';
  const guard = '<div class="row" style="margin:6px 0"><button class="btn sm" data-a="v_kr">🛡 Крыша</button><button class="btn sm" data-a="w_gear" data-v="cloth">🛍 Магазин</button></div>';
  showScr('<div class="box"><h2>🏢 Офис</h2><canvas id="ofc" width="720" height="440" style="width:100%;border-radius:12px;border:1.5px solid #4a3a82"></canvas>' + card + (S.st.length ? '<h3>Эффекты</h3>' + stText() : '') + hire + rank + ctrl + guard + '<div class="row" style="margin-top:8px"><button class="btn pri" data-a="' + from + '">← Назад</button></div></div>', true);
  const tm = setInterval(() => {const cv = document.getElementById('ofc'); if (!cv) return clearInterval(tm); drawOffice(cv, performance.now() / 1000);}, 110);
}
scrTeam = function () {scrOffice();};
document.addEventListener('click', e => {
  const cv = e.target.closest && e.target.closest('#ofc'); if (cv) {const r = cv.getBoundingClientRect(), x = (e.clientX - r.left) / r.width * 720, y = (e.clientY - r.top) / r.height * 440; const hit = ofRects.find(q => x >= q[0] && x <= q[0] + q[2] && y >= q[1] && y <= q[1] + q[3]); if (hit) {ofSel = hit[4]; Snd.sfx('click'); scrOffice();} return;}
  const b = e.target.closest('[data-a^="w_"],[data-a="x_team"]'); if (!b || b.disabled) return; X2(); const a = b.dataset.a, v = b.dataset.v;
  if (a === 'w_gear') {Snd.sfx('click'); scrGear(v);}
  else if (a === 'w_buy') {const [c, i] = v.split(':'), it = GEAR[c].it[+i], id = gid(c, +i); if (S.money < it[2] || S.gear[id]) return; S.money -= it[2]; S.gear[id] = 1; if (c !== 'furn') {S.eq[c] = id; if (c === 'cloth') S.eqCol = it[5];} Snd.sfx('cash'); renderHud(); scrGear(c);}
  else if (a === 'w_eq') {const [c, i] = v.split(':'), id = gid(c, +i); if (S.eq[c] === id) {S.eq[c] = null; if (c === 'cloth') S.eqCol = null;} else {S.eq[c] = id; if (c === 'cloth') S.eqCol = GEAR.cloth.it[+i][5];} Snd.sfx('stamp'); scrGear(c);}
  else if (a === 'w_meetopen') scrMeet();
  else if (a === 'w_meet') {const C = MEET_C[S.rank] || MEET_C[0]; S.meetDone = true; S.meetPending = false; let msg = ''; if (v === '0') {addSt('Разбор полётов', '📝', 2, {talk: 2}); S.energy = clamp(S.energy - 5, 0, 100); S.boss = clamp(S.boss + 1, 0, 100); msg = 'Вы записали всё до последней буквы.';} else if (v === '1') {addSt('Ясная голова', '🧠', 2, {calm: 3}); S.energy = clamp(S.energy - 3, 0, 100); msg = '«' + pick(MEET_TIPS) + '»';} else if (v === '2') {S.boss = clamp(S.boss - 3, 0, 100); addSt('Репутация бунтаря', '😤', 2, {talk: -1}); msg = C.n + ' записал вас в «трудные».';} else {S.energy = clamp(S.energy + 4, 0, 100); S.boss = clamp(S.boss - 2, 0, 100); msg = 'Вас заметили у выхода.';} Snd.sfx('stamp'); renderHud(); showScr('<div class="box"><div class="av big">' + C.ic + '</div><p style="text-align:center">' + msg + '</p><div class="row"><button class="btn pri" data-a="v_hub">Дальше</button></div></div>', true);}
  else if (a === 'w_hire') {if (v === 're') {S.money -= 100; S.cand = [mkP(), mkP(), mkP()];} else if (v === 'desk') {S.money -= 5000; S.desks = Math.min(12, S.desks + 2);} else {const p = S.cand[+v]; if (!p || S.staff.length >= S.desks || S.money < wageOf(p) * 3) return; S.money -= wageOf(p) * 3; S.staff.push(p); S.cand.splice(+v, 1); ofSel = S.staff.length - 1; Snd.sfx('stamp'); toast('✅ ' + p.n + ' принят(а) на работу', 'ok');} renderHud(); scrOffice();}
  else if (a === 'w_st') {const p = S.staff[ofSel]; if (!p) return; if (v === 'rep') {p.warns++; p.loy = clamp(p.loy - 12, 0, 100); p.fear = 1; Snd.sfx('bad'); toast('📣 Выговор: ' + p.n + ' (' + p.warns + '/3)'); if (p.warns >= 3) {S.staff.splice(ofSel, 1); S.heat = clamp(S.heat + 3, 0, 100); toast('🚪 ' + p.n + ' хлопнул дверью: риск +3', 'bad'); ofSel = -1;}} else if (v === 'bonus') {S.money -= 300; p.loy = clamp(p.loy + 14, 0, 100); Snd.sfx('coin'); toast('💰 ' + p.n + ' доволен(а)', 'ok');} else if (v === 'train') {const c = 300 + p.skill * 250; if (S.money < c || p.skill >= 5) return; S.money -= c; p.skill++; p.loy = clamp(p.loy + 4, 0, 100); Snd.sfx('promo');} else if (v === 'role') {p.role = (p.role + 1) % 4; p.loy = clamp(p.loy - 3, 0, 100); Snd.sfx('click');} else if (v === 'fire') {const comp = p.warns >= 2 ? 0 : wageOf(p) * 2; if (S.money < comp) return toast('Не хватает на выходное пособие.', 'bad'); S.money -= comp; S.staff.splice(ofSel, 1); ofSel = -1; Snd.sfx('lock'); toast('🚪 ' + p.n + ' уволен(а)' + (comp ? ' (пособие ' + fmt(comp) + ')' : '')); if (p.loy >= 50 && Math.random() < .4) {S.heat = clamp(S.heat + 2, 0, 100); toast('Обиженный бывший сотрудник пишет жалобы: риск +2', 'bad');}} renderHud(); scrOffice();}
});
const _hub10 = scrHub; scrHub = function () {_hub10(); X2(); const o = document.querySelector('#scr .opts'); if (o) o.insertAdjacentHTML('beforeend', '<button class="btn" data-a="x_team">🏢 Офис и команда</button><button class="btn" data-a="w_gear" data-v="car">🛍 Магазин (авто, мебель, шмотки)</button>' + (S.st.length ? '<div style="grid-column:1/-1;font-size:12px;color:#9a8fb8">Эффекты: ' + S.st.map(s => s.ic + s.n + ' (' + s.d + ')').join(' · ') + '</div>' : ''));};
function scrNews() {
  showScr('<div class="box"><h2>📰 Что нового</h2><p style="color:#ff7adf;font-weight:800">' + TITLE10 + ' · ' + BUILD10 + '</p><h3>В этом обновлении</h3><p>• Деньги добывать сложнее: комиссия и оклады ниже, расходы выше<br>• Логика в звонках: кнопка «🧩 Довод» (легенда, расчёты, время, неудобные вопросы). Эмоции теперь работают слабее<br>• Новый «Офис»: холст с людьми за столами. На «Пульте» можно нанимать, увольнять, давать выговоры, премии, обучать и менять роли<br>• Соревнования команд раз в 5 дней с призами<br>• В кабинете подписаны зоны: Первая холодка, Вторая холодка, Клоузеры, Мусора, Пульт<br>• Жильцы: заселяйте HR, коллег и сотрудников; ночи с HR (без пошлости) и совместная жизнь<br>• Новые авто, телефоны, одежда и мебель с баффами и дебаффами<br>• Ответы на случайные события дают бафф или дебафф и имеют последствия на следующий день</p><h3>Ранее</h3><p>• Погоняло, позиции, коучи, управляющие, 14 локаций, эпилог</p><div class="row" style="margin-top:8px"><button class="btn pri" data-a="x_close">Понятно</button></div></div>', true); lsSet('cc_news_130', 1);
}
