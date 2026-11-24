/* ======== build 1.4.0: иерархия, уважение Пульта, больше контента ======== */
const RESP_NEED = [0, 8, 25, 45, 70], RESP_LV = [[0, 'Вас не замечают'], [10, 'Знают в лицо'], [25, 'Уважают'], [45, 'Свой человек'], [70, 'Авторитет']];
const respOf = () => (S && S.resp) || 0;
const respOK = r => respOf() >= RESP_NEED[r];
const respLv = () => {let t = RESP_LV[0][1]; RESP_LV.forEach(l => {if (respOf() >= l[0]) t = l[1];}); return t;};
function rsp(d, why) {if (!S) return; S.resp = clamp((S.resp || 0) + d, 0, 100); if (Math.abs(d) >= 2) toast((d > 0 ? '⭐ Уважение +' + Math.round(d) : '⚠ Уважение ' + Math.round(d)) + (why ? ': ' + why : ''), d > 0 ? 'ok' : 'bad');}
const X4 = () => {Y1(); if (S.resp === undefined) S.resp = 0; if (!S.dayCloses) S.dayCloses = 0; if (!S.dayWarn) S.dayWarn = 0; if (S.pultDone === undefined) S.pultDone = false; if (!S.dayLines) S.dayLines = []; if (S.rank < 4 && !S.quest) genDay(); return S;};
/* --- поручения старших и задания Пульта --- */
const ERRS = [
  {t: 'принеси мне кофе, да побыстрее', cost: 40, en: -2, resp: 1.5}, {t: 'сделай за меня один звонок, я занят', cost: 0, en: -5, resp: 3}, {t: 'заплати за мой обед, потом сочтёмся', cost: 150, en: 0, resp: 2},
  {t: 'сходи на склад за бумагой', cost: 0, en: -4, resp: 2}, {t: 'отнеси конверт Сергею и ничего не спрашивай', cost: 300, en: 0, resp: 3.5, heat: 1}, {t: 'скажи боссу, что я весь день был на месте', cost: 0, en: 0, resp: 4, boss: -1},
  {t: 'почини мой стул и мой принтер', cost: 0, en: -3, resp: 2.2}, {t: 'встань пораньше и открой офис', cost: 0, en: -4, resp: 2.5}
];
const QUESTS = [
  d => ({id: 'closes', t: 'Закрыть сегодня ' + (2 + Math.floor(d / 10)) + ' контакта', n: 2 + Math.floor(d / 10)}), d => ({id: 'plan', t: 'Выполнить дневной план', n: 0}), d => ({id: 'calm', t: 'Не поднимать риск выше 60', n: 0}), d => ({id: 'nowarn', t: 'Никого не «сдавать» сегодня', n: 0})
];
function genDay() {
  Y1(); S.dayCloses = 0; S.dayWarn = 0; S.err = null; S.quest = null; if (S.rank >= 4) return;
  const hi = TEAM.map((t, i) => i).filter(i => TEAM[i].r > S.rank); if (hi.length && Math.random() < .75) {const i = pick(hi), e = pick(ERRS); S.err = {i, e, done: false};}
  S.quest = pick(QUESTS)(S.day);
}
const questOK = q => !q ? false : q.id === 'closes' ? S.dayCloses >= q.n : q.id === 'plan' ? S.turnover >= planNow() : q.id === 'calm' ? S.heat <= 60 : S.dayWarn === 0;
/* --- хуки уважения --- */
const _sc14 = success; success = function () {_sc14(); if (S && S.mode !== 'ending') {X4(); S.dayCloses++; rsp(1.2);}};
const _fl14 = fail; fail = function (m) {_fl14(m); if (S && S.mode !== 'ending') {X4(); rsp(-.3);}};
const _wn14 = warn; warn = function () {_wn14(); if (S && S.mode !== 'ending') {X4(); S.dayWarn++; rsp(-8, 'старшие не любят, когда «сдают»');}};
const _td14 = teamDaily; teamDaily = function () {_td14(); X4(); S.dayLines = []; if (S.rank < 4) {const okP = S.turnover >= planNow(); if (okP) {rsp(3); S.dayLines.push('⭐ План выполнен: уважение +3.');} else if (S.turnover < planNow() * .5) {rsp(-2); S.dayLines.push('⚠ План сильно недобран: уважение −2.');}
    if (S.quest) {if (questOK(S.quest)) {const r = 150 + S.day * 5; S.money += r; rsp(4); S.dayLines.push('✅ Задание Пульта выполнено: «' + S.quest.t + '» (+₴' + r + ', уважение +4).');} else {rsp(-1.5); S.dayLines.push('❌ Задание Пульта не выполнено: «' + S.quest.t + '».');}}}
  else if (S.lastContest && S.lastContest.day === S.day) {const d = [5, 2, -1, -4][S.lastContest.place - 1]; rsp(d); S.dayLines.push('🏆 Итоги соревнований: уважение ' + (d > 0 ? '+' : '') + d + '.');}};
const _nd14 = nextDay; nextDay = function () {X4(); if (S.err && !S.err.done) {rsp(-3, 'вы проигнорировали поручение'); S.boss = clamp(S.boss - 1, 0, 100); S.q.push({day: S.day + 1, t: 'Старший вспомнил вам отказ: ночная уборка', fx: {energy: -8}});} const dd = S.day; const r = _nd14(); if (S && S.day > dd) {genDay(); if (S.err) toast('📌 ' + TEAM[S.err.i].n + ': «' + S.err.e.t + '»', 'ok');} return r;};
/* --- вставка в итоги дня --- */
const _ds14 = daySummary; daySummary = function () {_ds14(); X4(); const bx = document.querySelector('#scr .box'); if (!bx || S.mode !== 'summary') return; const h2 = bx.querySelector('h2'); let html = '';
  if (S.dayLines.length) html += '<div class="help" style="margin:6px 0">' + S.dayLines.join('<br>') + '</div>';
  html += '<div style="font-size:12px;color:#9a8fb8;margin:2px 0">⭐ Уважение Пульта: <b>' + Math.round(respOf()) + '/100</b> · ' + respLv() + '</div>';
  if (S.err && !S.err.done && S.rank < 4) html += '<div class="row" style="margin:6px 0"><button class="btn" data-a="n_hier">📌 Поручение от ' + TEAM[S.err.i].n + '</button></div>';
  if (S.maxRank === 3 && S.xp >= RANKS[4].need && respOK(4) && !S.pultDone && S.examDay !== S.day) html += '<div class="row" style="margin:6px 0"><button class="btn warn" data-a="n_exam">🎖 Приём на Пульт (испытание)</button></div>';
  if (h2 && html) h2.insertAdjacentHTML('afterend', html);};
/* --- экран «Иерархия» --- */
const bar = (v, c) => '<div class="bar ' + c + '"><i style="width:' + clamp(v, 0, 100) + '%"></i></div>';
function scrHier(msg) {
  X4(); const e = S.err, q = S.quest, cdo = k => S.cd['t' + k] === S.day;
  const ladder = RANKS.map((r, i) => {const ok = i <= S.maxRank, need = i ? 'очков ' + r.need + ' · уважение ' + RESP_NEED[i] : 'старт'; return '<div class="tech" style="padding:6px 10px;' + (i === S.rank ? 'border-color:#ffd23a' : '') + '"><div>' + r.ic + ' <b>' + r.n + '</b><br><small>' + (ok ? '✔ открыто' : need + (i === 4 ? ' · испытание' : '')) + '</small></div></div>';}).join('');
  const trib = [['500', 500, 4], ['2000', 2000, 14], ['alk', 800, 7]].map(t => '<button class="btn sm" data-a="n_trib" data-v="' + t[0] + '"' + (cdo(t[0]) || S.money < t[1] ? ' disabled' : '') + '>' + (t[0] === 'alk' ? '🥃 Дорогой алкоголь' : '💼 Занести') + ' ₴' + t[1] + '<br><small>' + (cdo(t[0]) ? 'сегодня было' : '+' + t[2] + ' уважения') + '</small></button>').join('');
  showScr('<div class="box"><h2>⭐ Иерархия и уважение</h2><p>Здесь всё по чину. Новичков не слушают, а старшие решают, кто пойдёт выше. Уважение Пульта: <b>' + Math.round(respOf()) + '/100</b> · ' + respLv() + '</p>' + bar(respOf(), 'yel') + (msg ? '<p class="help">' + msg + '</p>' : '') + '<h3>Должности</h3>' + ladder + '<p style="color:#9a8fb8;font-size:12px">Повышение до «Мусора» даётся при нужных очках и уважении. На «Пульт» пускают только после испытания.</p>' +
    (S.rank < 4 ? '<h3>📌 Сегодня</h3>' + (e ? '<div class="tech"><div><b>Поручение от ' + TEAM[e.i].n + '</b> (' + RANKS[TEAM[e.i].r].n + ')<br><small>«' + e.e.t + '»</small></div><div style="display:flex;flex-direction:column;gap:4px">' + (e.done ? '<span>✔</span>' : '<button class="btn sm pri" data-a="n_err" data-v="do"' + (S.money < e.e.cost ? ' disabled' : '') + '>Сделать' + (e.e.cost ? ' ₴' + e.e.cost : '') + '</button><button class="btn sm" data-a="n_err" data-v="no">Отказать</button>') + '</div></div>' : '<p style="color:#9a8fb8">Старшие сегодня вас не трогают.</p>') + (q ? '<div class="tech"><div><b>Задание Пульта</b><br><small>' + q.t + ' · ' + (questOK(q) ? '✔ идёт хорошо' : 'ещё не выполнено') + '</small></div></div>' : '') : '<p style="color:#9a8fb8">Вы на Пульте: уважение держится на результатах команды и побеждённых соревнованиях.</p>') +
    '<h3>🎁 Задобрить Пульт</h3><div class="row" style="flex-wrap:wrap">' + trib + '</div><div class="row" style="margin-top:8px"><button class="btn pri" data-a="' + BACK() + '">← Назад</button></div></div>', true);
}
const EXAM = [
  {q: 'Пульт заходит на этаж посреди вашего звонка. Что делаете?', ch: [['Мягко заканчиваете разговор и встаёте поздороваться', 1], ['Продолжаете говорить, не поднимая головы', 0], ['Шепчете соседу: «Опять он»', 0]]},
  {q: 'Старший просит принести отчёт, но у вас важный клиент на линии. Ваши действия?', ch: [['Бросаете трубку и бежите за отчётом', 0], ['Спокойно закрываете звонок и приносите отчёт', 1], ['Говорите, что занят, и не отвлекаетесь', 0]]},
  {q: 'Вам предлагают долю с чужой сделки. Как отвечаете?', ch: [['Берёте и молчите', 0], ['Вежливо отказываетесь и сообщаете об этом старшему', 1], ['Берёте и просите больше', 0]]}
];
function scrExam(i, ok) {
  if (i === 0) {if (S.money < 3000) return toast('Вступительный взнос ₴3000 на Пульт.', 'bad'); S.money -= 3000; renderHud(); ok = 0;}
  if (i >= EXAM.length) {S.examDay = S.day; if (ok >= 2) {S.pultDone = true; S.maxRank = 4; S.rank = 4; S.xp = Math.max(S.xp, RANKS[4].need); Snd.sfx('promo'); X4(); rsp(5); showScr('<div class="box" style="text-align:center"><div style="font-size:54px">🎖</div><h2>Вас приняли на Пульт</h2><p>Сергей жмёт руку: «Теперь ты один из нас. Не подведи». Теперь вы управляете командой.</p><div class="row"><button class="btn pri" data-a="' + BACK() + '">Принять</button></div></div>', true); S.dayLines = [];} else {rsp(-6, 'испытание провалено'); showScr('<div class="box" style="text-align:center"><div style="font-size:54px">🙅</div><h2>Не сегодня</h2><p>Сергей качает головой: «Рано. Приходи завтра».</p><div class="row"><button class="btn pri" data-a="' + BACK() + '">Понятно</button></div></div>', true);} return;}
  S.exOk = ok; const E = EXAM[i]; showScr('<div class="box"><h2>🎖 Испытание Пульта · ' + (i + 1) + '/3</h2><p>' + E.q + '</p><div class="col">' + shuf(E.ch.map((c, k) => k), i * 13 + S.day).map(k => '<button class="reply" data-a="n_exam" data-v="' + (i + 1) + ':' + E.ch[k][1] + '">' + E.ch[k][0] + '</button>').join('') + '</div></div>', true);
}
/* --- клики --- */
document.addEventListener('click', e => {
  const b = e.target.closest('[data-a^="n_"]'); if (!b || b.disabled) return; X4(); const a = b.dataset.a, v = b.dataset.v; Snd.sfx('click');
  if (a === 'n_hier') scrHier();
  else if (a === 'n_err') {const er = S.err; if (!er || er.done) return; if (v === 'do') {if (S.money < er.e.cost) return; S.money -= er.e.cost; S.energy = clamp(S.energy + (er.e.en || 0), 0, 100); if (er.e.heat) S.heat = clamp(S.heat + er.e.heat, 0, 100); if (er.e.boss) S.boss = clamp(S.boss + er.e.boss, 0, 100); er.done = true; rsp(er.e.resp * (1 - respOf() / 140)); relAdd(TEAM[er.i].n, 1); renderHud(); scrHier(TEAM[er.i].n + ' доволен: «Запомню».');} else {er.done = true; rsp(-3, 'отказ старшему'); S.boss = clamp(S.boss - 1, 0, 100); S.q.push({day: S.day + 1, t: TEAM[er.i].n + ' припомнил отказ: вам досталась грязная работа', fx: {energy: -6}}); scrHier('Вы отказали. Старший это запомнил.');}}
  else if (a === 'n_trib') {const cost = v === 'alk' ? 800 : +v, g = v === '500' ? 4 : v === '2000' ? 14 : 7; if (S.money < cost || S.cd['t' + v] === S.day) return; S.money -= cost; S.cd['t' + v] = S.day; if (v === '2000') S.heat = clamp(S.heat - 1, 0, 100); rsp(g * (1 - respOf() / 130), 'Пульт доволен'); Snd.sfx('coin'); renderHud(); scrHier('Сергей принял подношение молча и убрал в ящик.');}
  else if (a === 'n_exam') {if (!v) scrExam(0, 0); else {const [i, okk] = v.split(':').map(Number); scrExam(i, (S.exOk || 0) + okk);}}
});
const _hub14 = scrHub; scrHub = function () {_hub14(); X4(); const o = document.querySelector('#scr .opts'); if (o) o.insertAdjacentHTML('beforeend', '<button class="btn" data-a="n_hier">⭐ Иерархия и уважение (' + Math.round(respOf()) + ')</button>');};
const _of14 = scrOffice; scrOffice = function () {_of14(); X4(); const h = document.querySelector('#scr .box h2'); if (h) h.insertAdjacentHTML('afterend', '<div class="row" style="margin:4px 0;align-items:center;gap:8px"><span style="font-size:12px;color:#9a8fb8;flex:1">⭐ Уважение Пульта: <b>' + Math.round(respOf()) + '</b> · ' + respLv() + '</span><button class="btn sm" data-a="n_hier">Иерархия</button></div>');};
/* --- события: чины, дедовщина, романтика --- */
const _ae14 = applyEvent; applyEvent = function (v) {const [i, k] = String(v).split(':').map(Number), ch = EVENTS[i] && EVENTS[i].ch[k], rs = ch && ch.resp; _ae14(v); if (rs) {X4(); rsp(rs);}};
EVENTS.push(
  {t: 'Старший занял ваш стул', req: () => S.rank <= 1 && S.day >= 2, d: 'Клоузер Рома садится на ваш стул: «Подвинься, я тут привык».', ch: [{a: 'Уступить', fx: {energy: -2}, resp: 1.5}, {a: 'Не уступать', fx: {boss: -1}, resp: -3}, {a: 'Предложить кофе за ₴50', fx: {money: -50}, resp: 1}]},
  {t: 'Забрали ваш контакт', req: () => S.rank <= 1 && S.day >= 3, d: 'Старший передаёт ваш горячий контакт «своему человеку».', ch: [{a: 'Отдать молча', fx: {money: -50, cons: 1}, resp: 2}, {a: 'Спорить', fx: {boss: 1}, resp: -2}, {a: 'Пожаловаться боссу', fx: {boss: 2, cons: -1}, resp: -5}]},
  {t: 'Пульт проверяет смену', req: () => S.rank >= 1 && S.day >= 4, d: 'Сергей подходит к вашему столу и листает вашу статистику.', ch: [{a: 'Показать цифры честно', fx: {energy: -1}, resp: 2}, {a: 'Приукрасить результаты', fx: {heat: 1}, resp: 1, buf: {n: 'Нервы после обмана', ic: '😬', fx: {calm: -3}}}, {a: 'Свалить на коллегу', fx: {cons: -3, boss: 1}, resp: -3}]},
  {t: 'Рыбалка с Сергеем', req: () => S.resp >= 15, d: 'Сергей зовёт вас на рыбалку «поговорить по-мужски».', ch: [{a: 'Поехать (₴100)', fx: {money: -100, energy: -6}, resp: 3}, {a: 'Вежливо отказаться', fx: {}, resp: -2}]},
  {t: 'Общак', req: () => S.day >= 2, d: 'Собирают «в общий фонд на подарки Пульту».', ch: [{a: 'Скинуться ₴200', fx: {money: -200}, resp: 2}, {a: 'Дать ₴50', fx: {money: -50}, resp: .5}, {a: 'Отказаться', fx: {}, resp: -3}]},
  {t: 'Слухи о повышении', req: () => S.rank <= 2 && S.day >= 5, d: 'По этажу ходят слухи, кого повысят на следующей неделе.', ch: [{a: 'Поддержать слухи', fx: {boss: 1}, resp: -1}, {a: 'Промолчать', fx: {}, resp: 1}, {a: 'Узнать у старших', fx: {cons: -1}, resp: 1.5}]},
  {t: 'Пульт хвалит вас при всех', req: () => S.resp >= 25, d: 'Сергей на общем собрании ставит вас в пример.', ch: [{a: 'Скромно поблагодарить', fx: {boss: 3}, resp: 2}, {a: 'Раздуться от важности', fx: {boss: 1}, resp: -1}]},
  {t: 'Вас подставили перед Пультом', req: () => S.rank >= 1 && S.day >= 6, d: 'Кто-то слил Сергею вашу ошибку.', ch: [{a: 'Оправдываться', fx: {boss: -2}, resp: -1.5}, {a: 'Взять вину на себя', fx: {boss: -1, cons: 2}, resp: 1.5}, {a: 'Указать на виновного', fx: {cons: -2, boss: 1}, resp: -2}]},
  {t: 'Новичок просит наставника', req: () => S.rank >= 2, d: 'Новенький с первой холодки ходит за вами по пятам.', ch: [{a: 'Помочь и научить', fx: {energy: -3, cons: 2}, resp: 1}, {a: 'Отмахнуться', fx: {}, resp: 0}, {a: 'Использовать как посыльного', fx: {cons: -1, energy: 3}, resp: -1}]},
  {t: 'Замена сотрудника', req: () => S.rank === 4 && S.day >= 5, d: 'Сергей требует освободить два стола под «своих людей».', ch: [{a: 'Подчиниться', fx: {boss: 2}, resp: 1}, {a: 'Отказаться', fx: {boss: -2}, resp: -4}, {a: 'Договориться на один стол', fx: {money: -300}, resp: 1.5}]},
  {t: 'Девушка ревнует', req: () => H().gf, d: 'Ваша девушка недовольна, что вы задерживаетесь на работе.', ch: [{a: 'Извиниться и купить цветы ₴150', fx: {money: -150, cons: 2}}, {a: 'Объяснить, что работа есть работа', fx: {cons: -1}}, {a: 'Пообещать выходной', fx: {energy: -2, cons: 1}}]},
  {t: 'Романтический ужин', req: () => H().gf, d: 'Вы с девушкой выбрались в ресторан. Свечи, музыка, никаких звонков.', ch: [{a: 'Заказать столик ₴400', fx: {money: -400, cons: 3, energy: 4}, buf: {n: 'Тёплое настроение', ic: '💞', fx: {calm: 3}}}, {a: 'Приготовить дома', fx: {energy: -2, cons: 2}}]},
  {t: 'Годовщина', req: () => H().gf && S.day >= 10, d: 'Вы вспоминаете, что сегодня важная дата для вас обоих.', ch: [{a: 'Подарить украшение ₴600', fx: {money: -600, cons: 4}}, {a: 'Устроить сюрприз', fx: {money: -200, cons: 3, energy: -3}}, {a: 'Сделать вид, что помните', fx: {cons: -2}}]},
  {t: 'Пульт просит остаться после смены', req: () => S.rank >= 2, d: 'Сергей: «Задержись, есть разговор».', ch: [{a: 'Остаться', fx: {energy: -4}, resp: 2}, {a: 'Сослаться на дела', fx: {}, resp: -2}]},
  {t: 'Корпоративные правила', req: () => S.day >= 3, d: 'Пульт зачитывает новые «правила порядка»: пять страниц запретов.', ch: [{a: 'Записать и запомнить', fx: {energy: -1}, resp: 1}, {a: 'Зевнуть в голос', fx: {boss: -1}, resp: -2}]}
);
/* --- новые HR --- */
HRS.push(
  {id: 'oksana', n: 'Оксана', role: 'Бухгалтер', ic: '👩‍🦰', d: 'Спокойная и расчётливая. Ценит надёжность и порядок в цифрах. Не любит пустых слов.', base: {compliment: .3, joke: .25, coffee: .45, gift: .4, honest: .5}, ref: ['«Оксана: «Простите, у меня закрытие периода».»', '«Оксана поправляет очки: «Давайте не сегодня».»', '«Оксана: «Мне это неловко».»'], ok: ['«Оксана неожиданно улыбается: «Вы милый».»', '«Оксана: «С вами спокойно».»', '«Оксана тихо смеётся».»']},
  {id: 'marian', n: 'Марьяна', role: 'Секретарь Пульта', ic: '💃', d: 'Эффектная и осторожная. Знает все секреты Пульта. С ней нужно быть тактичным и надёжным.', base: {compliment: .35, joke: .3, coffee: .3, gift: .55, honest: .25}, ref: ['«Марьяна: «Я при исполнении, не сейчас».»', '«Марьяна качает головой: «Не здесь».»', '«Марьяна прищуривается: «Я присмотрюсь».»'], ok: ['«Марьяна подмигивает: «А вы не промах».»', '«Марьяна: «Вечером буду свободна».»', '«Марьяна улыбается уголком губ».»']},
  {id: 'diana', n: 'Диана', role: 'Тренер по продажам', ic: '🏃‍♀️', d: 'Энергичная и прямая. Любит смелых и активных. Терпеть не может нытиков.', base: {compliment: .3, joke: .4, coffee: .35, gift: .3, honest: .45}, ref: ['«Диана: «Мне некогда ждать, решайся быстрее».»', '«Диана смеётся: «Не впечатлил».»', '«Диана: «Ты слишком вялый».»'], ok: ['«Диана хлопает вас по плечу: «Вот это другое дело!»»', '«Диана: «Ты начинаешь мне нравиться».»', '«Диана улыбается во весь рот».»']}
);
NIGHT_OK.push('Дождь за окном, чай остыл, а вы так и не заметили, как наступило утро.', 'Музыка, приглушённый свет и тишина, в которой не нужно ничего объяснять.', 'Сначала вы просто говорили, потом просто молчали вместе. Остальное осталось за закрытой дверью.', 'Вы встретили рассвет на кухне вдвоём, с одной чашкой на двоих.');
/* --- новые места города --- */
CITY.push(
  {id: 'club', n: 'Ночной клуб «Неон»', ic: '🪩', bg: ['#3a0a4a', '#0a0a1a'], em: ['🪩', '🎶', '🍸'], d: 'Басы, неон и незнакомые лица.', fare: 50, acts: [
    {a: 'Потанцевать', fx: {energy: -5, cons: 2}, say: ['Вы растворились в музыке. Телефон наконец забыт.', 'К вам подходит незнакомая компания и зовёт танцевать.']},
    {a: 'Выпить коктейль (₴250)', fx: {money: -250, energy: 3, cons: 1}, say: ['Бармен смешал что-то цветное и подмигнул.']},
    {a: 'Познакомиться с кем-нибудь', fx: {energy: -3, cons: 1}, say: ['Новая знакомая оставила номер на салфетке. Пока просто номер.', 'Вы пообщались с компанией и узнали пару городских слухов.']}]},
  {id: 'sauna', n: 'Сауна «Берёзка»', ic: '🧖', bg: ['#4a2a10', '#140a04'], em: ['🧖', '🪵', '🌿'], d: 'Пар, веники и разговоры по душам.', fare: 40, acts: [
    {a: 'Парилка (₴200)', fx: {money: -200, energy: 8, cons: 1}, say: ['Всё напряжение ушло вместе с паром.']},
    {a: 'Посидеть с «нужными людьми» (₴400)', fx: {money: -400, heat: -3, energy: -2}, say: ['За чаем решились вопросы, о которых в офисе не говорят.']},
    {a: 'Отдохнуть в тишине', fx: {energy: 6, cons: 1}, say: ['Вы лежите и смотрите в потолок. Идеально.']}]},
  {id: 'casino', n: 'Игорный зал «Золотой туз»', ic: '🎰', bg: ['#3a1010', '#0a0404'], em: ['🎰', '🃏', '🎲'], d: 'Огни, звон и самообман. Игра против казино.', fare: 30, acts: [
    {a: 'Сыграть на ₴300', gamble: 300, fx: {}}, {a: 'Сыграть на ₴1000', gamble: 1000, fx: {}}, {a: 'Просто посмотреть на людей', fx: {cons: 1}, say: ['Вы смотрите на лица игроков и думаете, насколько вы на них похожи.']}]},
  {id: 'carshow', n: 'Автосалон «Мотор»', ic: '🚘', bg: ['#1c2a3a', '#0a0e14'], em: ['🚘', '🔧', '🏁'], d: 'Блеск кузовов и запах новой кожи.', fare: 20, acts: [
    {a: 'Посмотреть машины', open: 'gear'}, {a: 'Тест-драйв', fx: {energy: 3, cons: 1}, say: ['Вы выжали педаль и на минуту почувствовали себя другим человеком.']}]}
);
document.addEventListener('click', e => {
  const b = e.target.closest('[data-a="v_act"]'); if (!b || b.disabled || !locCur || locCur.kind === 'o') return; const L = CITY.find(x => x.id === locCur.id), A = L && L.acts[+b.dataset.v]; if (!A || !A.gamble) return; e.stopImmediatePropagation(); X4();
  if (S.money < A.gamble) return toast('Не хватает денег для ставки.', 'bad'); const win = Math.random() < .44; S.money += win ? A.gamble * .9 : -A.gamble; S.cons = clamp(S.cons + (win ? 0 : -1), 0, 100); Snd.sfx(win ? 'cash' : 'bad'); renderHud(); openLoc('c', L.id, win ? '🎰 Повезло! Выигрыш ' + fmt(A.gamble * 1.9) + '. Но казино всегда помнит, кто за столом.' : '🎰 Ставка ушла. Крупье вежливо улыбается: «В следующий раз повезёт».');
}, true);
/* --- новости --- */
function scrNews() {
  showScr('<div class="box"><h2>📰 Что нового</h2><p style="color:#ff7adf;font-weight:800">БОЛЬШАЯ ПЕРЕМЕНА · build 1.4.0</p><h3>В этом обновлении</h3><p>• Строгая иерархия: уважение Пульта (0–100). Без него не повысят<br>• Старшие дают вам поручения, Пульт даёт ежедневные задания. Отказ имеет цену<br>• Можно «занести» Пульту, но дорого и не безгранично<br>• На Пульт принимают только после испытания (3 вопроса, взнос ₴3000)<br>• С коллегами теперь действует чин: старшие требуют уважения, младшим можно давать поручения<br>• Игра теперь на 45 дней<br>• 3 новые HR-героини, новые вечерние ночи и романтические события<br>• Новые места: ночной клуб, сауна, казино, автосалон<br>• 15 новых событий: дедовщина, проверки Пульта, подставы, романтика</p><h3>Ранее</h3><p>• Живые реплики, офис и команда, соревнования, жильцы, магазин, баффы и дебаффы</p><div class="row" style="margin-top:8px"><button class="btn pri" data-a="x_close">Понятно</button></div></div>', true); lsSet('cc_news_130', 1);
}
