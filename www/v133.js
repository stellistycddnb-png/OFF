'use strict';
/* v133: максимум качества — векторные персонажи, свет, субтитры, камера. MADE BY PESSIMIST */
(function () {
  const C = window.__cine, E = window.__endAnim, SC = window.__cineSC; if (!C || !E || !SC) return;
  const {sky, post, hz, W, H} = C, TAU = Math.PI * 2, clamp = (a, b, c) => Math.max(b, Math.min(c, a)), ease = x => x < .5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2, lerp = (a, b, k) => a + (b - a) * k;
  const rect = (g, x, y, w, h, r) => {g.beginPath(); if (g.roundRect) g.roundRect(x, y, w, h, r || 0); else g.rect(x, y, w, h); g.fill();};
  const circ = (g, x, y, r) => {g.beginPath(); g.arc(x, y, r, 0, TAU); g.fill();};
  const glow = (g, x, y, r, col, a) => {g.save(); g.globalCompositeOperation = 'lighter'; const q = g.createRadialGradient(x, y, 0, x, y, r); q.addColorStop(0, col.replace('A', a)); q.addColorStop(1, col.replace('A', 0)); g.fillStyle = q; g.fillRect(x - r, y - r, r * 2, r * 2); g.restore();};
  const hr = i => {const v = Math.sin(i * 127.1 + 311.7) * 43758.5453; return v - Math.floor(v);};
  /* человек (с лицом, мимикой, объёмом) */
  const shade = (g, x0, y0, x1, y1, c1, c2) => {const q = g.createLinearGradient(x0, y0, x1, y1); q.addColorStop(0, c1); q.addColorStop(1, c2); return q;};
  function limb(g, x0, y0, x1, y1, w, col) {g.strokeStyle = col; g.lineWidth = w; g.lineCap = 'round'; g.beginPath(); g.moveTo(x0, y0); g.lineTo(x1, y1); g.stroke();}
  function person(g, x, y, s, o) {
    o = o || {}; const t = o.t || 0, wk = o.walk ? Math.sin(t * o.walk) : 0, h = 64 * s, br = Math.sin(t * 2.2) * .8 * s, col = o.col || '#4a7ad8', skin = o.skin || '#f0c8a0', mood = o.mood || 'flat';
    g.save(); g.translate(x, y); g.scale(o.dir || 1, 1); if (o.alpha !== undefined) g.globalAlpha = o.alpha;
    g.fillStyle = 'rgba(0,0,0,.28)'; g.beginPath(); g.ellipse(0, 0, 17 * s, 4.5 * s, 0, 0, TAU); g.fill();
    const lg = o.pants || '#262a44';
    [[-1, 1], [1, -1]].forEach(([a, b2]) => {const fx = a * 4.5 * s + wk * b2 * 12 * s, lift = o.walk ? Math.max(0, wk * b2) * 5 * s : 0, hy = -h * .42, ky = -h * .2 - lift * .3; limb(g, a * 4.5 * s, hy, a * 4.5 * s + wk * b2 * 5 * s, ky, 7.2 * s, lg); limb(g, a * 4.5 * s + wk * b2 * 5 * s, ky, fx, -3 * s - lift, 6.6 * s, lg); g.fillStyle = '#15151c'; g.beginPath(); g.ellipse(fx + 3 * s, -1.5 * s - lift, 6 * s, 3 * s, 0, 0, TAU); g.fill();});
    g.translate(0, br);
    if (o.dress) {g.fillStyle = shade(g, 0, -h * .7, 0, 0, o.dress, '#e8e0f0'); g.beginPath(); g.moveTo(-8 * s, -h * .72); g.lineTo(8 * s, -h * .72); g.quadraticCurveTo(18 * s + wk * 3 * s, -h * .3, 20 * s, -2 * s); g.lineTo(-20 * s, -2 * s); g.quadraticCurveTo(-18 * s + wk * 3 * s, -h * .3, -8 * s, -h * .72); g.fill();}
    const bg = shade(g, -10 * s, -h * .8, 10 * s, -h * .4, col, 'rgba(0,0,0,.35)'); g.fillStyle = col; rect(g, -10.5 * s, -h * .81, 21 * s, h * .43, 6 * s); g.fillStyle = bg; rect(g, -10.5 * s, -h * .81, 21 * s, h * .43, 6 * s);
    if (o.tie) {g.fillStyle = o.tie; g.beginPath(); g.moveTo(0, -h * .79); g.lineTo(2.5 * s, -h * .7); g.lineTo(0, -h * .56); g.lineTo(-2.5 * s, -h * .7); g.fill(); g.fillStyle = 'rgba(255,255,255,.8)'; g.beginPath(); g.moveTo(-5 * s, -h * .8); g.lineTo(0, -h * .72); g.lineTo(5 * s, -h * .8); g.fill();}
    [-1, 1].forEach(a => {const sx = a * 10.5 * s, sy = -h * .75; let ex, ey, hx, hy; if (o.up) {ex = a * 16 * s; ey = -h * .88; hx = a * 15 * s + Math.sin(t * 9 + a) * 4 * s; hy = -h * 1.08 + Math.cos(t * 9 + a) * 3 * s;} else if (o.box) {ex = a * 12 * s; ey = -h * .55; hx = a * 4 * s + 6 * s; hy = -h * .5;} else {ex = a * 13 * s + a * wk * 2 * s; ey = -h * .56; hx = a * 12 * s - a * wk * 8 * s; hy = -h * .36 + (a * wk) * 4 * s;} limb(g, sx, sy, ex, ey, 5.4 * s, col); limb(g, ex, ey, hx, hy, 4.8 * s, col); g.fillStyle = skin; circ(g, hx, hy, 3.2 * s);});
    if (o.box) {g.fillStyle = shade(g, 0, 0, 20 * s, 18 * s, '#d4a864', '#9a6c30'); rect(g, 4 * s, -h * .62, 22 * s, 17 * s, 2 * s); g.fillStyle = 'rgba(0,0,0,.25)'; g.fillRect(4 * s, -h * .62 + 6 * s, 22 * s, 2 * s);}
    if (o.folder) {g.fillStyle = '#f2c14a'; rect(g, 8 * s, -h * .56, 14 * s, 18 * s, 2 * s); g.fillStyle = '#fff'; g.fillRect(10 * s, -h * .54, 10 * s, 2 * s);}
    g.fillStyle = skin; g.fillRect(-2.6 * s, -h * .86, 5.2 * s, 5 * s);
    const hy2 = -h * .94, hs = o.hairStyle || (o.dress ? 'long' : 'short'); if (hs === 'long') {g.fillStyle = o.hair || '#2a1e1a'; rect(g, -9.5 * s, hy2 - 8 * s, 19 * s, 28 * s, 8 * s);}
    g.fillStyle = shade(g, 0, hy2 - 9 * s, 0, hy2 + 9 * s, skin, 'rgba(160,100,70,1)'); circ(g, 0, hy2, 9 * s); g.fillStyle = skin; circ(g, 0, hy2 - .5 * s, 8.6 * s);
    g.fillStyle = o.hair || '#2a1e1a'; g.beginPath(); g.arc(0, hy2 - 1.5 * s, 9.4 * s, Math.PI * 1.02, TAU * 1.0 - .02); g.lineTo(6 * s, hy2 - 3 * s); g.quadraticCurveTo(0, hy2 - 7 * s, -6 * s, hy2 - 3 * s); g.fill();
    if (hs === 'bun') circ(g, 0, hy2 - 11 * s, 4 * s);
    if (o.cap) {g.fillStyle = o.cap; g.beginPath(); g.arc(0, hy2 - 2 * s, 9.8 * s, Math.PI, TAU); g.fill(); g.fillRect(-1 * s, hy2 - 3 * s, 13 * s, 2.6 * s); g.fillStyle = '#e8c040'; circ(g, 3 * s, hy2 - 7 * s, 1.6 * s);}
    /* лицо */
    const bl = Math.sin(t * 1.7 + (o.seed || 0)) > .96 ? .15 : 1, ex = 3.4 * s, ey = hy2 + .6 * s, rE = 1.9 * s; g.fillStyle = '#fff'; [-1, 1].forEach(a => {g.beginPath(); g.ellipse(a * ex + .8 * s, ey, rE, rE * bl, 0, 0, TAU); g.fill();}); g.fillStyle = '#1a1420'; [-1, 1].forEach(a => {g.beginPath(); g.ellipse(a * ex + 1.5 * s, ey, 1 * s, 1.1 * s * bl, 0, 0, TAU); g.fill();});
    g.strokeStyle = o.hair || '#2a1e1a'; g.lineWidth = 1.1 * s; g.lineCap = 'round'; const by = ey - 3 * s, ang = mood === 'sad' ? -1 : mood === 'angry' ? 1 : mood === 'shock' ? -.2 : 0; [-1, 1].forEach(a => {g.beginPath(); g.moveTo(a * ex + .8 * s - 2 * s, by - (mood === 'shock' ? 1.5 * s : 0) + a * ang * -1.2 * s * -1); g.lineTo(a * ex + .8 * s + 2 * s, by - (mood === 'shock' ? 1.5 * s : 0) + a * ang * 1.2 * s * -1); g.stroke();});
    g.strokeStyle = '#8a3a3a'; g.fillStyle = '#7a2a2a'; g.lineWidth = 1.2 * s; const my = hy2 + 4.8 * s, mx = 1 * s;
    if (mood === 'happy') {g.beginPath(); g.arc(mx, my - 1.2 * s, 2.8 * s, .15, Math.PI - .15); g.stroke();} else if (mood === 'open') {g.beginPath(); g.ellipse(mx, my, 2 * s, 2.3 * s * (.7 + .3 * Math.abs(Math.sin(t * 8))), 0, 0, TAU); g.fill();} else if (mood === 'sad') {g.beginPath(); g.arc(mx, my + 2 * s, 2.4 * s, Math.PI + .3, TAU - .3); g.stroke();} else if (mood === 'shock') {g.beginPath(); g.ellipse(mx, my, 1.4 * s, 1.8 * s, 0, 0, TAU); g.fill();} else {g.beginPath(); g.moveTo(mx - 2 * s, my); g.lineTo(mx + 2 * s, my); g.stroke();}
    if (mood === 'happy' || mood === 'open') {g.fillStyle = 'rgba(255,120,120,.28)'; circ(g, -5.5 * s + 1 * s, my - 1.5 * s, 2 * s); circ(g, 6 * s + 1 * s, my - 1.5 * s, 2 * s);}
    if (o.veil) {g.fillStyle = 'rgba(255,255,255,.55)'; g.beginPath(); g.moveTo(-9 * s, hy2 - 6 * s); g.quadraticCurveTo(-26 * s, -h * .5, -14 * s, -h * .2); g.lineTo(0, -h * .5); g.fill();}
    g.restore();
  }
  window.__person = person;
  /* здание */
  function building(g, x, base, w, h, col, win, seed, t) {g.fillStyle = col; g.fillRect(x, base - h, w, h + 90); if (win) for (let yy = base - h + 8, r = 0; yy < base - 10; yy += 15, r++) for (let xx = x + 7, c = 0; xx < x + w - 10; xx += 15, c++) {const on = hr(seed + r * 13 + c * 7) > .45; if (!on) continue; const fl = t !== undefined && hr(seed + r + c + Math.floor(t * 1.2)) > .985; g.fillStyle = fl ? 'rgba(255,255,255,.2)' : win; g.fillRect(xx, yy, 7, 8);}}
  function skyline(g, t, sp, base, col, win, seed, minh, maxh) {let x = -((t * sp) % 1000) - 40; for (let k = 0; k < 3; k++) for (let i = 0; i < 12; i++) {const w = 54 + hr(seed + i) * 44, h = (minh || 50) + hr(seed + i * 3) * ((maxh || 150) - (minh || 50)); building(g, x, base, w, h, col, win, seed + i, t); x += w + 6;}}
  function car(g, x, y, s, col, o) {
    o = o || {}; g.save(); g.translate(x, y); g.scale(s * (o.dir || 1), s); g.fillStyle = 'rgba(0,0,0,.3)'; g.beginPath(); g.ellipse(0, 2, 56, 7, 0, 0, TAU); g.fill();
    if (o.lights) {glow(g, 58, -14, 70, 'rgba(255,240,180,A)', .5);}
    g.fillStyle = col; rect(g, -54, -26, 108, 20, 8); if (!o.conv) {g.beginPath(); g.moveTo(-30, -26); g.lineTo(-18, -44); g.lineTo(22, -44); g.lineTo(36, -26); g.fill(); g.fillStyle = 'rgba(190,225,255,.85)'; g.beginPath(); g.moveTo(-24, -27); g.lineTo(-15, -41); g.lineTo(-1, -41); g.lineTo(-1, -27); g.fill(); g.beginPath(); g.moveTo(3, -27); g.lineTo(3, -41); g.lineTo(20, -41); g.lineTo(31, -27); g.fill();} else {g.fillStyle = 'rgba(190,225,255,.8)'; g.beginPath(); g.moveTo(14, -26); g.lineTo(24, -38); g.lineTo(28, -26); g.fill();}
    if (o.stripe) {g.fillStyle = o.stripe; g.fillRect(-52, -17, 104, 5);} if (o.bar) {const f = Math.floor((o.t || 0) * 6) % 2; g.fillStyle = f ? '#ff2a3a' : '#2a6aff'; g.fillRect(-14, -50, 12, 6); g.fillStyle = f ? '#2a6aff' : '#ff2a3a'; g.fillRect(2, -50, 12, 6);}
    g.fillStyle = '#ffe9a0'; g.fillRect(50, -22, 5, 6); g.fillStyle = '#d33'; g.fillRect(-55, -22, 4, 6);
    [-32, 32].forEach(wx => {g.fillStyle = '#111'; circ(g, wx, -4, 11); g.fillStyle = '#bbb'; circ(g, wx, -4, 5); g.strokeStyle = '#555'; g.lineWidth = 2; g.beginPath(); const a = (o.t || 0) * 12; g.moveTo(wx + Math.cos(a) * 5, -4 + Math.sin(a) * 5); g.lineTo(wx - Math.cos(a) * 5, -4 - Math.sin(a) * 5); g.stroke();});
    g.restore();
  }
  /* субтитры */
  function cap(g, text, t, t0, sub) {
    if (t < t0) return; const n = Math.min(text.length, Math.floor((t - t0) * 24)), a = clamp((t - t0) * 3, 0, 1); g.save(); g.globalAlpha = a; g.font = '800 21px sans-serif'; g.textAlign = 'center'; const w = Math.max(160, g.measureText(text).width + 36); g.fillStyle = 'rgba(0,0,0,.55)'; rect(g, W / 2 - w / 2, 30, w, 38, 10); g.fillStyle = '#fff'; g.shadowColor = '#000'; g.shadowBlur = 6; g.fillText(text.slice(0, n), W / 2, 56); if (sub && t > t0 + 1.5) {g.font = '600 13px sans-serif'; g.fillStyle = '#ffd7a0'; g.fillText(sub, W / 2, 86);} g.restore();
  }
  const rain = (g, t, n, a, sp) => {g.strokeStyle = 'rgba(170,190,230,' + (a || .35) + ')'; g.lineWidth = 1.2; for (let i = 0; i < n; i++) {const x = hr(i) * W * 1.1, y = (hr(i + 50) * H + t * (sp || 600)) % H; g.beginPath(); g.moveTo(x, y); g.lineTo(x - 5, y + 15); g.stroke();}};
  const shake = (g, k) => {if (k > 0) g.translate((Math.random() - .5) * 8 * k, (Math.random() - .5) * 8 * k);};
  /* ======== ОБЫСК ======== */
  E.raid = function (g, t) {
    sky(g, '#04050e', '#171028'); g.fillStyle = 'rgba(255,255,255,.7)'; for (let i = 0; i < 40; i++) g.fillRect(hr(i) * W, hr(i + 9) * 150, 1.5, 1.5);
    skyline(g, 0, 0, 250, '#0d0d1c', '#c9a55a', 3, 70, 190); skyline(g, 0, 0, 265, '#090914', '#7a6a3a', 17, 40, 120);
    const f = Math.floor(t * 5) % 2, col = f ? 'rgba(255,40,60,A)' : 'rgba(50,110,255,A)', sh = t > 3.1 && t < 3.5 ? 1 - (t - 3.1) / .4 : 0; g.save(); shake(g, sh);
    building(g, 470, 270, 190, 210, '#262638', '#ffd36a', 77, t); g.fillStyle = '#ffd36a'; g.font = '800 14px sans-serif'; g.textAlign = 'center'; g.fillText('КОНТОРА', 565, 98); g.fillStyle = '#14141c'; g.fillRect(540, 232, 50, 40);
    g.restore(); g.fillStyle = '#16161e'; g.fillRect(0, 268, W, 100); g.fillStyle = 'rgba(255,255,255,.06)'; g.fillRect(0, 268, W, 3);
    glow(g, 540, 200, 330, col, .22); glow(g, 100, 300, 260, f ? 'rgba(50,110,255,A)' : 'rgba(255,40,60,A)', .18);
    g.save(); g.globalCompositeOperation = 'lighter'; [[60, .6], [380, -.5]].forEach(([bx, ph], i) => {g.save(); g.translate(bx, 290); g.rotate(Math.sin(t * 1.2 + i * 2) * .4 + (i ? -.2 : .2)); const q = g.createLinearGradient(0, 0, 0, -330); q.addColorStop(0, 'rgba(255,255,230,.35)'); q.addColorStop(1, 'rgba(255,255,230,0)'); g.fillStyle = q; g.beginPath(); g.moveTo(-7, 0); g.lineTo(-62, -330); g.lineTo(62, -330); g.lineTo(7, 0); g.fill(); g.restore();}); g.restore();
    const p = ease(clamp(t / 1.6, 0, 1)); car(g, lerp(-160, 250, p), 300, 1.15, '#f3f3f6', {stripe: '#2a4fb0', bar: 1, t, lights: 1}); car(g, lerp(-300, 120, p), 312, 1.0, '#eee', {stripe: '#2a4fb0', bar: 1, t, lights: 1}); car(g, lerp(-440, 380, p), 305, 1.05, '#1b2a55', {bar: 1, t, lights: 1});
    if (t > 1.8) for (let i = 0; i < 5; i++) {const k = clamp((t - 1.8 - i * .15) / 1.1, 0, 1); person(g, lerp(300 + i * 18, 520 + (i % 3) * 18, ease(k)), 296 + (i % 2) * 6, 1.15, {col: '#1c3a7a', cap: '#102050', walk: 14, t, pants: '#141c30', mood: 'angry', seed: i, tie: '#e8c040'});}
    if (t > 3.1) {g.fillStyle = 'rgba(255,255,255,' + Math.max(0, .55 - (t - 3.1) * .8) + ')'; g.fillRect(0, 0, W, H);}
    if (t > 3.6) for (let i = 0; i < 3; i++) person(g, lerp(560, 330 + i * 40, ease(clamp((t - 3.6 - i * .2) / 1.4, 0, 1))), 300, 1.1, {col: '#8a5a3a', box: i < 2, walk: 8, t, dir: -1, mood: 'sad', seed: i});
    rain(g, t, 60, .18); cap(g, '05:47 — ОБЫСК', t, .9, 'Компьютеры изъяты. Все счета заблокированы.');
  };
  /* ======== УВОЛЕН ======== */
  E.fired = function (g, t) {
    sky(g, '#232838', '#12141e'); g.fillStyle = '#2b2f40'; g.fillRect(0, 268, W, 100); g.fillStyle = '#1b1e2c'; g.fillRect(0, 0, W, 268);
    for (let i = 0; i < 3; i++) {g.fillStyle = '#0d1226'; g.fillRect(40 + i * 150, 50, 110, 140); g.fillStyle = 'rgba(120,150,220,.2)'; g.fillRect(40 + i * 150, 50, 110, 140); g.strokeStyle = '#3a3f58'; g.lineWidth = 3; g.strokeRect(40 + i * 150, 50, 110, 140);}
    g.save(); g.beginPath(); for (let i = 0; i < 3; i++) g.rect(40 + i * 150, 50, 110, 140); g.clip(); rain(g, t, 40, .35, 500); g.restore();
    g.fillStyle = '#4a3624'; rect(g, 90, 240, 190, 16, 3); g.fillRect(100, 256, 8, 14); g.fillRect(262, 256, 8, 14); g.fillStyle = '#222'; rect(g, 130, 205, 56, 36, 3); g.fillStyle = '#6ac'; g.fillRect(134, 209, 48, 24);
    g.fillStyle = '#12090a'; g.fillRect(520, 70, 150, 200); glow(g, 600, 170, 150, 'rgba(255,230,160,A)', .15 * (t < 3.4 ? 1 : Math.max(0, 1 - (t - 3.4) * 2)));
    const sh = t > 3.4 && t < 3.8 ? 1 - (t - 3.4) / .4 : 0; g.save(); shake(g, sh); if (t < 3.4) {g.fillStyle = '#05050a'; g.fillRect(528, 78, 134, 192); person(g, 600, 270, 1.35, {col: '#111118', skin: '#222', hair: '#000', pants: '#0a0a10', dir: -1, mood: 'angry'});} else {g.fillStyle = '#4a2e1c'; rect(g, 524, 74, 142, 196, 3); g.fillStyle = '#d9a640'; circ(g, 640, 175, 5);} g.restore();
    const p = clamp((t - .5) / 2.9, 0, 1); const x = lerp(170, 470, ease(p)); if (t < 3.8) person(g, x, 270, 1.7, {col: '#4a6ab0', box: true, walk: p > 0 && p < 1 ? 9 : 0, t, hair: '#3a2a20', mood: 'sad', tie: '#b03a3a'});
    if (t > .6) for (let i = 0; i < 6; i++) {const k = clamp((t - .6 - i * .25) / 2, 0, 1); g.save(); g.translate(120 + i * 70 + Math.sin(t * 2 + i) * 12, lerp(100, 255, k)); g.rotate(Math.sin(t * 2 + i) * .5); g.fillStyle = 'rgba(245,245,250,' + (1 - k * .7) + ')'; g.fillRect(-8, -10, 16, 20); g.restore();}
    if (t > 3.4) {g.fillStyle = 'rgba(255,255,255,' + Math.max(0, .4 - (t - 3.4) * .6) + ')'; g.fillRect(0, 0, W, H);} if (Math.sin(t * 1.1 + 2) > .993) {g.fillStyle = 'rgba(210,225,255,.4)'; g.fillRect(0, 0, W, H);}
    cap(g, '«Ты нам больше не нужен»', t, 1.1, 'Конторе нужны цифры, а не люди.');
  };
  /* ======== ПУСТОТА ======== */
  E.conscience = function (g, t) {
    const gr = clamp(1 - t / 8, 0, 1); sky(g, '#1b1b22', '#08080c'); const sat = gr;
    for (let i = 0; i < 46; i++) {const x = hr(i) * W, k = (t * (.1 + hr(i + 4) * .3) + hr(i + 8)) % 1; g.fillStyle = 'rgba(' + (150 + sat * 80 | 0) + ',150,160,' + (.5 * (1 - k)) + ')'; g.font = (11 + hr(i + 2) * 16) + 'px monospace'; g.fillText(['₴', '0', '1', '$', '%', '€', '7'][i % 7], x, k * H);}
    for (let i = 0; i < 6; i++) person(g, 80 + i * 120, 290, .95, {col: '#44444e', pants: '#2a2a30', skin: '#555', hair: '#222', alpha: Math.max(0, .35 - t * .035 - i * .03)});
    const hb = Math.max(0, Math.sin(t * 5.2 / (1 + t * .12))); glow(g, 360, 240, 220, 'rgba(180,190,255,A)', .08 * gr + hb * .04);
    person(g, 360, 296, 2.0, {col: '#5a5a70', pants: '#303040', skin: '#8a7a70', hair: '#222', alpha: .25 + .75 * gr, mood: 'flat', t, tie: '#444'});
    const ring = Math.sin(t * 9) > 0, sh = Math.sin(t * 45) * 3 * (1 - gr) * (ring ? 1 : 0); g.save(); g.translate(360 + sh, 120); g.fillStyle = ring ? 'rgba(255,255,255,' + (.5 + .5 * gr) + ')' : 'rgba(255,255,255,.12)'; rect(g, -13, -22, 26, 44, 5); g.fillStyle = '#10141c'; g.fillRect(-10, -18, 20, 30); if (ring) {glow(g, 0, 0, 90, 'rgba(120,200,255,A)', .28 * gr + .05);} g.restore();
    g.fillStyle = 'rgba(0,0,0,' + clamp(t * .11, 0, .85) + ')'; g.fillRect(0, 0, W, H); g.fillStyle = 'rgba(0,0,0,' + hb * .12 + ')'; g.fillRect(0, 0, W, H);
    cap(g, 'Ты больше не помнишь имён', t, 1.2, 'Только суммы.');
  };
  /* ======== СВИДЕТЕЛЬ ======== */
  E.whistle = function (g, t) {
    const d = clamp(t / 3.5, 0, 1); sky(g, 'rgb(' + (36 + d * 190 | 0) + ',' + (50 + d * 130 | 0) + ',' + (110 + d * 20 | 0) + ')', 'rgb(255,' + (180 + d * 50 | 0) + ',' + (120 + d * 90 | 0) + ')');
    const sx = 360, sy = lerp(290, 160, ease(d)); g.fillStyle = '#fff6c8'; circ(g, sx, sy, 52); glow(g, sx, sy, 420, 'rgba(255,235,170,A)', .45 * d);
    g.save(); g.translate(sx, sy); for (let i = 0; i < 14; i++) {g.rotate(TAU / 14); g.fillStyle = 'rgba(255,255,210,' + .08 * d + ')'; g.beginPath(); g.moveTo(0, 0); g.lineTo(520, -22 - Math.sin(t * 1.5 + i) * 6); g.lineTo(520, 22 + Math.sin(t * 1.5 + i) * 6); g.fill();} g.restore();
    skyline(g, t, 10, 262, '#4a3a68', '#ffd58a', 5, 60, 160); skyline(g, t, 22, 290, '#2c2146', null, 11, 40, 100);
    g.fillStyle = '#d8cfc0'; g.fillRect(420, 150, 240, 20); for (let i = 0; i < 5; i++) g.fillRect(432 + i * 48, 170, 18, 100); g.beginPath(); g.moveTo(410, 150); g.lineTo(540, 100); g.lineTo(670, 150); g.fill(); g.fillStyle = '#b8ac9a'; for (let i = 0; i < 4; i++) g.fillRect(400 - i * 6, 270 + i * 8, 280 + i * 12, 8);
    g.fillStyle = '#2a2430'; g.fillRect(0, 300, W, 70);
    const p = clamp(t / 4, 0, 1); person(g, lerp(60, 470, ease(p)), 296 - (p > .75 ? (p - .75) * 160 * .35 : 0), 1.8, {col: '#3a5a98', folder: true, walk: p < 1 ? 9 : 0, t, up: p >= 1, mood: p >= 1 ? 'happy' : 'flat', tie: '#c8a030'});
    if (t > 4) {const s = clamp((t - 4) * 1.2, 0, 1); g.save(); g.globalAlpha = s; g.translate(540, 70); g.scale(.6 + s * .4, .6 + s * .4); g.fillStyle = '#2a60d0'; g.beginPath(); g.moveTo(0, -34); g.lineTo(30, -22); g.lineTo(26, 14); g.lineTo(0, 36); g.lineTo(-26, 14); g.lineTo(-30, -22); g.fill(); g.fillStyle = '#fff'; g.font = '800 30px sans-serif'; g.textAlign = 'center'; g.fillText('✓', 0, 10); g.restore(); glow(g, 540, 70, 130, 'rgba(120,180,255,A)', .5 * s);}
    for (let i = 0; i < 5; i++) {const x = ((t * (50 + i * 9) + i * 170) % 900) - 60, y = 70 + i * 28 + Math.sin(t * 3 + i) * 10; g.fillStyle = '#fff'; g.beginPath(); g.ellipse(x, y, 9, 3.5, 0, 0, TAU); g.fill(); g.beginPath(); g.moveTo(x - 2, y); g.lineTo(x - 8, y - 9 * Math.sin(t * 14 + i)); g.lineTo(x + 5, y); g.fill();}
    for (let i = 0; i < 26; i++) {const k = (t * .3 + hr(i)) % 1; g.fillStyle = 'rgba(255,255,220,' + (1 - k) * d + ')'; circ(g, hr(i + 3) * W, 330 - k * 300, 1.5 + hr(i + 7) * 2);}
    if (t > 3.4 && t < 3.9) {g.fillStyle = 'rgba(255,255,255,' + (1 - (t - 3.4) / .5) * .5 + ')'; g.fillRect(0, 0, W, H);}
    cap(g, 'Ты выбрал правильную сторону', t, 1.5, 'Страшно, но честно.');
  };
  /* ======== ДЕНЬГИ ЕСТЬ ======== */
  E.rich = function (g, t) {
    sky(g, '#ff4f86', '#ffc766'); g.fillStyle = '#fff2b0'; circ(g, 520, 180 + t * 4, 70); glow(g, 520, 180, 380, 'rgba(255,200,120,A)', .5);
    skyline(g, t, 14, 262, '#8a3a7a', null, 21, 60, 170); skyline(g, t, 40, 290, '#4a2054', '#ffd070', 8, 50, 130);
    for (let i = 0; i < 5; i++) {const x = ((i * 200 - t * 300) % 1000 + 1000) % 1000 - 60; g.strokeStyle = '#2a1030'; g.lineWidth = 5; g.beginPath(); g.moveTo(x, 300); g.quadraticCurveTo(x + 4, 250, x + 2, 210); g.stroke(); g.fillStyle = '#1e5a40'; for (let k = 0; k < 6; k++) {g.save(); g.translate(x + 2, 210); g.rotate(-1.2 + k * .5); g.beginPath(); g.ellipse(22, 0, 24, 5, 0, 0, TAU); g.fill(); g.restore();}}
    g.fillStyle = '#1e1c26'; g.fillRect(0, 300, W, 70); g.fillStyle = '#e8d060'; for (let i = -1; i < 14; i++) g.fillRect(((i * 90 - t * 640) % 1260 + 1260) % 1260 - 90, 336, 50, 5);
    for (let i = 0; i < 12; i++) {g.fillStyle = 'rgba(255,255,255,' + (.18 - i * .014) + ')'; g.fillRect(lerp(60, 340, ease(clamp(t / 3, 0, 1))) - 60 - i * 26, 322 + (i % 3) * 3, 34, 3);}
    const cx = lerp(60, 340, ease(clamp(t / 3, 0, 1))) + Math.sin(t * 2) * 8; car(g, cx, 326 + Math.sin(t * 26) * 1, 1.5, '#d8233a', {conv: 1, t, stripe: '#fff', lights: 0}); person(g, cx + 8, 296, .8, {col: '#f2f2f2', hair: '#2a1a10', mood: 'happy', t}); g.fillStyle = '#e8c0a0';
    for (let i = 0; i < 22; i++) {const k = (t * .5 + i / 22) % 1, x = (i * 71 + t * 55) % W, y = 10 + k * 300; g.save(); g.translate(x, y); g.rotate(t * 2 + i); if (i % 3) {g.fillStyle = '#5ac879'; g.fillRect(-11, -6, 22, 12); g.fillStyle = '#2a8a4a'; g.fillRect(-4, -3, 8, 6);} else {g.fillStyle = '#ffd24a'; circ(g, 0, 0, 7); g.fillStyle = '#c89a1a'; circ(g, 0, 0, 4);} g.restore();}
    glow(g, lerp(60, 340, ease(clamp(t / 3, 0, 1))) + 70, 300, 120, 'rgba(255,240,180,A)', .25);
    cap(g, 'ДЕНЬГИ ЕСТЬ', t, 1.4, 'Но телефон с незнакомого номера до сих пор пугает.');
  };
  /* ======== КОНЕЦ СМЕНЫ ======== */
  E.survive = function (g, t) {
    const d = clamp(t / 5, 0, 1); sky(g, 'rgb(' + (36 + d * 140 | 0) + ',' + (66 + d * 110 | 0) + ',' + (126 + d * 70 | 0) + ')', 'rgb(255,' + (160 + d * 70 | 0) + ',' + (100 + d * 90 | 0) + ')');
    const sy = lerp(320, 170, ease(d)); g.fillStyle = '#fff4c4'; circ(g, 360, sy, 48); glow(g, 360, sy, 360, 'rgba(255,230,160,A)', .5 * d);
    for (let i = 0; i < 4; i++) {const x = ((t * (10 + i * 4) + i * 210) % 900) - 100, y = 70 + i * 34; g.fillStyle = 'rgba(255,255,255,.75)'; [0, 26, 52].forEach((o, k) => {g.beginPath(); g.ellipse(x + o, y - (k === 1 ? 8 : 0), 30, 14, 0, 0, TAU); g.fill();});}
    skyline(g, t, 8, 270, '#3a4a76', null, 2, 70, 170); skyline(g, t, 18, 296, '#283252', '#ffd890', 5, 50, 120);
    g.fillStyle = '#2c2c3a'; g.fillRect(0, 306, W, 64); g.fillStyle = '#383850'; g.fillRect(0, 306, W, 4);
    for (let i = 0; i < 6; i++) {const x = ((i * 170 - t * 50) % 1020 + 1020) % 1020 - 60; g.fillStyle = '#5a3a24'; g.fillRect(x - 4, 250, 8, 56); g.fillStyle = '#2f7a4a'; circ(g, x, 240, 30); g.fillStyle = '#3c9a5a'; circ(g, x - 12, 250, 20); circ(g, x + 14, 248, 20);}
    const p = clamp(t / 6, 0, 1), px = lerp(60, 600, p); g.fillStyle = 'rgba(0,0,0,.18)'; g.beginPath(); g.ellipse(px - 70 * d, 312, 80 * d + 10, 6, 0, 0, TAU); g.fill(); person(g, px, 318, 1.8, {col: '#c8683a', walk: 8, t, hair: '#3a2a20', mood: d > .6 ? 'happy' : 'flat'});
    for (let i = 0; i < 4; i++) {const x = ((t * (70 + i * 10) + i * 230) % 840) - 60, y = 80 + i * 26 + Math.sin(t * 4 + i) * 8; g.strokeStyle = '#1a1a2a'; g.lineWidth = 2; g.beginPath(); g.moveTo(x - 9, y + Math.sin(t * 14 + i) * 5); g.quadraticCurveTo(x, y - 5, x + 9, y + Math.sin(t * 14 + i) * 5); g.stroke();}
    if (t > 1) {const a = clamp(t - 1, 0, 1); g.save(); g.translate(0, 70); g.globalAlpha = a; g.fillStyle = 'rgba(255,255,255,.9)'; rect(g, 300, 40, 120, 74, 8); g.fillStyle = '#d33'; rect(g, 300, 40, 120, 18, 8); g.fillStyle = '#222'; g.font = '800 30px sans-serif'; g.textAlign = 'center'; g.fillText('45', 360, 94); g.font = '700 11px sans-serif'; g.fillText('ДЕНЬ', 360, 54); g.fillStyle = '#fff'; g.restore();}
    cap(g, 'КОНЕЦ СМЕНЫ', t, 1.6, 'Ты жив и на свободе. Но ради чего?');
  };
  /* ======== СВАДЬБА ======== */
  SC.wed = function (g, t) {
    sky(g, '#ffc4de', '#fff1cf'); glow(g, 560, 70, 200, 'rgba(255,255,220,A)', .25); g.fillStyle = '#fffbe0'; circ(g, 560, 70, 34);
    for (let i = 0; i < 4; i++) {const x = ((t * (8 + i * 3) + i * 220) % 900) - 100, y = 50 + i * 36; g.fillStyle = 'rgba(255,255,255,.85)'; [0, 28, 56].forEach((o, k) => {g.beginPath(); g.ellipse(x + o, y - (k === 1 ? 9 : 0), 32, 15, 0, 0, TAU); g.fill();});}
    g.fillStyle = '#9ad28a'; g.fillRect(0, 290, W, 80); g.fillStyle = '#7ab86a'; for (let i = 0; i < 36; i++) g.fillRect(i * 22, 290 + hr(i) * 6, 14, 3);
    g.fillStyle = '#f2ece0'; rect(g, 250, 130, 220, 160, 4); g.fillStyle = '#b9674a'; g.beginPath(); g.moveTo(232, 134); g.lineTo(360, 60); g.lineTo(488, 134); g.fill(); g.fillStyle = '#f2ece0'; rect(g, 330, 40, 60, 100, 3); g.fillStyle = '#b9674a'; g.beginPath(); g.moveTo(322, 44); g.lineTo(360, 6); g.lineTo(398, 44); g.fill(); g.fillStyle = '#d6a640'; g.fillRect(358, -6, 4, 22); g.fillRect(351, 0, 18, 4);
    g.fillStyle = '#6a4a8a'; g.beginPath(); g.moveTo(330, 290); g.lineTo(330, 240); g.arc(360, 240, 30, Math.PI, 0); g.lineTo(390, 290); g.fill(); g.fillStyle = '#9ad0ff'; circ(g, 360, 96, 14); [285, 435].forEach(x => {g.fillStyle = '#8ac8ff'; rect(g, x - 14, 170, 28, 50, 14);});
    const sw = Math.floor(t * 3) % 2; [340, 380].forEach(x => {g.fillStyle = '#e8c060'; g.fillRect(x, 24, 6, 14);}); 
    const p = ease(clamp(t / 3.2, 0, 1)); person(g, lerp(80, 322, p), 296, 1.9, {col: '#1c1c2a', pants: '#14141e', walk: p < 1 ? 9 : 0, t, hair: '#2a1a10', mood: 'happy', tie: '#e8e8f0'}); person(g, lerp(640, 398, p), 296, 1.9, {col: '#fff', dress: '#fff', veil: true, walk: p < 1 ? 9 : 0, t, hair: '#6a3a1a', dir: -1, mood: 'happy'});
    if (t > 3.2) {const k = clamp((t - 3.2) * 1.5, 0, 1); g.save(); g.translate(360, 190 - Math.sin(t * 3) * 4); g.scale(k, k); g.strokeStyle = '#ffd24a'; g.lineWidth = 6; g.beginPath(); g.arc(-8, 0, 14, 0, TAU); g.stroke(); g.beginPath(); g.arc(8, 0, 14, 0, TAU); g.stroke(); g.restore(); glow(g, 360, 190, 90, 'rgba(255,230,140,A)', .3 * k);
      for (let i = 0; i < 9; i++) {const kk = (t * .4 + i / 9) % 1; g.save(); g.translate(360 + Math.sin(t * 2 + i) * 60, 190 - kk * 150); g.scale(1 - kk * .4, 1 - kk * .4); g.globalAlpha = 1 - kk; g.fillStyle = '#ff5a8a'; circ(g, -5, -3, 6); circ(g, 5, -3, 6); g.beginPath(); g.moveTo(-11, 0); g.lineTo(11, 0); g.lineTo(0, 14); g.fill(); g.restore();}
      for (let i = 0; i < 60; i++) {const kk = (t * (.25 + (i % 5) * .05) + (i * .618) % 1) % 1; g.save(); g.translate((i * 97 + i * i * 13) % W, -10 + kk * 330); g.rotate(t * 2 + i); g.fillStyle = ['#ff7aa8', '#ffd24a', '#ffffff', '#ff9a6a'][i % 4]; g.fillRect(-3, -2, 7, 4); g.restore();}}
    for (let i = 0; i < 3; i++) {const x = ((t * 60 + i * 270) % 840) - 60, y = 90 + i * 24 + Math.sin(t * 3 + i) * 8; g.fillStyle = '#fff'; g.beginPath(); g.ellipse(x, y, 10, 4, 0, 0, TAU); g.fill(); g.beginPath(); g.moveTo(x - 2, y); g.lineTo(x - 9, y - 10 * Math.sin(t * 14 + i)); g.lineTo(x + 6, y); g.fill();}
    cap(g, 'Совет да любовь!', t, 1.2);
  };
  /* ======== КОРПОРАТИВ ======== */
  SC.party = function (g, t) {
    sky(g, '#1c0a3a', '#08041a'); const hue = t * 90, beat = Math.max(0, Math.sin(t * Math.PI * 2 * 2.03)), b2 = beat * beat;
    g.save(); g.globalCompositeOperation = 'lighter'; for (let i = 0; i < 7; i++) {g.save(); g.translate(30 + i * 110, -10); g.rotate(Math.sin(t * 1.6 + i * 1.3) * .55); const q = g.createLinearGradient(0, 0, 0, 380), col = 'hsla(' + ((hue + i * 55) % 360) + ',100%,62%,'; q.addColorStop(0, col + (.5 + b2 * .3) + ')'); q.addColorStop(1, col + '0)'); g.fillStyle = q; g.beginPath(); g.moveTo(-5, 0); g.lineTo(-56, 380); g.lineTo(56, 380); g.lineTo(5, 0); g.fill(); g.restore();} g.restore();
    g.fillStyle = '#17102e'; g.fillRect(0, 290, W, 80); for (let i = 0; i < 12; i++) {g.fillStyle = 'hsla(' + ((hue + i * 30) % 360) + ',90%,55%,' + (.45 + b2 * .4) + ')'; g.fillRect(i * 60, 292, 56, 8);}
    g.fillStyle = '#0a0618'; rect(g, 540, 250, 150, 46, 4); g.fillStyle = '#333'; circ(g, 590, 262, 14); circ(g, 640, 262, 14); g.strokeStyle = '#888'; g.lineWidth = 1; [590, 640].forEach(x => {g.beginPath(); g.arc(x, 262, 8 + Math.sin(t * 6) * 2, 0, TAU); g.stroke();});
    g.save(); g.translate(360, 56); g.strokeStyle = '#555'; g.lineWidth = 2; g.beginPath(); g.moveTo(0, -60); g.lineTo(0, -34); g.stroke(); g.rotate(t * .8); g.fillStyle = '#c8d0e0'; circ(g, 0, 0, 34); for (let i = 0; i < 22; i++) {const a = i * TAU / 22 + t * .3; g.fillStyle = 'hsl(' + ((hue + i * 30) % 360) + ',90%,75%)'; g.fillRect(Math.cos(a) * 24 - 3, Math.sin(a * 2) * 24 - 3, 6, 6);} g.restore(); glow(g, 360, 56, 140, 'rgba(255,255,255,A)', .25 + b2 * .25);
    for (let i = 0; i < 30; i++) {const a = (t * .3 + i * .21) % TAU; g.fillStyle = 'hsla(' + ((hue + i * 40) % 360) + ',100%,70%,.7)'; circ(g, 360 + Math.cos(a * 2 + i) * 330, 150 + Math.sin(a + i) * 130 + 40, 2.2);}
    const COL = ['#e0508a', '#4ab0e0', '#f0c040', '#6ad08a', '#b070e0', '#e08a40', '#50d0c0'];
    COL.forEach((c, i) => {const x = 60 + i * 76, ph = t * 6 + i, hop = Math.abs(Math.sin(ph)) * 18; person(g, x, 304 - hop, 1.5, {col: c, up: i % 2 === 0, walk: 0, t: t + i, pants: '#221a3a', hair: ['#2a1a10', '#d8a040', '#111', '#6a3a1a'][i % 4], mood: i % 3 === 0 ? 'open' : 'happy', seed: i, hairStyle: i % 3 === 1 ? 'long' : i % 3 === 2 ? 'bun' : 'short'});});
    g.fillStyle = 'rgba(255,255,255,' + b2 * .08 + ')'; g.fillRect(0, 0, W, H);
    for (let i = 0; i < 40; i++) {const k = (t * .3 + hr(i)) % 1; g.fillStyle = 'hsl(' + ((i * 47 + hue) % 360) + ',90%,60%)'; g.save(); g.translate(hr(i + 5) * W, k * H); g.rotate(t * 2 + i); g.fillRect(-4, -2, 8, 4); g.restore();}
    cap(g, 'ЗОЛОТОЙ КОРПОРАТИВ', t, .9, 'Все за счёт фирмы. Пока что.');
  };

  /* ===== свечение (bloom) и киноплёнка ===== */
  let bc = null, bx = null, gn = null;
  function finish(g) {
    try {
      const cv = g.canvas; if (!bc) {bc = document.createElement('canvas'); bc.width = 120; bc.height = 60; bx = bc.getContext('2d'); gn = document.createElement('canvas'); gn.width = gn.height = 96; const q = gn.getContext('2d'), im = q.createImageData(96, 96); for (let i = 0; i < im.data.length; i += 4) {const v = Math.random() * 255; im.data[i] = im.data[i + 1] = im.data[i + 2] = v; im.data[i + 3] = 22;} q.putImageData(im, 0, 0);}
      g.save(); g.setTransform(1, 0, 0, 1, 0, 0); bx.clearRect(0, 0, 120, 60); bx.drawImage(cv, 0, 0, 120, 60); g.globalCompositeOperation = 'lighter'; g.globalAlpha = .07; g.drawImage(bc, 0, 0, cv.width, cv.height); g.globalCompositeOperation = 'source-over'; g.globalAlpha = .5; const ox = Math.floor(Math.random() * 96), oy = Math.floor(Math.random() * 96); g.fillStyle = g.createPattern(gn, 'repeat'); g.translate(-ox, -oy); g.fillRect(ox, oy, cv.width, cv.height); g.restore();
    } catch (e) {}
  }
  Object.keys(E).forEach(k => {const f = E[k]; if (typeof f === 'function') E[k] = function (g) {f.apply(this, arguments); finish(g);};});
  ['wed', 'party'].forEach(k => {const f = SC[k]; SC[k] = function (g) {f.apply(this, arguments); finish(g);};});
})();
