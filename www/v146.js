'use strict';
/* v146: настоящий «Ад» — жёсткие клиенты, инфляция, штрафы каждые 4 дня, но комиссия +25% */
(function () {
  const hell = () => S && S.diff === 'hell';
  const _a = answer;
  answer = function () {
    _a.apply(this, arguments); const c = S && S.call; if (!c || !hell() || c._h) return; c._h = 1; c.susp = Math.min(90, (c.susp || 0) + 10);
    try {c.log.push({w: 'them', t: pick(['«Я вас предупредил: у меня плохое настроение.»', '«Говорите быстро. И без глупостей.»', '«Мне уже звонили ваши. Хватит.»', '«Что опять?»'])}); render();} catch (e) {}
  };
  const _su = success;
  success = function () {
    const m0 = S.money; _su.apply(this, arguments);
    try {if (hell()) {const d = S.money - m0; if (d > 0) {const b = Math.round(d * .25); S.money += b; const bx = document.querySelector('#scr .box.story h2'); if (bx) bx.insertAdjacentHTML('afterend', '<p style="color:#ff9a7a">😈 Надбавка «Ада»: +' + fmt(b) + '</p>'); renderHud();}}} catch (e) {}
  };
  const EVS = [
    () => {const f = Math.max(150, Math.round(S.money * .12)); S.money -= f; return '🧾 Налоговая нагрянула без звонка. Штраф ' + fmt(f) + '.';},
    () => {S.heat = Math.min(99, S.heat + 9); return '🚨 Кто-то из своих стуканул. Подозрения +9.';},
    () => {S.boss = Math.max(1, S.boss - 9); return '😠 Шеф вызвал на «разговор по душам». Шеф −9.';},
    () => {S.cons = Math.max(1, S.cons - 7); return '🧠 Ночью приснилась бабушка из утреннего звонка. Совесть −7.';},
    () => {S.energy = Math.max(0, S.energy - 15); return '⚡ Ночью не спалось: соседи, долги, шеф. Силы −15.';}
  ];
  const _nd = nextDay;
  nextDay = function () {
    _nd.apply(this, arguments); if (!hell() || !S) return;
    try {
      const infl = Math.round(billsSum() * .25); S.money -= infl; let msg = '😈 Инфляция «Ада»: расходы выросли, −' + fmt(infl) + '.';
      if (S.day % 4 === 0) msg += ' ' + pick(EVS)();
      setTimeout(() => {try {toast(msg, 'bad'); renderHud(); save();} catch (e) {}}, 900);
      if (S.day % 4 === 0) setTimeout(() => {try {window.__lesnSay && window.__lesnSay('heat', true);} catch (e) {}}, 2600);
    } catch (e) {}
  };
})();
