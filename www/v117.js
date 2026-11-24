/* ======== build 1.4.0: новое интро и главный экран ======== */
(function () {
  const el = document.getElementById('iTerm'); if (!el) return; const L = ['> ПОДКЛЮЧЕНИЕ К ЛИНИИ…', '> АБОНЕНТ: ООО «ЗОЛОТОЙ БУЛЬБАШ ИНВЕСТ»', '> СТАТУС: ДОВЕРЧИВЫХ ХВАТАЕТ', '> СМЕНА НАЧИНАЕТСЯ'], txt = L.join('\n'); let i = 0;
  const t = setInterval(() => {if (!document.body.contains(el) || i > txt.length) return clearInterval(t); el.firstChild ? el.firstChild.nodeValue = txt.slice(0, i) : el.prepend(document.createTextNode(txt.slice(0, i))); i++;}, 48);
})();
/* --- главный экран: ночной город под дождём --- */
const TV = {W: 0, H: 0, bg: null, win: [], rain: [], cars: [], stars: [], sig: 0};
function tvRng(s) {return () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296;}
function tvBuild(W, H, dpr) {
  const r = tvRng(7), bg = document.createElement('canvas'); bg.width = Math.round(W * dpr); bg.height = Math.round(H * dpr); const g = bg.getContext('2d'); g.scale(dpr, dpr); TV.win = []; TV.stars = [];
  const sky = g.createLinearGradient(0, 0, 0, H); sky.addColorStop(0, '#06031a'); sky.addColorStop(.45, '#26104e'); sky.addColorStop(.68, '#6a1a6a'); sky.addColorStop(.8, '#2a1040'); sky.addColorStop(1, '#0a0618'); g.fillStyle = sky; g.fillRect(0, 0, W, H);
  const hz = H * .72, mx = W * .82, my = H * .3; const mg = g.createRadialGradient(mx, my, 4, mx, my, 120); mg.addColorStop(0, 'rgba(255,240,200,.55)'); mg.addColorStop(1, 'rgba(255,240,200,0)'); g.fillStyle = mg; g.fillRect(mx - 130, my - 130, 260, 260);
  g.fillStyle = '#fff3cf'; g.beginPath(); g.arc(mx, my, 20, 0, 7); g.fill(); g.fillStyle = 'rgba(210,190,150,.5)'; [[-6, -4, 4], [5, 5, 3], [-2, 8, 2.4]].forEach(c => {g.beginPath(); g.arc(mx + c[0], my + c[1], c[2], 0, 7); g.fill();});
  for (let i = 0; i < 70; i++) TV.stars.push({x: r() * W, y: r() * H * .5, p: r() * 6, s: .6 + r() * 1.4});
  const layer = (col, minH, maxH, wmin, wmax, wcol, dens, reg) => {let x = -20; while (x < W + 20) {const w = wmin + r() * (wmax - wmin), h = H * (minH + r() * (maxH - minH)); g.fillStyle = col; g.fillRect(x, hz - h, w, h + 4);
      if (r() < .3) {g.fillRect(x + w * .4, hz - h - 14, 2.5, 14);}
      for (let wy = hz - h + 8; wy < hz - 6; wy += 9) for (let wx = x + 5; wx < x + w - 6; wx += 8) {if (r() < dens) {g.fillStyle = wcol[Math.floor(r() * wcol.length)]; g.globalAlpha = .55 + r() * .4; g.fillRect(wx, wy, 3.4, 4.6); g.globalAlpha = 1; if (reg && r() < .06) TV.win.push({x: wx, y: wy, p: r() * 9});}} x += w + 2 + r() * 4;}};
  layer('#150a32', .12, .26, 22, 44, ['#ffd980', '#9ad6ff'], .22, 0); layer('#0f0724', .08, .2, 26, 50, ['#ffcf70', '#ff9ad8', '#8fe0ff'], .3, 1);
  // главная башня «Золотой Бульбаш»
  const bw = Math.min(W * .34, 150), bx = W * .5 - bw / 2, bh = H * .28; g.fillStyle = '#0a0518'; g.fillRect(bx, hz - bh, bw, bh + 4); g.fillStyle = '#1a0e38'; g.fillRect(bx - 6, hz - bh, bw + 12, 7); g.fillRect(bx + bw * .3, hz - bh - 24, bw * .4, 24); g.fillRect(bx + bw / 2 - 1.5, hz - bh - 54, 3, 30);
  for (let wy = hz - bh + 16; wy < hz - 10; wy += 11) for (let wx = bx + 8; wx < bx + bw - 10; wx += 10) {const on = r() < .62; g.fillStyle = on ? (r() < .5 ? '#ffe08a' : '#8ad8ff') : '#1c1238'; g.globalAlpha = on ? .85 : 1; g.fillRect(wx, wy, 5.5, 6.5); g.globalAlpha = 1; if (on && r() < .12) TV.win.push({x: wx, y: wy, p: r() * 9, big: 1});}
  g.save(); g.shadowColor = '#ffb400'; g.shadowBlur = 16; g.fillStyle = '#ffd23a'; g.font = '900 ' + Math.max(10, bw / 9) + 'px Impact,sans-serif'; g.textAlign = 'center'; g.fillText('ЗОЛОТОЙ БУЛЬБАШ', W / 2, hz - bh + 12 - 1); g.restore();
  // улица и мокрый асфальт
  const st = g.createLinearGradient(0, hz, 0, H); st.addColorStop(0, '#1a0e2e'); st.addColorStop(.12, '#120a22'); st.addColorStop(1, '#07040f'); g.fillStyle = st; g.fillRect(0, hz, W, H - hz);
  const rf = g.createLinearGradient(0, hz, 0, hz + (H - hz) * .5); rf.addColorStop(0, 'rgba(255,58,200,.22)'); rf.addColorStop(1, 'rgba(255,58,200,0)'); g.fillStyle = rf; g.fillRect(0, hz, W, (H - hz) * .5);
  g.fillStyle = 'rgba(255,255,255,.12)'; for (let x = 0; x < W; x += 46) g.fillRect(x, hz + 18, 22, 2);
  TV.hz = hz; TV.bw = bw; TV.bx = bx; TV.bh = bh; TV.bg = bg; TV.W = W; TV.H = H; TV.cars = Array.from({length: 6}, (_, i) => ({x: r() * W, y: hz + 8 + (i % 3) * 12, v: (i % 2 ? 1 : -1) * (40 + r() * 60), c: i % 2 ? '#ff4a62' : '#ffe9a0'}));
  TV.rain = Array.from({length: 110}, () => ({x: r() * W, y: r() * H, l: 8 + r() * 14, v: 380 + r() * 300}));
}
function tFrame(ts) {
  tAnim = 0; const el = $('title'); if (el.classList.contains('hide')) return; const c = $('tcv'), dpr = Math.min(devicePixelRatio || 1, 2), W = innerWidth, H = innerHeight;
  if (c.width !== Math.round(W * dpr) || c.height !== Math.round(H * dpr)) {c.width = Math.round(W * dpr); c.height = Math.round(H * dpr); TV.bg = null;} if (!TV.bg || TV.W !== W || TV.H !== H) tvBuild(W, H, dpr);
  const g = c.getContext('2d'), t = ts / 1000, dt = Math.min(.05, TV.last ? t - TV.last : .016); TV.last = t; g.setTransform(1, 0, 0, 1, 0, 0); g.drawImage(TV.bg, 0, 0); g.scale(dpr, dpr);
  TV.stars.forEach(s => {g.fillStyle = 'rgba(255,255,255,' + (.3 + .5 * Math.abs(Math.sin(t * 1.4 + s.p))) + ')'; g.fillRect(s.x, s.y, s.s, s.s);});
  // прожекторы
  g.save(); g.globalCompositeOperation = 'lighter'; [[.18, 1], [.82, -1]].forEach((k, i) => {const ang = Math.sin(t * .6 + i * 2) * .45 + k[1] * -.25; g.save(); g.translate(W * k[0], TV.hz); g.rotate(ang); const gr = g.createLinearGradient(0, 0, 0, -H * .7); gr.addColorStop(0, 'rgba(255,230,170,.22)'); gr.addColorStop(1, 'rgba(255,230,170,0)'); g.fillStyle = gr; g.beginPath(); g.moveTo(-5, 0); g.lineTo(5, 0); g.lineTo(46, -H * .7); g.lineTo(-46, -H * .7); g.fill(); g.restore();}); g.restore();
  // мерцающие окна
  TV.win.forEach(w => {const a = Math.sin(t * 2 + w.p); if (a > .35) {g.fillStyle = w.big ? 'rgba(255,240,170,.9)' : 'rgba(255,210,120,.8)'; g.fillRect(w.x, w.y, 3.6, 5);} else if (a < -.8) {g.fillStyle = 'rgba(10,5,24,.9)'; g.fillRect(w.x - .3, w.y - .3, w.big ? 5.8 : 4, w.big ? 6.8 : 5.4);}});
  // мигающая антенна
  g.fillStyle = Math.sin(t * 4) > 0 ? '#ff2a3a' : '#5a0a14'; g.beginPath(); g.arc(W / 2, TV.hz - TV.bh - 56, 3.2, 0, 7); g.fill(); g.save(); g.shadowColor = '#f33'; g.shadowBlur = Math.sin(t * 4) > 0 ? 14 : 0; g.fill(); g.restore();
  // звонящий телефон над башней
  const ph = Math.sin(t * 14) * (Math.sin(t * 1.6) > .55 ? 7 : 0) * Math.PI / 180; g.save(); g.translate(W / 2, TV.hz - TV.bh - 92); g.rotate(ph); g.font = '26px sans-serif'; g.textAlign = 'center'; g.fillText('📞', 0, 0); g.restore();
  // машины
  TV.cars.forEach(cr => {cr.x += cr.v * dt; if (cr.x > W + 30) cr.x = -30; if (cr.x < -30) cr.x = W + 30; g.fillStyle = cr.c; g.shadowColor = cr.c; g.shadowBlur = 10; g.fillRect(cr.x, cr.y, 9, 2.6); g.fillRect(cr.x + 12, cr.y, 9, 2.6); g.shadowBlur = 0; g.globalAlpha = .25; g.fillRect(cr.x, cr.y + 7, 21, 5); g.globalAlpha = 1;});
  // купюры и монеты вверх
  TC.coins.forEach(p => {p.y -= p.v * dt * .8; if (p.y < -.05) {p.y = 1.05; p.x = Math.random();} g.save(); g.translate(p.x * W, p.y * H); g.rotate(Math.sin(t + p.r) * .6); g.font = p.s + 'px sans-serif'; g.globalAlpha = .5; g.textAlign = 'center'; g.fillText(p.r > 3 ? '💸' : '🪙', 0, 0); g.restore();});
  // дождь
  g.strokeStyle = 'rgba(190,210,255,.28)'; g.lineWidth = 1; g.beginPath(); TV.rain.forEach(d => {d.y += d.v * dt; d.x -= d.v * dt * .18; if (d.y > H) {d.y = -20; d.x = Math.random() * (W + 60);} g.moveTo(d.x, d.y); g.lineTo(d.x + d.l * .18, d.y - d.l);}); g.stroke();
  const vg = g.createRadialGradient(W / 2, H * .5, H * .25, W / 2, H * .5, H * .85); vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(0,0,0,.6)'); g.fillStyle = vg; g.fillRect(0, 0, W, H); tAnim = requestAnimationFrame(tFrame);
}
const _st17 = showTitle; showTitle = function () {_st17(); const t = $('title'); if (t && !document.getElementById('tchips')) t.insertAdjacentHTML('afterbegin', '<div id="tchips"><a href="https://t.me/+OlavQF1edndlOWY1" target="_blank" rel="noopener">📣 Канал</a><a href="https://t.me/Izzolentaaa" target="_blank" rel="noopener">✉ @Izzolentaaa</a></div>');};
