'use strict';
/* КОЛ-ЦЕНТР: СМЕНА — графика: сцена офиса, логотип, иконка, заставка. MADE BY PESSIMIST */
const Gfx = (() => {
  const mk = (w, h) => {const c = document.createElement('canvas'); c.width = w; c.height = h; return c;};
  const rr = (g, x, y, w, h, r) => {g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath();};
  const circ = (g, x, y, r, f) => {g.beginPath(); g.arc(x, y, r, 0, 6.2832); g.fillStyle = f; g.fill();};
  const mix = (a, b, k) => a.map((v, i) => Math.round(v + (b[i] - v) * k));
  const rgb = c => 'rgb(' + c.join(',') + ')';

  function sky(g, x, y, w, h, p) {
    // p: 0 утро … 1 вечер
    const stops = [[[150, 190, 235], [250, 225, 180]], [[100, 170, 240], [190, 225, 250]], [[240, 150, 90], [250, 200, 120]], [[20, 24, 60], [70, 40, 90]]];
    const f = p * 3, i = Math.min(2, Math.floor(f)), k = f - i, A = mix(stops[i][0], stops[i + 1][0], k), B = mix(stops[i][1], stops[i + 1][1], k);
    const gr = g.createLinearGradient(0, y, 0, y + h); gr.addColorStop(0, rgb(A)); gr.addColorStop(1, rgb(B)); g.fillStyle = gr; g.fillRect(x, y, w, h);
    const night = Math.max(0, p - .72) / .28; const sx = x + w * (.15 + p * .7), sy = y + h * (.65 - Math.sin(p * 3.14) * .5);
    circ(g, sx, sy, 9, night > .5 ? '#f2f2d8' : '#fff1a8');
    g.fillStyle = 'rgba(30,34,52,' + (.75 + night * .2) + ')'; const R = [[.02, .5], [.12, .34], [.24, .6], [.34, .28], [.46, .52], [.58, .38], [.7, .62], [.82, .3], [.92, .5]];
    R.forEach(r => g.fillRect(x + w * r[0], y + h * r[1], w * .1, h * (1 - r[1]))); if (night > 0) {g.fillStyle = 'rgba(255,224,120,' + night + ')'; R.forEach((r, i) => {for (let k2 = 0; k2 < 3; k2++) g.fillRect(x + w * r[0] + 3 + (k2 % 2) * 7, y + h * r[1] + 6 + k2 * 9, 3, 4);});}
  }
  function person(g, x, y, s, skin, shirt, t, ph, headset) {
    g.save(); g.translate(x, y); g.scale(s, s);
    rr(g, -9, 0, 18, 22, 6); g.fillStyle = shirt; g.fill(); circ(g, 0, -8, 8, skin);
    g.fillStyle = 'rgba(0,0,0,.45)'; g.beginPath(); g.arc(0, -10, 8.4, 3.2, 6.2); g.fill();
    if (headset) {g.strokeStyle = '#222'; g.lineWidth = 2; g.beginPath(); g.arc(0, -9, 9, 3.3, 6.1); g.stroke(); circ(g, -9, -7, 3, '#222'); circ(g, 9, -7, 3, '#222'); g.beginPath(); g.moveTo(9, -5); g.quadraticCurveTo(10, 3, 4, 3); g.stroke();}
    const b = Math.sin(t * 9 + ph) * 2; g.strokeStyle = skin; g.lineWidth = 3.2; g.lineCap = 'round'; g.beginPath(); g.moveTo(-8, 8); g.lineTo(-11, 20 + b); g.moveTo(8, 8); g.lineTo(11, 20 - b); g.stroke();
    g.restore();
  }
  function scene(g, w, h, t, S) {
    const p = S.p, night = Math.max(0, p - .72) / .28, dark = .15 + night * .4;
    const wall = g.createLinearGradient(0, 0, 0, h); wall.addColorStop(0, '#6b6a86'); wall.addColorStop(1, '#4c4a68'); g.fillStyle = wall; g.fillRect(0, 0, w, h);
    g.fillStyle = '#3a3347'; g.fillRect(0, h * .74, w, h * .26); g.fillStyle = 'rgba(255,200,120,.06)'; for (let i = 0; i < 6; i++) g.fillRect(w * (i / 6 + .02), h * .76, w * .08, h * .22); g.fillStyle = 'rgba(255,255,255,.04)'; for (let i = 0; i < 10; i++) g.fillRect(i * w / 10, h * .74, 2, h * .26);
    // окно
    const wx = w * .05, wy = h * .1, ww = w * .3, wh = h * .45; g.save(); rr(g, wx, wy, ww, wh, 4); g.clip(); sky(g, wx, wy, ww, wh, p); g.restore(); g.strokeStyle = '#d6dcd8'; g.lineWidth = 4; rr(g, wx, wy, ww, wh, 4); g.stroke(); g.lineWidth = 2; g.beginPath(); g.moveTo(wx + ww / 2, wy); g.lineTo(wx + ww / 2, wy + wh); g.moveTo(wx, wy + wh / 2); g.lineTo(wx + ww, wy + wh / 2); g.stroke();
    // часы
    const cx = w * .585, cy = h * .27; circ(g, cx, cy, 16, '#f4efe0'); g.strokeStyle = '#222'; g.lineWidth = 2; g.beginPath(); g.arc(cx, cy, 16, 0, 6.28); g.stroke();
    const tm = S.min, hr = (tm / 60) % 12, mn = tm % 60; g.lineWidth = 2.4; g.beginPath(); g.moveTo(cx, cy); g.lineTo(cx + Math.sin(hr / 12 * 6.283) * 8, cy - Math.cos(hr / 12 * 6.283) * 8); g.stroke(); g.lineWidth = 1.5; g.beginPath(); g.moveTo(cx, cy); g.lineTo(cx + Math.sin(mn / 60 * 6.283) * 12, cy - Math.cos(mn / 60 * 6.283) * 12); g.stroke();
    // плакаты
    {const px = w * .365, py = h * .18, pw = w * .15, ph = h * .2; rr(g, px, py, pw, ph, 3); const pg = g.createLinearGradient(px, py, px, py + ph); pg.addColorStop(0, '#12331e'); pg.addColorStop(1, '#0a1c10'); g.fillStyle = pg; g.fill(); g.strokeStyle = '#ffd23a'; g.lineWidth = 1.5; g.stroke();
      g.textAlign = 'center'; g.fillStyle = '#ffd23a'; const f1 = Math.max(8, Math.round(h * .062)); g.font = '900 ' + f1 + 'px Impact,sans-serif'; g.fillText('MAKE', px + pw / 2, py + ph * .38); g.fillStyle = '#5dffc0'; g.fillText('MONEY', px + pw / 2, py + ph * .72); g.fillStyle = '#ffd23a'; g.font = '700 ' + Math.round(f1 * .8) + 'px sans-serif'; g.fillText('₴ ₴ ₴', px + pw / 2, py + ph * .93);
      const bx3 = w * .36, by3 = h * .02, bw3 = w * .285, bh3 = h * .13; rr(g, bx3, by3, bw3, bh3, 3); g.fillStyle = '#3a0d0d'; g.fill(); g.strokeStyle = '#c8a050'; g.lineWidth = 1.5; g.stroke(); g.fillStyle = '#e8d29a'; const f2 = Math.max(7, Math.round(h * .045)); g.font = '800 ' + f2 + 'px sans-serif'; g.fillText('ЧУГУН ВЕЩАЕТ:', bx3 + bw3 / 2, by3 + bh3 * .42); g.fillStyle = '#ff6a5a'; g.font = '900 ' + f2 + 'px sans-serif'; g.fillText('НУЖНО ЕБАШИТЬ!', bx3 + bw3 / 2, by3 + bh3 * .8);}
    // кабинет босса
    const bx = w * .66, by = h * .12, bw = w * .3, bh = h * .6; g.fillStyle = 'rgba(160,210,230,.18)'; rr(g, bx, by, bw, bh, 4); g.fill(); person(g, bx + bw / 2, by + bh * .5, 1.4, '#e0b090', '#1b1f2a', t, 0, false); g.fillStyle = '#c33'; g.fillRect(bx + bw / 2 - 1.5, by + bh * .5 + 4, 3, 12);
    g.strokeStyle = '#9bb'; g.lineWidth = 3; rr(g, bx, by, bw, bh, 4); g.stroke(); g.fillStyle = '#222'; g.font = '700 ' + Math.round(h * .03) + 'px sans-serif'; g.fillText('ДИРЕКТОР', bx + bw / 2, by + bh + 12);
    // обстановка офиса (build 1.7.0)
    {for (let i = 0; i < 5; i++) {const lx = w * (.1 + i * .2); g.fillStyle = '#d8d4c4'; rr(g, lx, 0, w * .09, h * .018, 2); g.fill(); g.fillStyle = 'rgba(255,245,200,' + (.45 - night * .2) + ')'; g.beginPath(); g.moveTo(lx, h * .018); g.lineTo(lx + w * .09, h * .018); g.lineTo(lx + w * .13, h * .2); g.lineTo(lx - w * .04, h * .2); g.fill();}
      // перегородки-кубиклы
      g.fillStyle = 'rgba(30,24,50,.55)'; for (let i = 0; i < 5; i++) g.fillRect(w * (.075 + i * .135) - w * .067, h * .5, 3, h * .24);
      // растение
      g.fillStyle = '#7a4a2a'; rr(g, w * .012, h * .6, w * .035, h * .1, 3); g.fill(); g.fillStyle = '#2f8a4a'; for (let k = 0; k < 5; k++) {g.beginPath(); g.ellipse(w * .03 + (k - 2) * w * .012, h * .56 - Math.abs(k - 2) * 2, w * .012, h * .06, (k - 2) * .35 + Math.sin(t + k) * .03, 0, 6.28); g.fill();}
      // кулер
      const kx = w * .945, ky = h * .52; g.fillStyle = '#d6e4ee'; rr(g, kx, ky, w * .04, h * .18, 3); g.fill(); g.fillStyle = 'rgba(120,190,255,.8)'; g.fillRect(kx + w * .006, ky - h * .06, w * .028, h * .06); if (Math.sin(t * 2) > .8) circ(g, kx + w * .02, ky - h * .03, 2, '#fff');
      // принтер с бумагой
      g.fillStyle = '#c9c9d0'; rr(g, w * .52, h * .62, w * .09, h * .07, 3); g.fill(); g.fillStyle = '#fff'; g.fillRect(w * .535, h * .6 - ((t * 6) % 6), w * .05, h * .03); g.fillStyle = Math.sin(t * 5) > 0 ? '#5f5' : '#252'; g.fillRect(w * .595, h * .64, 3, 3);
      // стажёр бегает по коридору
      const ix = w * (.05 + ((t * .02) % .9)); g.font = Math.round(h * .08) + 'px sans-serif'; g.textAlign = 'center'; g.fillText('🏃', ix, h * .72 + Math.abs(Math.sin(t * 8)) * -3); g.fillText('📄', ix - w * .02, h * .7);
      // стеклянная дверь
      g.strokeStyle = 'rgba(190,230,255,.5)'; g.lineWidth = 2; rr(g, w * .905, h * .08, w * .04, h * .62, 3); g.stroke();}
    // коллеги по лестнице
    const cols = [['#e0b090', '#7a5ac8', 'cold1', 'Дима'], ['#b98c6c', '#c8507a', 'cold2', 'Катя'], ['#f0c8a8', '#2a6a9a', 'closer', 'Рома'], ['#d8b090', '#3a4a3a', 'musor', 'Гриша'], ['#e0c0a0', '#202020', 'pult', 'Сергей']];
    cols.forEach((c, i) => {
      if (i === (S.rank || 0)) return;
      const x = w * (.075 + i * .135), y = h * .43, sc = Math.min(1.1, w / 420); person(g, x, y, sc, c[0], c[1], t, i * 2, i < 3);
      if (i === 3) {g.fillStyle = '#1c2c5a'; rr(g, x - 9 * sc, y - 19 * sc, 18 * sc, 6 * sc, 2); g.fill(); g.fillRect(x - 11 * sc, y - 14 * sc, 22 * sc, 2 * sc); circ(g, x, y - 17 * sc, 1.6 * sc, '#ffd23a');}
      if (i === 4) {g.fillStyle = '#111'; rr(g, x - 16 * sc, y + 14 * sc, 32 * sc, 14 * sc, 2); g.fill(); g.fillStyle = 'rgba(80,255,170,.7)'; for (let k = 0; k < 4; k++) g.fillRect(x - 13 * sc + k * 7 * sc, y + 26 * sc - ((Math.sin(t * 2 + k * 1.7) + 1) * 4.5 + 2) * sc, 4 * sc, ((Math.sin(t * 2 + k * 1.7) + 1) * 4.5 + 2) * sc);}
      g.fillStyle = '#6a4a2c'; g.fillRect(x - 22 * sc, y + 24 * sc, 44 * sc, 6 * sc);
      const me = i === S.rank; g.fillStyle = me ? '#ffd23a' : 'rgba(10,8,24,.8)'; const fs = Math.max(8, Math.round(h * .05)); g.font = '700 ' + fs + 'px sans-serif'; g.textAlign = 'center'; const label = (me ? '▶ ' : '') + c[3]; const tw = g.measureText(label).width + 8; rr(g, x - tw / 2, y + 31 * sc, tw, fs + 4, 4); g.fill(); g.fillStyle = me ? '#201400' : '#e8e0ff'; g.fillText(label, x, y + 31 * sc + fs);
    });
    // ваш персонаж (build 1.7.0)
    {const o = S.out || [0, 0, 0], i = S.rank || 0, sc = Math.min(1.2, w / 400) * 1.1, x = w * (.075 + i * .135), y = h * .43;
      const shirts = ['#6a6a78', '#e8e8f0', '#2a2f4a', '#12121c'];
      person(g, x, y, sc, '#e8b898', S.col || shirts[o[0] || 0], t, i * 2 + 1, i < 3);
      if (o[0] >= 2) {g.fillStyle = '#c33'; g.fillRect(x - 1.2 * sc, y + 2 * sc, 2.4 * sc, 12 * sc);}
      g.fillStyle = ['#e8e8e8', '#5a3a22', '#101010'][o[1] || 0]; rr(g, x - 9 * sc, y + 22 * sc, 18 * sc, 4 * sc, 2); g.fill();
      if (o[2] === 1 || o[2] === 3) circ(g, x + 9 * sc, y + 14 * sc, 2.2 * sc, '#cfd8e0'); if (o[2] === 2) {g.strokeStyle = '#ffd23a'; g.lineWidth = 1.6 * sc; g.beginPath(); g.arc(x, y + 4 * sc, 6 * sc, .2, Math.PI - .2); g.stroke();}
      const nk = '★ ' + (S.nick || 'ВЫ'), fs = Math.max(8, Math.round(h * .045)); g.font = '800 ' + fs + 'px sans-serif'; g.textAlign = 'center'; const tw = g.measureText(nk).width + 8; rr(g, x - tw / 2, y - 26 * sc, tw, fs + 4, 4); g.fillStyle = '#ffd23a'; g.fill(); g.fillStyle = '#201400'; g.fillText(nk, x, y - 26 * sc + fs);}
    // ваш стол
    const dy = h * .8; const dg = g.createLinearGradient(0, dy, 0, h); dg.addColorStop(0, '#7a5230'); dg.addColorStop(1, '#4e321c'); g.fillStyle = dg; g.fillRect(0, dy, w, h - dy);
    g.fillStyle = '#222'; rr(g, w * .38, dy - h * .085, w * .26, h * .105, 4); g.fill(); g.fillStyle = 'rgba(110,255,170,' + (.55 + Math.sin(t * 3) * .1) + ')'; g.fillRect(w * .39, dy - h * .075, w * .24, h * .075);
    g.fillStyle = 'rgba(0,60,20,.55)'; for (let i = 0; i < 4; i++) g.fillRect(w * .4, dy - h * .068 + i * h * .015, w * (.06 + ((i * 37 + Math.floor(t * 2)) % 7) * .02), 2);
    if (S.mode === 'call') {g.fillStyle = 'rgba(0,70,30,.85)'; for (let i = 0; i < 14; i++) {const bh = (Math.sin(t * 9 + i * 1.3) * .5 + .5) * h * .05 + 2; g.fillRect(w * .4 + i * w * .0165, dy - h * .022 - bh, w * .011, bh);}}
    // телефон
    const ph = S.ring ? Math.sin(t * 40) * 1.5 : 0; g.save(); g.translate(w * .15 + ph, dy + 6); rr(g, 0, 0, 36, 18, 4); g.fillStyle = S.ring ? '#ffd23a' : '#2a2a30'; g.fill(); if (S.ring) {g.shadowColor = '#ffd23a'; g.shadowBlur = 16; rr(g, 0, 0, 36, 18, 4); g.fill(); g.shadowBlur = 0;} g.restore();
    (S.pets || []).forEach((id, i) => {g.font = Math.round(h * .13) + 'px sans-serif'; g.textAlign = 'center'; g.fillText({fish: '🐟', ham: '🐹', cat: '🐈', dog: '🐕'}[id] || '🐾', w * (.9 - i * .08), dy + 8 + Math.sin(t * 2 + i) * 1.5);});
    // кружка и пар
    g.fillStyle = '#eee'; rr(g, w * .78, dy + 4, 18, 16, 3); g.fill(); g.fillStyle = '#6b3e1c'; g.fillRect(w * .78 + 2, dy + 6, 14, 4); for (let i = 0; i < 3; i++) {g.strokeStyle = 'rgba(255,255,255,' + (.35 - i * .08) + ')'; g.lineWidth = 2; g.beginPath(); g.moveTo(w * .78 + 5 + i * 4, dy + 2); g.quadraticCurveTo(w * .78 + 2 + i * 4 + Math.sin(t * 3 + i) * 3, dy - 8, w * .78 + 6 + i * 4, dy - 16 - i * 3); g.stroke();}
    // луч света и пыль
    if (night < .6) {const lg = g.createLinearGradient(wx, wy, wx + ww * .8, h); lg.addColorStop(0, 'rgba(255,240,190,' + .16 * (1 - night) + ')'); lg.addColorStop(1, 'rgba(255,240,190,0)'); g.fillStyle = lg; g.beginPath(); g.moveTo(wx + 4, wy + wh); g.lineTo(wx + ww - 4, wy + wh); g.lineTo(wx + ww * 1.5, h * .8); g.lineTo(wx + ww * .2, h * .8); g.closePath(); g.fill();
      for (let i = 0; i < 18; i++) {const px = wx + ww * (.2 + ((i * 53) % 100) / 100 * .9) + Math.sin(t * .6 + i) * 6, py = wy + wh + ((t * (6 + i % 5) + i * 31) % (h * .75 - wy - wh)); g.fillStyle = 'rgba(255,250,220,' + .35 * (1 - night) + ')'; g.fillRect(px, py, 1.6, 1.6);}}
    // реплики коллег
    const SAY = ['...', 'Алё?', 'Да-да', 'Сумма?', 'Тсс', 'Минутку', 'Перезвоню']; for (let i = 0; i < 5; i++) {const ph = Math.floor(t / 2.6 + i * 1.9), hs = (ph * 7919 + i * 104729) % 11; if (hs < 3 && (t / 2.6 + i * 1.9) % 1 < .8) {const sc2 = Math.min(1.1, w / 420), bx2 = w * (.075 + i * .135), by2 = h * .43 - 26 * sc2, tx = SAY[hs + i % 4]; g.font = '600 ' + Math.max(8, Math.round(h * .045)) + 'px sans-serif'; const tw2 = g.measureText(tx).width + 10; g.fillStyle = 'rgba(255,255,255,.92)'; rr(g, bx2 - tw2 / 2, by2 - 14, tw2, 14, 5); g.fill(); g.fillStyle = '#222'; g.textAlign = 'center'; g.fillText(tx, bx2, by2 - 3);}}
    // освещение
    const lf = 1 - Math.max(0, Math.sin(t * 17) * Math.sin(t * 3.1)) * .06; g.fillStyle = 'rgba(8,10,30,' + dark * lf + ')'; g.fillRect(0, 0, w, h);
    const vg = g.createRadialGradient(w / 2, h / 2, h * .3, w / 2, h / 2, h * .9); vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(0,0,0,.45)'); g.fillStyle = vg; g.fillRect(0, 0, w, h);
  }
  function logoText(g, cx, cy, s) {
    g.textAlign = 'center'; g.textBaseline = 'middle'; g.lineJoin = 'round';
    const draw = (t, y, size, c1, c2) => {g.font = '900 ' + size + 'px Impact,"Arial Black",sans-serif'; const gr = g.createLinearGradient(0, y - size / 2, 0, y + size / 2); gr.addColorStop(0, c1); gr.addColorStop(1, c2); g.strokeStyle = '#08060a'; g.lineWidth = size * .2; g.strokeText(t, cx, y + size * .06); g.shadowColor = 'rgba(255,60,200,.8)'; g.shadowBlur = size * .3; g.strokeStyle = '#ff3ac8'; g.lineWidth = size * .06; g.strokeText(t, cx, y); g.shadowBlur = 0; g.fillStyle = gr; g.fillText(t, cx, y);};
    draw('КОЛ-ЦЕНТР', cy - 24 * s, 66 * s, '#fff7a8', '#ffb400'); draw('СМЕНА', cy + 38 * s, 58 * s, '#a8fff0', '#00c8a8');
  }
  function headset(g, cx, cy, r, col) {
    g.strokeStyle = col; g.lineWidth = r * .16; g.lineCap = 'round'; g.beginPath(); g.arc(cx, cy, r, Math.PI * 1.05, Math.PI * 1.95); g.stroke();
    rr(g, cx - r * 1.12, cy - r * .1, r * .42, r * .7, r * .15); g.fillStyle = col; g.fill(); rr(g, cx + r * .7, cy - r * .1, r * .42, r * .7, r * .15); g.fill();
    g.beginPath(); g.moveTo(cx + r * .92, cy + r * .6); g.quadraticCurveTo(cx + r * .9, cy + r * 1.25, cx + r * .2, cy + r * 1.25); g.stroke(); circ(g, cx + r * .15, cy + r * 1.25, r * .1, col);
  }
  function icon(S) {
    const c = mk(S, S), g = c.getContext('2d'), bg = g.createLinearGradient(0, 0, S, S); bg.addColorStop(0, '#3a1d6e'); bg.addColorStop(1, '#0c1030'); g.fillStyle = bg; g.fillRect(0, 0, S, S);
    for (let i = 0; i < 4; i++) {g.strokeStyle = 'rgba(255,58,200,' + (.5 - i * .1) + ')'; g.lineWidth = S * .012; g.beginPath(); g.arc(S * .5, S * .45, S * (.26 + i * .06), -.8, .8 + 3.14, false); g.stroke();}
    headset(g, S * .5, S * .42, S * .24, '#ffd23a');
    g.fillStyle = '#fff'; g.font = '900 ' + S * .2 + 'px Impact,sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.strokeStyle = '#0c1030'; g.lineWidth = S * .03; g.strokeText('₴', S * .5, S * .5); g.fillStyle = '#7dffb0'; g.fillText('₴', S * .5, S * .5);
    g.font = '900 ' + S * .085 + 'px Impact,sans-serif'; g.fillStyle = '#fff7a8'; g.strokeText('КОЛ-ЦЕНТР', S * .5, S * .8); g.fillText('КОЛ-ЦЕНТР', S * .5, S * .8); g.font = '700 ' + S * .042 + 'px sans-serif'; g.fillStyle = '#ffd7a0'; g.fillText('PESSIMIST', S * .5, S * .91);
    return c;
  }
  function splash(w, h, txt) {
    const c = mk(w, h), g = c.getContext('2d'), bg = g.createLinearGradient(0, 0, 0, h); bg.addColorStop(0, '#1a0c3a'); bg.addColorStop(.6, '#2a1050'); bg.addColorStop(1, '#0c0618'); g.fillStyle = bg; g.fillRect(0, 0, w, h);
    const s = Math.min(w / 460, h / 800); for (let i = 0; i < 60; i++) {g.fillStyle = 'rgba(255,255,255,' + (.15 + (i * 37 % 10) / 20) + ')'; g.fillRect((i * 97 % 100) / 100 * w, (i * 53 % 100) / 100 * h * .7, 2, 2);}
    headset(g, w / 2, h * .3, 70 * s, '#ffd23a'); logoText(g, w / 2, h * .5, s);
    if (txt) {g.textAlign = 'center'; g.fillStyle = '#ffd7a0'; g.font = '700 ' + 20 * s + 'px sans-serif'; g.fillText('MADE BY PESSIMIST', w / 2, h * .6); g.fillStyle = '#ff7adf'; g.font = '800 ' + 16 * s + 'px Impact,sans-serif'; g.fillText('ЗОЛОТОЙ КОРПОРАТИВ · build 1.7.0', w / 2, h * .68); g.fillStyle = '#9fd8ff'; g.font = '600 ' + 15 * s + 'px sans-serif'; g.fillText('@Izzolentaaa  ·  t.me/+OlavQF1edndlOWY1', w / 2, h * .635);}
    return c;
  }
  return {mk, scene, logoText, headset, icon, splash};
})();
