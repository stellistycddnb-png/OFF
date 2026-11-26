'use strict';
/* v129: свадьба, анимация поездки на своём транспорте. MADE BY PESSIMIST */
(function () {
  const sn = n => {try {Snd.sfx(n);} catch (e) {}};
  /* ---------- анимация поездки ---------- */
  let animBusy = false;
  const _go = goLoc;
  goLoc = function (v) {
    if (animBusy) return;
    const [k, id] = String(v).split(':'), L = k === 'o' ? OFFICES.find(x => x.id === id) : CITY.find(x => x.id === id);
    if (!L || S.slots <= 0 || S.money < L.fare) return _go(v);
    const car = CARS[H().car || 0], gf = H().wife ? (typeof GIRLS_ICON !== 'undefined' ? '' : '') : '';
    animBusy = true; sn('engine');
    showScr('<div class="box" style="text-align:center"><h2>' + car.ic + ' В пути: ' + L.ic + ' ' + L.n + '</h2><canvas id="trv" width="720" height="260" style="width:100%;border-radius:12px;border:1.5px solid #4a3a82"></canvas><p id="trt" style="color:#9a8fb8;margin:6px 0">Нажмите, чтобы пропустить</p></div>', true);
    const cv = document.getElementById('trv'), g = cv.getContext('2d'), t0 = performance.now(), DUR = 1900, night = S.time && S.time >= 18 * 60 || (S.hour || 0) >= 18;
    const tips = {'🚶': 'Пешком: шаг за шагом…', '🚲': 'Дззынь! Дорогу велосипеду!', '🛴': 'Вжжж… самокат разгоняется.', '🚗': 'Двигатель бурчит, но едет.'}, tip = tips[car.ic] || 'Едем по городу…';
    document.getElementById('trt').textContent = tip;
    let done = false, raf;
    const fin = () => {if (done) return; done = true; cancelAnimationFrame(raf); animBusy = false; _go(v);};
    document.getElementById('scr').addEventListener('click', fin, {once: true});
    setTimeout(fin, DUR);
    const spd = {'🚶': .5, '🚲': .8, '🛴': 1.1, '🚗': 1.4}[car.ic] || 1.5;
    function frame(now) {
      if (done || !document.getElementById('trv')) return; const t = (now - t0) / 1000, w = 720, h = 260;
      const sky = g.createLinearGradient(0, 0, 0, h); sky.addColorStop(0, night ? '#0a0830' : '#4aa8ff'); sky.addColorStop(1, night ? '#3a1a5a' : '#ffd8a0'); g.fillStyle = sky; g.fillRect(0, 0, w, h);
      g.fillStyle = night ? '#fff6c0' : '#ffe27a'; g.beginPath(); g.arc(600, 50, 24, 0, 7); g.fill();
      if (night) for (let i = 0; i < 30; i++) {g.fillStyle = 'rgba(255,255,255,.7)'; g.fillRect((i * 83) % 720, (i * 37) % 120, 2, 2);}
      // здания (параллакс)
      for (let L2 = 0; L2 < 2; L2++) {const sp = (L2 ? 120 : 50) * spd, base = L2 ? 150 : 120, hh = L2 ? 90 : 60; g.fillStyle = night ? (L2 ? '#1a1240' : '#12102c') : (L2 ? '#6a7ab8' : '#8aa0d0'); for (let i = -1; i < 14; i++) {const x = ((i * 70 - t * sp) % 980 + 980) % 980 - 70, bh = hh + ((i * 37 + L2 * 11) % 5) * 14; g.fillRect(x, base + 40 - bh, 58, bh + 20); if (night) {g.fillStyle = '#ffd36a'; for (let q = 0; q < 4; q++) g.fillRect(x + 8 + (q % 2) * 22, base + 46 - bh + Math.floor(q / 2) * 18, 8, 8); g.fillStyle = L2 ? '#1a1240' : '#12102c';}}}
      // дорога
      g.fillStyle = '#26262e'; g.fillRect(0, 175, w, 85); g.fillStyle = '#3a3a46'; g.fillRect(0, 170, w, 8);
      g.fillStyle = '#f2e060'; for (let i = -1; i < 14; i++) {const x = ((i * 90 - t * 420 * spd) % 1260 + 1260) % 1260 - 90; g.fillRect(x, 218, 50, 5);}
      // фонари
      for (let i = 0; i < 4; i++) {const x = ((i * 250 - t * 260 * spd) % 1000 + 1000) % 1000 - 60; g.fillStyle = '#555'; g.fillRect(x, 120, 4, 55); g.fillStyle = night ? '#ffe9a0' : '#888'; g.fillRect(x - 6, 116, 16, 6);}
      // транспорт
      const bob = Math.sin(t * 22 * spd) * 2, cx = 60 + Math.min(1, t / 1.6) * 260; g.textAlign = 'center'; g.font = '56px sans-serif'; g.fillText(car.ic, cx, 232 + bob);
      if (S && H().wife || H().dgf) {g.font = '22px sans-serif'; g.fillText('💞', cx + 6, 190 + Math.sin(t * 4) * 3);}
      // пыль
      g.fillStyle = 'rgba(255,255,255,.35)'; for (let i = 0; i < 4; i++) {g.beginPath(); g.arc(cx - 32 - i * 12 - (t * 40 % 12), 244 - i * 2, 4 + i, 0, 7); g.fill();}
      if (car.ic === '🚗' && Math.sin(t * 5) > .92) {g.font = '18px sans-serif'; g.fillText('📯', cx + 40, 180);}
      raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);
    if (car.ic === '🚗') setTimeout(() => sn('buzz'), 900);
  };
  /* ---------- свадьба ---------- */
  const WEDDING = [
    {a: '💒 Скромная роспись (₴1500)', need: 1500, outs: [
      {p: .7, t: 'Тихая роспись, двое свидетелей и один тост. Было очень тепло.', fx: {money: -1500, cons: 6, energy: 4}},
      {p: .3, t: 'Регистратор перепутала имена, но после третьей попытки всё получилось.', fx: {money: -1500, cons: 5, energy: 2}}]},
    {a: '🎉 Свадьба с гостями (₴4000)', need: 4000, outs: [
      {p: .55, t: 'Гости танцевали до утра. Шеф произнёс тост и забыл, как зовут невесту.', fx: {money: -4000, boss: 8, cons: 8, energy: -4}},
      {p: .3, t: 'Тамада перепутал всех. Невеста смеялась до слёз. Лучшая свадьба года.', fx: {money: -4000, boss: 5, cons: 10, energy: -2}},
      {p: .15, t: 'Тётя из Житомира выпила всё шампанское. Но все счастливы.', fx: {money: -4000, boss: 3, cons: 6, energy: -6}}]},
    {a: '✈️ Свадьба на берегу моря (₴7000)', need: 7000, outs: [
      {p: .8, t: 'Закат, море, шум волн. Вы запомните это на всю жизнь.', fx: {money: -7000, cons: 14, energy: 10, heat: -2}},
      {p: .2, t: 'Пошёл дождь, но фотограф сказал: «Это романтика». Так и было.', fx: {money: -7000, cons: 12, energy: 6}}]}
  ];
  function scrWedding(id) {
    const g = (typeof find === 'function') ? null : null;
    showScr('<div class="box"><h2>💒 Свадьба</h2><p>Вы решились. Выберите, как отметить день, который запомнится надолго.</p><div class="col">' + WEDDING.map((c, i) => '<button class="btn' + (i ? '' : ' pri') + '" data-a="wed" data-v="' + id + ':' + i + '"' + (S.money < c.need ? ' disabled' : '') + '>' + c.a + '</button>').join('') + '<button class="btn" data-a="dates">← Позже</button></div></div>', true);
  }
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-a="wed_go"],[data-a="wed"]'); if (!b || b.disabled) return; e.preventDefault(); e.stopImmediatePropagation(); Snd.resume(); sn('click');
    const h = H();
    if (b.dataset.a === 'wed_go') return scrWedding(b.dataset.v);
    const [id, i] = b.dataset.v.split(':'), c = WEDDING[+i]; if (S.money < c.need) return toast('Не хватает денег.', 'bad');
    let r = Math.random(), s = 0, o = c.outs[c.outs.length - 1]; for (const x of c.outs) {s += x.p; if (r < s) {o = x; break;}}
    applyFx(o.fx); h.wife = id; h.dgf = id; h.wedDay = S.day; sn('fanfare'); setTimeout(() => sn('cheer'), 500); setTimeout(() => sn('heart'), 1100); renderHud();
    const nm = (document.querySelector('[data-wn="' + id + '"]') || {}).textContent;
    showScr('<div class="box corp"><div class="corp-hd"><span class="disco">💒</span><div class="corp-ic">💍</div></div><h2>Вы поженились!</h2><p>' + o.t + '</p><p style="color:#ff9ad1;font-weight:800">Теперь у вас семья: каждый день +6 силы и +2 совесть, а к зарплате добавляется поддержка половинки.</p><div class="col"><button class="btn pri" data-a="dt_back">🏠 Домой</button></div></div>', true);
    try {checkAch();} catch (er) {}
    try {setTimeout(() => window.__cineRun && window.__cineRun('wed', '.corp-hd'), 0);} catch (er) {}
  }, true);
  /* кнопка «Сделать предложение» на экране знакомств */
  const _sd = window.scrDates;
  const obs = new MutationObserver(() => {
    if (!S) return; const h = H(); if (!h.dgf || h.wife) return; const box = document.querySelector('#scr .box.hbox'); if (!box || box.querySelector('[data-a="wed_go"],.wedhint')) return;
    const btn = box.querySelector('[data-a="dt"][data-v^="' + h.dgf + ':bye"]'); if (!btn) return; const x = (h.dates || []).find(y => y.id === h.dgf); if (!x) return;
    if (x.aff >= 95 && (x.vis || 0) >= 2) btn.insertAdjacentHTML('beforebegin', '<button class="btn pri" data-a="wed_go" data-v="' + h.dgf + '">💍 Сделать предложение</button>');
    else btn.insertAdjacentHTML('beforebegin', '<small class="wedhint" style="width:100%;color:#9a8fb8">💍 Предложение: симпатия 95+ и 2 вечера дома (сейчас ' + Math.round(x.aff) + ', вечеров ' + (x.vis || 0) + ')</small>');
  });
  obs.observe(document.getElementById('scr'), {childList: true, subtree: true});
  /* семейные бонусы */
  const _nd = nextDay;
  nextDay = function () {
    const r = _nd.apply(this, arguments); try {const h = H(); if (h.wife) {S.energy = clamp(S.energy + 2, 0, 100); S.cons = clamp(S.cons + 1, 0, 100); S.money += 80; if (Math.random() < .25) toast(pick(['💞 Жена оставила вам записку: «Борщ в холодильнике».', '💞 Жена ждёт вас дома с чаем.', '💞 Жена гордится вами. Вслух.']), 'ok');}} catch (e) {}
    return r;
  };
  ACH.push({id: 'wed', n: 'Совет да любовь', d: 'Жениться', c: () => !!(H() && H().wife)});
})();
