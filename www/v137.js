'use strict';
/* v137: защита от сбоев, оптимизация и ежедневная награда. MADE BY PESSIMIST */
(function () {
  /* --- защита: таймеры/клики после конца звонка больше не роняют игру --- */
  ['resolveOpen', 'resolveDil'].forEach(n => {try {const f = window[n]; if (typeof f !== 'function') return; window[n] = function () {if (!S || !S.call) return; return f.apply(this, arguments);};} catch (e) {}});
  /* --- оптимизация: кэш узора киноплёнки, пауза анимаций, когда игра свёрнута --- */
  document.addEventListener('visibilitychange', () => {document.documentElement.classList.toggle('bgpause', document.hidden);});
  /* --- ежедневная награда (по реальному времени) --- */
  const G = (k, d) => {try {return lsGet(k, d);} catch (e) {return d;}}, P = (k, v) => {try {lsSet(k, v);} catch (e) {}};
  const REW = [{m: 200, e: 10, t: '☕ Утренний кофе'}, {m: 300, e: 12, t: '🍩 Пончики к чаю'}, {m: 400, e: 15, t: '🎧 Новые наушники'}, {m: 500, e: 18, t: '🎟 Лотерейный билет'}, {m: 700, e: 20, t: '💼 Премия от шефа'}, {m: 900, e: 25, t: '🍀 Удачный день'}, {m: 1500, e: 40, t: '🏆 Недельный бонус!', c: 5}];
  const dayKey = () => {const d = new Date(); return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();};
  const prev = k => {const d = new Date(Math.floor(k / 10000), Math.floor(k / 100) % 100 - 1, k % 100); d.setDate(d.getDate() - 1); return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();};
  function offer() {
    try {
      if (typeof S === 'undefined' || !S || S.mode !== 'idle' || document.getElementById('dailypop') || document.getElementById('updpop')) return;
      const sc = document.getElementById('scr'); if (sc && sc.innerHTML.trim()) return;
      const st = G('cc_daily', {last: 0, streak: 0}), today = dayKey(); if (st.last === today) return;
      const streak = st.last === prev(today) ? Math.min(7, st.streak + 1) : 1, r = REW[streak - 1];
      const d = document.createElement('div'); d.id = 'dailypop'; d.style.cssText = 'position:fixed;inset:0;z-index:99998;background:rgba(5,3,14,.78);display:flex;align-items:center;justify-content:center;padding:18px';
      d.innerHTML = '<div style="max-width:340px;width:100%;background:linear-gradient(180deg,#2a1a52,#150e2e);border:2px solid #ffd23a;border-radius:18px;padding:18px;color:#f2ecff;text-align:center;box-shadow:0 0 36px rgba(255,210,58,.3)"><div style="font-size:42px">🎁</div><h2 style="margin:4px 0">Награда за возвращение</h2><div style="color:#ffd23a;font-weight:800">День ' + streak + ' из 7 подряд</div><div style="display:flex;gap:5px;justify-content:center;margin:10px 0">' + REW.map((x, i) => '<span style="width:30px;height:30px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:800;' + (i < streak ? 'background:#ffd23a;color:#3a2600' : 'background:#2a2250;color:#9a8fb8') + '">' + (i + 1) + '</span>').join('') + '</div><p style="margin:6px 0"><b>' + r.t + '</b><br>+₴' + r.m + ' · +' + r.e + ' сил' + (r.c ? ' · +' + r.c + ' совести' : '') + '</p><button class="btn pri" id="dailygo" style="width:100%">Забрать</button></div>';
      document.body.appendChild(d);
      document.getElementById('dailygo').onclick = () => {S.money += r.m; S.energy = clamp(S.energy + r.e, 0, 100); if (r.c) S.cons = clamp(S.cons + r.c, 0, 100); P('cc_daily', {last: today, streak}); try {Snd.sfx('cash'); setTimeout(() => Snd.sfx('sparkle'), 200);} catch (e) {} try {renderHud();} catch (e) {} try {toast('🎁 +₴' + r.m + ', +' + r.e + ' сил', 'ok');} catch (e) {} d.remove();};
    } catch (e) {}
  }
  setInterval(offer, 4000);
})();
