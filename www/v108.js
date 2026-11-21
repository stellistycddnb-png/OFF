/* ======== ВОРОВСКАЯ РОМАНТИКА · build 1.0.9 ======== */
const BUILD8 = 'build 1.0.9', TITLE8 = 'ВОРОВСКАЯ РОМАНТИКА';
RANKS[1].need = 8; RANKS[2].need = 22; RANKS[3].need = 42; RANKS[4].need = 66;
TEAM[3].n = 'Гриша'; TEAM[3].q = ['«Красная корочка — клиент послушный. Только настоящим не звони.»', '«Звонить «из полиции» — тоже работа».'];
{const e = EVENTS.find(x => x.t === 'Палыч намекает'); if (e) {e.t = 'Палыч (охрана) намекает'; e.d = 'Палыч из службы безопасности подходит к столу: «Если что — за небольшую благодарность я прикрою».';}}
const SKILLS = {talk: {n: '🎙 Красноречие', d: '+0.8 к убеждению за уровень'}, voice: {n: '🎤 Голос', d: '−0.8 подозрения за уровень'}, psy: {n: '🧠 Чтение людей', d: '+1.5 к убеждению в начале'}, close: {n: '🎯 Закрытие', d: '−3 к цели разговора за уровень'}, nerve: {n: '🔋 Стрессоустойчивость', d: '+2 энергии на старте дня'}};
const OFFICES = [
  {id: 'main', n: 'Главный офис', ic: '🏢', bg: ['#2a2050', '#150c30'], em: ['🏢', '🖥', '☎'], fare: 0, d: 'Ваш родной этаж. Здесь вас знают.', mgr: {n: 'Лев Борисович', ic: '🧑‍💼', role: 'Директор', perk: '+1 к расположению босса в день', q: ['«Цифры любят тишину. И дисциплину.»', '«Ты растёшь. Не останавливайся».']}, coach: 'voice'},
  {id: 'north', n: 'Офис «Бульбаш-Север»', ic: '🏬', bg: ['#1c3050', '#0c1830'], em: ['🏬', '❄', '☎'], fare: 150, d: 'Холодный регион, горячие звонки. Тут любят порядок.', mgr: {n: 'Тамара Ильинична', ic: '👩‍💼', role: 'Управляющая', perk: '+₴80 в день', q: ['«Я не ругаюсь. Я просто замечаю».', '«У нас план выполняют, а не обсуждают».']}, coach: 'talk'},
  {id: 'resort', n: 'Курорт «Золотой берег»', ic: '🏖', bg: ['#3a5a7a', '#c8a050'], em: ['🏖', '🌴', '🍹'], fare: 400, d: 'Офис в бывшем санатории. Все ходят в тапочках.', mgr: {n: 'Эдик Курортный', ic: '🕶', role: 'Управляющий', perk: '+3 энергии в день', q: ['«Расслабься. Деньги любят спокойных».', '«Тут даже план выполняется у бассейна».']}, coach: 'psy'},
  {id: 'basement', n: 'Подвал на Заводской', ic: '🏚', bg: ['#2a2a2a', '#0a0a0a'], em: ['🏚', '💡', '🐀'], fare: 100, d: 'Тесно, сыро, шумно. Зато учат быстро.', mgr: {n: 'Гоша Подвал', ic: '🧔', role: 'Управляющий', perk: '−1 к риску в день', q: ['«Тут не до сантиментов».', '«Лишнее слово — лишняя проблема».']}, coach: 'close'},
  {id: 'colos', n: 'Бизнес-центр «Колос»', ic: '🏙', bg: ['#4a3a7a', '#1a1a3a'], em: ['🏙', '🪟', '💼'], fare: 300, d: 'Стекло, кофемашины и модные слова.', mgr: {n: 'Инга Глянцева', ic: '💁‍♀️', role: 'Управляющая', perk: '+₴60 в день', q: ['«Мы называем это нетворкингом».', '«Главное — упаковка».']}, coach: 'talk2'},
  {id: 'ware', n: 'Склад №7', ic: '🏭', bg: ['#3a3020', '#14100a'], em: ['🏭', '📦', '🚛'], fare: 200, d: 'Склад с телефонами. Пахнет картоном и стрессом.', mgr: {n: 'Мишаня Склад', ic: '🧑‍🏭', role: 'Управляющий', perk: '+1 совесть в день', q: ['«Тут все работают. Некогда думать».', '«Коробки — они честнее людей».']}, coach: 'nerve'}
];
const COACHES = {
  voice: {n: 'Макс «Голос»', ic: '🎤', skill: 'voice', d: 'Ставит голос: звучите увереннее, подозрения меньше.', tips: ['«Говори из диафрагмы, а не из паники.»', '«Голос — это 70% доверия. Остальное — легенда.»', '«Улыбка слышна даже в трубке».'], ok: ['«Вот! Теперь тебя хочется слушать, {nick}.»', '«Ты растёшь на глазах, {nick}.»'], bad: ['«Сегодня голос сиплый. Попробуем позже».']},
  talk: {n: 'Вадим Ораторов', ic: '🎙', skill: 'talk', d: 'Красноречие: слова ложатся лучше, убеждение растёт.', tips: ['«Сначала вопрос, потом просьба. Не наоборот.»', '«Паузы — твои друзья».', '«Короткая фраза бьёт длинную».'], ok: ['«Блестяще, {nick}! Ты уже почти оратор.»', '«Вот это подача!»'], bad: ['«Пока рано. Тренируйся».']},
  talk2: {n: 'Артём Синергия', ic: '📊', skill: 'talk', d: 'Модные слова и презентации: красноречие.', tips: ['«Главное — слово «экосистема».»', '«Если непонятно — значит, умно».', '«Говори слайдами».'], ok: ['«Синергия случилась, {nick}!»', '«Ты усвоил термины. Горжусь».'], bad: ['«Недостаточно инсайтов. Ещё раз».']},
  psy: {n: 'Лика Психолог', ic: '🧠', skill: 'psy', d: 'Учит читать людей по голосу: сильнее начало разговора.', tips: ['«Слушай не слова — слушай дыхание.»', '«Каждый человек хочет, чтобы его услышали».', '«Страх звучит выше, чем злость».'], ok: ['«Видишь людей насквозь, {nick}. Используй это осторожно.»', '«Хорошо. Теперь помни, что за голосом — человек».'], bad: ['«Ты торопишься. Присмотрись».']},
  close: {n: 'Борода', ic: '🧔', skill: 'close', d: 'Учит заканчивать разговор быстрее: цель ниже.', tips: ['«Не тяни. Решение зреет в первые три минуты.»', '«Последний шаг — самый короткий».', '«Чем меньше слов в конце, тем лучше».'], ok: ['«Закрываешь как волк, {nick}.»', '«Вот теперь работаем».'], bad: ['«Ты не готов. Приходи ещё».']},
  nerve: {n: 'Петрович', ic: '🧓', skill: 'nerve', d: 'Стрессоустойчивость: больше энергии с утра.', tips: ['«Дыши. Всё остальное — потом.»', '«Спи, ешь, не кури пустым».', '«Нервы — как сталь: гнутся, но не ломаются».'], ok: ['«Держишься, {nick}. Это главное.»', '«Крепкий ты. Тут таких мало».'], bad: ['«Сегодня не мой день».']}
};
const X1 = () => {if (!S) return {}; if (S.nick === undefined) S.nick = 'Новичок'; if (S.maxRank === undefined) S.maxRank = S.rank || 0; if (!S.skills) S.skills = {talk: 0, voice: 0, psy: 0, close: 0, nerve: 0}; if (S.slots === undefined) S.slots = 3; if (S.kr === undefined) S.kr = 0; if (S.krSaves === undefined) S.krSaves = 0; if (!S.mgr) S.mgr = {}; if (!S.vis) S.vis = {}; if (!S.nextEn) S.nextEn = 0; return S;};
const skillEn = () => (S && S.skills ? S.skills.nerve * 2 : 0) + (typeof allFx === 'function' && S ? Math.round(allFx().en) : 0);
const nick = () => (S && S.nick) || 'Новичок';
/* ---- должности: свои действия и реплики ---- */
const RANK_ACTS = [
  [{id: 'script', ic: '📋', n: 'По скрипту', p: [6, 12], s: [0, 4], me: ['«Согласно инструкции, мне нужно задать вам пару вопросов.»', '«Давайте пройдём по шагам, как положено.»'], re: ['«Хм, ну давайте по порядку.»', '«Ладно, спрашивайте».']},
   {id: 'hand', ic: '🔀', n: 'Соединить с Катей', end: 'hand', min: 1}],
  [{id: 'recall', ic: '📞', n: '«Мы уже звонили»', p: [10, 16], s: [6, 12], mood: {trusting: [4, -4], elder: [4, -2]}, me: ['«Мы с вами уже связывались, помните?»', '«Коллега вам звонил на прошлой неделе, я продолжу».'], re: ['«А, да, что-то припоминаю.»', '«Звонили? Не помню, но допустим».']},
   {id: 'warm', ic: '♨', n: 'Прогреть', p: [8, 14], s: [-4, 2], once: 1, me: ['«Расскажите, что вас сейчас больше всего беспокоит?»', '«Я здесь, чтобы вас выслушать».'], re: ['«Спасибо, что выслушали…»', '«Мне давно никто не звонил просто так».']}],
  [{id: 'deadline', ic: '⏱', n: 'Дедлайн', p: [16, 26], s: [14, 24], mood: {busy: [4, -6], student: [-4, 6]}, me: ['«У нас осталось сорок минут, потом всё сгорит.»', '«Окно закрывается сегодня в шесть».'], re: ['«Так быстро?!»', '«Ладно-ладно, не давите».']},
   {id: 'disc', ic: '🏷', n: 'Скидка-ловушка', p: [14, 20], s: [6, 10], money: -60, me: ['«Для вас сделаю скидку из своей комиссии.»', '«Только вам, только сегодня».'], re: ['«Правда? Ну это другое дело.»', '«Спасибо, это очень любезно».']}],
  [{id: 'badge', ic: '🪪', n: 'Показать «корочку»', p: [10, 14], s: [18, 28], mood: {trusting: [14, -16], elder: [18, -18], cop: [-10, 22]}, me: ['«Вот моё удостоверение. Вы видите? Номер три».', '«Смотрите внимательно, я при исполнении».'], re: ['«Ой, простите, не знал(а)…»', '«Господи, это правда полиция».']},
   {id: 'case', ic: '📂', n: '«Дело номер…»', p: [12, 20], s: [8, 14], heat: 1, me: ['«Дело номер семь-тапок, том второй.»', '«По делу вы проходите свидетелем. Пока».'], re: ['«Боже, какое дело?»', '«Я ничего не нарушал(а)!»']}],
  [{id: 'order', ic: '📣', n: 'Приказ по смене', p: [12, 18], s: [5, 10], boss: 1, me: ['«Команда, вся смена: работаем по четвёртому протоколу.»', '«Все слышали? Тишина в эфире!»'], re: ['«Что у вас там за шум?»', '«Какая смена? Вы о чём?»']},
   {id: 'escal', ic: '🧯', n: 'Погасить эскалацию', p: [10, 16], s: [-8, -2], once: 1, cons: -1, me: ['«Я старший смены, давайте решим вопрос спокойно.»', '«Приношу извинения от лица компании».'], re: ['«Хоть кто-то нормальный…»', '«Ладно, говорите».']}]
];
const ROLE_LINES = [
  [['«Я оператор первой линии: помогу вам с вопросом.»', '«Сейчас уточню у профильного специалиста».'], ['«Мой коллега уже занимается вашим случаем.»', '«Это стандартная процедура первой линии».'], ['«Я передам заявку старшему, нужно ваше согласие.»'], ['«Сейчас переключу вас на Катю, не вешайте трубку.»']],
  [['«Мы с вами уже связывались: я продолжаю вашу заявку.»'], ['«У вас на руках уже одобренный вариант».'], ['«Осталась только формальность — я её сейчас оформлю».'], ['«Передаю вас клоузеру с положительным заключением».']],
  [['«Я старший по вашему вопросу и сразу к делу.»'], ['«Давайте не ходить кругами: решение принимаем сегодня».'], ['«Я лично контролирую сделку, не волнуйтесь».'], ['«Фиксирую. Диктуйте — и закрываем».']],
  [['«Старший лейтенант, отдел «Тапочек». Вас слушают».'], ['«На вас поступило заявление. Пока устное».'], ['«Могу помочь снять вопросы, но придётся внести залог».'], ['«Звонок записывается. Прошу не прерывать».']],
  [['«Старший смены. Мне передали вашу жалобу».'], ['«Я лично разберусь, как исправить ситуацию».'], ['«Компания готова пойти навстречу, но нужен шаг с вашей стороны».'], ['«Благодарю за терпение. Закрываем вопрос».']]
];
const _chooseOld = choose;
choose = function (type) {
  const c = S && S.call; if (!c) return; X1();
  if (typeof type === 'string' && type.startsWith('r:')) {
    const A = RANK_ACTS[S.rank].find(a => 'r:' + a.id === type); if (!A) return; c.rused = c.rused || {}; if (A.once && c.rused[A.id]) return; c.rused[A.id] = 1;
    if (A.end === 'hand') {if (c.pers < 30) {toast('Контакт ещё не заинтересован.', 'bad'); c.rused[A.id] = 0; return;} const b = 70 + S.rank * 20; S.money += b; S.xp++; S.boss = clamp(S.boss + 2, 0, 100); S.min += 3; Snd.sfx('cash'); toast('🔀 Катя приняла контакт. Бонус ' + fmt(b), 'ok'); return endCall();}
    let p = ri(A.p[0], A.p[1]), s = ri(A.s[0], A.s[1]); const mm = A.mood && A.mood[c.p.mood]; if (mm) {p += mm[0]; s += mm[1];}
    c.pers = Math.max(0, c.pers + p + S.skills.talk * .8); c.susp = Math.max(0, c.susp + s - S.skills.voice * .8); c.turn++; S.min += 5; S.energy = clamp(S.energy - 2, 0, 100); if (A.money) S.money += A.money; if (A.heat) S.heat = clamp(S.heat + A.heat, 0, 100); if (A.boss) S.boss = clamp(S.boss + A.boss, 0, 100); if (A.cons) S.cons = clamp(S.cons + A.cons, 0, 100);
    Snd.sfx('key'); c.log.push({w: 'me', t: pick(A.me)}); c.log.push({w: 'them', t: c.p.mood === 'cop' ? pick(REPLY_ST.cop) : pick(A.re)}); Snd.sfx('voice');
    if (S.cons <= 0) return ending('conscience'); if (S.heat >= 100) return ending('raid');
    if (c.pers >= c.target) return success(); if (c.susp >= 100) return fail('Человек бросил трубку: «Это обман!»'); if (c.turn >= 6) return fail('Человек сказал «мне некогда» и отключился.'); return render();
  }
  const normal = ['pressure', 'flattery', 'jargon', 'empathy'].includes(type);
  if (normal) {const sk = S.skills; c.pers += sk.talk * .8; c.susp = Math.max(0, c.susp - sk.voice * .8);}
  _chooseOld(type);
  if (normal && S.call === c && S.mode === 'call') {const st = stageOf(c); if (Math.random() < .4 && ROLE_LINES[S.rank][st]) {c.log.push({w: 'me', t: pick(ROLE_LINES[S.rank][st])}); render();}}
};
const _answerOld = answer;
answer = function () {_answerOld(); const c = S && S.call; if (!c) return; X1(); c.target = Math.max(60, c.target - S.skills.close * 3); c.pers += S.skills.psy * 1.5; if (S.rank === 4) c.pre = 'Клиент в ярости и требует старшего смены.';};
const _begin = begin; begin = function (f) {X1(); return _begin(f);};
/* ---- погоняло ---- */
const NICKS = ['Тихий', 'Профессор', 'Лис', 'Бульба', 'Гоша', 'Малой', 'Седой', 'Шахматист', 'Крот', 'Артист'];
const _startNew = startNew;
function scrNick() {
  showScr('<div class="box"><h2>🎭 Ваше погоняло</h2><p>В этой конторе все друг друга зовут прозвищами. Как будут звать вас?</p><input id="nickIn" maxlength="14" placeholder="Введите погоняло" value="" style="width:100%;padding:11px;border-radius:10px;border:1.5px solid #4a3a82;background:#1a1236;color:#f2ecff;font:700 18px sans-serif;text-align:center;-webkit-user-select:text;user-select:text"><div class="row" style="margin:8px 0">' + NICKS.map(n => '<button class="btn sm" data-a="v_nick" data-v="' + n + '">' + n + '</button>').join('') + '<button class="btn sm" data-a="v_nick" data-v="*">🎲</button></div><div class="row"><button class="btn pri" data-a="v_nickgo">▶ Приступить к работе</button></div></div>', true);
}
startNew = function () {scrNick();};
/* ---- хаб вечера ---- */
const evCost = () => X1().slots;
function scrHub() {
  X1(); const R = RK(), kr = ['нет', 'Привет от Палыча', 'Крыша Палыча', 'Полная защита'][S.kr];
  showScr('<div class="box"><h2>🌆 Вечер, ' + nick() + '</h2><p>Свободных вечерних действий: <b>' + S.slots + '</b> · деньги ' + fmt(S.money) + '</p><div class="opts"><button class="btn" data-a="h_home" data-v="summary">🏡 Дом</button><button class="btn" data-a="v_map">🗺 Город и офисы</button><button class="btn" data-a="v_pos">🎖 Должность</button><button class="btn" data-a="v_skills">🎓 Навыки</button><button class="btn" data-a="v_kr">🛡 Крыша · ' + kr + '</button><button class="btn" data-a="v_shop">🛒 Улучшения</button></div><div class="row" style="margin-top:8px"><button class="btn pri" data-a="next">🌅 Следующий день</button></div></div>', true);
}
function scrPos() {
  X1(); showScr('<div class="box"><h2>🎖 Позиция</h2><p>Выберите, где работать завтра. Отдельные диалоги и действия — на каждой позиции. Повышение открывает следующую, но вы можете вернуться на прежнюю.</p>' + RANKS.map((r, i) => {const open = i <= S.maxRank, next = i === S.maxRank + 1, price = 2500 * i; return '<div class="tech" style="' + (S.rank === i ? 'border-color:#ffd23a' : '') + '"><div>' + r.ic + ' <b>' + r.n + '</b><br><small>' + (open ? 'Оклад ' + fmt(SALARY[i]) + ' · комиссия ×' + r.credit + ' · план ×' + r.plan + '<br>Действия: ' + RANK_ACTS[i].map(a => a.ic + a.n).join(', ') : 'Нужно очков: ' + r.need + ' (у вас ' + S.xp + ')') + '</small></div>' + (open ? '<button class="btn sm' + (S.rank === i ? ' pri' : '') + '" data-a="v_setpos" data-v="' + i + '">' + (S.rank === i ? '✔' : 'Выбрать') + '</button>' : next ? '<button class="btn sm" data-a="v_buypos" data-v="' + i + '"' + (S.money < price ? ' disabled' : '') + '>Купить ' + fmt(price) + '</button>' : '<span>🔒</span>') + '</div>';}).join('') + '<div class="row" style="margin-top:8px"><button class="btn pri" data-a="v_hub">← Назад</button></div></div>', true);
}
function scrSkills() {
  X1(); showScr('<div class="box"><h2>🎓 Навыки и коучи</h2><p>Коучи сидят в офисах. Съездите на карту и займитесь с ними.</p>' + Object.keys(SKILLS).map(k => '<div class="tech"><div><b>' + SKILLS[k].n + '</b> ' + '★'.repeat(S.skills[k]) + '☆'.repeat(5 - S.skills[k]) + '<br><small>' + SKILLS[k].d + '</small></div></div>').join('') + '<div class="row" style="margin-top:8px"><button class="btn pri" data-a="v_hub">← Назад</button></div></div>', true);
}
function scrKr() {
  X1(); const T = [['Нет крыши', 0, ''], ['Привет от Палыча', 150, 'Риск −2/день'], ['Крыша Палыча', 350, 'Риск −5/день, раз в игре сорвёт обыск'], ['Полная защита', 700, 'Риск −9/день, срывает обыски (до 5 раз)']];
  showScr('<div class="box"><div class="av big">🧑‍✈️</div><h2 style="text-align:center">Палыч · «Крыша»</h2><p>Палыч — сотрудник службы безопасности. Если ему регулярно заносят, он закрывает глаза на многое. Но если перестанете платить, будет плохо.</p><p>Сейчас: <b>' + T[S.kr][0] + '</b></p>' + T.map((t, i) => '<div class="tech" style="' + (S.kr === i ? 'border-color:#ffd23a' : '') + '"><div><b>' + t[0] + '</b><br><small>' + (t[1] ? '₴' + t[1] + ' в день · ' : '') + t[2] + '</small></div><button class="btn sm' + (S.kr === i ? ' pri' : '') + '" data-a="v_krset" data-v="' + i + '">' + (S.kr === i ? '✔' : 'Выбрать') + '</button></div>').join('') + '<p style="color:#9a8fb8;font-size:12px">Платится в конце каждого дня. Не хватит денег — Палыч обидится, риск вырастет.</p><div class="row" style="margin-top:8px"><button class="btn pri" data-a="v_hub">← Назад</button></div></div>', true);
}
const KR_COST = [0, 150, 350, 700], KR_HEAT = [0, 2, 5, 9];
const _teamDaily = teamDaily;
teamDaily = function () {
  _teamDaily(); X1(); S.slots = 3; S.nextEn = 0;
  OFFICES.forEach(o => {if ((S.mgr[o.id] || 0) >= 4) {const i = OFFICES.indexOf(o); if (i === 0) S.boss = clamp(S.boss + 1, 0, 100); if (i === 1) S.money += 80; if (i === 2) S.energy = clamp(S.energy + 3, 0, 100); if (i === 3) S.heat = clamp(S.heat - 1, 0, 100); if (i === 4) S.money += 60; if (i === 5) S.cons = clamp(S.cons + 1, 0, 100);}});
  if (S.kr > 0) {if (S.money >= KR_COST[S.kr]) {S.money -= KR_COST[S.kr]; S.heat = clamp(S.heat - KR_HEAT[S.kr], 0, 100);} else {S.heat = clamp(S.heat + 10, 0, 100); S.kr = 0; toast('🛡 Палыч обиделся: денег нет, крыша снята. Риск +10.', 'bad');}}
};
/* ---- карта города ---- */
const CITY = [
  {id: 'cafe', n: 'Кафе «Тихий угол»', ic: '☕', bg: ['#4a3020', '#1a0e08'], em: ['☕', '🥐', '🛋'], d: 'Тихое место, где никто не задаёт вопросов.', fare: 0, acts: [
    {a: 'Выпить кофе (₴80)', fx: {money: -80, energy: 8}, say: ['Бариста улыбается: «Как обычно?»', 'За соседним столиком спорят про курс валют.']},
    {a: 'Посидеть с ноутбуком', fx: {energy: 4, cons: 1}, say: ['Вы смотрите в окно и впервые за день молчите.', 'Кофемашина шипит. Мир стал тише.']},
    {a: 'Заговорить с незнакомцем', fx: {cons: 1, energy: -2}, say: ['Незнакомец рассказывает, как его обманули. Вам неловко.', 'Пожилой человек делится рецептом борща и жизнью.']}]},
  {id: 'gym', n: 'Спортзал «Железо»', ic: '🏋', bg: ['#2a2a40', '#0c0c18'], em: ['🏋', '🥊', '💪'], d: 'Тренер говорит, что сила — в голове.', fare: 30, acts: [
    {a: 'Тренировка (₴150)', fx: {money: -150, energy: -8, cons: 2, nextEn: 8}, say: ['Тренер кричит: «Ещё подход, ' + '{nick}' + '!»', 'Мышцы гудят. Зато голова пустая.']},
    {a: 'Лёгкая разминка', fx: {energy: 2, cons: 1, nextEn: 3}, say: ['Вы размялись и вспомнили, что у вас есть тело.']},
    {a: 'Бокс с грушей', fx: {energy: -4, cons: 3, heat: -1}, say: ['Груша получила всё, что вы хотели сказать боссу.']}]},
  {id: 'mall', n: 'ТЦ «Мегаплаза»', ic: '🛍', bg: ['#3a2a5a', '#120a22'], em: ['🛍', '👗', '🍔'], d: 'Огни, скидки и отражения в витринах.', fare: 20, acts: [
    {a: 'Зайти в магазины одежды', open: 'ward'}, {a: 'Мебельный салон', open: 'furn'},
    {a: 'Фуд-корт (₴150)', fx: {money: -150, energy: 6}, say: ['Вы съели что-то с сыром и соусом. Счастье длилось 10 минут.']}]},
  {id: 'park', n: 'Парк «Вековой дуб»', ic: '🌳', bg: ['#1c4a2c', '#0a1a10'], em: ['🌳', '🦆', '🐿'], d: 'Дубы старше этой конторы.', fare: 0, acts: [
    {a: 'Прогуляться', fx: {energy: 3, cons: 2}, say: ['Листья шуршат. Телефон молчит. Отлично.', 'Вы увидели белку. Белка увидела вас. Мир.']},
    {a: 'Покормить уток', fx: {cons: 3, money: -20}, say: ['Утки ругаются, но благодарно.']},
    {a: 'Сесть на скамейку и подумать', fx: {cons: 2, energy: 2}, say: ['Вы думали о том, куда всё идёт. Не придумали.', 'Скамейка тёплая, мысли холодные.']}]},
  {id: 'bar', n: 'Бар «Два сома»', ic: '🍺', bg: ['#4a2a1a', '#140a06'], em: ['🍺', '🎱', '🎤'], d: 'Здесь шумно, и никто не слушает.', fare: 30, acts: [
    {a: 'Посидеть (₴200)', fx: {money: -200, energy: 5, cons: -1}, say: ['Бармен вытирает бокал: «Тяжёлый день?»', 'Музыка громкая, мысли тихие.']},
    {a: 'Послушать слухи', fx: {}, rumor: 1},
    {a: 'Найти нужного человека (₴300)', fx: {money: -300, heat: -4}, say: ['Незнакомец кивает: «Передам, кому надо».', 'Конверт пропал. Спокойствия прибавилось.']}]},
  {id: 'market', n: 'Рынок «Зелёный ряд»', ic: '🥬', bg: ['#4a5a2a', '#161e0a'], em: ['🥬', '🍎', '🐟'], d: 'Крики продавцов и запах укропа.', fare: 10, acts: [
    {a: 'Купить продукты (₴90)', fx: {money: -90, energy: 6}, say: ['Продавщица добавила лишний пучок укропа: «Вы мне нравитесь».']},
    {a: 'Поторговаться', fx: {energy: -2, cons: 1}, say: ['Вы сбили цену на гривну. Победа дня.']},
    {a: 'Послушать торговок', fx: {cons: 1}, say: ['«А у нас сосед на телефоне работает… странно, да?» — шепчутся торговки.']}]},
  {id: 'embank', n: 'Набережная', ic: '🌊', bg: ['#1a3a5a', '#0a0e1e'], em: ['🌊', '🌉', '⛵'], d: 'Вода не спрашивает, чем вы занимаетесь.', fare: 20, acts: [
    {a: 'Постоять у воды', fx: {cons: 3, energy: 2}, say: ['Вода течёт. Ваши проблемы — нет.']},
    {a: 'Позвонить маме', fx: {cons: 4, energy: -2}, say: ['Мама рассказывает про рассаду. Вы слушаете и молчите.']},
    {a: 'Бросить монетку в воду', fx: {money: -10, cons: 1}, say: ['Вы загадали желание. Конкретное. Пока секрет.']}]},
  {id: 'lib', n: 'Читальный зал', ic: '📚', bg: ['#3a2a1a', '#120c06'], em: ['📚', '🕯', '📜'], d: 'Тишина и пыль веков.', fare: 0, acts: [
    {a: 'Почитать', fx: {cons: 2, energy: 2}, say: ['Вы читаете страницу и понимаете, что давно не читали.']},
    {a: 'Найти справочник по праву', fx: {evidence: 1, energy: -2}, say: ['Вы выписали несколько интересных статей закона.']},
    {a: 'Поспать между стеллажами', fx: {energy: 7}, say: ['Библиотекарь делает вид, что не видит.']}]}
];
const LOC_EV = [
  {t: 'Дорога', d: 'Вы идёте по улице и видите, как пожилой человек что-то роняет.', ch: [{a: 'Помочь поднять', fx: {cons: 3, energy: -1}}, {a: 'Пройти мимо', fx: {cons: -1}}]},
  {t: 'Незнакомец', d: 'К вам подходит человек: «Скажите, а вы случайно не из той конторы?»', ch: [{a: 'Отрицать', fx: {heat: 1}}, {a: 'Отшутиться', fx: {energy: -1}}, {a: 'Ускорить шаг', fx: {}}]},
  {t: 'Кошелёк', d: 'На земле лежит чей-то кошелёк.', ch: [{a: 'Вернуть владельцу', fx: {cons: 4, energy: -2}}, {a: 'Взять ₴200 себе', fx: {money: 200, cons: -4}}, {a: 'Оставить как есть', fx: {}}]},
  {t: 'Бывший клиент', d: 'Вас зовёт человек, чей голос вы помните.', ch: [{a: 'Притвориться, что не слышите', fx: {cons: -2}}, {a: 'Извиниться', fx: {cons: 4, energy: -3}}]},
  {t: 'Уличный музыкант', d: 'Играет старую песню. Все останавливаются.', ch: [{a: 'Бросить ₴50', fx: {money: -50, cons: 2}}, {a: 'Постоять молча', fx: {cons: 1}}]}
];
const RUMORS = ['«Говорят, на «Складе №7» ищут нового управляющего.»', '«Слышал, Палыч берёт больше с тех, кто платит реже».', '«Инга из «Колоса» водит клиентов на экскурсии. По-моему, это глупо, но работает».', '«В подвале на Заводской недавно поменялся коуч. Учит жёстко».', '«Юлия из комплаенса ведёт какую-то свою папку. Лучше с ней быть честным».', '«Эдик на курорте раздаёт отгулы тем, кто привозит ему коктейли».', '«Одного из старших вчера увезли. Но это шёпотом».'];
const mapCols = o => o.bg || ['#2a2050', '#150c30'];
function drawLoc(cv, L, t) {
  const g = cv.getContext('2d'), w = cv.width, h = cv.height, s = h / 200; g.clearRect(0, 0, w, h);
  const bg = g.createLinearGradient(0, 0, 0, h); bg.addColorStop(0, L.bg[0]); bg.addColorStop(1, L.bg[1]); g.fillStyle = bg; g.fillRect(0, 0, w, h);
  for (let i = 0; i < 30; i++) {g.fillStyle = 'rgba(255,255,255,' + (.1 + Math.sin(t * 2 + i) * .08) + ')'; g.fillRect((i * 97 % 100) / 100 * w, (i * 53 % 60) / 100 * h, 1.5 * s, 1.5 * s);}
  g.fillStyle = 'rgba(0,0,0,.35)'; g.fillRect(0, h * .72, w, h * .28);
  g.textAlign = 'center'; g.font = 72 * s + 'px sans-serif'; g.fillText(L.em[0], w * .5, h * .58 + Math.sin(t) * 3);
  g.font = 36 * s + 'px sans-serif'; g.fillText(L.em[1], w * .2, h * .66 + Math.sin(t * 1.3) * 2); g.fillText(L.em[2], w * .8, h * .66 + Math.cos(t * 1.1) * 2);
  g.font = 20 * s + 'px sans-serif'; g.fillText('🚶', w * (.3 + ((t * .03) % .4)), h * .88);
}
function scrMap() {
  X1(); showScr('<div class="box"><h2>🗺 Город и офисы</h2><p>Вечерних действий: <b>' + S.slots + '</b>. Каждая поездка берёт одно.</p><h3>🏢 Офисы (коучи и управляющие)</h3>' + OFFICES.map(o => '<div class="tech"><div>' + o.ic + ' <b>' + o.n + '</b><br><small>' + o.mgr.role + ': ' + o.mgr.n + ' · доверие ' + (S.mgr[o.id] || 0) + '/4 · билет ' + fmt(o.fare) + '</small></div><button class="btn sm" data-a="v_go" data-v="o:' + o.id + '"' + (S.slots <= 0 || S.money < o.fare ? ' disabled' : '') + '>Ехать</button></div>').join('') + '<h3>🌆 Город</h3>' + CITY.map(c => '<div class="tech"><div>' + c.ic + ' <b>' + c.n + '</b><br><small>' + c.d + (c.fare ? ' · ' + fmt(c.fare) : '') + '</small></div><button class="btn sm" data-a="v_go" data-v="c:' + c.id + '"' + (S.slots <= 0 || S.money < c.fare ? ' disabled' : '') + '>Идти</button></div>').join('') + '<div class="row" style="margin-top:8px"><button class="btn pri" data-a="v_hub">← Назад</button></div></div>', true);
}
let locCur = null;
function openLoc(kind, id, msg) {
  X1(); const L = kind === 'o' ? OFFICES.find(x => x.id === id) : CITY.find(x => x.id === id); locCur = {kind, id}; const tm = setInterval(() => {const cv = document.getElementById('lc'); if (!cv) return clearInterval(tm); drawLoc(cv, L, performance.now() / 1000);}, 120);
  let body = '';
  if (kind === 'o') {const co = COACHES[L.coach], lvl = S.skills[co.skill], cost = 400 + lvl * 500, m = L.mgr, rel = S.mgr[L.id] || 0, vis = S.vis[L.id] || {};
    body = '<div class="tech"><div>' + co.ic + ' <b>' + co.n + '</b> · коуч<br><small>' + co.d + ' · ' + SKILLS[co.skill].n + ' ' + '★'.repeat(lvl) + '☆'.repeat(5 - lvl) + '</small></div><button class="btn sm" data-a="v_train" data-v="' + L.id + '"' + (lvl >= 5 || S.money < cost || vis.t ? ' disabled' : '') + '>' + (lvl >= 5 ? 'Макс' : vis.t ? 'Уже' : fmt(cost)) + '</button></div>' +
      '<div class="tech"><div>' + m.ic + ' <b>' + m.n + '</b> · ' + m.role + '<br><small>Доверие ' + rel + '/4 · при 4: ' + m.perk + '</small></div></div>' + '<div class="opts"><button class="btn" data-a="v_mgr" data-v="adv"' + (vis.m ? ' disabled' : '') + '>💬 Совет</button><button class="btn" data-a="v_mgr" data-v="gift"' + (vis.m || S.money < 500 ? ' disabled' : '') + '>✉ Конверт ₴500</button><button class="btn" data-a="v_mgr" data-v="chat"' + (vis.m ? ' disabled' : '') + '>☕ Поговорить</button></div>';}
  else body = '<div class="col">' + L.acts.map((a, i) => '<button class="btn" data-a="v_act" data-v="' + i + '">' + a.a + '</button>').join('') + '</div>';
  showScr('<div class="box"><h2>' + L.ic + ' ' + L.n + '</h2><canvas id="lc" width="720" height="300" style="width:100%;border-radius:12px;border:1.5px solid #4a3a82"></canvas><p>' + L.d + '</p>' + (msg ? '<p class="help">' + msg + '</p>' : '') + body + '<div class="row" style="margin-top:8px"><button class="btn pri" data-a="v_map">← На карту</button></div></div>', true);
}
function goLoc(v) {
  X1(); const [k, id] = v.split(':'), L = k === 'o' ? OFFICES.find(x => x.id === id) : CITY.find(x => x.id === id); if (S.slots <= 0 || S.money < L.fare) return; S.slots--; S.money -= L.fare; S.energy = clamp(S.energy - (k === 'o' ? 6 : 1), 0, 100); Snd.sfx('engine'); renderHud();
  if (Math.random() < .4) {const e = pick(LOC_EV); S.curLoc = v; S.curLocEv = LOC_EV.indexOf(e); showScr('<div class="box"><h2>🚶 ' + e.t + '</h2><p>' + e.d + '</p><div class="col">' + e.ch.map((c, i) => '<button class="btn' + (i ? '' : ' pri') + '" data-a="v_lev" data-v="' + i + '">' + c.a + '</button>').join('') + '</div></div>', true); return;}
  openLoc(k, id);
}
/* ---- клики ---- */
const FXK = ['cons', 'heat', 'boss', 'energy'];
const fxAll = fx => {FXK.forEach(q => {if (fx[q]) S[q] = clamp(S[q] + fx[q], 0, 100);}); if (fx.money) S.money += fx.money; if (fx.evidence) S.evidence += fx.evidence; if (fx.nextEn) S.nextEn = (S.nextEn || 0) + fx.nextEn; if (fx.slots) S.slots += fx.slots; if (fx.kr !== undefined) S.kr = fx.kr; renderHud();};
document.addEventListener('click', e => {
  const b = e.target.closest('[data-a^="v_"]'); if (!b || b.disabled) return; X1(); const a = b.dataset.a, v = b.dataset.v; Snd.sfx('click');
  if (a === 'v_nick') {const inp = document.getElementById('nickIn'); inp.value = v === '*' ? pick(NICKS) : v;}
  else if (a === 'v_nickgo') {const inp = document.getElementById('nickIn'); const nm = (inp.value || '').trim() || 'Новичок'; _startNew(); X1(); S.nick = nm; renderHud(); toast('Погоняло: «' + nm + '»', 'ok');}
  else if (a === 'v_hub') scrHub(); else if (a === 'v_map') scrMap(); else if (a === 'v_pos') scrPos(); else if (a === 'v_skills') scrSkills(); else if (a === 'v_kr') scrKr(); else if (a === 'v_shop') daySummaryRerender();
  else if (a === 'v_setpos') {S.rank = +v; Snd.sfx('stamp'); toast('Завтра вы работаете: ' + RK().ic + ' ' + RK().n, 'ok'); scrPos();}
  else if (a === 'v_buypos') {const p = 2500 * +v; if (S.money >= p) {S.money -= p; S.maxRank = +v; S.rank = +v; Snd.sfx('promo'); toast('🎖 Вы купили рекомендацию: ' + RK().n, 'ok');} scrPos();}
  else if (a === 'v_krset') {S.kr = +v; Snd.sfx(S.kr ? 'coin' : 'lock'); scrKr();}
  else if (a === 'v_go') goLoc(v);
  else if (a === 'v_lev') {const e2 = LOC_EV[S.curLocEv], c = e2.ch[+v]; fxAll(c.fx); const [k, id] = S.curLoc.split(':'); openLoc(k, id, '🚶 ' + e2.t + ': ' + c.a + '.');}
  else if (a === 'v_act') {const L = CITY.find(x => x.id === locCur.id), A = L.acts[+v]; if (A.open) {H().from = 'summary'; return scrShop(A.open);} if (A.rumor) {return openLoc('c', L.id, pick(RUMORS));} if (A.fx.money && S.money + A.fx.money < 0) return toast('Не хватает денег.', 'bad'); fxAll(A.fx); Snd.sfx(A.fx.money ? 'coin' : 'notif'); openLoc('c', L.id, pick(A.say).replace('{nick}', nick()));}
  else if (a === 'v_train') {const L = OFFICES.find(x => x.id === v), co = COACHES[L.coach], lvl = S.skills[co.skill], cost = 400 + lvl * 500; if (S.money < cost || lvl >= 5) return; S.money -= cost; S.skills[co.skill]++; S.vis[L.id] = S.vis[L.id] || {}; S.vis[L.id].t = 1; S.energy = clamp(S.energy - 4, 0, 100); Snd.sfx('promo'); renderHud(); openLoc('o', L.id, co.ic + ' ' + co.n + ': ' + pick(co.tips) + '<br>' + pick(co.ok).replace('{nick}', nick()) + '<br><b>' + SKILLS[co.skill].n + ' → ' + S.skills[co.skill] + '/5</b>');}
  else if (a === 'v_mgr') {const L = OFFICES.find(x => x.id === locCur.id), m = L.mgr; S.vis[L.id] = S.vis[L.id] || {}; S.vis[L.id].m = 1; let add = 1, msg = m.ic + ' ' + m.n + ': ' + pick(m.q); if (v === 'adv') {S.buffAdvice = 1; msg += '<br>Совет: +5 к убеждению в следующем звонке.';} else if (v === 'gift') {S.money -= 500; S.heat = clamp(S.heat + 2, 0, 100); S.cons = clamp(S.cons - 2, 0, 100); add = 2; msg += '<br>Конверт принят. Доверие +2, риск +2.'; Snd.sfx('coin');} else {S.cons = clamp(S.cons + 1, 0, 100); msg += '<br>Разговор по душам. Совесть +1.';} S.mgr[L.id] = Math.min(4, (S.mgr[L.id] || 0) + add); renderHud(); openLoc('o', L.id, msg);}
});
const _nextDay8 = nextDay;
nextDay = function () {X1(); S.vis = {}; return _nextDay8();};
const _applyEvent = applyEvent;
applyEvent = function (v) {const [i, k] = String(v).split(':').map(Number), fx = EVENTS[i] && EVENTS[i].ch[k] && EVENTS[i].ch[k].fx; _applyEvent(v); if (fx) {X1(); if (fx.slots) S.slots += fx.slots; if (fx.kr !== undefined) S.kr = fx.kr;}};
/* охрана Палыча спасает от обыска */
setInterval(() => {if (!S || !running || S.kr < 2 || S.heat < 85 || !S.kr) return; const lim = S.kr === 3 ? 5 : 1; if ((S.krSaves || 0) >= lim) return; S.krSaves++; S.heat = 60; Snd.sfx('good'); toast('🛡 Палыч предупредил о проверке и «решил вопрос»: риск снижен.', 'ok'); renderHud();}, 400);
/* ---- HR: легче и быстрее ---- */
ACTS.walk = {n: '🚶 Прогулка', cost: 100, aff: [8, 12], ann: 8, min: 20}; ACTS.movie = {n: '🎬 Кино', cost: 250, aff: [10, 15], ann: 10, min: 35};
ACTS.date.min = 40; ACTS.home.min = 55;
/* ---- новые события ---- */
EVENTS.push(
  {t: 'Конкурс «Лучший оператор»', req: () => S.day >= 3, d: 'Директор объявляет конкурс: призовой фонд ₴400.', ch: [{a: 'Участвовать', fx: {energy: -5, boss: 3, money: 150}}, {a: 'Сидеть тихо', fx: {}}]},
  {t: 'Мотивационный гуру', req: () => S.day >= 4, d: 'В офис пришёл гуру с билетами на «тренинг». ₴300.', ch: [{a: 'Купить билет', fx: {money: -300, boss: 2, cons: -1}}, {a: 'Отказаться', fx: {boss: -1}}]},
  {t: 'Новичок на стажировке', req: () => S.rank >= 1, d: 'К вам прикрепили стажёра. Он смотрит на вас большими глазами.', ch: [{a: 'Научить по-честному', fx: {cons: 3, energy: -3, boss: 1}}, {a: 'Научить грязным приёмам', fx: {cons: -4, boss: 3}}, {a: 'Отмахнуться', fx: {boss: -1}}]},
  {t: 'Жалоба дошла до босса', req: () => S.day >= 4, d: 'Бывший клиент написал жалобу. Босс вызывает вас.', ch: [{a: 'Оправдываться', fx: {boss: -3, heat: 2}}, {a: 'Свалить на коллегу', fx: {boss: 1, cons: -3}}, {a: 'Взять вину на себя', fx: {boss: -1, cons: 2}}]},
  {t: 'Палыч просит занести', req: () => S.kr === 0 && S.day >= 2, d: 'Палыч из службы безопасности подмигивает: «Хочешь спать спокойно? Заносим по чуть-чуть».', ch: [{a: 'Оформить «привет от Палыча»', fx: {kr: 1, money: -150, heat: -2}}, {a: 'Занести разово ₴300', need: {money: 300}, fx: {money: -300, heat: -6}}, {a: 'Сказать «потом»', fx: {heat: 3, boss: -1}}]},
  {t: 'Палыч улыбается', req: () => S.kr > 0, d: 'Палыч прошёл по этажу и ничего не заметил. Как и договаривались.', ch: [{a: 'Кивнуть', fx: {heat: -2}}, {a: 'Шепнуть «спасибо»', fx: {heat: -3, cons: -1}}]},
  {t: 'Записка от HR', req: () => HRS.some(g => H().hr[g.id].aff >= 30 && !H().hr[g.id].blocked), d: 'На вашем столе записка с нарисованным сердечком. Подписи нет.', ch: [{a: 'Улыбнуться и спрятать', fx: {cons: 1, energy: 3}}, {a: 'Расспросить коллег', fx: {boss: -1, energy: 1}}]},
  {t: 'Приглашение в офис', req: () => S.day >= 6, d: 'Управляющий другого офиса приглашает вас на неделю обмена опытом.', ch: [{a: 'Принять (дополнительный вечер)', fx: {slots: 1, energy: -3}}, {a: 'Отказаться вежливо', fx: {boss: 1}}]},
  {t: 'Перебои со связью', req: () => S.life.n === 0, d: 'Мобильный интернет умер посреди разговора.', ch: [{a: 'Перезвонить с городского', fx: {energy: -3}}, {a: 'Ждать', fx: {boss: -1}}]},
  {t: 'Кофемашина сломалась', req: () => S.day >= 2, d: 'Весь этаж без кофе. Нервы на пределе.', ch: [{a: 'Скинуться на ремонт ₴50', fx: {money: -50, cons: 1, boss: 1}}, {a: 'Пойти за кофе в кафе', fx: {money: -80, energy: 6}}]},
  {t: 'Сквозняк', req: () => S.day >= 3, d: 'Сквозняк в вашей части офиса. Все чихают.', ch: [{a: 'Закрыть окно', fx: {energy: 2}}, {a: 'Терпеть', fx: {energy: -4}}]},
  {t: 'Подарок от управляющего', req: () => Object.values(S.mgr || {}).some(x => x >= 2), d: 'Курьер принёс коробку с запиской: «Не забывай нас».', ch: [{a: 'Открыть', fx: {money: 200, cons: -1}}, {a: 'Отнести боссу', fx: {boss: 3}}]}
);
DILEMMAS.push(
  {t: 'Голос в трубке дрожит', d: 'Человек заикается, но продолжает слушать.', ch: [{a: 'Мягко успокоить', fx: {susp: -8, pers: 6, cons: 1}}, {a: 'Использовать момент', fx: {pers: 18, cons: -6}}, {a: 'Закончить звонок', end: 'hang', fx: {cons: 2}}]},
  {t: 'Человек просит бумагу', d: '«Пришлите мне это письменно, с печатью».', ch: [{a: 'Пообещать «в течение дня»', fx: {pers: 6, susp: 8}}, {a: 'Отказаться', fx: {susp: 14}}, {a: 'Закончить разговор', end: 'hang'}]},
  {t: 'Коллега просит тишины', d: 'Рядом кричит коллега, и человек всё слышит.', ch: [{a: 'Зажать микрофон', fx: {susp: -4}}, {a: 'Продолжать как ни в чём не бывало', fx: {susp: 10}}]},
  {t: 'Хозяин спрашивает адрес', d: '«А где вы находитесь? Я приеду сам».', ch: [{a: 'Назвать выдуманный адрес', fx: {pers: 8, susp: 14, heat: 2}}, {a: 'Уйти от ответа', fx: {susp: 10}}, {a: 'Сбросить', end: 'hang'}]},
  {t: 'Человек просит поклясться', d: '«Поклянитесь, что это правда!»', ch: [{a: 'Поклясться (низко)', fx: {pers: 16, cons: -6, susp: 4}}, {a: 'Промолчать', fx: {susp: 12}}, {a: 'Признаться', end: 'warn'}]}
);
/* ---- новости ---- */
function scrNews() {
  showScr('<div class="box"><h2>📰 Что нового</h2><p style="color:#ff7adf;font-weight:800">' + TITLE8 + ' · ' + BUILD8 + '</p><h3>В этом обновлении</h3><p>• <b>1.0.9:</b> вы стоите на своей позиции один, офис перепланирован (лампы, перегородки, кулер, принтер, растение, стажёр с бумагами), 13 новых офисных событий, «конец смены» и эпилог в финале<br>• Игра теперь 30 дней, а не 14<br>• Ваш персонаж виден в сцене и меняется вместе с позицией и одеждой<br>• Своё погоняло<br>• Выбор позиции: Первая холодка, Вторая холодка, Клоузер, «Мусор», Пульт. У каждой свои действия и реплики<br>• Коучи в офисах: 5 навыков, прокачка до 5 уровня, свои фразы у каждого коуча<br>• Управляющие офисами и поездки по другим офисам: учёба и бонусы<br>• Много локаций: 6 офисов и 8 мест города<br>• Палыч теперь «Крыша» из службы безопасности: берёт деньги и закрывает глаза. «Мусор» — отдельная позиция<br>• HR-девушки сдаются быстрее: легче расположить, новые прогулки и кино<br>• Много новых событий и вариантов ответа</p><h3>Ранее</h3><p>• Меню, коллеги, дом и мебель, питомцы, достижения, диалоги по этапам</p><div class="row" style="margin-top:8px"><button class="btn pri" data-a="x_close">Понятно</button></div></div>', true); lsSet('cc_news_110', 1);
}

const _ds8 = daySummary;
daySummary = function () {_ds8(); const n = document.querySelector('#scr [data-a="next"]'); if (n && S.mode === 'summary' && S.day < DAYS) n.parentNode.insertAdjacentHTML('afterbegin', '<button class="btn" data-a="v_hub">🌆 Вечер</button>');};
/* ======== build 1.0.9: офисные моменты и эпилог ======== */
EVENTS.push(
  {t: 'Корпоратив в пятницу', req: () => S.day >= 5, d: 'Начальство объявило корпоратив в переговорке: торт, шарики и тост за «честный бизнес».', ch: [{a: 'Остаться до конца', fx: {boss: 4, energy: -6, cons: -1}}, {a: 'Заглянуть на пять минут', fx: {boss: 1}}, {a: 'Уйти по-английски', fx: {boss: -2, energy: 3}}]},
  {t: 'Именинник в отделе', req: () => S.day >= 2, d: 'У Димы день рождения. Все скидываются на подарок.', ch: [{a: 'Скинуться ₴100', fx: {money: -100, cons: 2, boss: 1}}, {a: 'Подписать открытку', fx: {cons: 1}}, {a: 'Сделать вид, что занят', fx: {cons: -1}}]},
  {t: 'Сломался принтер', req: () => S.day >= 2, d: 'Принтер пережёвывает бумагу. Вся смена стоит в очереди.', ch: [{a: 'Починить самому', fx: {energy: -3, boss: 2}}, {a: 'Пнуть принтер', fx: {cons: 1, energy: 1}}, {a: 'Пойти в другой кабинет', fx: {energy: -2}}]},
  {t: 'Пожарная тревога', req: () => S.day >= 3, d: 'Завыла сирена. Охрана просит всех выйти во двор.', ch: [{a: 'Выйти со всеми', fx: {energy: 4, heat: 1}}, {a: 'Остаться работать', fx: {boss: 3, energy: -4}}]},
  {t: 'Проверка чистоты', req: () => S.day >= 3, d: 'Завхоз ходит по рядам и осматривает столы.', ch: [{a: 'Быстро прибрать', fx: {energy: -2, boss: 1}}, {a: 'Сказать, что это «творческий беспорядок»', fx: {boss: -1, cons: 1}}]},
  {t: 'Новый кулер', req: () => S.day >= 2, d: 'Привезли новый кулер. Очередь за водой — как за зарплатой.', ch: [{a: 'Занять очередь', fx: {energy: 2}}, {a: 'Налить из-под крана', fx: {energy: -1}}]},
  {t: 'Скучающий стажёр', req: () => S.day >= 4, d: 'Стажёр сидит и крутит ручку. «А что мне делать?»', ch: [{a: 'Дать задание', fx: {cons: 1, boss: 1, energy: -2}}, {a: 'Отправить за кофе', fx: {energy: 3}}]},
  {t: 'Собрание «пятиминутка»', req: () => S.day >= 3, d: 'Босс собрал всех на «пятиминутку», которая длится сорок.', ch: [{a: 'Кивать и записывать', fx: {boss: 3, energy: -4}}, {a: 'Играть в телефон', fx: {boss: -2, energy: 2}}]},
  {t: 'Вечеринка в курилке', req: () => S.day >= 3, d: 'В курилке рассказывают анекдоты, и никто не работает.', ch: [{a: 'Присоединиться', fx: {energy: 3, boss: -1, cons: 1}}, {a: 'Пройти мимо', fx: {boss: 1}}]},
  {t: 'Подарочные ручки', req: () => S.day >= 2, d: 'Каждому сотруднику раздают ручки с логотипом фирмы «Золотой Бульбаш».', ch: [{a: 'Взять две', fx: {cons: -1}}, {a: 'Отдать другу', fx: {cons: 1}}]},
  {t: 'Уборщица тётя Галя', req: () => S.day >= 2, d: 'Тётя Галя моет пол и ворчит: «Не пойму, чем вы тут все занимаетесь».', ch: [{a: 'Угостить конфетой', fx: {cons: 2}}, {a: 'Соврать про «сервис»', fx: {cons: -1}}, {a: 'Промолчать', fx: {}}]},
  {t: 'Жалоба на шум', req: () => S.day >= 3, d: 'Соседний офис жалуется на крик в вашем отделе.', ch: [{a: 'Говорить тише', fx: {heat: -1, boss: 1}}, {a: 'Закрыть дверь', fx: {heat: 1}}]},
  {t: 'Фото на стенд', req: () => S.day >= 4, d: 'Фотограф снимает «лучшие лица компании» для стенда в коридоре.', ch: [{a: 'Позировать', fx: {boss: 2, heat: 2}}, {a: 'Отказаться', fx: {heat: -1}}]}
);
const SHIFT_END = ['Свет в коридоре гаснет, остаётся только гудение кулера.', 'Дима прощается, не отрываясь от экрана.', 'Тётя Галя уже моет пол между рядами.', 'За окном загораются фонари. Телефоны наконец молчат.', 'Кто-то ещё допечатывает отчёт, остальные расходятся по домам.', 'Принтер выплёвывает последнюю страницу и затихает.', 'В кабинете директора ещё горит свет.'];
const _ds9 = daySummary;
daySummary = function () {_ds9(); const bx = document.querySelector('#scr .box'); if (bx && S.mode === 'summary') {const h2 = bx.querySelector('h2'); if (h2) h2.insertAdjacentHTML('afterend', '<p style="color:#9a8fb8;font-size:12px;margin:2px 0 6px">🌇 ' + pick(SHIFT_END) + '</p>');}};
const _ending9 = ending;
ending = function (k) {
  X1(); const gf = S.home && S.home.gf ? HRS.find(g => g.id === S.home.gf) : null; const o = [];
  o.push('Тебя звали «' + nick() + '», и это прозвище ещё долго вспоминали в этих коридорах.');
  if (S.kr >= 2) o.push('Палыч из охраны ещё долго спрашивал у нового стажёра: «А ' + nick() + ' не заходил?»'); else if (S.kr === 0 && k !== 'raid') o.push('Палыч из охраны так и не получил своё «спасибо». Но и не особо обиделся.');
  if (gf) o.push(gf.n + ' иногда пишет тебе, и вы пока не решили, что у вас.');
  const best = Object.keys(S.skills || {}).sort((a, b) => S.skills[b] - S.skills[a])[0]; if (best && S.skills[best] > 0) o.push('Чему научился: ' + SKILLS[best].n.replace(/^\S+\s/, '') + ' — и это останется с тобой.');
  const mg = OFFICES.filter(x => (S.mgr[x.id] || 0) >= 4).map(x => x.mgr.n); if (mg.length) o.push('Управляющие (' + mg.join(', ') + ') помнят тебя как человека слова.');
  if (S.pets && S.pets.length) o.push('Дома тебя ждёт хвостатая компания.');
  o.push(k === 'whistle' || k === 'conscience' && false ? 'Ты вышел из этой истории с чистыми руками.' : k === 'raid' || k === 'fired' ? 'Это был последний день на этом этаже.' : 'Офис опустел, и ты впервые слышишь тишину.');
  _ending9(k); const bx = document.querySelector('#scr .box'); if (bx) {const rows = bx.querySelectorAll('.row'), last = rows[rows.length - 1]; const html = '<div class="help" style="text-align:left;margin:8px 0"><b>📖 Эпилог</b><br>' + o.join('<br>') + '</div>'; if (last) last.insertAdjacentHTML('beforebegin', html); else bx.insertAdjacentHTML('beforeend', html);}
};
