/* ======== БОЛЬШАЯ АФЕРА · build 1.0.7 ======== */
const BUILD = 'build 1.0.7', UPD = 'БОЛЬШАЯ АФЕРА';
/* ---- больше фраз ---- */
{const X = [
  [['«Нам нужно срочно уточнить один момент: {thing}.»'], ['«Вы ведь слышали о таком? Это {thing}.»'], ['«Только вы сможете это решить: {thing}.»'], ['«Давайте быстро, без паузы — {thing}.»']],
  [['«Это очень редкий случай, не упустите: {thing}.»'], ['«Мне жаль, но срок поджимает: {thing}.»'], ['«У вас уже одобрено, остаётся формальность: {thing}.»'], ['«Многие сначала сомневаются, а потом благодарят: {thing}.»']],
  [['«Это ваш шанс закрыть вопрос — {fee}.»'], ['«Вы ведь разумный человек, {fee} — разумное решение.»'], ['«{fee} подтверждает, что вы серьёзно настроены.»'], ['«Давайте честно: без {fee} ничего не сдвинется.»']],
  [['«Остался один шаг — {fee}. Я останусь на линии.»'], ['«Вы молодец, что решились. Теперь {fee}.»'], ['«Фиксирую вашу готовность. Сейчас {fee}.»'], ['«Давайте закончим: {fee} — и вы свободны.»']]];
 ['pressure', 'flattery', 'jargon', 'empathy'].forEach((t, ti) => {for (let st = 0; st < 4; st++) STAGE_LINES.norm[st][t].push(X[st][ti][0]);});
 REPLY_ST.good.forEach((a, i) => a.push(['«Ой, ну если так…»', '«Хм, а вы убедительно говорите.»', '«Допустим. Что дальше?»', '«Ладно, я согласен(на).»'][i]));
 REPLY_ST.bad.forEach((a, i) => a.push(['«Почему я должен вам верить?»', '«Что-то мне это не по душе.»', '«Звучит как развод.»', '«Нет, мне надо подумать.»'][i]));
}
const ASKQ = {
  elder: [['«А как ваше здоровье? Давление не беспокоит?»', '«Да вот, давление шалит. Внучка звонит редко…»', 'внучка звонит редко'], ['«Вы сегодня уже завтракали?»', '«Каша, как всегда. Одна живу, готовлю мало.»', 'вы живёте одна']],
  trusting: [['«У вас, кажется, семья? Не отвлекаю?»', '«Дети дома, муж на работе. Я с ними вся в заботах.»', 'у вас на руках семья'], ['«Вам удобно говорить сейчас?»', '«Да, у меня как раз обед. Слушаю вас.»', 'у вас сейчас обед']],
  skeptic: [['«Как давно вы работаете по профессии?»', '«Лет пятнадцать. Меня на мякине не проведёшь.»', 'вы пятнадцать лет в профессии'], ['«Вы, наверное, много работаете?»', '«Работы хватает. Лишнего времени нет.»', 'у вас нет лишнего времени']],
  student: [['«Вы учитесь или уже работаете?»', '«На третьем курсе. Подрабатываю немного.»', 'вы студент и подрабатываете'], ['«А деньги на учёбу откуда?»', '«Родители помогают, но всё дорого.»', 'вам нужны деньги на учёбу']],
  busy: [['«Вы сейчас на работе?»', '«Да, на рынке. Покупатели, не отвлекайте долго.»', 'вы на работе'], ['«Вам удобно говорить?»', '«Минута найдётся. Дальше как получится.»', 'у вас мало времени']],
  cop: [['«Простите, как к вам обращаться?»', '«Это я должен спрашивать. Продолжайте.»', 'вы очень осторожны'], ['«Вы давно в этом городе живёте?»', '«А вам зачем это знать?»', 'вы осторожничаете']]
};
const KNOW_USE = ['«Кстати, вы говорили, что {d}. Я как раз хочу вам помочь.»', '«Помню, вы упомянули: {d}. Это важно учесть.»', '«Я не забыл: {d}. Поэтому решу всё быстро.»'];
const INTERJ = {
  elder: ['«Ой, чайник закипел… секундочку.»', '«Подождите, кот на пульт залез.»', '«Говорите погромче, я вас плохо слышу.»'],
  trusting: ['«Тут дети шумят, не обращайте внимания.»', '«Подождите, у меня суп на плите.»'],
  skeptic: ['«Я это записываю, если что.»', '«Хм… допустим.»'],
  student: ['«Подождите, мне в чат пишут.»', '«Сейчас пара начнётся, я быстро.»'],
  busy: ['«Я в пробке, говорите короче.»', '«Подождите, мне другой звонок.»'],
  cop: ['«Хм.»', '«Продолжайте, я слушаю.»']
};
DILEMMAS.push(
  {m: ['elder', 'trusting'], t: 'Человек зовёт соседку', d: '«Валя, иди сюда, послушай, что говорят!»', ch: [
    {a: 'Продолжить увереннее', fx: {pers: 8, susp: 14}},
    {a: 'Сменить тон на дружеский', fx: {susp: -6, pers: 4}},
    {a: 'Свернуть разговор', end: 'hang'}]},
  {t: 'Телефон разряжается', d: 'В трубке: «У меня телефон садится, быстро!»', ch: [
    {a: 'Ускориться', fx: {pers: 12, susp: 8}},
    {a: 'Предложить перезвонить', end: 'hang'},
    {a: 'Продиктовать номер для связи', fx: {pers: 6, heat: 1}}]},
  {t: 'Человек просит скидку', d: '«А скидка какая-нибудь есть?»', ch: [
    {a: 'Предложить «скидку 10%»', fx: {pers: 12, susp: -4, money: -50}},
    {a: 'Отказать', fx: {pers: -2, susp: 6}},
    {a: 'Сослаться на «последний день акции»', fx: {pers: 8, susp: 10}}]},
  {m: ['skeptic', 'student'], t: 'Человек называет фамилию', d: '«Сейчас пробью ваше имя по форумам.»', ch: [
    {a: 'Назвать псевдоним', fx: {susp: 12, pers: 3}},
    {a: 'Рассмеяться', fx: {susp: 6}},
    {a: 'Сбросить', end: 'hang'}]},
  {t: 'Приходит сообщение от близкого', d: 'Человек вскрикивает: «Мне только что написал сын! Это про него?!»', ch: [
    {a: 'Подтвердить (низко)', fx: {pers: 24, cons: -9, susp: 8, heat: 2}},
    {a: 'Честно: «Нет, это обман»', end: 'warn'},
    {a: 'Замолчать и сбросить', end: 'hang'}]},
  {t: 'Фоном играет детский смех', d: 'В трубке слышно, как играет ребёнок.', ch: [
    {a: 'Продолжить', fx: {pers: 10, cons: -3}},
    {a: 'Замолчать на секунду', fx: {cons: 1, pers: -4}},
    {a: 'Предупредить и закончить', end: 'warn'}]},
  {t: 'Начальник просит отчёт', d: 'В чат: «Сколько у тебя уже закрыто? Живо!»', ch: [
    {a: 'Преувеличить', fx: {boss: 2, heat: 1}},
    {a: 'Сказать правду', fx: {boss: -1}},
    {a: 'Не отвечать', fx: {boss: -2, susp: -2}}]},
  {t: 'Человек предлагает «подумать до завтра»', d: '«Давайте я подумаю до завтра, а потом сам вам позвоню».', ch: [
    {a: 'Согласиться', end: 'hang', fx: {boss: -1}},
    {a: 'Надавить: «До завтра не доживёт предложение»', fx: {pers: 12, susp: 20}},
    {a: 'Записать «на завтра»', end: 'hang', fx: {boss: 1, money: 40}}]}
);
EVENTS.push(
  {t: 'Сломался принтер', req: () => S.day >= 2, d: 'Принтер зажевал план. Секретарь машет руками.', ch: [{a: 'Помочь починить', fx: {energy: -4, boss: 2}}, {a: 'Пройти мимо', fx: {boss: -1}}]},
  {t: 'День рождения коллеги', req: () => S.day >= 3, d: 'Все скидываются на торт.', ch: [{a: 'Сбросить ₴100', fx: {money: -100, cons: 1, boss: 1}}, {a: 'Отказаться', fx: {boss: -1}}]},
  {t: 'Дежурный по этажу', req: () => S.day >= 2, d: 'Охранник проверяет пропуск и косится на ваш монитор.', ch: [{a: 'Показать пропуск спокойно', fx: {heat: -1}}, {a: 'Пошутить', fx: {boss: -1, energy: 2}}]},
  {t: 'Слух про зарплату', req: () => S.day >= 4, d: 'Коллеги шепчутся: премию выдадут не всем.', ch: [{a: 'Спросить у босса', fx: {boss: -2, money: 100}}, {a: 'Не вмешиваться', fx: {cons: 1}}]},
  {t: 'Корпоратив', req: () => S.day >= 5, d: 'Директор объявляет вечеринку «для сплочения».', ch: [{a: 'Пойти и развлечься', fx: {energy: -6, boss: 3, cons: -1}}, {a: 'Уйти домой', fx: {boss: -3, energy: 4}}]},
  {t: 'Новые наушники', req: () => S.day >= 3, d: 'Продавец у метро предлагает «фирменную гарнитуру».', ch: [{a: 'Купить за ₴200', fx: {money: -200, energy: 3}}, {a: 'Отказаться', fx: {}}]}
);
/* ---- общение с коллегами ---- */
const CHAT_T = {
  advice: {n: '🎓 Совет', fx: {boss: 0}, l: ['{n}: «Не давай клиенту паузу — он начнёт думать».', '{n}: «Сначала вопросы, потом просьба. Не наоборот».', '{n}: «Если слышишь детей на фоне — смени тактику».', '{n}: «Говори медленнее, и тебе будут верить больше».']},
  gossip: {n: '🗣 Сплетни', fx: {cons: -1}, l: ['{n} шепчет: «Директор сегодня в плохом настроении…»', '{n}: «Говорят, нашу контору уже обсуждают в сети».', '{n}: «Слышал(а), кого-то из старших вот-вот повысят».', '{n}: «Юлия из комплаенса всё записывает, будь осторожен».']},
  smoke: {n: '🚬 Перекурить', fx: {energy: 6}, l: ['{n} протягивает зажигалку: «Пять минут жизни».', '{n}: «Давай постоим тут. Хоть не слышно звонков».', '{n} молчит и смотрит вдаль. Вы тоже.']},
  loan: {n: '💸 Занять ₴200', fx: {money: 200, boss: -1, cons: -1}, l: ['{n}: «Держи. Но верни, ладно?»', '{n} достаёт купюры: «Только не рассказывай».', '{n}: «Ну… выручу. Один раз».']}
};
const REL_PERK = ['Дима: +₴80 в день', 'Катя: +1 совесть в день', 'Рома: +1 к расположению босса', 'Гриша: −2 к риску в день', 'Сергей: +3 к энергии'];
const X0 = () => {if (!S.rel) S.rel = {}; if (!S.chats) S.chats = 0; return S;};
function teamDaily() {X0(); S.chats = 0; TEAM.forEach((t, i) => {if ((S.rel[t.n] || 0) >= 4) {if (i === 0) S.money += 80; if (i === 1) S.cons = clamp(S.cons + 1, 0, 100); if (i === 2) S.boss = clamp(S.boss + 1, 0, 100); if (i === 3) S.heat = clamp(S.heat - 2, 0, 100); if (i === 4) S.energy = clamp(S.energy + 3, 0, 100);}});}
function scrChat(i, last) {
  X0(); const t = TEAM[i], rel = S.rel[t.n] || 0, left = 2 - S.chats;
  showScr('<div class="box"><div class="av big">' + t.ic + '</div><h2 style="text-align:center">' + t.n + '</h2><p style="text-align:center;color:#9a8fb8">' + RANKS[t.r].ic + ' ' + RANKS[t.r].n + '</p><p>Доверие: <b>' + rel + '/4</b> <small style="color:#9a8fb8">(при 4: ' + REL_PERK[i] + ')</small></p><div class="bar yel"><i style="width:' + Math.min(100, rel * 25) + '%"></i></div><p style="color:#9a8fb8">Разговоров сегодня: ' + (2 - left) + '/2</p>' + (last ? '<p class="help">' + last + '</p>' : '') + '<div class="opts">' + Object.keys(CHAT_T).map(k => '<button class="opt" data-a="x_chat" data-v="' + i + ':' + k + '"' + (left <= 0 ? ' disabled' : '') + '>' + CHAT_T[k].n + '</button>').join('') + '</div><div class="row" style="margin-top:8px"><button class="btn pri" data-a="x_team">← К команде</button></div></div>', true);
}
/* ---- новости и разработчик ---- */
function scrNews() {
  showScr('<div class="box"><h2>📰 Что нового</h2><p style="color:#ff7adf;font-weight:800">' + UPD + ' · ' + BUILD + '</p>' +
  '<h3>В этом обновлении</h3><p>• Новое главное меню с анимированным городом и отдельный раздел «Разработчик»<br>• Это окно «Что нового» — теперь вы всегда в курсе<br>• ~20 новых звуков: двери, монеты, печать, сердце, мотор, питомцы, сирена, фоновый шум офиса<br>• Новые действия в разговоре: «❓ Спросить» (узнать о человеке и использовать это) и «🤐 Пауза»<br>• Живые вставки: собеседники отвлекаются, переспрашивают, шумят<br>• Разговоры с коллегами: советы, сплетни, перекур, долг. Накопите доверие — получите бонус<br>• Новые дилеммы и события, больше реплик на каждом этапе разговора</p>' +
  '<h3>Ранее</h3><p>• Дом: мебель, одежда, транспорт и вечера дома<br>• HR-девушки: трудно расположить, давление приводит к жалобе<br>• «Мусор» звонит как «полицейский» с выдуманными делами<br>• Диалоги по этапам: Знакомство → Крючок → Просьба → Закрытие<br>• Быт, питомцы, достижения, карьерная лестница, обновление поверх установки</p>' +
  '<div class="row" style="margin-top:8px"><button class="btn pri" data-a="x_close">Понятно</button></div></div>', true); lsSet('cc_news_108', 1);
}
function scrDev() {
  showScr('<div class="box" style="text-align:center"><div style="font:900 34px Impact,sans-serif;letter-spacing:.1em;color:#eee;text-shadow:0 0 18px #ff3ac8">PESSIMIST</div><p style="letter-spacing:.3em;font-size:11px;color:#9a8a70">MADE BY</p><p>Разработчик игры «Кол-центр: Смена»</p><div class="col" style="margin:10px 0"><a class="btn pri" style="text-decoration:none;color:#201400" href="https://t.me/+OlavQF1edndlOWY1" target="_blank" rel="noopener">📢 Канал: t.me/+OlavQF1edndlOWY1</a><a class="btn" style="text-decoration:none" href="https://t.me/Izzolentaaa" target="_blank" rel="noopener">✉ Telegram: @Izzolentaaa</a></div><p style="font-size:12px;color:#9a8fb8">Игра сатирическая: она показывает, какую цену платят живые люди. Все компании и «легенды» выдуманы.</p><div class="row" style="margin-top:8px;justify-content:center"><button class="btn pri" data-a="x_close">Закрыть</button></div></div>', true);
}
/* ---- главное меню ---- */
let tAnim = 0;
function showTitle() {
  running = false; Snd.ringStop(); $('app').classList.add('hide'); $('title').classList.remove('hide'); hideScr(); const has = !!lsGet(SAVE_KEY, null);
  $('tbtn').innerHTML = (has ? '<button class="btn pri big" data-m="cont">▶ Продолжить игру</button><button class="btn" data-m="new">🆕 Новая игра</button>' : '<button class="btn pri big" data-m="new">▶ Начать игру</button>') +
   '<div class="row two"><button class="btn" data-m="news">📰 Что нового</button><button class="btn" data-m="ach">🏆 Награды</button></div><div class="row two"><button class="btn" data-m="help">❔ Как играть</button><button class="btn" data-m="set">⚙ Настройки</button></div><div class="row two"><button class="btn" data-m="about">ℹ Об игре</button><button class="btn" data-m="priv">🔒 Политика</button></div><button class="btn dev" data-m="dev">👤 Разработчик · PESSIMIST</button>';
  if (!tAnim) tAnim = requestAnimationFrame(tFrame); if (!lsGet('cc_news_107', 0)) setTimeout(() => {if (!$('scr').innerHTML) scrNews();}, 500);
}
function drawTitle() {if (!tAnim && !$('title').classList.contains('hide')) tAnim = requestAnimationFrame(tFrame);}
const TC = {coins: Array.from({length: 22}, (_, i) => ({x: Math.random(), y: Math.random(), v: .04 + Math.random() * .08, s: 10 + Math.random() * 14, r: Math.random() * 6}))};
function tFrame(ts) {
  tAnim = 0; const el = $('title'); if (el.classList.contains('hide')) return; const c = $('tcv'), dpr = Math.min(devicePixelRatio || 1, 2), W = innerWidth, H2 = innerHeight; if (c.width !== Math.round(W * dpr)) {c.width = Math.round(W * dpr); c.height = Math.round(H2 * dpr);} const g = c.getContext('2d'); g.setTransform(dpr, 0, 0, dpr, 0, 0); const t = ts / 1000;
  const sky = g.createLinearGradient(0, 0, 0, H2); sky.addColorStop(0, '#0b0620'); sky.addColorStop(.55, '#2a0f4a'); sky.addColorStop(1, '#0e0a1c'); g.fillStyle = sky; g.fillRect(0, 0, W, H2);
  for (let i = 0; i < 60; i++) {g.fillStyle = 'rgba(255,255,255,' + (.25 + Math.sin(t * 2 + i) * .2) + ')'; g.fillRect((i * 97 % 100) / 100 * W, (i * 53 % 55) / 100 * H2, 1.5, 1.5);}
  g.fillStyle = '#ffe9a0'; g.beginPath(); g.arc(W * .88, H2 * .4, 24, 0, 7); g.fill(); g.fillStyle = '#2a0f4a'; g.beginPath(); g.arc(W * .88 + 9, H2 * .4 - 4, 22, 0, 7); g.fill();
  for (let k = 0; k < 2; k++) {const ax = W * (k ? .78 : .22), ang = Math.sin(t * .7 + k * 2) * .5 + (k ? -.3 : .3); g.save(); g.translate(ax, H2 * .72); g.rotate(ang); const bg = g.createLinearGradient(0, 0, 0, -H2 * .7); bg.addColorStop(0, 'rgba(255,230,160,.22)'); bg.addColorStop(1, 'rgba(255,230,160,0)'); g.fillStyle = bg; g.beginPath(); g.moveTo(-6, 0); g.lineTo(6, 0); g.lineTo(46, -H2 * .7); g.lineTo(-46, -H2 * .7); g.fill(); g.restore();}
  [[.55, '#150c30', .1, 1], [.42, '#1e1040', .14, 1.6], [.3, '#2a1650', .18, 2.4]].forEach((L, li) => {g.fillStyle = L[1]; const off = (t * 3 * (li + 1)) % 60; for (let x = -60 + off % 60 - 60; x < W + 60; x += 60) {const bh = H2 * (L[2] + ((Math.floor((x + 60 * 100) / 60) * 37 + li * 11) % 7) * .03); g.fillRect(x, H2 * (.78 - L[0] * .0) - bh, 52, bh + 200); for (let wy = 0; wy < bh - 10; wy += 14) for (let wx = 6; wx < 46; wx += 14) {if ((Math.floor(x / 60 * 7) + wy + wx + Math.floor(t * .5)) % 5 === 0) {g.fillStyle = 'rgba(255,210,100,' + (.15 + li * .12) + ')'; g.fillRect(x + wx, H2 * .78 - bh + wy + 6, 6, 8); g.fillStyle = L[1];}}}});
  TC.coins.forEach(p => {p.y += p.v * .016; if (p.y > 1.05) {p.y = -.05; p.x = Math.random();} g.save(); g.translate(p.x * W, p.y * H2); g.rotate(Math.sin(t + p.r) * .6); g.font = p.s + 'px sans-serif'; g.fillStyle = 'rgba(255,210,58,.55)'; g.textAlign = 'center'; g.fillText(['₴', '$', '€'][Math.floor(p.r) % 3], 0, 0); g.restore();});
  const vg = g.createRadialGradient(W / 2, H2 / 2, H2 * .2, W / 2, H2 / 2, H2 * .8); vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(0,0,0,.55)'); g.fillStyle = vg; g.fillRect(0, 0, W, H2); tAnim = requestAnimationFrame(tFrame);
}
/* ---- действия в разговоре: «Спросить», «Пауза», вставки ---- */
const _choose = choose;
choose = function (type) {
  const c = S.call; if (!c) return;
  if (type === 'ask') {const q = pick(ASKQ[c.p.mood]); c.asked = true; c.knows = true; c.detail = q[2]; c.pers += ri(4, 9); c.susp = Math.max(0, c.susp - 4); c.turn++; S.min += 3; Snd.sfx('typing'); c.log.push({w: 'me', t: q[0]}); c.log.push({w: 'them', t: q[1]}); return render();}
  if (type === 'pause') {S.min += 2; Snd.sfx('whoosh'); c.log.push({w: 'me', t: '…'}); if (Math.random() < .5) {c.pers += ri(4, 9); c.log.push({w: 'them', t: pick(['«Ну… и что вы предлагаете?»', '«Я слушаю. Говорите уже.»', '«Да ладно, давайте, я готов(а) слушать».']) });} else {c.susp += ri(5, 11); c.log.push({w: 'them', t: pick(['«Вы там уснули?»', '«Алло? Вы меня слышите?»', '«Странная пауза… что-то тут не так».'])});} Snd.sfx('voice'); if (c.pers >= c.target) return success(); if (c.susp >= 100) return fail('Человек бросил трубку: «Это обман!»'); return render();}
  const know = c.knows && ['flattery', 'empathy', 'jargon'].includes(type) && !c.usedKnow; if (know) {c.pers += 4; c.susp = Math.max(0, c.susp - 3);}
  _choose(type);
  if (S.call === c && S.mode === 'call') {let ch = false; if (know && c.detail) {c.usedKnow = true; c.log.push({w: 'me', t: pick(KNOW_USE).replace('{d}', c.detail)}); ch = true;} if (Math.random() < .28 && INTERJ[c.p.mood]) {c.log.push({w: 'them', t: pick(INTERJ[c.p.mood])}); ch = true;} if (ch) render();}
};
const _success = success; success = function () {_success(); Snd.sfx('stamp'); setTimeout(() => Snd.sfx('coin'), 200);};
const _ending = ending; ending = function (k) {Snd.sfx(k === 'raid' ? 'siren' : k === 'rich' || k === 'survive' || k === 'whistle' ? 'cheer' : 'wah'); return _ending(k);};
const _daySummary = daySummary; daySummary = function () {Snd.sfx('bell'); return _daySummary();};
const _nextDay = nextDay; nextDay = function () {Snd.sfx('door'); return _nextDay();};
const _toast = toast; toast = function (m, k) {if (k === 'ok') Snd.sfx('notif'); return _toast(m, k);};
const _hrAct = hrAct; hrAct = function (id, k) {const b = H().hr[id].aff; _hrAct(id, k); Snd.sfx(H().hr[id].aff > b ? 'heart' : 'buzz');};
/* ---- общие клики ---- */
document.addEventListener('click', e => {
  const b = e.target.closest('button,a'); if (!b) return; const a = b.dataset && b.dataset.a, m = b.dataset && b.dataset.m, v = b.dataset && b.dataset.v;
  if (m === 'news') {Snd.resume(); Snd.sfx('paper'); scrNews();} else if (m === 'dev') {Snd.resume(); Snd.sfx('lock'); scrDev();}
  else if (a === 'x_chat0') scrChat(+v); else if (a === 'x_close') {hideScr(); Snd.sfx('lock');} else if (a === 'x_team') scrTeam(); else if (a === 'x_chat') {X0(); const [i, k] = v.split(':'), t = TEAM[+i], T = CHAT_T[k]; if (S.chats >= 2) return; S.chats++; S.rel[t.n] = Math.min(4, (S.rel[t.n] || 0) + 1); const fx = T.fx; ['cons', 'boss', 'energy'].forEach(q => {if (fx[q]) S[q] = clamp(S[q] + fx[q], 0, 100);}); if (fx.money) S.money += fx.money; if (k === 'advice') S.buffAdvice = 1; if (k === 'smoke') S.min += 10; Snd.sfx(k === 'loan' ? 'coin' : k === 'smoke' ? 'whoosh' : 'voice'); renderHud(); scrChat(+i, pick(T.l).replace('{n}', t.n) + (k === 'advice' ? ' (+5 к убеждению в следующем звонке)' : ''));}
  else if (a === 'h_car') setTimeout(() => Snd.sfx('engine'), 60); else if (a === 'h_home' || a === 'lifeopen') Snd.sfx('door'); else if (a === 'h_shop') Snd.sfx('paper'); else if (a === 'h_buy') Snd.sfx('coin'); else if (a === 'pet') {const p = PETS.find(x => x.id === v); if (p) Snd.sfx({fish: 'bubble', ham: 'squeak', cat: 'meow', dog: 'woof'}[p.id]);} else if (a === 'tclose') Snd.sfx('lock');
});
const _answer = answer; answer = function () {_answer(); if (S.buffAdvice && S.call) {S.call.pers += 5; S.buffAdvice = 0;}};
