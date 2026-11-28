'use strict';
/* v150: ТОТАЛ — рейтинг офисов по плану, просмотр других офисов, вкладки на экране команды, полировка */
(function () {
  const $q = s => document.querySelector(s), clampN = (v, a, b) => Math.max(a, Math.min(b, v));
  const CH = {main: 1, north: 1.04, resort: .8, basement: .92, colos: 1.1, ware: .9};
  const hs = str => {let h = 2166136261; for (let i = 0; i < str.length; i++) {h ^= str.charCodeAt(i); h = Math.imul(h, 16777619);} return (h >>> 0) / 4294967295;};
  const TG = () => (S.tot = S.tot || {}), SEED = () => (S.tseed = S.tseed || String(Math.floor(Math.random() * 1e6)));
  const perf = (id, d) => clampN((CH[id] || 1) + (hs(id + d + SEED()) - .5) * .5 + Math.sin(d / 3 + hs(id) * 6) * .06, .45, 1.6);
  const MED = ['🥇', '🥈', '🥉'];
  /* записи по дням: день -> {you, plan} */
  const _nd = nextDay;
  nextDay = function () {
    const d = S && S.day, you = S && S.turnover, plan = S ? planNow() : 1;
    _nd.apply(this, arguments);
    try {
      if (S && S.day > d) {
        TG()[d] = {you: Math.round(you), plan: Math.round(plan)};
        if (d % 7 === 0) {
          const st = standings('w', d), me = st.findIndex(r => r.id === 'main') + 1, prize = [3000, 1500, 800, 0, -400, -800][me - 1] || 0, bd = [5, 3, 1, 0, -3, -5][me - 1] || 0;
          S.money = Math.max(0, S.money + prize); S.boss = clampN(S.boss + bd, 0, 100); S.tlast = {d, me, prize};
          (S.hist = S.hist || []).push({d: S.day, t: '🏆 ТОТАЛ недели: ' + me + '-е место из ' + st.length}); setTimeout(() => {try {toast('🏆 ТОТАЛ недели: ' + me + '-е место' + (prize ? (prize > 0 ? ', премия +' : ', штраф ') + fmt(Math.abs(prize)) : ''), me <= 3 ? 'ok' : 'bad');} catch (e) {}}, 1500);
        }
      }
    } catch (e) {}
  };
  /* рейтинг: режим t (сегодня), w (7 дней), a (всё); до дня upto включительно */
  function standings(mode, upto) {
    const cur = upto === undefined ? S.day : upto, from = mode === 't' ? cur : mode === 'w' ? Math.max(1, cur - 6) : 1, T = TG();
    const rows = OFFICES.map(o => ({id: o.id, o, turn: 0, plan: 0, days: []}));
    for (let d = from; d <= cur; d++) {
      const rec = T[d] || (d === S.day && upto === undefined ? {you: S.turnover, plan: planNow()} : null); if (!rec) continue;
      rows.forEach(r => {const v = r.id === 'main' ? rec.you : rec.plan * perf(r.id, d); r.turn += v; r.plan += rec.plan; r.days.push(rec.plan ? v / rec.plan : 0);});
    }
    rows.forEach(r => {r.pct = r.plan ? r.turn / r.plan : 0;});
    return rows.sort((a, b) => b.pct - a.pct);
  }
  const tabs = on => '<div class="tabs"><button data-a="tt_team"' + (on === 0 ? ' class="on"' : '') + '>🏢 Мой офис</button><button data-a="tt_tot"' + (on === 1 ? ' class="on"' : '') + '>🏆 ТОТАЛ</button><button data-a="tt_offs"' + (on === 2 ? ' class="on"' : '') + '>🌍 Офисы</button></div>';
  let mode = 'w';
  function scrTot() {
    if (!S) return; running = false; const st = standings(mode), me = st.findIndex(r => r.id === 'main'), top = st[0], T = TG(), days = Object.keys(T).length;
    const label = {t: 'Сегодня', w: '7 дней', a: 'Всё время'};
    const rows = st.map((r, i) => {const p = Math.round(r.pct * 100), w = clampN(p / 1.6, 4, 100), you = r.id === 'main';
      return '<div class="tot' + (you ? ' me' : '') + '" data-a="tt_o" data-v="' + r.id + '"><span class="pl">' + (MED[i] || (i + 1)) + '</span><span class="nm">' + r.o.ic + ' <b>' + (you ? '★ ' : '') + r.o.n + '</b><small>' + r.o.mgr.n + ' · ' + fmtR(r.turn) + '</small><i class="bar"><u style="width:' + w + '%;background:' + (p >= 100 ? 'linear-gradient(90deg,#2fd08a,#5dffc0)' : p >= 75 ? 'linear-gradient(90deg,#d8a020,#ffd23a)' : 'linear-gradient(90deg,#c03050,#ff5a6a)') + '"></u></i></span><span class="pc ' + (p >= 100 ? 'win' : p < 75 ? 'lose' : '') + '">' + p + '%</span></div>';}).join('');
    const gap = me > 0 ? 'До ' + (me) + '-го места: не хватает ' + Math.max(0, Math.round((st[me - 1].pct - st[me].pct) * st[me].plan)) + ' ₽ оборота (' + st[me - 1].o.n + ')' : 'Вы лидер! Держите планку.';
    const lastW = S.tlast ? '<p class="mut">Прошлая неделя (день ' + S.tlast.d + '): ' + S.tlast.me + '-е место' + (S.tlast.prize ? ', ' + (S.tlast.prize > 0 ? 'премия ' : 'штраф ') + fmt(Math.abs(S.tlast.prize)) : '') + '.</p>' : '';
    showScr('<div class="box">' + tabs(1) + '<h2>🏆 ТОТАЛ</h2><p class="mut">Все офисы «Золотого Бульбаша» соревнуются по выполнению плана. Раз в 7 дней: 🥇 +₴3000 и шеф доволен, последнее место: штраф.</p><div class="pills">' + ['t', 'w', 'a'].map(k => '<button data-a="tt_m" data-v="' + k + '"' + (k === mode ? ' class="on"' : '') + '>' + label[k] + '</button>').join('') + '</div>' + (days || mode === 't' ? rows : '<p class="mut">Данные появятся после первого закрытого дня.</p>') + '<p style="margin-top:8px"><b>' + gap + '</b></p>' + lastW + '<p class="mut">Нажмите на офис, чтобы посмотреть его.</p><div class="row" style="margin-top:8px"><button class="btn" data-a="' + BACK() + '">Закрыть</button></div></div>', true);
  }
  const spark = a => {const v = a.slice(-7), w = 14; return '<svg viewBox="0 0 ' + (v.length * w) + ' 40" width="' + (v.length * w) + '" height="40">' + v.map((x, i) => {const h = clampN(x / 1.6, .05, 1) * 36; return '<rect x="' + (i * w + 2) + '" y="' + (38 - h) + '" width="10" height="' + h + '" rx="2" fill="' + (x >= 1 ? '#5dffc0' : x >= .75 ? '#ffd23a' : '#ff5a6a') + '"/>';}).join('') + '</svg>';};
  function scrOff(id) {
    if (!S) return; running = false; const o = OFFICES.find(x => x.id === id) || OFFICES[0], st = standings('w'), i = st.findIndex(r => r.id === o.id), r = st[i], allT = standings('a'), ia = allT.findIndex(x => x.id === o.id), staff = Math.round(6 + hs(o.id + 'st') * 14), you = o.id === 'main';
    const trust = (S.mgr && S.mgr[o.id]) || 0, can = !you && S.slots > 0 && S.money >= o.fare;
    showScr('<div class="box">' + tabs(2) + '<div class="ofcard" style="background:linear-gradient(135deg,' + o.bg[0] + ',' + o.bg[1] + ')"><div class="em">' + o.em.map(e => '<span>' + e + '</span>').join('') + '</div><h2 style="margin:6px 0 2px">' + o.ic + ' ' + o.n + '</h2><div style="font-size:13px;opacity:.9">' + o.d + '</div></div><div class="stat"><span>Управляющий</span><span>' + o.mgr.ic + ' ' + o.mgr.n + '</span><span>Должность</span><span>' + o.mgr.role + '</span><span>Сотрудников</span><span>' + (you ? (S.staff ? S.staff.length : TEAM.length) : staff) + '</span><span>Место за 7 дней</span><span>' + MED[i] + ' ' + (i + 1) + ' из ' + st.length + '</span><span>Выполнение плана</span><span>' + Math.round(r.pct * 100) + '%</span><span>Место за всё время</span><span>' + (ia + 1) + '</span>' + (you ? '' : '<span>Доверие управляющего</span><span>' + trust + '/4</span>') + '</div><div class="mut" style="margin:4px 0 2px">Последние дни (выполнение плана)</div>' + spark(r.days.length ? r.days : [0]) + '<div class="col" style="margin-top:8px">' + (you ? '' : '<button class="btn pri" data-a="v_go" data-v="o:' + o.id + '"' + (can ? '' : ' disabled') + '>✈ Съездить: билет ' + fmt(o.fare) + (S.slots <= 0 ? ' (нет вечерних действий)' : '') + '</button>') + '<button class="btn" data-a="tt_offs">← К списку офисов</button><button class="btn" data-a="tt_tot">🏆 К рейтингу</button></div></div>', true);
  }
  function scrOffs() {
    if (!S) return; running = false; const st = standings('w');
    showScr('<div class="box">' + tabs(2) + '<h2>🌍 Офисы компании</h2><p class="mut">Нажмите на офис, чтобы посмотреть его, или съездите туда вечером.</p>' + OFFICES.map(o => {const i = st.findIndex(r => r.id === o.id), p = Math.round(st[i].pct * 100); return '<div class="ofrow" data-a="tt_o" data-v="' + o.id + '" style="background:linear-gradient(135deg,' + o.bg[0] + 'cc,' + o.bg[1] + 'cc)"><span class="e">' + o.ic + '</span><span class="t"><b>' + (o.id === 'main' ? '★ ' : '') + o.n + '</b><small>' + o.mgr.n + ' · ' + o.mgr.role + '</small></span><span class="p">' + (MED[i] || (i + 1)) + '<small>' + p + '%</small></span></div>';}).join('') + '<div class="row" style="margin-top:8px"><button class="btn" data-a="tt_tot">🏆 Рейтинг ТОТАЛ</button><button class="btn" data-a="' + BACK() + '">Закрыть</button></div></div>', true);
  }
  /* вкладки на экране команды и пункт в меню */
  const _of = scrOffice;
  scrOffice = function () {_of(); try {const h = $q('#scr .box h2'); if (h) h.insertAdjacentHTML('beforebegin', tabs(0));} catch (e) {}};
  scrTeam = function () {scrOffice();};
  const _sm = scrMenu;
  scrMenu = function () {_sm(); try {const b = $q('#scr [data-a="hist"]') || $q('#scr [data-a="pk"]'); if (b) b.insertAdjacentHTML('beforebegin', '<button class="btn" data-a="tt_tot">🏆 ТОТАЛ офисов<br><small>рейтинг по плану</small></button>');} catch (e) {}};
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-a^="tt_"]'); if (!b || !S) return; e.preventDefault(); e.stopImmediatePropagation(); try {Snd.resume(); Snd.sfx('click');} catch (er) {}
    const a = b.dataset.a, v = b.dataset.v; if (a === 'tt_tot') scrTot(); else if (a === 'tt_offs') scrOffs(); else if (a === 'tt_o') scrOff(v); else if (a === 'tt_m') {mode = v; scrTot();} else if (a === 'tt_team') scrOffice();
  }, true);
  /* ---------- оформление ---------- */
  const css = document.createElement('style');
  css.textContent = '.tabs{display:flex;gap:4px;margin:0 0 8px;background:#120c2c;border:1.5px solid #3a2e78;border-radius:12px;padding:3px}.tabs button{flex:1;padding:8px 4px;border-radius:9px;font:700 12.5px sans-serif;color:#b9aedb;background:transparent;border:0}.tabs button.on{background:linear-gradient(180deg,#ffe06a,#f0a000);color:#2a1a00;box-shadow:0 2px 0 #8a5a00}' +
    '.pills{display:flex;gap:6px;margin:6px 0}.pills button{flex:1;padding:6px;border-radius:20px;border:1.5px solid #4b3b8c;background:#1a1236;color:#cfc4ee;font:700 12.5px sans-serif}.pills button.on{background:#ff3ac8;border-color:#ffb0e8;color:#fff}' +
    '.mut{color:#9a8fb8!important;font-size:12.5px!important}' +
    '.tot{display:flex;align-items:center;gap:8px;background:linear-gradient(180deg,#201848,#171038);border:1.5px solid #3a2e78;border-radius:12px;padding:7px 9px;margin:5px 0;cursor:pointer}.tot.me{border-color:#ffd23a;box-shadow:0 0 14px rgba(255,210,58,.3)}.tot .pl{font:800 20px sans-serif;width:30px;text-align:center}.tot .nm{flex:1;min-width:0;display:flex;flex-direction:column;gap:1px;font-size:13.5px}.tot .nm small{color:#9a8fb8;font-size:11px}.tot .bar{display:block;height:6px;border-radius:4px;background:#0c0820;margin-top:3px;overflow:hidden}.tot .bar u{display:block;height:100%;border-radius:4px;text-decoration:none}.tot .pc{font:800 16px sans-serif;min-width:46px;text-align:right;font-variant-numeric:tabular-nums}' +
    '.ofcard{border-radius:14px;padding:12px;border:1.5px solid rgba(255,255,255,.18);margin-bottom:6px;text-shadow:0 2px 6px #000a}.ofcard h2{color:#fff!important}.ofcard .em{display:flex;gap:10px;font-size:30px;filter:drop-shadow(0 3px 4px #0008)}' +
    '.ofrow{display:flex;align-items:center;gap:10px;border:1.5px solid rgba(255,255,255,.16);border-radius:13px;padding:9px 11px;margin:6px 0;cursor:pointer;text-shadow:0 1px 4px #000a}.ofrow .e{font-size:28px}.ofrow .t{flex:1;display:flex;flex-direction:column;font-size:14px}.ofrow small{opacity:.8;font-size:11.5px}.ofrow .p{display:flex;flex-direction:column;align-items:center;font:800 18px sans-serif}.ofrow .p small{font-size:11px}' +
    '#hud{backdrop-filter:blur(6px)}.box .tech,.box .help{box-shadow:0 2px 8px rgba(0,0,0,.25)}.box{scrollbar-width:thin;scrollbar-color:#5c4aa6 transparent}';
  document.head.appendChild(css);
  window.__standings = standings;
})();
