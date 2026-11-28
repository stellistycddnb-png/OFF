/* ======== build 1.6.0 «ЗОЛОТОЙ КОРПОРАТИВ»: диалоги с ответами на вопросы клиента, обновления и связь внутри игры, новые клиенты и легенды ======== */
const BUILD_V = '1.9.15', BUILD_NAME = 'ЗОЛОТОЙ КОРПОРАТИВ';
const TG_UPD = 'https://t.me/SMENAGAME';
const UPD_URL = 'https://raw.githubusercontent.com/stellistycddnb-png/OFF/main/www/';
/* ---------- 1. Логика: клиент задал вопрос → агент отвечает именно на него ---------- */
const INTENT_RX = [
  ['real', /(развод|обман|скам|мошенник|бред|нелепо|придумал|не верится|не сходится)/i],
  ['proof', /(документ|лиценз|удостоверени|подтвердите|договор|письменно|на почту|официальн|проверю|проверил)/i],
  ['cost', /(сколько|сумм[ауы]\?|цифру|в гривнах|стоит|реквизиты получателя)/i],
  ['why', /(почему именно|точно про меня|с какой стати|платить за|зачем.*плат|платить\?)/i],
  ['who', /(кто это|кто вы|кто будете|представьтесь|какая организация|что за организация|назовите организацию|откуда вы (вообще )?звоните|вы откуда звоните|фамилию и должность|не знаю\. что вам|что за контора)/i],
  ['src', /(откуда у вас|кто дал вам|мой номер|этот номер)/i],
  ['hear', /(громче|проще|по-человечески|плохо слышу|не разбираюсь)/i],
  ['brief', /(коротко|кратко|быстро|некогда|две минуты|совещание|в пробке|за рулём)/i],
  ['thing', /(по какому вопросу|что случилось|что вам нужно|к чему вы ведёте|зачем вы звоните|что дальше)/i]
];
const detectIntent = t => {for (const [k, rx] of INTENT_RX) if (rx.test(t || '')) return k; return null;};
const ANS = {
  who: {pressure: ['«Старший специалист {company}. Отвечайте быстро: окно по вашему делу закрывается.»', '«{company}, отдел срочных обращений. Времени у нас немного.»'], flattery: ['«Артём, {company}. Беспокою вас, потому что вы, судя по голосу, человек разумный.»', '«{company}, меня зовут Артём. С такими собеседниками, как вы, работать одно удовольствие.»'], jargon: ['«Артём, {company}, отдел сопровождения. Номер заявки 7-Б, пригодится для протокола.»', '«{company}, служба верификации. Ваш регистрационный профиль активен.»'], empathy: ['«Меня зовут Артём, я из {company}. Понимаю, звонок неожиданный, — постараюсь быть кратким и честным.»', '«Артём, компания {company}. Спасибо, что не бросили трубку, это важно.»']},
  src: {pressure: ['«Номер из нашего реестра участников. Сейчас важнее другое: {thing}.»', '«Из базы обращений. Времени мало, речь о: {thing}.»'], flattery: ['«Ваш номер значится среди проверенных участников — выбрали не случайно: {thing}.»', '«Вас рекомендовали как надёжного человека. Поэтому звоню по поводу: {thing}.»'], jargon: ['«Номер взят из реестра обращений по протоколу 3-А: {thing}.»', '«Он числится в базе участников программы, статус по ней: {thing}.»'], empathy: ['«Понимаю, что настораживает. Номер из реестра участников программы, по которой идёт {thing}.»', '«Вы правы, что спрашиваете. Он у нас в списке по теме: {thing}.»']},
  proof: {pressure: ['«Документы придут после подтверждения. Решение нужно сегодня.»'], flattery: ['«Вам я пришлю всё лично: документы будут сразу после подтверждения.»'], jargon: ['«Договор формируется автоматически после верификации, номер придёт в СМС.»'], empathy: ['«Правильно, что просите документы. Они придут сразу после подтверждения заявки.»']},
  cost: {pressure: ['«{fee} — {amt} ₴. Решайте сегодня.»'], flattery: ['«Для вас {fee} — всего {amt} ₴, сущая мелочь.»'], jargon: ['«{fee} по тарифу 3-Б составляет {amt} ₴, возвращается при закрытии протокола.»'], empathy: ['«Совсем немного: {fee} — {amt} ₴. Я знаю, что деньги нелегко достаются.»']},
  why: {pressure: ['«Так устроена процедура: без {fee} дело не двинется.»'], flattery: ['«Потому что вы доводите дело до конца. {fee} — формальность.»'], jargon: ['«По регламенту {fee} закрывает этап верификации: {thing}.»'], empathy: ['«Понимаю, неприятно. Но {fee} — единственный способ закрыть вопрос: {thing}.»']},
  real: {pressure: ['«Это не обман. Но вы теряете время, пока сомневаетесь.»'], flattery: ['«Умный человек и должен сомневаться. Всё прозрачно: {company}.»'], jargon: ['«Нет, это стандартная процедура {company}, протокол 7-Б.»'], empathy: ['«Понимаю ваш страх, сейчас много обмана. Мы работаем открыто: {company}.»']},
  hear: {pressure: ['«Повторяю проще: {thing}. Решайте.»'], flattery: ['«Скажу проще, вы всё поймёте: {thing}.»'], jargon: ['«Если по-простому: {thing}.»'], empathy: ['«Конечно, повторю помедленнее: {thing}.»']},
  brief: {pressure: ['«Коротко: {thing}. Нужно решение сегодня.»'], flattery: ['«Коротко, уважая ваше время: {thing}.»'], jargon: ['«Суть в одной строке: {thing}.»'], empathy: ['«Не задержу. Коротко: {thing}.»']},
  thing: {pressure: ['«Коротко: {thing}. Нужно решить сегодня.»'], flattery: ['«Речь о: {thing}. Именно такому человеку, как вы, это интересно.»'], jargon: ['«Обращение по реестру: {thing}.»'], empathy: ['«Хочу помочь вам с вопросом: {thing}. Расскажу спокойно и по порядку.»']}
};
const _lf20 = lineFor;
lineFor = function (c, type, st) {
  const live = !!window.__commit, k = c.pend;
  if (!k || !ANS[k] || !ANS[k][type]) return _lf20(c, type, st);
  c.amt = c.amt || pick([49, 99, 149, 199, 299]);
  let t = pick(ANS[k][type]), ctx = Object.assign({}, c, {});
  const keepM = c.mention; t = fillN(t, c).replace(/\{company\}/g, COMPANY).replace(/\{amt\}/g, c.amt);
  if (k === 'who') t = t.replace(/»$/, ' Звоню по поводу: ' + fillN('{thing}', c) + '.»');
  t = gx(t, false);
  if (live) {window.__commit = false; c.lastType = type; c.lastLine = t; c.greeted = true; c.pend = null; c.pers += 5; c.answered = (c.answered || 0) + 1; c.lastAns = k;} else c.mention = keepM;
  return t;
};
const _ch20 = choose;
choose = function (type) {
  const c0 = S.call; _ch20(type); const c = S.call;
  if (c && c === c0 && ['pressure', 'flattery', 'jargon', 'empathy'].includes(type) && c.lastReply) c.pend = detectIntent(c.lastReply);
};
/* ---------- 2. Новые клиенты и легенды ---------- */
PEOPLE.push(
  {name: 'Раиса Захаровна', age: 74, ic: '👵', mood: 'elder', bio: 'Бывшая заведующая библиотекой. Всё записывает в тетрадку.'},
  {name: 'Вера Ивановна', age: 80, ic: '👵', mood: 'elder', bio: 'Живёт с кошкой. Любит поговорить и плохо видит цифры.'},
  {name: 'Анатолий', age: 61, ic: '🧔', mood: 'skeptic', bio: 'Дальнобойщик. Всё слышал, всему не верит.'},
  {name: 'Кристина', age: 31, ic: '💁‍♀️', mood: 'busy', bio: 'Менеджер по продажам. Сама звонит людям и узнаёт приёмы.'},
  {name: 'Денис', age: 23, ic: '🧑‍💻', mood: 'student', bio: 'Геймер, не спит ночью. Любит технику, лесть ненавидит.'},
  {name: 'Ярослава', age: 41, ic: '👩‍🏫', mood: 'trusting', bio: 'Воспитательница. Добрая и доверчивая.'},
  {name: 'Павел Андреевич', age: 66, ic: '🕵️', mood: 'cop', bio: 'Бывший следователь. Слишком вежлив, слишком внимателен.'},
  {name: 'Людмила Фёдоровна', age: 59, ic: '👩‍🍳', mood: 'trusting', bio: 'Школьный повар. Верит людям с красивым голосом.'},
  {name: 'Руслан', age: 36, ic: '🧑‍🔧', mood: 'busy', bio: 'Таксист. В пробке, на связи урывками.'},
  {name: 'Олег', age: 50, ic: '👨‍💼', mood: 'skeptic', bio: 'Юрист. Просит документы по каждому пункту.'}
);
Object.assign(SHORT, {'прописка вашего солнца': 'солнце', 'бесхозное эхо': 'эхо', 'посылка из ниоткуда': 'посылка', 'пароль на свободе': 'пароль', 'отпуск вашего отражения': 'отражение', 'выигранный вторник': 'вторник', 'дело о пропавшей пятнице': 'пятница', 'дело о неубранной кровати': 'кровать'});
PRE_INFO.push(
  {hook: 'Звонит «Бюро погоды». На вас оформлено одно «личное солнце», а оно без прописки.', thing: 'прописка вашего солнца', fee: '«сбор за тепло»'},
  {hook: 'Это «Институт эха». Ваш сосед записал на вас бесхозное эхо.', thing: 'бесхозное эхо', fee: '«сбор за громкость»'},
  {hook: 'Служба доставки сюрпризов: для вас пришла посылка из ниоткуда.', thing: 'посылка из ниоткуда', fee: '«сбор за ниоткуда»'},
  {hook: 'Фонд забытых паролей: за вами числится пароль «123456», он просит свободы.', thing: 'пароль на свободе', fee: '«выкуп пароля»'},
  {hook: 'Совет жильцов вашего зеркала: ваше отражение подало заявление на отпуск.', thing: 'отпуск вашего отражения', fee: '«сбор за отпуск»'},
  {hook: 'Лотерея «Счастливый понедельник»: вы выиграли вторник, нужно доплатить за среду.', thing: 'выигранный вторник', fee: '«доплата за среду»'}
);
POL_PRE.push(
  {hook: 'Отдел «Угрозыска пропавших пятниц». Ваша пятница объявлена в розыск, а вы — подозреваемый.', thing: 'дело о пропавшей пятнице', fee: '«залог за пятницу»'},
  {hook: 'Отряд «Особого назначения по неубранным кроватям». На вас поступил сигнал.', thing: 'дело о неубранной кровати', fee: '«штраф за покрывало»'}
);
/* ---------- 3. Обновления и связь с разработчиком ---------- */
const vnum = v => String(v).split('.').map(x => parseInt(x, 10) || 0);
const vnewer = (a, b) => {const x = vnum(a), y = vnum(b); for (let i = 0; i < 3; i++) {if ((y[i] || 0) > (x[i] || 0)) return true; if ((y[i] || 0) < (x[i] || 0)) return false;} return false;};
async function fetchLatest() {
  const bust = '?t=' + Date.now();
  try {const r = await fetch(UPD_URL + 'version.json' + bust, {cache: 'no-store'}); if (r.ok) {const j = await r.json(); if (j && j.version) return j;}} catch (e) {}
  const r = await fetch(UPD_URL + 'data.js' + bust, {cache: 'no-store'}); if (!r.ok) throw new Error('http ' + r.status);
  const t = await r.text(), m = t.match(/const VERSION = '[^']*build (\d+\.\d+\.\d+)/) || t.match(/build (\d+\.\d+\.\d+)/); if (!m) throw new Error('no version'); return {version: m[1]};
}
const diagText = () => 'КОЛ-ЦЕНТР: СМЕНА · build ' + BUILD_V + ' «' + BUILD_NAME + '»\nУстройство: ' + navigator.userAgent + '\nЭкран: ' + innerWidth + 'x' + innerHeight + (S ? '\nДень: ' + S.day + ', ранг: ' + S.rank + ', деньги: ' + Math.round(S.money) : '');
function devHTML(from) {
  return '<div class="box" data-from="' + from + '"><h2>📨 Связь и обновления</h2><p style="color:#ff7adf;font-weight:800;margin:0">build ' + BUILD_V + ' · ' + BUILD_NAME + '</p><div id="updst" class="dil" style="margin:8px 0"><p>Нажмите «Проверить обновления», чтобы узнать, вышел ли новый патч.</p></div><div class="col"><button class="btn pri" data-a="upd_check">🔄 Проверить обновления</button><a class="btn" href="' + TG_USER_URL + '" target="_blank" rel="noopener">✉ Написать разработчику ' + TG_USER + '</a><a class="btn" href="' + TG_UPD + '" target="_blank" rel="noopener">🔔 Канал обновлений (APK и патчи)</a><a class="btn" href="' + TG_CHANNEL + '" target="_blank" rel="noopener">📣 Личный канал PESSIMIST</a><button class="btn" data-a="dev_bug">🐞 Сообщить об ошибке</button><button class="btn" data-a="dev_idea">💡 Предложить идею</button></div><div class="row" style="margin-top:8px"><button class="btn" data-a="back">← Назад</button></div></div>';
}
function scrDev(from) {showScr(devHTML(from), from !== 'title');}
async function copyTxt(t) {try {await navigator.clipboard.writeText(t); return true;} catch (e) {try {const ta = document.createElement('textarea'); ta.value = t; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); ta.remove(); return true;} catch (e2) {return false;}}}
const a_go = '<button class="btn pri" data-a="upd_go">⬇ Обновить сейчас (веб-версия)</button>';
async function doUpdCheck(manual) {
  const box = document.getElementById('updst'); if (manual && box) box.innerHTML = '<p>⏳ Проверяю…</p>';
  try {
    const j = await fetchLatest(); lsSet('cc_updchk', {t: Date.now(), v: j.version});
    if (vnewer(BUILD_V, j.version)) {
      const notes = j.notes ? '<p style="text-align:left">• ' + (Array.isArray(j.notes) ? j.notes.join('<br>• ') : j.notes) + '</p>' : '';
      if (box) box.innerHTML = '<b>🚀 Вышло обновление ' + j.version + (j.name ? ' «' + j.name + '»' : '') + '</b>' + notes + '<div class="col">' + '' + '<a class="btn" href="' + (j.channel || TG_UPD) + '" target="_blank" rel="noopener">📦 Скачать новый APK в канале</a>' + (window.Capacitor ? '<p>Скачайте APK в канале и установите его поверх старой версии.</p>' : '') + '</div>';
      else toast('🚀 Вышло обновление ' + j.version + '! Меню → «Связь и обновления»', 'ok');
    } else if (box) box.innerHTML = '<b>✅ У вас последняя версия</b><p>Установлено ' + BUILD_V + ', на сервере ' + j.version + '.</p>';
  } catch (e) {if (box && manual) box.innerHTML = '<b>📡 Не удалось проверить</b><p>Нужен интернет. Попробуйте позже или загляните в канал разработчика.</p>';}
}
document.addEventListener('click', async e => {
  const b = e.target.closest('[data-a^="upd_"],[data-a^="dev_"]'); if (!b) return; const a = b.dataset.a; if (!/^(upd_check|upd_go|dev_open|dev_bug|dev_idea)$/.test(a)) return; e.preventDefault(); e.stopImmediatePropagation(); Snd.resume(); Snd.sfx('click');
  if (a === 'upd_check') doUpdCheck(true);
  else if (a === 'upd_go') {try {save();} catch (x) {} location.href = UPD_URL + '?v=' + Date.now();}
  else if (a === 'dev_open') scrDev(b.dataset.from || (b.closest('[data-from]') || {dataset: {}}).dataset.from || 'title');
  else if (a === 'dev_bug' || a === 'dev_idea') {const ok = await copyTxt((a === 'dev_bug' ? '🐞 Ошибка в игре. Что случилось: \n\n' : '💡 Идея для игры: \n\n') + diagText()); toast(ok ? '📋 Данные скопированы. Вставьте их в чат с разработчиком.' : 'Откройте чат и опишите проблему', 'ok'); window.open(TG_USER_URL, '_blank');}
}, true);
const _sm20 = scrMenu; scrMenu = function () {_sm20(); const q = document.querySelector('#scr [data-a="quit"]'); if (q) q.insertAdjacentHTML('beforebegin', '<button class="btn" data-a="dev_open" data-from="pause">📨 Связь и обновления</button>');};
const _ss20 = scrSet; scrSet = function (from) {_ss20(from); const r = document.querySelector('#scr .box .row'); if (r) r.insertAdjacentHTML('beforebegin', '<div class="col" style="margin:6px 0"><button class="btn" data-a="dev_open">📨 Связь и обновления</button></div>');};
const _st20 = showTitle; showTitle = function () {_st20(); const c = document.getElementById('tchips'); if (c && !document.getElementById('tupd')) c.insertAdjacentHTML('beforeend', '<a id="tupd" href="#" data-a="dev_open">🔄 Обновления</a>');
  const ck = lsGet('cc_updchk', {t: 0}); if (Date.now() - ck.t > 6 * 3600e3) setTimeout(() => doUpdCheck(false), 2500);};
const _sn20 = scrNews; scrNews = function () {_sn20(); const p = document.querySelector('#scr .box p'); if (p) p.textContent = BUILD_NAME + ' · build ' + BUILD_V; const h3 = document.querySelector('#scr .box h3'); if (h3) h3.insertAdjacentHTML('beforebegin', '<h3>☎ Последний звонок</h3><p>• Клиент задаёт вопрос — агент отвечает именно на него: кто звонит, откуда номер, сколько стоит, чем докажете<br>• Проверка обновлений прямо в игре и кнопки связи с разработчиком<br>• 10 новых клиентов, 8 новых легенд<br>• Баг-репорт и идеи в один тап</p>');};
