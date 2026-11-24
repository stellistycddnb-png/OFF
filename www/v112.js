/* ======== build 1.4.0: отдельные кнопки жизни, взаимодействия с коллегами ======== */
const SKL = ['voice', 'talk', 'close', 'psy', 'nerve'];
const CCH = [
  {gift: 'Дима любит порядок и тишину.', help: ['«Говори медленнее и чётче, он нервничает».', '«Не перебивай: пусть закончит мысль».'], teach: '«Покажу, как держать голос ровным».'},
  {gift: 'Катя любит сладкое и юмор.', help: ['«Задай ему вопрос про семью, расслабится».', '«Скажи что-нибудь тёплое, он оттает».'], teach: '«Научу говорить так, чтобы слушали».'},
  {gift: 'Рома любит деньги и честность в цифрах.', help: ['«Считай вслух, не бойся цифр».', '«Не затягивай: цель уже близко».'], teach: '«Покажу, как закрывать быстро».'},
  {gift: 'Гриша любит кофе без сахара.', help: ['«Держи легенду, не меняй фамилию».', '«Говори с паузами, как будто читаешь по бумажке».'], teach: '«Научу читать людей».'},
  {gift: 'Сергей любит, когда все спокойны.', help: ['«Главное — не паниковать, я прикрою».', '«Передавай мне, если запахло жареным».'], teach: '«Научу держать нервы».'}
];
const TALK_EXTRA = ['Дима жалуется на сквозняк и подсказывает, где прячется заначка конфет.', 'Катя рассказывает, как поймала удачного клиента, и показывает, на чём.', 'Рома делится секретом: «Цифры любят тишину».', 'Гриша шепчет: «Никогда не говори «я не уверен», говори «я проверю».»', 'Сергей вспоминает, как начинал: «Я тоже был новичком».'];
const Y1 = () => {X3(); if (!S.cd) S.cd = {}; if (!S.relx) S.relx = {}; return S;};
const relOf = n => (S.rel && S.rel[n]) || 0;
function relAdd(n, p) {Y1(); S.relx[n] = Math.max(0, (S.relx[n] || 0) + p); while (S.relx[n] >= 3 && relOf(n) < 4) {S.relx[n] -= 3; S.rel[n] = relOf(n) + 1; toast('🤝 ' + n + ': отношения ' + S.rel[n] + '/4', 'ok');}}
const cdKey = (i, k) => 'c' + i + k;
const done = (i, k) => S.cd[cdKey(i, k)] === S.day;
const mark = (i, k) => {S.cd[cdKey(i, k)] = S.day;};
const CACTS = [
  {k: 'coffee', ic: '☕', n: 'Кофе вместе', d: '₴60 · отношения +, бодрость', min: 0, cost: 60},
  {k: 'talk', ic: '💬', n: 'Поболтать', d: 'Бесплатно · отношения +', min: 0},
  {k: 'case', ic: '🧩', n: 'Разобрать сложный звонок', d: 'Бафф «Разбор полётов»', min: 1},
  {k: 'gossip', ic: '🗣', n: 'Сплетни', d: 'Слухи и подсказки (иногда риск)', min: 1},
  {k: 'gift', ic: '🎁', n: 'Подарок', d: '₴200 · отношения ++', min: 0, cost: 200},
  {k: 'teach', ic: '🎓', n: 'Попросить научить', d: '₴ за урок · +1 к навыку', min: 2},
  {k: 'cover', ic: '🛡', n: 'Попросить прикрыть', d: 'Бафф «Прикрытие»: меньше подозрения', min: 2},
  {k: 'bar', ic: '🍻', n: 'Вечером выпить', d: '₴150 · тратит вечерний слот', min: 1, cost: 150, slot: 1},
  {k: 'lead', ic: '💼', n: 'Попросить лид', d: '+₴300 · иногда с подвохом', min: 3},
  {k: 'loan', ic: '💸', n: 'Занять ₴500', d: 'Вернёте ₴600 через 3 дня', min: 3},
  {k: 'order', ic: '📣', n: 'Дать поручение', d: 'Подчинённый работает на вас: +₴ и уважение у остальных', min: 0, only: 'low'},
  {k: 'tribute', ic: '💼', n: 'Занести долю ₴300', d: 'Старший ценит: уважение Пульта +', min: 0, cost: 300, only: 'high'}
];
function scrColl(i, msg) {
  Y1(); const t = TEAM[i], rel = relOf(t.n), lvl = S.skills[SKL[i]] || 0;
  showScr('<div class="box"><div class="av big">' + t.ic + '</div><h2 style="text-align:center">' + t.n + '</h2><p style="text-align:center;color:#9a8fb8">' + RANKS[t.r].ic + ' ' + RANKS[t.r].n + ' · отношения ' + '❤'.repeat(rel) + '🤍'.repeat(4 - rel) + '</p><p style="color:#9a8fb8;font-size:12px">' + CCH[i].gift + ' Учит: ' + SKILLS[SKL[i]].n + ' ' + '★'.repeat(lvl) + '☆'.repeat(5 - lvl) + '</p>' + (msg ? '<p class="help">' + msg + '</p>' : '') + '<div class="col">' + CACTS.filter(a => !a.only || (a.only === 'low' ? t.r < S.rank : t.r > S.rank)).map(a => {const hi = t.r > S.rank && !['coffee', 'talk', 'gift', 'tribute'].includes(a.k) && respOf() < 8 * (t.r - S.rank), lock = rel < a.min || hi, cost = a.k === 'teach' ? 200 + lvl * 250 : a.cost || 0, off = lock || done(i, a.k) || S.money < cost || (a.slot && S.slots <= 0) || (a.k === 'teach' && lvl >= 5); return '<button class="btn" data-a="z_act" data-v="' + i + ':' + a.k + '"' + (off ? ' disabled' : '') + '>' + a.ic + ' ' + a.n + '<br><small>' + (lock ? (hi ? 'нужно уважение ' + 8 * (t.r - S.rank) + ' (старший)' : 'нужны отношения ' + a.min + '/4') : done(i, a.k) ? 'сегодня уже было' : a.k === 'teach' ? '₴' + cost + ' · +1 ' + SKILLS[SKL[i]].n : a.d) + '</small></button>';}).join('') + '</div><div class="row" style="margin-top:8px"><button class="btn pri" data-a="x_team">← В офис</button></div></div>', true);
}
function collAct(i, k) {
  Y1(); const t = TEAM[i], A = CACTS.find(x => x.k === k); if (done(i, k)) return; const lvl = S.skills[SKL[i]] || 0, cost = k === 'teach' ? 200 + lvl * 250 : A.cost || 0; if (S.money < cost) return; if (A.slot) {if (S.slots <= 0) return; S.slots--;} S.money -= cost; mark(i, k); S.energy = clamp(S.energy - 2, 0, 100); let msg = '', p = 0;
  if (k === 'coffee') {p = 2; S.energy = clamp(S.energy + 6, 0, 100); msg = t.ic + ' ' + t.n + ': ' + pick(t.q);}
  else if (k === 'talk') {p = 1; S.cons = clamp(S.cons + 1, 0, 100); msg = TALK_EXTRA[i];}
  else if (k === 'case') {p = 1; addSt('Разбор полётов', '📝', 2, {talk: 2}); msg = pick(CCH[i].help);}
  else if (k === 'gossip') {p = 1; msg = pick(RUMORS); if (Math.random() < .2) {S.heat = clamp(S.heat + 1, 0, 100); msg += ' (кто-то слышал: риск +1)';}}
  else if (k === 'gift') {p = 3; msg = t.n + ' растроган(а): «Ну ты даёшь!»'; Snd.sfx('good');}
  else if (k === 'teach') {if (Math.random() < .75) {S.skills[SKL[i]] = Math.min(5, lvl + 1); Snd.sfx('promo'); msg = t.n + ': ' + CCH[i].teach + '<br><b>' + SKILLS[SKL[i]].n + ' → ' + S.skills[SKL[i]] + '/5</b>';} else msg = t.n + ' махнул(а) рукой: «Не сегодня, голова не варит. Давай завтра».'; p = 1;}
  else if (k === 'cover') {addSt('Прикрытие', '🛡', 2, {calm: 3}); p = 1; msg = t.n + ': «Если что — я рядом».';}
  else if (k === 'bar') {p = 3; S.cons = clamp(S.cons + 2, 0, 100); S.energy = clamp(S.energy - 4, 0, 100); msg = 'Вы с ' + t.n + ' просидели вечер за пивом. ' + pick(TALK_EXTRA);}
  else if (k === 'lead') {if (Math.random() < .8) {S.money += 300; msg = t.n + ' передал(а) вам хороший контакт: +₴300.';} else {S.boss = clamp(S.boss - 2, 0, 100); msg = 'Контакт оказался «горячим» не в ту сторону: босс −2.';} p = 1;}
  else if (k === 'order') {S.money += 100 + 40 * (S.rank - t.r); S.energy = clamp(S.energy + 2, 0, 100); rsp(.5); msg = t.n + ' ворчит, но делает. Вы сэкономили силы и получили ₴.'; p = -1;}
  else if (k === 'tribute') {rsp(3 * (1 - respOf() / 130)); msg = t.n + ' кивает: «Правильно понимаешь порядок».'; p = 2;}
  else if (k === 'loan') {S.money += 500; S.q.push({day: S.day + 3, t: 'Вы вернули долг ' + t.n, fx: {money: -600}}); msg = t.n + ' одолжил(а) ₴500. Верните ₴600 через 3 дня.'; p = 1;}
  relAdd(t.n, p); Snd.sfx('click'); renderHud(); scrColl(i, msg);
}
/* помощь коллеги прямо в звонке (вместо коучей) */
function whisper(c) {const l = TEAM.map((t, i) => i).filter(i => TEAM[i].r !== S.rank && relOf(TEAM[i].n) >= 1); if (!l.length) return; const i = pick(l); c.log.push({w: 'me', t: '🙋 ' + TEAM[i].n + ' шепчет: ' + pick(CCH[i].help)}); c.pers += 1 + relOf(TEAM[i].n) * .5;}
RANK_ACTS.forEach(a => a.push({id: 'help', ic: '🙋', n: 'Позвать коллегу'}));
const _ch12 = choose;
choose = function (type) {
  const c = S && S.call; if (!c || type !== 'r:help') return _ch12(type); Y1(); c.helps = c.helps || 0; if (c.helps >= 2) return toast('Коллеги заняты своими звонками.', 'bad');
  const l = TEAM.map((t, i) => i).filter(i => TEAM[i].r !== S.rank && relOf(TEAM[i].n) >= 1 && !done(i, 'help')); if (!l.length) return toast('Некого позвать: подружитесь с коллегами (кнопка «Команда»).', 'bad');
  l.sort((a, b) => relOf(TEAM[b].n) - relOf(TEAM[a].n)); const i = l[0], rel = relOf(TEAM[i].n), t = TEAM[i]; mark(i, 'help'); c.helps++; c.turn++; S.min += 3;
  c.pers += 8 + rel * 3; c.susp = Math.max(0, c.susp - 4 - rel * 2); if (i === 4) c.pers += 6; if (i === 0) c.susp = Math.max(0, c.susp - 6);
  c.log.push({w: 'me', t: '🙋 ' + t.n + ' подключается: ' + pick(CCH[i].help)}); c.log.push({w: 'them', t: '«Кто это там? Ладно, продолжайте».'}); relAdd(t.n, 1); Snd.sfx('good');
  if (c.pers >= c.target) return success(); render();
};
/* офис: у коллеги вместо чата кнопка взаимодействий */
const _of12 = scrOffice; scrOffice = function () {_of12(); const b = document.querySelector('#scr [data-a="x_chat0"]'); if (b) {b.setAttribute('data-a', 'z_coll'); b.textContent = '🤝'; b.style.minWidth = '56px';}};
/* поездки в рабочее время отнимают время */
const _gl12 = goLoc; goLoc = function (v) {const s0 = S.slots; _gl12(v); if (S.mode !== 'summary' && S.slots < s0) S.min += 45;};
/* отдельные кнопки внизу */
$('bar').addEventListener('click', e => {
  const b = e.target.closest('button'); if (!b || !S) return; const a = b.dataset.b; if (!['home', 'love', 'trip', 'shop'].includes(a)) return; e.stopImmediatePropagation(); Snd.resume();
  if (S.mode !== 'idle') {toast('Сначала закончите разговор.', 'bad'); return;} X3(); running = false; H().from = 'idle';
  if (a === 'home') scrHome('idle'); else if (a === 'love') scrHR(); else if (a === 'trip') scrMap(); else scrGear('car');
}, true);
const _hr12 = scrHR; scrHR = function (id) {_hr12(id); if (!id && H().from === 'idle') {const b = document.querySelector('#scr [data-a="h_hrback"]'); if (b) b.setAttribute('data-a', 'resume');}};
/* без прыжков: сохраняем прокрутку панели при каждой перерисовке */
const _rn12 = render; render = function () {const m = $('main'), top = m ? m.scrollTop : 0; _rn12(); if (m && top) m.scrollTop = top;};
document.addEventListener('click', e => {const b = e.target.closest('[data-a="z_coll"],[data-a="z_act"]'); if (!b || b.disabled) return; Y1(); if (b.dataset.a === 'z_coll') scrColl(+b.dataset.v); else {const [i, k] = b.dataset.v.split(':'); collAct(+i, k);}});
function scrNews() {
  showScr('<div class="box"><h2>📰 Что нового</h2><p style="color:#ff7adf;font-weight:800">БОЛЬШАЯ ПЕРЕМЕНА · build 1.4.0</p><h3>В этом обновлении</h3><p>• Внизу отдельные кнопки: 🏡 Дом, 💘 Отношения, 🗺 Поездки, 🛍 Магазин. Доступны в любое время между звонками<br>• Коучей больше нет. Навыки теперь передают коллеги<br>• У каждого коллеги меню из 10 действий: кофе, разбор звонка, сплетни, подарок, урок, прикрытие, бар вечером, лид, долг<br>• В звонке кнопка «🙋 Позвать коллегу»: друг подключается и помогает<br>• Экран больше не дёргается: высота кабинета фиксирована, прокрутка панели сохраняется</p><h3>Ранее</h3><p>• Живой кабинет, офис и команда на «Пульте», соревнования, баффы, жильцы и романтика, логика в звонках</p><div class="row" style="margin-top:8px"><button class="btn pri" data-a="x_close">Понятно</button></div></div>', true); lsSet('cc_news_130', 1);
}
