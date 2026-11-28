'use strict';
/* v147: дерево навыков — очки за дни и повышения, 8 навыков по 3 уровня */
(function () {
  const $q = s => document.querySelector(s);
  const PK = [
    {id: 'thick', ic: '🛡', n: 'Толстая кожа', d: 'Подозрения растут медленнее: −10% за уровень'},
    {id: 'cons', ic: '🧠', n: 'Чистая совесть', d: 'Удары по совести слабее: −12% за уровень'},
    {id: 'boss', ic: '🤝', n: 'Подлиза', d: 'Шеф бесится реже: −12% за уровень'},
    {id: 'gold', ic: '💰', n: 'Золотой язык', d: 'Комиссия за «сделку» +10% за уровень'},
    {id: 'nerve', ic: '⚡', n: 'Железные нервы', d: '+6 сил в начале каждого дня за уровень'},
    {id: 'nose', ic: '🕵', n: 'Нюх оперативника', d: '1: чуешь подставных клиентов. 2: штраф за них вдвое меньше. 3: ещё и награда за раскрытие'},
    {id: 'dipl', ic: '📞', n: 'Дипломат', d: 'Клиенты начинают разговор спокойнее: подозрение −4 за уровень'},
    {id: 'luck', ic: '🍀', n: 'Везунчик', d: 'Каждое утро шанс найти деньги: до ₴100×уровень'}
  ];
  const COST = [1, 2, 3];
  window.__pk = id => (S && S.perks && S.perks[id]) || 0;
  const pts = () => S.pp || 0, spent = () => Object.values(S.perks || {}).reduce((a, b) => a + b, 0);
  const give = (n, why) => {S.pp = pts() + n; try {toast('🌳 +' + n + ' очк. навыков' + (why ? ' (' + why + ')' : ''), 'ok');} catch (e) {}};
  /* стартовые очки */
  const _b = begin;
  begin = function (f) {const r = _b(f); if (f === true && S && S.pp === undefined) {S.pp = 2 + (S.ngl || 0); S.perks = S.perks || {}; setTimeout(() => {try {toast('🌳 Открыты навыки: Меню → «Навыки» (' + S.pp + ' очк.)', 'ok');} catch (e) {}}, 2600);} return r;};
  /* очки: каждый 3-й день и за повышение */
  let lastRank = null;
  setInterval(() => {if (!S) {lastRank = null; return;} if (lastRank === null || S._rk0 !== S) {lastRank = S.rank; S._rk0 = S;} if (S.rank > lastRank) {give(1, 'повышение'); lastRank = S.rank;}}, 1500);
  const _nd = nextDay;
  nextDay = function () {
    const d0 = S && S.day; _nd.apply(this, arguments); if (!S || S.mode === 'ending' || S.day === d0) return;
    try {
      if (S.day % 3 === 0) give(1, 'день ' + S.day);
      const n = window.__pk('nerve'); if (n) S.energy = Math.min(100, S.energy + 6 * n);
      const l = window.__pk('luck'); if (l && Math.random() < .45) {const g = Math.round((20 + Math.random() * 80) * l); S.money += g; setTimeout(() => {try {toast('🍀 Утром нашлись деньги: +' + fmt(g), 'ok'); renderHud();} catch (e) {}}, 1500);}
      renderHud(); save();
    } catch (e) {}
  };
  /* эффекты в звонках */
  const _a = answer;
  answer = function () {
    _a.apply(this, arguments); const c = S && S.call; if (!c || c._pk) return; c._pk = 1;
    try {
      const dp = window.__pk('dipl'); if (dp) c.susp = Math.max(0, (c.susp || 0) - 4 * dp);
      if (c.sting && window.__pk('nose') >= 1) setTimeout(() => {try {toast('🕵 Нюх: этот клиент слишком любознательный. Осторожнее.', 'warn'); Snd.sfx('pop');} catch (e) {}}, 700);
      render();
    } catch (e) {}
  };
  const _su = success;
  success = function () {
    const c = S.call, m0 = S.money, h0 = S.heat; _su.apply(this, arguments);
    try {
      const g = window.__pk('gold'), d = S.money - m0; if (g && d > 0) {const b = Math.round(d * .1 * g); S.money += b; const bx = $q('#scr .box.story h2'); if (bx) bx.insertAdjacentHTML('afterend', '<p style="color:#ffd23a">💰 Золотой язык: +' + fmt(b) + '</p>');}
      if (c && c.sting && window.__pk('nose') >= 2) {S.heat = h0 + (S.heat - h0) * .5; if (d < 0) S.money = m0 + d * .5;}
      renderHud();
    } catch (e) {}
  };
  const _wn = warn;
  warn = function () {
    const c = S && S.call, st = c && c.sting; _wn.apply(this, arguments);
    try {if (st && window.__pk('nose') >= 3) {S.money += 300; toast('🕵 Нюх: награда за раскрытие подставной закупки +₴300', 'ok'); renderHud();}} catch (e) {}
  };
  /* экран навыков */
  const _sm = scrMenu;
  scrMenu = function () {if (S && S.pp === undefined) {S.pp = 2; S.perks = S.perks || {};} _sm(); try {const b = $q('#scr [data-a="stats"]') || $q('#scr [data-a="achm"]'); if (b) b.insertAdjacentHTML('afterend', '<button class="btn" data-a="pk">🌳 Навыки<br><small>очков: ' + pts() + '</small></button>');} catch (e) {}};
  function scrPk(msg) {
    if (!S) return; if (S.pp === undefined) {S.pp = 2; S.perks = S.perks || {};} const row = p => {const l = window.__pk(p.id), nxt = COST[l], can = nxt !== undefined && pts() >= nxt; return '<div style="border:1px solid #3a2a6a;border-radius:12px;padding:8px 10px;margin:6px 0;background:#1a1040"><div style="display:flex;justify-content:space-between;align-items:center"><b>' + p.ic + ' ' + p.n + '</b><span style="color:#ffd23a">' + '●'.repeat(l) + '○'.repeat(3 - l) + '</span></div><div style="font-size:12px;color:#b8a8d8;margin:3px 0 6px">' + p.d + '</div>' + (nxt === undefined ? '<div style="color:#5dffc0;font-size:12px">Максимум</div>' : '<button class="btn sm' + (can ? ' pri' : '') + '" data-a="pk_buy" data-v="' + p.id + '"' + (can ? '' : ' style="opacity:.55"') + '>Улучшить за ' + nxt + ' очк.</button>') + '</div>';};
    showScr('<div class="box"><h2>🌳 Навыки</h2><p>Очков: <b style="color:#ffd23a">' + pts() + '</b> · потрачено: ' + spent() + '<br><small>+1 очко каждый 3-й день и за повышение</small></p>' + (msg ? '<p style="color:#5dffc0">' + msg + '</p>' : '') + PK.map(row).join('') + '<div class="row" style="margin-top:8px"><button class="btn pri" data-a="pk_back">← Назад</button></div></div>', true);
  }
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-a="pk"],[data-a="pk_buy"],[data-a="pk_back"]'); if (!b) return; e.preventDefault(); e.stopImmediatePropagation(); try {Snd.resume(); Snd.sfx('click');} catch (er) {}
    const a = b.dataset.a; if (a === 'pk') return scrPk();
    if (a === 'pk_back') return scrMenu();
    const p = PK.find(x => x.id === b.dataset.v), l = window.__pk(p.id), c = COST[l];
    if (c === undefined || pts() < c) {try {toast('Не хватает очков навыков', 'warn');} catch (er) {} return;}
    S.pp -= c; S.perks = S.perks || {}; S.perks[p.id] = l + 1; try {save(); Snd.sfx('levelup');} catch (er) {} scrPk('✔ ' + p.n + ': уровень ' + (l + 1));
  }, true);
  [{id: 'pk5', n: 'Прокачанный', d: 'Купить 5 уровней навыков за игру', c: () => S && Object.values(S.perks || {}).reduce((a, b) => a + b, 0) >= 5},
   {id: 'pk12', n: 'Мастер своего дела', d: 'Купить 12 уровней навыков за игру', c: () => S && Object.values(S.perks || {}).reduce((a, b) => a + b, 0) >= 12}].forEach(a => {if (!ACH.some(x => x.id === a.id)) ACH.push(a);});
})();
