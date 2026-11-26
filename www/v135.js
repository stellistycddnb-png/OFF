'use strict';
/* v135: заметное уведомление об обновлении — окно при запуске, красная метка, частые проверки. MADE BY PESSIMIST */
(function () {
  const ALT = 'https://cdn.jsdelivr.net/gh/stellistycddnb-png/OFF@main/www/version.json';
  const G = (k, d) => {try {return lsGet(k, d);} catch (e) {return d;}}, P = (k, v) => {try {lsSet(k, v);} catch (e) {}};
  async function latest() {
    try {return await fetchLatest();} catch (e) {}
    const r = await fetch(ALT + '?t=' + Date.now(), {cache: 'no-store'}); if (!r.ok) throw new Error('alt'); const j = await r.json(); if (!j || !j.version) throw new Error('bad'); return j;
  }
  function badge(j) {
    document.querySelectorAll('#tupd').forEach(e => {e.textContent = '🔴 Обновление ' + j.version; e.style.color = '#ff7a8a'; e.style.fontWeight = '800';});
  }
  function popup(j) {
    if (document.getElementById('updpop')) return;
    const d = document.createElement('div'); d.id = 'updpop'; d.style.cssText = 'position:fixed;inset:0;z-index:99999;background:rgba(5,3,14,.78);display:flex;align-items:center;justify-content:center;padding:18px;animation:fadeIn .25s';
    const notes = (Array.isArray(j.notes) ? j.notes : (j.notes ? [j.notes] : [])).slice(0, 5).map(n => '<li style="margin:3px 0">' + n + '</li>').join('');
    d.innerHTML = '<div style="max-width:360px;width:100%;background:linear-gradient(180deg,#2a1a52,#150e2e);border:2px solid #ff7adf;border-radius:18px;padding:18px;color:#f2ecff;box-shadow:0 0 40px rgba(255,122,223,.35);text-align:center"><div style="font-size:42px">🚀</div><h2 style="margin:4px 0 2px">Вышло обновление!</h2><div style="color:#ff7adf;font-weight:800">' + j.version + (j.name ? ' · «' + j.name + '»' : '') + '</div><div style="color:#9a8fb8;font-size:12.5px;margin:2px 0 8px">У вас установлена ' + BUILD_V + '</div>' + (notes ? '<ul style="text-align:left;padding-left:20px;font-size:13.5px;margin:8px 0">' + notes + '</ul>' : '') + '<a href="' + (j.channel || TG_UPD) + '" target="_blank" rel="noopener" class="btn pri" style="display:block;margin:10px 0 6px;text-decoration:none">📦 Скачать APK в канале</a><button class="btn" id="updlater" style="width:100%">Позже</button></div>';
    document.body.appendChild(d); try {Snd.sfx('notif');} catch (e) {}
    document.getElementById('updlater').onclick = () => {P('cc_updskip', {v: j.version, t: Date.now()}); d.remove();};
    d.addEventListener('click', e => {if (e.target === d) {P('cc_updskip', {v: j.version, t: Date.now()}); d.remove();}});
  }
  async function check(force) {
    try {
      const ck = G('cc_updchk2', {t: 0}); if (!force && Date.now() - ck.t < 20 * 60e3) {if (ck.j && vnewer(BUILD_V, ck.j.version)) badge(ck.j); return;}
      const j = await latest(); P('cc_updchk2', {t: Date.now(), j}); P('cc_updchk', {t: Date.now(), v: j.version});
      if (vnewer(BUILD_V, j.version)) {badge(j); const sk = G('cc_updskip', {}); const call = typeof S !== 'undefined' && S && S.mode === 'call'; if (!(sk.v === j.version && Date.now() - sk.t < 8 * 3600e3) && !call) popup(j);}
    } catch (e) {}
  }
  window.__updCheck = check;
  setTimeout(() => check(true), 2500);
  document.addEventListener('visibilitychange', () => {if (document.visibilityState === 'visible') setTimeout(() => check(false), 800);});
  const _st = showTitle; showTitle = function () {_st.apply(this, arguments); setTimeout(() => check(false), 300);};
})();
