'use strict';
/* v152: мини-игра №3 «Набери номер» и реальные эффекты мебели дома */
(function () {
  const $q = s => document.querySelector(s), T = k => (typeof tier === 'function' && S && S.home ? tier('f', k) : 0);
  /* ---------- эффекты мебели ---------- */
  const FX = [
    ['bed', '🛏', 'Кровать', t => '⚡ +' + 2 * t + ' энергии с утра'], ['sofa', '🛋', 'Диван', t => '🧠 +' + t + ' совести с утра'], ['tv', '📺', 'Телевизор', t => '🚨 −' + t + ' риска с утра'],
    ['lamp', '💡', 'Свет', t => '🎯 подозрение клиента на старте −' + 2 * t], ['plant', '🪴', 'Растения', t => '⚡ +' + t + ' энергии, 🚨 −' + (t * .5) + ' риска с утра'], ['rug', '🧶', 'Ковёр', t => '📞 интерес клиента на старте +' + 3 * t],
    ['kit', '🍳', 'Кухня', t => '💰 экономия на еде +₴' + 35 * t + ' в день'], ['wall', '🖼', 'Стены', t => '😠 шеф +' + (t * .7).toFixed(1) + ' с утра'], ['sound', '🎧', 'Музыка', t => '💰 комиссия с «сделок» +' + 2 * t + '%'], ['smart', '🤖', 'Умный дом', t => '🚨 −' + (t * .7).toFixed(1) + ' риска, 💰 +₴' + 20 * t + ' в день']
  ];
  const _nd = nextDay;
  nextDay = function () {
    const d0 = S && S.day; _nd.apply(this, arguments);
    try {
      if (!S || S.day === d0 || !S.home) return; const g = k => T(k), L = [];
      const en = 2 * g('bed') + g('plant'), cons = g('sofa'), heat = g('tv') + g('plant') * .5 + g('smart') * .7, boss = g('wall') * .7, money = 35 * g('kit') + 20 * g('smart');
      if (en) S.energy = clamp(S.energy + en, 0, 100); if (cons) S.cons = clamp(S.cons + cons, 0, 100); if (heat) S.heat = clamp(S.heat - heat, 0, 100); if (boss) S.boss = clamp(S.boss + boss, 0, 100); if (money) S.money += money;
      if (en || cons || heat || boss || money) {toast('🏠 Дом помогает: ' + [en ? '⚡+' + en : '', cons ? '🧠+' + cons : '', heat ? '🚨−' + Math.round(heat * 10) / 10 : '', boss ? '😠+' + Math.round(boss * 10) / 10 : '', money ? '💰+' + fmt(money) : ''].filter(Boolean).join(' '), 'ok'); try {renderHud();} catch (e) {}}
    } catch (e) {}
  };
  const _a = answer;
  answer = function () {const had = S && S.call; _a.apply(this, arguments); try {const c = S && S.call; if (c && c !== had && S.home && !c._hf) {c._hf = 1; c.susp = Math.max(0, c.susp - 2 * T('lamp')); c.pers += 3 * T('rug');}} catch (e) {}};
  const _su = success;
  success = function () {const m0 = S.money; _su.apply(this, arguments); try {const t = T('sound'); if (t) {const b = Math.round(Math.max(0, S.money - m0) * .02 * t); if (b > 0) S.money += b;}} catch (e) {}};
  const _sh = scrHome;
  scrHome = function () {
    _sh.apply(this, arguments);
    try {const cv = $q('#scr #hstat') || $q('#scr #hc') || $q('#scr #hmc'); if (!cv || !S.home || $q('#scr .hfx')) return; const rows = FX.filter(f => T(f[0]) > 0).map(f => '<div class="r" style="padding:2px 0;border-top:1px dashed #33286a">' + f[1] + ' <b>' + f[2] + '</b> · ' + f[3](T(f[0])) + '</div>').join('');
      cv.insertAdjacentHTML('afterend', '<div class="help hfx" style="margin:6px 0;font-size:12.5px"><b style="color:#5dffc0">🎯 Что даёт ваш дом</b>' + (rows || '<br>Пока ничего. Купите мебель: у каждого предмета свой эффект (кровать, ТВ, свет, кухня и другие).') + '</div>');} catch (e) {}
  };
  /* ---------- мини-игра «Набери номер» ---------- */
  const _sm = scrMenu;
  scrMenu = function () {_sm(); try {const b = $q('#scr [data-a="mini2"]') || $q('#scr [data-a="mini"]'); if (b) b.insertAdjacentHTML('afterend', '<button class="btn" data-a="mini3">📞 Перерыв: «Набери номер»<br><small>' + (S && S.mini3Day === S.day ? 'сегодня уже был · ' : '') + 'рекорд ' + lsGet('cc_mini3best', 0) + '</small></button>');} catch (e) {}};
  function game() {
    hideScr(); const ov = document.createElement('div'); ov.id = 'mini'; ov.style.cssText = 'position:fixed;inset:0;z-index:99999;background:rgba(8,4,20,.97);display:flex;align-items:center;justify-content:center;padding:14px;touch-action:manipulation;user-select:none';
    document.body.appendChild(ov); let round = 0, score = 0, seq = '', typed = '', phase = 'show', over = false, tms = [];
    const sfx = x => {try {Snd.sfx(x);} catch (e) {}}, after = (f, ms) => tms.push(setTimeout(f, ms));
    const pad = () => '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:10px">' + [1, 2, 3, 4, 5, 6, 7, 8, 9, '⌫', 0, '☎'].map(k => '<button data-m3="' + k + '" style="padding:16px 0;font:800 24px sans-serif;border-radius:14px;border:1.5px solid #5c4aa6;background:linear-gradient(#43338a,#291d58);color:#fff">' + k + '</button>').join('') + '</div>';
    const head = () => '<div style="display:flex;justify-content:space-between;color:#ffd23a;font:800 16px sans-serif"><span>★ ' + score + '</span><span>Номер ' + (round + 1) + '/6</span></div>';
    function next() {
      if (round >= 6) return fin(); const len = 4 + round; seq = ''; for (let i = 0; i < len; i++) seq += Math.floor(Math.random() * 10); typed = ''; phase = 'show'; const ms = 900 + len * 420;
      ov.innerHTML = '<div style="width:min(94vw,380px);color:#f2ecff;font-family:sans-serif;text-align:center">' + head() + '<div style="color:#9a8fb8;margin:10px 0 4px">Запомните номер клиента</div><div style="font:800 40px monospace;letter-spacing:.12em;color:#7ff3ff;background:#120c2c;border:2px solid #3a2e78;border-radius:14px;padding:16px 4px">' + seq + '</div><div style="height:6px;background:#0c0820;border-radius:4px;margin-top:10px;overflow:hidden"><u style="display:block;height:100%;background:#ffd23a;width:100%;transition:width ' + ms + 'ms linear"></u></div></div>';
      after(() => {const u = ov.querySelector('u'); if (u) u.style.width = '0%';}, 30); after(ask, ms);
    }
    function ask() {phase = 'type'; ov.innerHTML = '<div style="width:min(94vw,380px);color:#f2ecff;font-family:sans-serif;text-align:center">' + head() + '<div style="color:#9a8fb8;margin:10px 0 4px">Наберите номер по памяти</div><div id="m3d" style="font:800 40px monospace;letter-spacing:.12em;min-height:62px;color:#fff;background:#120c2c;border:2px solid #3a2e78;border-radius:14px;padding:12px 4px">&nbsp;</div>' + pad() + '</div>';}
    function submit() {
      if (phase !== 'type') return; phase = 'res'; const ok = typed === seq; if (ok) {score += 20 + seq.length * 5; sfx('good');} else sfx('bad');
      ov.innerHTML = '<div style="text-align:center;color:#f2ecff;font:700 18px sans-serif;padding:20px"><div style="font-size:48px">' + (ok ? '✅' : '❌') + '</div><p>' + (ok ? 'Верно!' : 'Мимо. Был номер:') + '</p><p style="font:800 30px monospace;color:#7ff3ff">' + seq + '</p></div>'; round++;
      if (!ok) after(fin, 1500); else after(next, 900);
    }
    function fin() {
      if (over) return; over = true; tms.forEach(clearTimeout); const best = Math.max(lsGet('cc_mini3best', 0), score); lsSet('cc_mini3best', best); const gain = Math.min(600, score * 3); S.money += gain; S.energy = clamp(S.energy - 5, 0, 100); S.mini3Day = S.day; try {checkAch(); renderHud(); save();} catch (e) {}
      ov.innerHTML = '<div style="text-align:center;color:#f2ecff;font:700 18px sans-serif;padding:20px"><div style="font-size:54px">' + (score >= 200 ? '🏆' : '📞') + '</div><p>Память на номера: ' + score + ' очк.</p><p style="color:#ffd23a">Премия +' + fmt(gain) + ' · рекорд ' + best + '</p><button class="btn pri" id="m3x" style="margin-top:12px;padding:12px 28px">Вернуться</button></div>';
      $q('#m3x').onclick = () => {ov.remove(); try {scrMenu();} catch (e) {}};
    }
    ov.addEventListener('click', e => {const b = e.target.closest('[data-m3]'); if (!b || phase !== 'type') return; const k = b.dataset.m3; if (k === '⌫') typed = typed.slice(0, -1); else if (k === '☎') return submit(); else if (typed.length < seq.length) typed += k; const d = $q('#m3d'); if (d) d.textContent = typed || ' '; if (typed.length === seq.length && k !== '⌫') submit();});
    next();
  }
  document.addEventListener('click', e => {const b = e.target.closest('[data-a="mini3"]'); if (!b) return; e.preventDefault(); e.stopImmediatePropagation(); if (S && S.mini3Day === S.day) toast('Сегодня этот перерыв уже был', 'warn'); else if (S && S.energy < 5) toast('Нет сил на перерыв', 'warn'); else game();}, true);
  [{id: 'mini3_150', n: 'Память как у АТС', d: '150 очков в «Набери номер»', c: () => lsGet('cc_mini3best', 0) >= 150}].forEach(a => {if (!ACH.some(x => x.id === a.id)) ACH.push(a);});
})();
