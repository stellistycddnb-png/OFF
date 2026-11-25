/* ======== Большой кабинет (build 1.7.0) ======== */
(function () {
  const rr = (g, x, y, w, h, r) => {g.beginPath(); if (g.roundRect) g.roundRect(x, y, w, h, r); else g.rect(x, y, w, h);};
  const circ = (g, x, y, r, c) => {g.fillStyle = c; g.beginPath(); g.arc(x, y, r, 0, 6.283); g.fill();};
  const hash = n => {const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x);};
  const SKINS = ['#e0b090', '#b98c6c', '#f0c8a8', '#d8b090', '#e0c0a0', '#c89a78'], SHIRTS = ['#7a5ac8', '#c8507a', '#2a6a9a', '#3a4a3a', '#8a6a2a', '#4a7a6a', '#a05a3a', '#5a5a8a', '#2a7a7a'], HAIR = ['#1a1208', '#3a2412', '#6a4a22', '#101010', '#8a6a3a'];
  const SAY = ['Алё?', 'Да-да', 'Сумма?', 'Минутку', 'Перезвоню', 'Слушаю вас', 'Тсс', 'Хорошо'];
  const RCOL = ['#7a5ac8', '#c8507a', '#2a6a9a', '#3a4a3a'];
  function sky(g, x, y, w, h, p) {
    const k = p < .15 ? 0 : p < .6 ? 1 : p < .8 ? 2 : 3, C = [['#8ec8f8', '#d8ecff'], ['#6ab4f0', '#c8e4ff'], ['#ff9a5a', '#6a4a9a'], ['#0a1030', '#2a2a5a']][k];
    const gr = g.createLinearGradient(0, y, 0, y + h); gr.addColorStop(0, C[0]); gr.addColorStop(1, C[1]); g.fillStyle = gr; g.fillRect(x, y, w, h);
    g.fillStyle = k === 3 ? '#0a0a22' : 'rgba(40,50,80,.55)'; for (let i = 0; i < 6; i++) {const bw = w * .14, bh = h * (.25 + hash(i + 3) * .4); g.fillRect(x + i * w * .17, y + h - bh, bw, bh);}
    if (k === 3) {g.fillStyle = '#ffe9a0'; for (let i = 0; i < 18; i++) g.fillRect(x + hash(i) * w, y + h * (.55 + hash(i + 9) * .4), 2, 2);}
  }
  const ACTL = ['type', 'type', 'type', 'talk', 'talk', 'coffee', 'stretch', 'think', 'wave', 'facepalm', 'phone', 'angry', 'laugh', 'yawn', 'look', 'type', 'talk'];
  const actFor = (ph, t) => {const k = t / 5 + ph * 1.7, slot = Math.floor(k); return {act: ACTL[Math.floor(hash(slot * 3.3 + ph * 7.1) * ACTL.length)], f: k - slot, slot};};
  const EMO = {angry: '💢', laugh: '😂', yawn: '💤', think: '💭', coffee: '☕', facepalm: '😩', wave: '👋', stretch: '😌'};
  function limb(g, sx, sy, hx, hy, bend, sleeve, skin, sc) {
    const mx = (sx + hx) / 2, my = (sy + hy) / 2, dx = hx - sx, dy = hy - sy, L = Math.hypot(dx, dy) || 1, ex = mx - dy / L * bend, ey = my + dx / L * bend;
    g.lineCap = 'round'; g.lineJoin = 'round'; g.strokeStyle = sleeve; g.lineWidth = 6 * sc; g.beginPath(); g.moveTo(sx, sy); g.lineTo(ex, ey); g.stroke(); g.strokeStyle = skin; g.lineWidth = 4.6 * sc; g.beginPath(); g.moveTo(ex, ey); g.lineTo(hx, hy); g.stroke(); circ(g, hx, hy, 2.6 * sc, skin);
  }
  function seated(g, X, Y, sc, o, t, ph) {
    const A = o.act ? {act: o.act, f: (t / 3) % 1} : actFor(ph, t), act = A.act, f = A.f, sw = Math.sin(f * 3.1416);
    const tt = t * 9 + ph; let lean = 0, tilt = 0, dy = 0, mouth = 'line', brow = 0, eyes = 'open', gaze = 0, blush = 0, R = null, L = null, mug = false;
    const bob = Math.sin(tt) * 1.6; L = [-6, 23 + bob]; R = [6, 23 - bob];
    switch (act) {
      case 'type': mouth = Math.sin(t * .7 + ph) > .6 ? 'smile' : 'line'; gaze = Math.sin(t * .8 + ph) * .3; break;
      case 'talk': mouth = 'talk'; R = [14 + Math.sin(t * 6 + ph) * 2, 10 + Math.sin(t * 5 + ph) * 3]; brow = .3; lean = Math.sin(t * 3 + ph) * .6; break;
      case 'coffee': mug = true; R = [7 - sw * 1, 23 - sw * 28]; mouth = sw > .5 ? 'o' : 'line'; eyes = sw > .6 ? 'closed' : 'open'; break;
      case 'stretch': L = [-15, 23 - sw * 42 + Math.sin(t * 8) * 1]; R = [15, 23 - sw * 42 + Math.sin(t * 8 + 1) * 1]; lean = -sw * 2; mouth = sw > .4 ? 'yawn' : 'line'; eyes = sw > .4 ? 'closed' : 'open'; dy = -sw; break;
      case 'think': R = [3, 23 - sw * 25]; mouth = 'line'; brow = -.5; gaze = -.5 * sw; tilt = sw * .12; break;
      case 'wave': R = [16, 23 - sw * 30 + Math.sin(t * 13) * 3 * sw]; mouth = 'smile'; brow = .4; tilt = sw * .05; break;
      case 'facepalm': R = [0, 23 - sw * 34]; mouth = 'frown'; brow = -.6; eyes = 'closed'; tilt = sw * .15; dy = sw * 1.5; break;
      case 'phone': R = [11, 23 - sw * 26]; mouth = Math.sin(t * 7) > 0 ? 'talk' : 'smile'; gaze = .3; break;
      case 'angry': L = [-8 + Math.sin(tt * 2) * 1.2, 20]; R = [8 + Math.sin(tt * 2 + 2) * 1.2, 20]; mouth = 'frown'; brow = -1; blush = 1; lean = Math.sin(tt * 2) * .8; break;
      case 'laugh': L = [-6, 14 + Math.sin(tt * 2) * 1.2]; R = [6, 14 + Math.sin(tt * 2 + 1) * 1.2]; mouth = 'open'; eyes = 'closed'; tilt = -.1; dy = Math.sin(tt * 2) * 1.2; blush = .6; brow = .5; break;
      case 'yawn': R = [4, 23 - sw * 25]; mouth = 'yawn'; eyes = 'closed'; tilt = -sw * .08; break;
      case 'look': gaze = Math.sin(t * 1.4 + ph * 3) > 0 ? 1 : -1; mouth = 'line'; lean = gaze * .6; break;
      case 'ring': mouth = 'o'; brow = .9; R = [11, 5]; break;
      case 'nervous': gaze = Math.sin(t * 5) > 0 ? 1 : -1; mouth = 'frown'; brow = -.4; blush = .5; break;
      case 'gloom': mouth = 'frown'; brow = -.5; tilt = .08; eyes = 'half'; break;
      case 'tired': mouth = 'yawn'; eyes = 'closed'; tilt = .06; break;
    }
    // тень и стул
    g.fillStyle = 'rgba(0,0,0,.28)'; g.beginPath(); g.ellipse(X, Y + 40 * sc, 24 * sc, 6 * sc, 0, 0, 6.28); g.fill();
    g.fillStyle = '#17131f'; g.fillRect(X - 1.2 * sc, Y + 26 * sc, 2.4 * sc, 12 * sc); for (let k = -1; k <= 1; k++) circ(g, X + k * 9 * sc, Y + 39 * sc, 2 * sc, '#2a2438');
    g.save(); g.translate(X + lean * sc, Y + dy * sc);
    g.fillStyle = '#1a1626'; rr(g, -14 * sc, -2 * sc, 28 * sc, 32 * sc, 8 * sc); g.fill();
    const gr = g.createLinearGradient(-11 * sc, 0, 11 * sc, 0); gr.addColorStop(0, o.shirt); gr.addColorStop(.5, o.shirt); gr.addColorStop(1, 'rgba(0,0,0,.35)');
    g.fillStyle = o.shirt; rr(g, -11 * sc, 2 * sc, 22 * sc, 25 * sc, 7 * sc); g.fill(); g.fillStyle = 'rgba(0,0,0,.18)'; g.fillRect(3 * sc, 4 * sc, 8 * sc, 22 * sc); g.fillStyle = 'rgba(255,255,255,.12)'; g.fillRect(-10 * sc, 4 * sc, 4 * sc, 16 * sc);
    g.fillStyle = 'rgba(255,255,255,.65)'; g.beginPath(); g.moveTo(-4 * sc, 2 * sc); g.lineTo(0, 7 * sc); g.lineTo(4 * sc, 2 * sc); g.fill();
    if (o.tie) {g.fillStyle = o.tie; g.beginPath(); g.moveTo(-1.6 * sc, 3 * sc); g.lineTo(1.6 * sc, 3 * sc); g.lineTo(2.2 * sc, 16 * sc); g.lineTo(0, 19 * sc); g.lineTo(-2.2 * sc, 16 * sc); g.fill();}
    // шея и голова
    g.fillStyle = o.skin; g.fillRect(-3 * sc, -2 * sc, 6 * sc, 5 * sc); g.save(); g.translate(0, -8 * sc); g.rotate(tilt);
    g.fillStyle = 'rgba(0,0,0,.2)'; circ(g, 1 * sc, 1 * sc, 9.2 * sc, 'rgba(0,0,0,.18)'); const hg = g.createRadialGradient(-3 * sc, -3 * sc, 1, 0, 0, 10 * sc); hg.addColorStop(0, o.skin); hg.addColorStop(1, 'rgba(0,0,0,.25)'); circ(g, 0, 0, 9 * sc, o.skin); g.fillStyle = hg; g.beginPath(); g.arc(0, 0, 9 * sc, 0, 6.283); g.fill();
    circ(g, -9 * sc, 0, 2.2 * sc, o.skin); circ(g, 9 * sc, 0, 2.2 * sc, o.skin);
    // волосы
    g.fillStyle = o.hair; const st = o.style | 0; if (st === 0) {g.beginPath(); g.arc(0, -1.5 * sc, 9.5 * sc, 3.25, 6.17); g.fill();} else if (st === 1) {g.beginPath(); g.arc(0, -1.5 * sc, 9.8 * sc, 3.1, 6.3); g.fill(); rr(g, -10 * sc, -2 * sc, 4 * sc, 16 * sc, 2 * sc); g.fill(); rr(g, 6 * sc, -2 * sc, 4 * sc, 16 * sc, 2 * sc); g.fill();} else if (st === 2) {g.beginPath(); g.arc(0, -3 * sc, 8 * sc, 3.5, 5.9); g.fill();} else {g.beginPath(); g.arc(0, -1.5 * sc, 9.5 * sc, 3.25, 6.17); g.fill(); circ(g, 0, -11 * sc, 4 * sc, o.hair);}
    // румянец/злость
    if (blush) {g.fillStyle = 'rgba(255,70,70,' + (.35 * blush) + ')'; circ(g, -5.5 * sc, 3 * sc, 2.8 * sc, g.fillStyle); circ(g, 5.5 * sc, 3 * sc, 2.8 * sc, g.fillStyle);}
    // брови
    g.strokeStyle = o.hair === '#101010' || o.hair === '#1a1208' ? '#111' : '#2a1a0a'; g.lineWidth = 1.5 * sc; g.lineCap = 'round'; g.beginPath(); g.moveTo(-6 * sc, (-4.5 - brow * 1.5) * sc); g.lineTo(-2 * sc, (-4.5 + brow * 1.8 * (brow < 0 ? 1 : -.3)) * sc); g.moveTo(6 * sc, (-4.5 - brow * 1.5) * sc); g.lineTo(2 * sc, (-4.5 + brow * 1.8 * (brow < 0 ? 1 : -.3)) * sc); g.stroke();
    // глаза
    const blink = (t * .9 + ph * 5) % 4 < .13, ex = gaze * 1.3 * sc; if (eyes === 'closed' || blink) {g.strokeStyle = '#2a1a0a'; g.lineWidth = 1.3 * sc; g.beginPath(); g.arc(-3.5 * sc, -1 * sc, 1.9 * sc, .2, 2.9); g.arc(3.5 * sc, -1 * sc, 1.9 * sc, .2, 2.9); g.stroke();} else {const er = eyes === 'half' ? .9 : 2; g.fillStyle = '#fff'; g.beginPath(); g.ellipse(-3.6 * sc, -1 * sc, 2.4 * sc, er * sc, 0, 0, 6.28); g.ellipse(3.6 * sc, -1 * sc, 2.4 * sc, er * sc, 0, 0, 6.28); g.fill(); g.fillStyle = '#1a1208'; circ(g, -3.6 * sc + ex, -1 * sc, 1.3 * sc, '#1a1208'); circ(g, 3.6 * sc + ex, -1 * sc, 1.3 * sc, '#1a1208');}
    // рот
    g.strokeStyle = '#5a1a1a'; g.fillStyle = '#5a1a1a'; g.lineWidth = 1.3 * sc; const my = 4.6 * sc;
    if (mouth === 'smile') {g.beginPath(); g.arc(0, my - 1.5 * sc, 3 * sc, .15, 3); g.stroke();} else if (mouth === 'frown') {g.beginPath(); g.arc(0, my + 3 * sc, 2.8 * sc, 3.3, 6.1); g.stroke();} else if (mouth === 'talk') {g.beginPath(); g.ellipse(0, my, 2 * sc, (.6 + Math.abs(Math.sin(t * 12 + ph)) * 2.2) * sc, 0, 0, 6.28); g.fill();} else if (mouth === 'open') {g.beginPath(); g.ellipse(0, my, 3 * sc, (2 + Math.abs(Math.sin(tt * 2)) * 1.5) * sc, 0, 0, 6.28); g.fill(); g.fillStyle = '#fff'; g.fillRect(-2 * sc, my - 2 * sc, 4 * sc, 1.2 * sc);} else if (mouth === 'yawn') {g.beginPath(); g.ellipse(0, my + sc, 2.6 * sc, (2.4 + sw * 1.6) * sc, 0, 0, 6.28); g.fill();} else if (mouth === 'o') {g.beginPath(); g.ellipse(0, my, 1.8 * sc, 2.1 * sc, 0, 0, 6.28); g.fill();} else {g.beginPath(); g.moveTo(-2 * sc, my); g.lineTo(2 * sc, my); g.stroke();}
    if (o.sweat) {g.fillStyle = 'rgba(120,200,255,.9)'; const sy = ((t * 6) % 10); g.beginPath(); g.ellipse(8 * sc, (-6 + sy) * sc, 1.2 * sc, 1.8 * sc, 0, 0, 6.28); g.fill();}
    if (o.headset) {g.strokeStyle = '#222'; g.lineWidth = 2 * sc; g.beginPath(); g.arc(0, -1 * sc, 10.5 * sc, 3.3, 6.1); g.stroke(); circ(g, -10 * sc, 1 * sc, 3 * sc, '#222'); circ(g, 10 * sc, 1 * sc, 3 * sc, '#222'); g.beginPath(); g.moveTo(10 * sc, 3 * sc); g.quadraticCurveTo(11 * sc, 8 * sc, 3.5 * sc, 7.5 * sc); g.stroke(); circ(g, 3.5 * sc, 7.5 * sc, 1.3 * sc, '#ff4a4a');}
    g.restore();
    // руки
    const sh = o.shirt; limb(g, -10 * sc, 8 * sc, L[0] * sc, L[1] * sc, 5 * sc, sh, o.skin, sc); limb(g, 10 * sc, 8 * sc, R[0] * sc, R[1] * sc, -5 * sc, sh, o.skin, sc);
    if (mug) {g.fillStyle = '#eee'; rr(g, (R[0] - 3) * sc, (R[1] - 7) * sc, 6 * sc, 6 * sc, 1.2 * sc); g.fill();}
    g.restore();
    if (act === 'angry') {for (let k = 0; k < 2; k++) {g.strokeStyle = 'rgba(255,255,255,' + (.5 - k * .2) + ')'; g.lineWidth = 1.5 * sc; g.beginPath(); g.moveTo(X - 6 * sc + k * 12 * sc, Y - 16 * sc); g.quadraticCurveTo(X - 4 * sc + k * 12 * sc + Math.sin(t * 6 + k) * 3, Y - 24 * sc - ((t * 8) % 8), X - 6 * sc + k * 12 * sc, Y - 30 * sc - ((t * 8) % 8)); g.stroke();}}
    return A;
  }
  function desk(g, x, y, sc, mon, t, ph, o) {
    const w = 60 * sc;
    g.fillStyle = '#7a5230'; rr(g, x - w / 2, y + 24 * sc, w, 9 * sc, 3 * sc); g.fill(); g.fillStyle = '#5a3a1e'; g.fillRect(x - w / 2 + 2 * sc, y + 33 * sc, 3 * sc, 8 * sc); g.fillRect(x + w / 2 - 5 * sc, y + 33 * sc, 3 * sc, 8 * sc);
    g.fillStyle = '#222'; rr(g, x - 13 * sc, y + 8 * sc, 26 * sc, 17 * sc, 2 * sc); g.fill(); g.fillStyle = mon.live ? 'rgba(110,255,170,.9)' : 'rgba(90,150,200,' + (.55 + Math.sin(t * 2 + ph) * .12) + ')'; g.fillRect(x - 11.5 * sc, y + 9.5 * sc, 23 * sc, 12 * sc);
    if (mon.live) {g.fillStyle = 'rgba(0,70,30,.9)'; for (let i = 0; i < 10; i++) {const bh = (Math.sin(t * 9 + i * 1.3) * .5 + .5) * 9 * sc + 1.5; g.fillRect(x - 10 * sc + i * 2.2 * sc, y + 21 * sc - bh, 1.6 * sc, bh);}} else {g.fillStyle = 'rgba(0,40,70,.5)'; for (let i = 0; i < 3; i++) g.fillRect(x - 10 * sc, y + 11.5 * sc + i * 3.4 * sc, (6 + ((i * 7 + Math.floor(t * 1.5 + ph)) % 8)) * sc, 1.3 * sc);}
    g.fillStyle = '#ccc'; g.fillRect(x - 9 * sc, y + 26.5 * sc, 18 * sc, 2.5 * sc);
  }
  function scene(g, w, h, t, S) {
    const p = S.p || 0, night = Math.max(0, p - .72) / .28, u = Math.min(w / 390, h / 340), WH = h * .3;
    // стена
    const wl = g.createLinearGradient(0, 0, 0, WH); wl.addColorStop(0, '#6b6a86'); wl.addColorStop(1, '#55537a'); g.fillStyle = wl; g.fillRect(0, 0, w, WH + 4);
    // пол
    const fl = g.createLinearGradient(0, WH, 0, h); fl.addColorStop(0, '#3a3347'); fl.addColorStop(1, '#2a2438'); g.fillStyle = fl; g.fillRect(0, WH, w, h - WH);
    g.strokeStyle = 'rgba(255,255,255,.05)'; g.lineWidth = 1; for (let i = -6; i < 14; i++) {g.beginPath(); g.moveTo(w * .5 + (i - 4) * w * .05, WH); g.lineTo(w * .5 + (i - 4) * w * .17, h); g.stroke();} for (let k = 1; k < 7; k++) {const y = WH + (h - WH) * (k / 7) ** 1.6; g.beginPath(); g.moveTo(0, y); g.lineTo(w, y); g.stroke();}
    g.fillStyle = '#1f1a2a'; g.fillRect(0, WH, w, 5);
    // окна
    for (let i = 0; i < 3; i++) {const wx = w * (.03 + i * .16), ww = w * .13, wy = h * .04, wh = WH * .72; g.save(); rr(g, wx, wy, ww, wh, 3); g.clip(); sky(g, wx, wy, ww, wh, p); g.restore(); g.strokeStyle = '#d6dcd8'; g.lineWidth = 3; rr(g, wx, wy, ww, wh, 3); g.stroke(); g.beginPath(); g.moveTo(wx + ww / 2, wy); g.lineTo(wx + ww / 2, wy + wh); g.stroke();}
    // баннер ЧУГУН
    {const bx = w * .5, by = h * .015, bw = w * .26, bh = h * .075; rr(g, bx, by, bw, bh, 3); g.fillStyle = '#3a0d0d'; g.fill(); g.strokeStyle = '#c8a050'; g.lineWidth = 1.5; g.stroke(); g.textAlign = 'center'; g.fillStyle = '#e8d29a'; g.font = '800 ' + Math.max(7, 8 * u) + 'px sans-serif'; g.fillText('ЧУГУН ВЕЩАЕТ:', bx + bw / 2, by + bh * .4); g.fillStyle = '#ff6a50'; g.font = '900 ' + Math.max(8, 10 * u) + 'px sans-serif'; g.fillText('НУЖНО ЕБАШИТЬ', bx + bw / 2, by + bh * .82);}
    // плакат MAKE MONEY
    {const px = w * .5, py = h * .105, pw = w * .13, ph = h * .15; rr(g, px, py, pw, ph, 3); g.fillStyle = '#12331e'; g.fill(); g.strokeStyle = '#ffd23a'; g.lineWidth = 1.5; g.stroke(); g.textAlign = 'center'; g.fillStyle = '#ffd23a'; g.font = '900 ' + Math.max(8, 11 * u) + 'px Impact,sans-serif'; g.fillText('MAKE', px + pw / 2, py + ph * .4); g.fillStyle = '#5dffc0'; g.fillText('MONEY', px + pw / 2, py + ph * .75);}
    // часы
    {const cx = w * .69, cy = h * .16, r = 13 * u; circ(g, cx, cy, r, '#f4efe0'); g.strokeStyle = '#222'; g.lineWidth = 2; g.beginPath(); g.arc(cx, cy, r, 0, 6.28); g.stroke(); const tm = S.min || 540, hr = (tm / 60) % 12, mn = tm % 60; g.lineWidth = 2; g.beginPath(); g.moveTo(cx, cy); g.lineTo(cx + Math.sin(hr / 12 * 6.283) * r * .55, cy - Math.cos(hr / 12 * 6.283) * r * .55); g.stroke(); g.beginPath(); g.moveTo(cx, cy); g.lineTo(cx + Math.sin(mn / 60 * 6.283) * r * .85, cy - Math.cos(mn / 60 * 6.283) * r * .85); g.stroke();}
    // табло плана
    {const bx = w * .5, by = h * .27 - 0, bw = w * .2, bh = h * .02; g.fillStyle = 'rgba(0,0,0,.45)'; g.fillRect(bx, by, bw, bh); const pr = Math.min(1.2, S.prog || 0); g.fillStyle = pr >= 1 ? '#5dffa0' : '#ffd23a'; g.fillRect(bx, by, bw * Math.min(1, pr), bh); g.fillStyle = '#e8e0ff'; g.font = '700 ' + Math.max(7, 7 * u) + 'px sans-serif'; g.textAlign = 'left'; g.fillText('ПЛАН ' + Math.round(pr * 100) + '%', bx + bw + 4, by + bh);}
    // кабинет директора
    {const bx = w * .74, by = h * .03, bw = w * .24, bh = WH * .9; g.fillStyle = 'rgba(160,210,230,.2)'; rr(g, bx, by, bw, bh, 4); g.fill(); if ((S.rank || 0) !== 4) seated(g, bx + bw / 2, by + bh * .5, .9 * u, {shirt: '#202020', skin: SKINS[4], hair: '#1a1208', style: 3, headset: true, act: (S.prog || 0) >= 1 ? 'laugh' : (S.prog || 0) < .3 ? 'think' : 'type'}, t, 0); g.fillStyle = '#5a3a1e'; g.fillRect(bx + bw * .2, by + bh * .82, bw * .6, bh * .1); g.strokeStyle = '#9bb'; g.lineWidth = 3; rr(g, bx, by, bw, bh, 4); g.stroke(); g.fillStyle = '#e8e0ff'; g.font = '800 ' + Math.max(7, 7.5 * u) + 'px sans-serif'; g.textAlign = 'center'; {const lt = (S.rank || 0) === 4 ? '🎛 ПУЛЬТ · ваш' : '🎛 ПУЛЬТ · Сергей', lw = g.measureText(lt).width + 10; g.fillStyle = 'rgba(10,8,24,.85)'; rr(g, bx + bw / 2 - lw / 2, by + 3, lw, 13 * u, 5); g.fill(); g.fillStyle = '#ffd23a'; g.fillText(lt, bx + bw / 2, by + 3 + 10 * u);}}
    // ---- люди ----
    const FILLN = ['Олег', 'Нина', 'Гена', 'Лёша', 'Рита', 'Саша', 'Дана', 'Миша', 'Жанна', 'Толик', 'Вера', 'Дима'];
    const mr = S.mr || 0, rank = S.rank || 0, pult = !!S.staff;
    const rows = [{y: .43, sc: .78, xs: [.12, .37, .63, .88]}, {y: .6, sc: .92, xs: [.12, .37, .63, .88]}, {y: .775, sc: 1.02, xs: [.17, .83]}];
    const spots = []; rows.forEach((r, ri) => r.xs.forEach(x => spots.push({x: x * w, y: r.y * h, sc: r.sc * u, ri})));
    const mine = {x: .5 * w, y: .775 * h, sc: 1.3 * u};
    const ROLEROW = [0, 0, 1, 1, 2, 2, 3, 3, -1, -1], RL = [['📞', 'ПЕРВАЯ ХОЛОДКА'], ['🔥', 'ВТОРАЯ ХОЛОДКА'], ['💼', 'КЛОУЗЕРЫ'], ['🚔', 'МУСОРА']];
    spots.forEach((sp, i) => sp.role = ROLEROW[i]); const occs = new Array(spots.length).fill(null);
    if (pult) {const over = []; for (let r = 0; r < 4; r++) {const l = S.staff.filter(q => Math.min(3, q.role) === r); l.forEach((q, k) => {const o = {n: q.n, col: RCOL[r], skin: q.skin || SKINS[0], hs: r < 3}; if (k < 2) occs[2 * r + k] = o; else over.push(o);});} over.forEach((o, k) => {if (8 + k < 10) occs[8 + k] = o;});}
    else {TEAM.forEach(x => {if (x.r < 4 && x.r !== rank) occs[2 * x.r] = {n: x.n, col: RCOL[x.r], skin: SKINS[x.r % 6], hs: x.r < 3};}); spots.forEach((sp, i) => {if (occs[i]) return; const hh = hash(i + 7); if (hh > .15) occs[i] = {n: FILLN[i % FILLN.length], col: sp.role >= 0 ? RCOL[sp.role] : SHIRTS[Math.floor(hash(i + 20) * SHIRTS.length)], skin: SKINS[Math.floor(hash(i + 31) * SKINS.length)], hs: sp.role !== 3 && hh > .3};});}
    spots.forEach((sp, i) => {
      const occ = occs[i];
      const sc = sp.sc; desk(g, sp.x, sp.y, sc, {live: false}, t, i, null);
      if (occ) {const ph = i * 1.9 + hash(i) * 3, ai = actFor(ph, t);
        seated(g, sp.x, sp.y, sc, {shirt: occ.col, skin: occ.skin, hair: HAIR[i % HAIR.length], style: i % 4, headset: occ.hs, act: ai.act, _f: ai.f}, t, ph);
        desk(g, sp.x, sp.y, sc, {live: false}, t, i, null);
        const txt = ai.act === 'talk' ? SAY[Math.floor(hash(ai.slot * 5 + i) * SAY.length)] : EMO[ai.act]; if (txt && ai.f > .1 && ai.f < .9) {g.font = '700 ' + Math.max(9, 10 * u) + 'px sans-serif'; const bw = g.measureText(txt).width + 10; g.fillStyle = 'rgba(255,255,255,.94)'; rr(g, sp.x - bw / 2 + 10 * sc, sp.y - 40 * sc - Math.sin(ai.f * 3.14) * 3, bw, 14 * u, 6); g.fill(); g.fillStyle = '#222'; g.textAlign = 'center'; g.fillText(txt, sp.x + 10 * sc, sp.y - 40 * sc + 10.5 * u - Math.sin(ai.f * 3.14) * 3);}
        if (occ.n) {g.font = '700 ' + Math.max(9, 9.5 * u) + 'px sans-serif'; g.textAlign = 'center'; const bw = g.measureText(occ.n).width + 8; g.fillStyle = 'rgba(10,8,24,.8)'; rr(g, sp.x - bw / 2, sp.y + 42 * sc, bw, 14 * u, 4); g.fill(); g.fillStyle = '#e8e0ff'; g.fillText(occ.n, sp.x, sp.y + 42 * sc + 10.5 * u);}}
      else if (pult) {g.fillStyle = 'rgba(255,255,255,.18)'; g.font = '700 ' + 11 * u + 'px sans-serif'; g.textAlign = 'center'; g.fillText('свободно', sp.x, sp.y + 8 * sc);}
    });
    for (let r = 0; r < 4; r++) {const a1 = spots[2 * r], a2 = spots[2 * r + 1], cx = (a1.x + a2.x) / 2, cy = a1.y - 47 * a1.sc, tx = RL[r][0] + ' ' + RL[r][1]; g.font = '800 ' + Math.max(8, 8.5 * u) + 'px sans-serif'; g.textAlign = 'center'; const bw = g.measureText(tx).width + 12; g.fillStyle = RCOL[r]; rr(g, cx - bw / 2, cy - 7 * u, bw, 14 * u, 7 * u); g.fill(); g.strokeStyle = 'rgba(255,255,255,.55)'; g.lineWidth = 1; g.stroke(); g.fillStyle = '#fff'; g.fillText(tx, cx, cy + 3.2 * u);}
    // ---- вы ----
    {const m = mine, sc = m.sc, inCall = S.mode === 'call', pAct = S.mode === 'ring' ? 'ring' : inCall ? ((t * .4) % 3 < .5 ? 'wave' : 'talk') : (S.energy || 100) < 22 ? ((t / 6) % 2 < 1 ? 'tired' : 'stretch') : (S.heat || 0) > 70 ? 'nervous' : (S.cons || 100) < 28 ? 'gloom' : actFor(1.3, t).act, o = S.out || [0, 0, 0], shirts = ['#6a6a78', '#e8e8f0', '#2a2f4a', '#12121c'];
      g.fillStyle = 'rgba(255,210,58,' + (.12 + Math.sin(t * 2) * .04) + ')'; g.beginPath(); g.ellipse(m.x, m.y + 30 * sc, 62 * sc, 22 * sc, 0, 0, 6.28); g.fill();
      seated(g, m.x, m.y, sc, {shirt: S.col || shirts[o[0] || 0], tie: (!S.col && o[0] >= 2) ? '#c33' : null, skin: '#e8b898', hair: '#2a1a0a', headset: rank < 3 || inCall, sweat: (S.heat || 0) > 65, style: 0, act: pAct}, t, 1.3);
      desk(g, m.x, m.y, sc, {live: inCall}, t, 3, null);
      if (o[2] === 1 || o[2] === 3) circ(g, m.x + 12 * sc, m.y + 24 * sc, 2.2 * sc, '#cfd8e0'); if (o[2] === 2) {g.strokeStyle = '#ffd23a'; g.lineWidth = 1.6 * sc; g.beginPath(); g.arc(m.x, m.y + 6 * sc, 6 * sc, .2, Math.PI - .2); g.stroke();}
      // телефон
      const ph = S.ring ? Math.sin(t * 40) * 1.5 : 0; g.save(); g.translate(m.x - 44 * sc + ph, m.y + 24 * sc); rr(g, 0, 0, 20 * sc, 9 * sc, 3 * sc); g.fillStyle = S.ring ? '#ffd23a' : '#2a2a30'; g.fill(); if (S.ring) {g.shadowColor = '#ffd23a'; g.shadowBlur = 14; g.fill(); g.shadowBlur = 0; g.font = (12 * u) + 'px sans-serif'; g.textAlign = 'center'; g.fillText('🔔', 10 * sc, -3 * sc);} g.restore();
      // кружка + пар
      g.fillStyle = '#eee'; rr(g, m.x + 28 * sc, m.y + 21 * sc, 7 * sc, 7 * sc, 1.5); g.fill(); for (let i = 0; i < 3; i++) {g.strokeStyle = 'rgba(255,255,255,' + (.4 - i * .1) + ')'; g.lineWidth = 1.4; g.beginPath(); g.moveTo(m.x + 31 * sc + i * 2, m.y + 20 * sc); g.quadraticCurveTo(m.x + 33 * sc + Math.sin(t * 2 + i) * 3, m.y + 14 * sc - i * 3, m.x + 31 * sc + i * 2, m.y + 8 * sc - i * 3); g.stroke();}
      (S.pets || []).forEach((id, i) => {g.font = Math.round(16 * u) + 'px sans-serif'; g.textAlign = 'center'; g.fillText({fish: '🐟', ham: '🐹', cat: '🐈', dog: '🐕'}[id] || '🐾', m.x + (44 + i * 16) * sc * .8, m.y + 30 * sc + Math.sin(t * 2 + i) * 1.5);});
      const nk = '★ ' + (S.nick || 'ВЫ'); g.font = '800 ' + Math.max(9, 10 * u) + 'px sans-serif'; g.textAlign = 'center'; const tw = g.measureText(nk).width + 12; rr(g, m.x - tw / 2, m.y - 32 * sc, tw, 15 * u, 5); g.fillStyle = '#ffd23a'; g.fill(); g.fillStyle = '#201400'; g.fillText(nk, m.x, m.y - 32 * sc + 11 * u);
      if (inCall) {g.font = '700 ' + Math.max(8, 9 * u) + 'px sans-serif'; const tx = 'Алло, слушаю вас…', bw = g.measureText(tx).width + 12; g.fillStyle = 'rgba(255,255,255,.94)'; rr(g, m.x + 14 * sc, m.y - 44 * sc, bw, 15 * u, 6); g.fill(); g.fillStyle = '#222'; g.textAlign = 'left'; g.fillText(tx, m.x + 20 * sc, m.y - 44 * sc + 11 * u);}}
    // обстановка
    {const px = w * .02, py = h * .52; g.fillStyle = '#7a4a2a'; rr(g, px, py + 14 * u, 16 * u, 18 * u, 3); g.fill(); g.fillStyle = '#2f8a4a'; for (let k = 0; k < 5; k++) {g.beginPath(); g.ellipse(px + 8 * u + (k - 2) * 5 * u, py + 6 * u, 5 * u, 15 * u, (k - 2) * .35 + Math.sin(t + k) * .03, 0, 6.28); g.fill();}
      const kx = w * .93, ky = h * .56; g.fillStyle = '#d6e4ee'; rr(g, kx, ky, 15 * u, 38 * u, 3); g.fill(); g.fillStyle = 'rgba(120,190,255,.85)'; g.fillRect(kx + 2 * u, ky - 12 * u, 11 * u, 12 * u); if (Math.sin(t * 2) > .8) circ(g, kx + 7 * u, ky - 5 * u, 1.8, '#fff');
      const ix = w * (((t * .018) % 1.15) - .07), iy = WH + 10 * u; g.font = Math.round(18 * u) + 'px sans-serif'; g.textAlign = 'center'; g.fillText('🚶', ix, iy + Math.abs(Math.sin(t * 6)) * -3); if (hash(Math.floor(t / 9)) > .4) g.fillText('📄', ix - 16 * u, iy);}
    // лучи ламп и затемнение
    for (let i = 0; i < 4; i++) {const lx = w * (.12 + i * .26); g.fillStyle = 'rgba(255,245,200,.1)'; g.beginPath(); g.moveTo(lx, 0); g.lineTo(lx + w * .08, 0); g.lineTo(lx + w * .14, h * .5); g.lineTo(lx - w * .06, h * .5); g.fill(); g.fillStyle = '#d8d4c4'; rr(g, lx, 0, w * .08, 4, 2); g.fill();}
    if (night > 0) {g.fillStyle = 'rgba(8,6,30,' + night * .4 + ')'; g.fillRect(0, 0, w, h);}
    if (S.mode === 'ring') {g.strokeStyle = 'rgba(255,210,58,' + (.4 + Math.sin(t * 12) * .3) + ')'; g.lineWidth = 3; rr(g, 1, 1, w - 2, h - 2, 8); g.stroke();}
    g.fillStyle = 'rgba(255,255,255,.35)'; g.font = '700 ' + Math.max(7, 7 * u) + 'px sans-serif'; g.textAlign = 'right'; g.fillText('ЗОЛОТОЙ КОРПОРАТИВ · build 1.7.0', w - 6, h - 5);
  }
  Gfx.scene = scene;
})();
