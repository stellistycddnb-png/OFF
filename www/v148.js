'use strict';
/* v148: возвращающиеся клиенты, реакции в звонке, настроения музыки, «Моя история», подсказка Лесного, фикс баффов утром */
(function () {
  const $q = s => document.querySelector(s), rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1)), H0 = () => (S.hist = S.hist || []);
  const hist = t => {if (!S) return; const h = H0(); h.push({d: S.day, t}); if (h.length > 80) h.splice(0, h.length - 80);};
  let dayFresh = 0;

  /* ---------- 1. баффы нового дня: видно и не перекрывается ---------- */
  const css = document.createElement('style');
  css.textContent = '#lesq{top:auto!important;bottom:112px;animation:lqb .25s ease-out!important}@keyframes lqb{from{opacity:0;transform:translate(-50%,10px)}}.toast.long{animation:tin .25s,tout .5s 4.6s forwards!important}' +
    '#mornb{position:fixed;left:50%;top:calc(var(--st,0px) + 96px);transform:translateX(-50%);z-index:8900;width:min(92vw,400px);background:#1b1242f5;border:2px solid #5dffc0;border-radius:14px;padding:8px 12px;color:#f2ecff;font:600 12.5px/1.45 sans-serif;box-shadow:0 6px 24px rgba(0,0,0,.55);animation:lqin .25s ease-out;touch-action:manipulation}#mornb b.t{color:#5dffc0;font-size:12px;display:block;margin-bottom:3px}#mornb .r{padding:2px 0;border-top:1px dashed #3a2a6a}#mornb .r:first-of-type{border-top:0}#mornb small{color:#b9aedb;font-weight:500}' +
    '.av{position:relative}.av .rx{position:absolute;right:-8px;top:-8px;font-size:22px;filter:drop-shadow(0 2px 3px #000a);pointer-events:none}.av.mood-sweat{border-color:#ff6a6a!important;box-shadow:0 0 14px #ff3a3a88!important}.av.mood-glad{border-color:#5dffc0!important;box-shadow:0 0 14px #5dffc088!important}.av.mood-hmm{border-color:#ffd23a!important}' +
    '.av.rx-shake{animation:rxs .45s!important}.av.rx-bounce{animation:rxb .55s!important}.av.rx-sweat .rx{animation:rxd 1.2s infinite}@keyframes rxs{20%,60%{transform:translateX(-5px) rotate(-6deg)}40%,80%{transform:translateX(5px) rotate(6deg)}}@keyframes rxb{30%{transform:translateY(-9px) scale(1.12)}60%{transform:translateY(0) scale(.96)}}@keyframes rxd{50%{transform:translateY(5px);opacity:.6}}body.perf2 .av.rx-shake,body.perf2 .av.rx-bounce,body.perf2 .av.rx-sweat .rx{animation:none!important}';
  document.head.appendChild(css);
  const _toast = toast;
  toast = function (m, k) {
    if (dayFresh > Date.now()) {const n = $q('#toasts') ? $q('#toasts').children.length : 0; _toast(m, k); const t = $q('#toasts') && $q('#toasts').lastElementChild; if (t) {t.classList.add('long'); setTimeout(() => {try {t.remove();} catch (e) {}}, 5400);} return;}
    return _toast(m, k);
  };
  const fxT = fx => {try {return fxText(fx);} catch (e) {return '';}};
  function morning() {
    try {
      if (!S || S.mode === 'ending') return; const old = document.getElementById('mornb'); if (old) old.remove(); const st = S.st || [], q = (S.q || []).filter(x => x.day <= S.day + 1);
      const rows = st.map(s => '<div class="r">' + s.ic + ' <b>' + s.n + '</b> · ' + s.d + ' дн.<br><small>' + fxT(s.fx) + '</small></div>').join('') + q.map(x => '<div class="r">📌 ' + x.t + '</div>').join('');
      if (!rows) return; const d = document.createElement('div'); d.id = 'mornb'; d.innerHTML = '<b class="t">☀ Эффекты дня ' + S.day + ' (нажмите, чтобы скрыть)</b>' + rows; d.onclick = () => d.remove(); document.body.appendChild(d); setTimeout(() => {try {d.remove();} catch (e) {}}, 9000);
    } catch (e) {}
  }
  const _nd = nextDay;
  nextDay = function () {const d0 = S && S.day; dayFresh = Date.now() + 8000; _nd.apply(this, arguments); if (S && S.day !== d0) {hist('📅 Начался день ' + S.day); setTimeout(morning, 900);}};
  /* лесной с задержкой после начала дня: не мешать плашкам */
  try {if (window.__lesnSay) {const _ls = window.__lesnSay; window.__lesnSay = function (k, f) {if (k === 'day') return setTimeout(() => _ls(k, f), 6500); return _ls(k, f);};}} catch (e) {}

  /* ---------- 2. возвращающиеся клиенты ---------- */
  const RQ = () => (S.rq = S.rq || []);
  const queue = (c, k) => {if (!c || !c.p || c.p.mood === 'cop' || c.sting) return; const q = RQ(); if (q.length >= 6 || q.some(x => x.n === c.p.name)) return; q.push({n: c.p.name, k, due: S.day + rnd(2, 4)});};
  const _su = success;
  success = function () {const c = S.call, m0 = S.money; _su.apply(this, arguments); try {if (c && c.p) {hist('💰 «Сделка»: ' + c.p.name + ' (+' + fmt(Math.max(0, S.money - m0)) + ')'); if (Math.random() < .5) queue(c, 'angry');}} catch (e) {}};
  const _wn = warn;
  warn = function () {const c = S.call; _wn.apply(this, arguments); try {if (c && c.p) {hist('🛟 Предупредил: ' + c.p.name); if (Math.random() < .65) queue(c, 'thanks');}} catch (e) {}};
  const _fl = fail;
  fail = function (m) {const c = S.call; _fl.apply(this, arguments); try {if (c && c.p) hist('📵 Бросил(а) трубку: ' + c.p.name);} catch (e) {}};
  const _a = answer;
  answer = function () {
    _a.apply(this, arguments); const c = S && S.call; if (!c || c._rc) return; c._rc = 1;
    try {
      const q = RQ(), i = q.findIndex(x => x.due <= S.day); if (i < 0 || c.sting || Math.random() > .6) return; const r = q[i], P = PEOPLE.find(p => p.name === r.n); if (!P) {q.splice(i, 1); return;}
      q.splice(i, 1); c.p = P; c.ret = r.k; c.open = false; const fem = isFem(P);
      const line = r.k === 'angry' ? '«Это вы мне звонили на днях? Я ' + (fem ? 'потеряла' : 'потерял') + ' деньги! Вы меня обманули!»' : '«Здравствуйте! Это вы меня на днях предупредили. Я ' + (fem ? 'хотела' : 'хотел') + ' сказать спасибо.»';
      c.log = [{w: 'me', t: '«' + COMPANY + ', добрый день!»'}, {w: 'them', t: line}]; if (r.k === 'angry') c.susp = Math.max(c.susp, 20);
      const rk = S.rank || 0, pay = Math.min(S.money, 150 + rk * 100), tip = 120 + rk * 80;
      const body = r.k === 'angry'
        ? '<p><b>' + P.name + '</b> ' + (fem ? 'перезвонила' : 'перезвонил') + ': деньги пропали, и это ваших рук дело.</p><p class="sad">' + line + '</p><div class="col"><button class="btn pri" data-a="rc_sorry">🙏 Извиниться и вернуть часть <small>−' + fmt(pay) + ' · риск −6 · совесть +4</small></button><button class="btn" data-a="rc_push">😏 «Вы сами согласились» <small>разговор продолжится, подозрение +30</small></button><button class="btn" data-a="rc_hang">📵 Сбросить <small>риск +6, шеф −1</small></button></div>'
        : '<p><b>' + P.name + '</b> ' + (fem ? 'перезвонила' : 'перезвонил') + ', чтобы поблагодарить: вы спасли деньги.</p><p class="sad">' + line + '</p><div class="col"><button class="btn pri" data-a="rc_tip">🎁 Принять благодарность <small>+' + fmt(tip) + ' · риск −4 · совесть +5</small></button><button class="btn" data-a="rc_ask">🗣 «Приведите знакомых» <small>разговор продолжится: доверие выше, подозрение ниже</small></button><button class="btn" data-a="rc_leave">👋 Вежливо закончить <small>совесть +2</small></button></div>';
      setTimeout(() => {if (S && S.call === c && S.mode === 'call') {showScr('<div class="box story"><div class="av big">' + P.ic + '</div><h2>📞 Повторный звонок</h2>' + body + '</div>', true); try {Snd.sfx(r.k === 'angry' ? 'bad' : 'good');} catch (e) {}}}, 350);
      hist((r.k === 'angry' ? '😡 Перезвонил(а) обманутый: ' : '🙏 Перезвонил(а) со словами благодарности: ') + P.name);
    } catch (e) {}
  };
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-a^="rc_"]'); if (!b || !S) return; e.preventDefault(); e.stopImmediatePropagation(); const a = b.dataset.a, c = S.call, rk = S.rank || 0; try {Snd.resume(); Snd.sfx('click');} catch (er) {}
    const cl = (k, d) => {S[k] = clamp(S[k] + d, 0, 100);};
    if (a === 'rc_sorry') {const pay = Math.min(S.money, 150 + rk * 100); S.money -= pay; cl('heat', -6); cl('cons', 4); toast('🙏 Вернули ' + fmt(pay) + '. Стало легче.', 'ok'); hist('🙏 Вернул деньги обманутому');}
    else if (a === 'rc_hang') {cl('heat', 6); cl('boss', -1); toast('📵 Сбросили. Жалоба ушла наверх.', 'bad');}
    else if (a === 'rc_tip') {const t = 120 + rk * 80; S.money += t; cl('heat', -4); cl('cons', 5); toast('🎁 Благодарность: +' + fmt(t), 'ok'); try {Snd.sfx('cash');} catch (er) {}}
    else if (a === 'rc_leave') {cl('cons', 2);}
    else if (a === 'rc_push') {if (c) {c.susp += 30; c.log.push({w: 'me', t: '«Вы сами подписали, это ваш выбор.»'}); c.open = true;} hideScr(); try {renderHud(); render();} catch (er) {} return;}
    else if (a === 'rc_ask') {if (c) {c.pers += 25; c.susp = Math.max(0, c.susp - 10); c.log.push({w: 'me', t: '«Будем рады, если приведёте друзей.»'}); c.open = true;} hideScr(); try {renderHud(); render();} catch (er) {} return;}
    hideScr(); try {renderHud();} catch (er) {} S.min += 3; endCall(); try {save();} catch (er) {}
  }, true);

  /* ---------- 3. реакции персонажа в звонке ---------- */
  const _r = render;
  render = function () {
    _r.apply(this, arguments);
    try {
      const c = S && S.call; if (!c || S.mode !== 'call') return; const av = $q('#main .caller .av'); if (!av) return;
      const pp = c._pp || {p: c.pers, s: c.susp}, dp = c.pers - pp.p, ds = c.susp - pp.s;
      if (dp !== 0 || ds !== 0) {c._pp = {p: c.pers, s: c.susp}; if (ds >= 7) {c._rk = 'shake'; c._rt = Date.now();} else if (dp >= 7) {c._rk = 'bounce'; c._rt = Date.now();}}
      let ic = '🙂', cls = ''; const ratio = c.pers / Math.max(1, c.target);
      if (c.susp >= 70) {ic = '😰'; cls = 'mood-sweat rx-sweat';} else if (c.susp >= 40) {ic = '🤨'; cls = 'mood-hmm';} else if (ratio >= .65) {ic = '😊'; cls = 'mood-glad';} else if (c.ret === 'angry') ic = '😠';
      if (c._rt && Date.now() - c._rt < 900) {cls += ' rx-' + c._rk; ic = c._rk === 'shake' ? '💢' : '✨';}
      cls.split(' ').filter(Boolean).forEach(k => av.classList.add(k)); av.insertAdjacentHTML('beforeend', '<span class="rx">' + (cls.includes('rx-sweat') && !/rx-(shake|bounce)/.test(cls) ? '💦' : ic) + '</span>');
    } catch (e) {}
  };

  /* ---------- 4. настроение музыки ---------- */
  setInterval(() => {
    try {
      if (!S || $q('#app').classList.contains('hide') || S.mode === 'ending') return; let m = 'calm'; const c = S.call;
      if (S.mode === 'call' && c) m = (c.susp >= 60 || S.heat >= 85) ? 'panic' : 'tense'; else if (S.heat >= 90) m = 'panic'; else if (S.min >= DAY_END - 90 || S.mode === 'summary') m = 'night';
      if (window.__mood !== m) {window.__mood = m; Snd.setMood(m);}
    } catch (e) {}
  }, 800);

  /* ---------- 5. подсказка «Что делать?» ---------- */
  function advice() {
    const a = [], fr = clamp((S.min - DAY_START) / (DAY_END - DAY_START), 0, 1), pct = S.turnover / Math.max(1, planNow());
    if (S.energy < 25) a.push('Силы на исходе. Жми «Кофе» или «Обед», и снова в бой, красавчик.');
    if (S.heat > 70) a.push('Подозрения высоко. Сходи к Палычу, купи VPN или найми адвоката, это решаемо. Лучше до проверки, чем после.');
    if (S.cons < 30) a.push('Совесть просела. Предупреди пару клиентов кнопкой «Предупредить», и полегчает.');
    if (S.boss < 30) a.push('Шеф на взводе. Бери звонки, закрывай «сделки» и не бросай трубки зря, и он отойдёт.');
    if (pct < fr - .25) a.push('План отстаёт: ' + Math.round(pct * 100) + '% при ' + Math.round(fr * 100) + '% дня. Берись за звонки, ты это можешь, ёпта.');
    if (S.pp > 0) a.push('У тебя висят очки навыков (' + S.pp + '). Меню → «Навыки», прокачай, будет пиздато.');
    if (S.money > 3000) a.push('Деньги есть. Вложись в магазин, дом или подарки, и они начнут работать на тебя.');
    if ((S.rq || []).length) a.push('Кто-то из клиентов ещё перезвонит. Если что, держи себя в руках и решай по ситуации.');
    if (!a.length) a.push(S.energy > 60 && S.heat < 40 ? 'Всё ровно, красота! Бери звонки, закрывай «сделки» и копи деньги. Так держать!' : 'Работай по ситуации, смотри на полоски наверху. Ты справляешься, блядь, молодец.');
    return a.slice(0, 3);
  }
  /* ---------- 6. «Моя история» ---------- */
  function scrHist() {
    if (!S) return; const h = H0(), n = k => h.filter(x => x.t.startsWith(k)).length, deals = n('💰'), warns = n('🛟'), ret = n('😡') + n('🙏');
    const ch = deals + warns < 3 ? 'Пока рано судить' : warns > deals ? 'Совестливый' : deals > warns * 2 ? 'Циник' : 'Золотая середина';
    let last = -1, rows = ''; h.slice(-40).reverse().forEach(x => {if (x.d !== last) {rows += '<h3>День ' + x.d + '</h3>'; last = x.d;} rows += '<div class="r" style="padding:3px 0;font-size:13px">' + x.t + '</div>';});
    showScr('<div class="box"><h2>📖 Моя история</h2><p>Характер: <b style="color:#ffd23a">' + ch + '</b><br><small>«сделок»: ' + deals + ' · предупреждений: ' + warns + ' · перезвонов: ' + ret + '</small></p>' + (rows || '<p>Пока пусто. Поработай, и здесь появятся твои решения.</p>') + '<div class="row" style="margin-top:8px"><button class="btn pri" data-a="hs_back">← Назад</button></div></div>', true);
  }
  function scrAdv() {
    const a = advice(); showScr('<div class="box"><div class="av big">🧔</div><h2 style="text-align:center">Лесной: что делать?</h2>' + a.map(t => '<p style="border-left:3px solid #ffd23a;padding-left:8px">' + t + '</p>').join('') + '<div class="row" style="margin-top:8px"><button class="btn pri" data-a="adv_back">← Назад</button></div></div>', true);
  }
  const _sm = scrMenu;
  scrMenu = function () {_sm(); try {const b = $q('#scr [data-a="pk"]') || $q('#scr [data-a="stats"]') || $q('#scr [data-a="achm"]'); if (b) b.insertAdjacentHTML('afterend', '<button class="btn" data-a="hist">📖 Моя история<br><small>твои решения по дням</small></button><button class="btn" data-a="adv">🧔 Что делать?<br><small>совет Лесного по ситуации</small></button>');} catch (e) {}};
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-a="hist"],[data-a="hs_back"],[data-a="adv"],[data-a="adv_back"]'); if (!b) return; e.preventDefault(); e.stopImmediatePropagation(); try {Snd.resume(); Snd.sfx('click');} catch (er) {}
    const a = b.dataset.a; if (a === 'hist') scrHist(); else if (a === 'adv') scrAdv(); else scrMenu();
  }, true);
  const _en = ending;
  ending = function (k) {try {hist('🏁 Финал: ' + k);} catch (e) {} return _en.apply(this, arguments);};
  window.__advice = advice;
})();
