'use strict';
/* v128: знакомства в заведениях, свидания и приглашение домой. MADE BY PESSIMIST */
(function () {
  const GIRLS = [
    {id: 'oks', n: 'Оксана', ic: '👩‍🌾', job: 'флорист', d: 'Приносит на свидания растения и забывает, что это не цветочный магазин.', like: 'gift'},
    {id: 'mar', n: 'Марина', ic: '☕', job: 'бариста', d: 'Помнит ваш заказ лучше, чем вы сами.', like: 'cafe'},
    {id: 'ler', n: 'Лера', ic: '🎧', job: 'диджей', d: 'Живёт ночью, ценит чувство юмора и громкую музыку.', like: 'write'},
    {id: 'kat', n: 'Катя', ic: '🩺', job: 'ветеринар', d: 'Обожает животных. Питомцы у вас дома — огромный плюс.', like: 'cafe'},
    {id: 'dia', n: 'Диана', ic: '⚖️', job: 'юрист', d: 'Читает договоры за завтраком. Ценит честность и порядок.', like: 'write'},
    {id: 'son', n: 'Соня', ic: '🎨', job: 'художница', d: 'Рисует вас карандашом и честно говорит, что получилось.', like: 'gift'},
    {id: 'ira', n: 'Ира', ic: '🧘', job: 'инструктор по йоге', d: 'Спокойная, как пруд. Не любит суеты и ультиматумов.', like: 'cafe'},
    {id: 'nas', n: 'Настя', ic: '📰', job: 'журналистка', d: 'Любопытная. Лучше не рассказывать ей про вашу работу.', like: 'write'}
  ];
  const ACT = {
    write: {n: '💬 Написать', cost: 0, aff: [3, 7]},
    cafe: {n: '☕ Встретиться в кафе', cost: 150, aff: [6, 10]},
    gift: {n: '🎁 Подарить цветы', cost: 300, aff: [8, 12]}
  };
  const D = () => {const h = H(); if (!h.dates) h.dates = []; return h.dates;};
  const find = id => D().find(x => x.id === id);
  const sn = n => {try {Snd.sfx(n);} catch (e) {}};
  /* знакомство в заведениях */
  const VEN = ['club', 'karaoke', 'catcafe', 'bowling', 'diner', 'arcade', 'sauna'];
  VEN.forEach(id => {const L = CITY.find(x => x.id === id); if (L) L.acts.push({a: '💬 Познакомиться', meet: 1, fx: {}});});
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-a="v_act"]'); if (!b || b.disabled || !locCur || locCur.kind === 'o') return;
    const L = CITY.find(x => x.id === locCur.id), A = L && L.acts[+b.dataset.v]; if (!A || !A.meet) return;
    e.stopImmediatePropagation(); const l = D(), fresh = GIRLS.filter(g => !find(g.id)); let msg;
    S.energy = clamp(S.energy - 3, 0, 100); renderHud();
    if (fresh.length && l.length < 6 && Math.random() < .6) {const g = pick(fresh); l.push({id: g.id, aff: 15, last: S.day, today: 0, vis: 0}); sn('notif'); msg = '💞 Вы познакомились: ' + g.ic + ' ' + g.n + ', ' + g.job + '. Контакт сохранён в Доме → «Знакомства».';}
    else if (l.length && Math.random() < .5) {const x = pick(l), g = GIRLS.find(y => y.id === x.id); x.aff = clamp(x.aff + 4, 0, 100); msg = g.ic + ' Случайно встретили ' + g.n + '. Поболтали пять минут (+4).';}
    else msg = pick(['Вы немного поболтали с людьми. Телефон остался при вас.', 'Все сегодня заняты своими компаниями.', 'Девушка улыбнулась, но подошёл её друг. Ладно.']);
    openLoc('c', L.id, msg);
  }, true);
  /* экран знакомств */
  function scrDates(msg) {
    const l = D(), h = H();
    showScr('<div class="box hbox"><h2>💞 Знакомства</h2><p>Знакомьтесь в городе (клуб, караоке, кафе, боулинг…). Хорошие отношения открывают приглашение домой.</p>' + (msg ? '<p class="help">' + msg + '</p>' : '') +
      (l.length ? l.map(x => {const g = GIRLS.find(y => y.id === x.id), rel = h.dgf === x.id; return '<div class="tech"><div>' + g.ic + ' <b>' + g.n + '</b> · ' + g.job + (rel ? ' ❤' : '') + '<br><small>' + g.d + '</small><br><small>Симпатия: <b>' + Math.round(x.aff) + '</b>/100 · сегодня встреч: ' + (x.last === S.day ? x.today : 0) + '/2</small></div></div><div class="opts">' +
        Object.keys(ACT).map(k => '<button class="btn" data-a="dt" data-v="' + x.id + ':' + k + '">' + ACT[k].n + (ACT[k].cost ? ' (₴' + ACT[k].cost + ')' : '') + '</button>').join('') +
        '<button class="btn pri" data-a="dt" data-v="' + x.id + ':home"' + (x.aff < 50 ? ' disabled' : '') + '>🏠 Пригласить домой' + (x.aff < 50 ? ' (от симпатии 50)' : '') + '</button>' +
        (x.aff >= 85 && !rel ? '<button class="btn" data-a="dt" data-v="' + x.id + ':ask">💍 Предложить встречаться</button>' : '') +
        '<button class="btn" data-a="dt" data-v="' + x.id + ':bye">🚪 Попрощаться</button></div>';}).join('') : '<p style="color:#9a8fb8">Пока никого. Загляните в «Поездки» и нажмите «Познакомиться».</p>') +
      '<div class="row" style="margin-top:8px"><button class="btn" data-a="dt_back">← В дом</button></div></div>', true);
  }
  const HOME_OUT = [
    {p: .22, t: 'Вечер удался: чай, плед и сериал. Вы впервые за неделю не смотрели на телефон.', fx: {energy: 8, cons: 3}, aff: 10, s: 'heart'},
    {p: .16, t: '{g} приготовила ужин из ничего. Вы никогда так вкусно не ели.', fx: {energy: 10}, aff: 8, s: 'good'},
    {p: .14, t: 'Пока вы заваривали чай, {g} подружилась с вашими питомцами. Они не отходят от неё.', fx: {cons: 2, energy: 4}, aff: 9, pet: 1, s: 'purr'},
    {p: .12, t: 'Позвонил шеф и сорок минут говорил про отчёты. {g} вежливо ждала.', fx: {boss: 3, energy: -4}, aff: -3, s: 'phone'},
    {p: .1, t: '{g} нашла на полке бумаги с работы и задала неудобный вопрос.', fx: {heat: 2, cons: -1}, aff: -2, s: 'err'},
    {p: .1, t: 'Неожиданно пришли соседи за солью и остались на чай. Получился вечер на пятерых.', fx: {energy: 3, cons: 1}, aff: 4, s: 'cheer'},
    {p: .09, t: 'Вечер вышел неловким: вы оба молчали и смотрели в разные стороны. Хорошо, что чайник закипел.', fx: {energy: -1}, aff: -4, s: 'wah'},
    {p: .07, t: 'Вы вдвоём смотрели на звёзды с балкона. Тишина говорила за вас.', fx: {cons: 4, energy: 6}, aff: 12, s: 'sparkle'}
  ];
  const pickOut = arr => {let r = Math.random(), s = 0; for (const o of arr) {s += o.p; if (r < s) return o;} return arr[arr.length - 1];};
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-a="dt"],[data-a="dt_back"],[data-a="dates"]'); if (!b || b.disabled) return; e.preventDefault(); e.stopImmediatePropagation(); Snd.resume(); sn('click');
    const a = b.dataset.a; if (a === 'dates') {HM.gen++; return scrDates();} if (a === 'dt_back') return scrHome();
    const [id, k] = b.dataset.v.split(':'), x = find(id), g = GIRLS.find(y => y.id === id); if (!x) return;
    if (k === 'bye') {const l = D(); l.splice(l.indexOf(x), 1); if (H().dgf === id) H().dgf = null; return scrDates(g.n + ' пожелала вам удачи.');}
    if (k === 'ask') {if (x.aff < 85) return; if (H().dgf) return scrDates('Вы уже встречаетесь с ' + GIRLS.find(y => y.id === H().dgf).n + '.'); H().dgf = id; sn('heart'); x.aff = clamp(x.aff + 5, 0, 100); return scrDates('❤ ' + g.n + ' улыбнулась: «Давно пора». Теперь у вас отношения (+4 силы и +1 совесть каждый день).');}
    if (x.last !== S.day) {x.last = S.day; x.today = 0;} if (x.today >= 2) return scrDates('На сегодня хватит: ' + g.n + ' просит не торопиться.');
    if (k === 'home') {
      if (x.aff < 50) return;
      x.today++; x.vis++; const win = Math.random() < Math.min(.95, .35 + x.aff / 150 + ((S.pets || []).length ? .05 : 0));
      if (!win) {x.aff = clamp(x.aff - 6, 0, 100); sn('wah'); renderHud(); return scrDates(g.n + ' ответила: «Давай в другой раз, я устала». Ничего страшного (−6).');}
      let o = pickOut(HOME_OUT); if (o.pet && !(S.pets || []).length) o = HOME_OUT[0];
      applyFx(o.fx); x.aff = clamp(x.aff + o.aff, 0, 100); H().guest = S.day; H().guestN = g.n + ' ' + g.ic; sn(o.s); renderHud();
      return scrDates('🏠 ' + g.n + ' у вас дома. ' + o.t.replace('{g}', g.n) + ' (' + (o.aff >= 0 ? '+' : '') + o.aff + ')');
    }
    const A = ACT[k]; if (S.money < A.cost) return toast('Не хватает денег.', 'bad'); S.money -= A.cost; x.today++;
    const ad = Math.round(ri(A.aff[0], A.aff[1]) * (g.like === k ? 1.5 : 1)); x.aff = clamp(x.aff + ad, 0, 100); S.energy = clamp(S.energy + (k === 'cafe' ? 2 : 0), 0, 100); sn(k === 'gift' ? 'good' : 'notif'); renderHud();
    scrDates(g.ic + ' ' + g.n + ': ' + pick(k === 'write' ? ['«Ой, ты написал(а) вовремя!»', '«Смешно. Продолжай.»'] : k === 'cafe' ? ['«Тут вкусный чай. И ты ничего.»', '«Давно так не сидела в кафе без телефона.»'] : ['«Мне давно никто не дарил цветы!»', '«Красиво. Поставлю на кухне.»']) + ' (+' + ad + (g.like === k ? ', ей это особенно нравится' : '') + ')');
  }, true);
  /* кнопка в доме + строка про гостью */
  const _sh = scrHome;
  scrHome = function (from) {
    _sh(from); const box = document.querySelector('#scr .box'); if (!box) return; const h = H(), opts = box.querySelector('.opts');
    if (opts && !opts.querySelector('[data-a="dates"]')) opts.insertAdjacentHTML('beforeend', '<button class="btn" data-a="dates">💞 Знакомства (' + D().length + ')</button>');
    if (h.guest === S.day && !box.querySelector('.guestln')) box.querySelector('h2').insertAdjacentHTML('afterend', '<p class="guestln" style="color:#ff9ad1;margin:4px 0">💕 Сегодня у вас гостья: ' + h.guestN + '</p>');
  };
  /* ежедневно */
  const _nd = nextDay;
  nextDay = function () {
    const r = _nd.apply(this, arguments); try {const h = H(); D().forEach(x => {if (x.last < S.day - 2) x.aff = Math.max(0, x.aff - 3); x.today = 0;}); if (h.dgf && find(h.dgf)) {S.energy = clamp(S.energy + 4, 0, 100); S.cons = clamp(S.cons + 1, 0, 100); const x = find(h.dgf); x.last = S.day; if (Math.random() < .08) {x.aff -= 15; if (x.aff < 50) {h.dgf = null; toast('💔 Вы поссорились. Отношения закончились.', 'bad');}}}} catch (e) {}
    return r;
  };
})();
