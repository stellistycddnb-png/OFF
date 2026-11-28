'use strict';
/* v151: ежедневные задания, серия «сделок», место в ТОТАЛ на главном экране, карточки команды */
(function () {
  const $q = s => document.querySelector(s), rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const DEF = [
    {id: 'deal', f: () => {const n = rnd(2, 4); return {n: 'Закрыть «сделок»: ' + n, need: n, rew: {m: 150 * n}};}},
    {id: 'warn', f: () => {const n = rnd(1, 2); return {n: 'Предупредить клиентов: ' + n, need: n, rew: {m: 120 * n, cons: 5}};}},
    {id: 'calls', f: () => {const n = rnd(5, 8); return {n: 'Принять звонков: ' + n, need: n, rew: {m: 200}};}},
    {id: 'streak', f: () => ({n: 'Серия из 3 «сделок» подряд', need: 3, rew: {pp: 1}})},
    {id: 'plan', f: () => ({n: 'Выполнить план дня', need: 1, rew: {m: 400, boss: 3}})},
    {id: 'cool', f: () => ({n: 'Закончить день с риском ниже 40', need: 1, rew: {m: 300}})}
  ];
  function gen() {
    const pool = DEF.slice().sort(() => Math.random() - .5).slice(0, 3);
    S.dq = {d: S.day, list: pool.map(p => Object.assign({id: p.id, cur: 0, done: 0}, p.f()))};
  }
  const ensure = () => {if (!S) return false; if (!S.dq || S.dq.d !== S.day) gen(); return true;};
  function reward(t) {
    t.done = 1; const r = t.rew, parts = [];
    if (r.m) {S.money += r.m; parts.push('+' + fmt(r.m));} if (r.cons) {S.cons = clamp(S.cons + r.cons, 0, 100); parts.push('совесть +' + r.cons);} if (r.boss) {S.boss = clamp(S.boss + r.boss, 0, 100); parts.push('шеф +' + r.boss);} if (r.pp) {S.pp = (S.pp || 0) + r.pp; parts.push('+' + r.pp + ' очко навыков');}
    try {toast('📋 Задание выполнено: ' + t.n + ' (' + parts.join(', ') + ')', 'ok'); Snd.sfx('good'); renderHud();} catch (e) {}
    (S.hist = S.hist || []).push({d: S.day, t: '📋 Задание: ' + t.n});
  }
  const bump = (id, n, set) => {if (!ensure()) return; S.dq.list.forEach(t => {if (t.id === id && !t.done) {t.cur = set ? Math.max(t.cur, n) : t.cur + n; if (t.cur >= t.need) reward(t);}});};
  const _a = answer; answer = function () {const had = S && S.call; _a.apply(this, arguments); if (S && S.call && S.call !== had) bump('calls', 1);};
  const _su = success;
  success = function () {
    const m0 = S.money; S.streak = (S.streak || 0) + 1; _su.apply(this, arguments);
    try {
      bump('deal', 1); bump('streak', S.streak, true);
      if (S.streak >= 2) {const com = Math.max(0, S.money - m0), b = Math.round(com * .1 * Math.min(S.streak - 1, 5)); if (b > 0) {S.money += b; toast('🔥 Серия ×' + S.streak + ': бонус +' + fmt(b), 'ok');}}
      if (S.streak > (S.bestStreak || 0)) S.bestStreak = S.streak;
    } catch (e) {}
  };
  const _wn = warn; warn = function () {S.streak = 0; _wn.apply(this, arguments); bump('warn', 1);};
  const _fl = fail; fail = function () {S.streak = 0; return _fl.apply(this, arguments);};
  const _hg = hang; hang = function () {S.streak = 0; return _hg.apply(this, arguments);};
  setInterval(() => {try {if (ensure() && S.mode !== 'ending' && S.turnover >= planNow()) bump('plan', 1);} catch (e) {}}, 1500);
  const _nd = nextDay;
  nextDay = function () {try {if (ensure() && S.heat < 40) bump('cool', 1);} catch (e) {} S.streak = 0; return _nd.apply(this, arguments);};
  /* карточка заданий и место в ТОТАЛ на главном экране */
  const css = document.createElement('style');
  css.textContent = '.dqc{margin:8px auto 0;max-width:420px;background:linear-gradient(180deg,#201848,#171038);border:1.5px solid #3a2e78;border-radius:12px;padding:7px 10px;font:600 12.5px/1.5 sans-serif;color:#e6dcff;text-align:left}.dqc b.h{color:#ffd23a;display:flex;justify-content:space-between}.dqc .t{display:flex;justify-content:space-between;gap:8px;border-top:1px dashed #33286a;padding:2px 0}.dqc .t.ok{color:#5dffc0;text-decoration:line-through;opacity:.8}.dqc .t i{font-style:normal;color:#9a8fb8}' +
    '.cards{display:grid;grid-template-columns:1fr 1fr;gap:8px}.pc{background:linear-gradient(180deg,#241a52,#171038);border:1.5px solid #3a2e78;border-radius:13px;padding:8px;text-align:center;font-size:12.5px}.pc .a{font-size:34px;line-height:1.1}.pc b{display:block;margin-top:2px}.pc small{color:#9a8fb8;display:block}.pc .m{height:6px;background:#0c0820;border-radius:4px;margin:4px 0;overflow:hidden}.pc .m u{display:block;height:100%;text-decoration:none;border-radius:4px}';
  document.head.appendChild(css);
  const _r = render;
  render = function () {
    _r.apply(this, arguments);
    try {
      if (!ensure() || S.mode !== 'idle') return; const idle = $q('#main .idle'); if (!idle || idle.querySelector('.dqc')) return;
      let place = ''; try {const st = window.__standings('w'), me = st.findIndex(r => r.id === 'main') + 1; place = '<span>🏆 ТОТАЛ: ' + me + '-е из ' + st.length + '</span>';} catch (e) {}
      const done = S.dq.list.filter(t => t.done).length;
      idle.insertAdjacentHTML('beforeend', '<div class="dqc"><b class="h"><span>📋 Задания дня ' + done + '/3</span>' + place + '</b>' + S.dq.list.map(t => '<div class="t' + (t.done ? ' ok' : '') + '"><span>' + t.n + '</span><i>' + (t.done ? '✔' : Math.min(t.cur, t.need) + '/' + t.need) + '</i></div>').join('') + (S.streak > 1 ? '<div class="t"><span>🔥 Серия «сделок»</span><i>×' + S.streak + '</i></div>' : '') + '</div>');
    } catch (e) {}
  };
  /* карточки команды */
  function scrCards() {
    if (!S) return; running = false; const pult = S.maxRank >= 4 && S.staff, list = pult ? S.staff : TEAM.filter(x => x.r !== S.rank);
    const cards = list.map(p => {
      if (pult) {const R = ROLES[p.role]; return '<div class="pc"><div class="a">' + R.ic + '</div><b>' + p.n + (p.nick ? ' «' + p.nick + '»' : '') + '</b><small>' + R.n + '</small><div class="m"><u style="width:' + p.skill * 20 + '%;background:#ffd23a"></u></div><small>навык ' + '★'.repeat(p.skill) + '☆'.repeat(5 - p.skill) + '</small><div class="m"><u style="width:' + p.loy + '%;background:' + (p.loy < 30 ? '#ff5a6a' : '#5dffc0') + '"></u></div><small>лояльность ' + Math.round(p.loy) + '%</small></div>';}
      return '<div class="pc"><div class="a">' + p.ic + '</div><b>' + p.n + '</b><small>' + RANKS[p.r].ic + ' ' + RANKS[p.r].n + '</small></div>';
    }).join('');
    showScr('<div class="box"><h2>🃏 Моя команда</h2><p style="color:#9a8fb8">' + (pult ? 'Сотрудники вашей смены: навык и лояльность.' : 'Коллеги по должностям. Станьте «Пультом», чтобы нанимать своих.') + '</p><div class="cards">' + (cards || '<p>Пока пусто.</p>') + '</div><div class="row" style="margin-top:10px"><button class="btn pri" data-a="tt_team">← К офису</button></div></div>', true);
  }
  const _of = scrOffice;
  scrOffice = function () {_of(); try {const t = $q('#scr .tabs'); if (t) t.insertAdjacentHTML('afterend', '<button class="btn sm" data-a="cd_open" style="width:100%;margin:0 0 6px">🃏 Карточки команды</button>');} catch (e) {}};
  scrTeam = function () {scrOffice();};
  document.addEventListener('click', e => {const b = e.target.closest('[data-a="cd_open"]'); if (!b) return; e.preventDefault(); e.stopImmediatePropagation(); try {Snd.sfx('click');} catch (er) {} scrCards();}, true);
})();
