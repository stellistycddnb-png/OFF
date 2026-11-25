'use strict';
/* v131: кинематографичные концовки — анимация + музыка/звук. MADE BY PESSIMIST */
(function () {
  const W = 720, H = 360, hz = m => 440 * Math.pow(2, (m - 69) / 12);
  const rr = (s => () => (s = (s * 16807) % 2147483647) / 2147483647);
  /* ---------- аудио ---------- */
  let ctx = null, out = null, nb = null, vol = .9;
  const _sv = Snd.setVol; Snd.setVol = function (m, s) {vol = s; return _sv.apply(this, arguments);};
  function actx() {
    if (!ctx) {try {ctx = new (window.AudioContext || window.webkitAudioContext)();} catch (e) {return null;} nb = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate); const d = nb.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;}
    if (ctx.state !== 'running') ctx.resume(); return ctx;
  }
  function bus() {const c = actx(); if (!c) return null; const g = c.createGain(), k = c.createDynamicsCompressor(); g.gain.value = Math.min(1, vol) * .9; g.connect(k); k.connect(c.destination); return {c, g};}
  const T = {
    o(B, t, f, d, ty, v, f2, at) {const c = B.c, o = c.createOscillator(), g = c.createGain(); o.type = ty || 'sine'; o.frequency.setValueAtTime(f, t); if (f2) o.frequency.exponentialRampToValueAtTime(f2, t + d); const a = at || .01; g.gain.setValueAtTime(.0001, t); g.gain.linearRampToValueAtTime(v, t + a); g.gain.exponentialRampToValueAtTime(.0001, t + d); o.connect(g); g.connect(B.g); o.start(t); o.stop(t + d + .05);},
    n(B, t, d, v, ty, f0, f1) {const c = B.c, s = c.createBufferSource(), g = c.createGain(), f = c.createBiquadFilter(); s.buffer = nb; s.loop = true; f.type = ty || 'lowpass'; f.frequency.setValueAtTime(f0 || 800, t); if (f1) f.frequency.exponentialRampToValueAtTime(f1, t + d); g.gain.setValueAtTime(.0001, t); g.gain.linearRampToValueAtTime(v, t + Math.min(.03, d / 3)); g.gain.exponentialRampToValueAtTime(.0001, t + d); s.connect(f); f.connect(g); g.connect(B.g); s.start(t); s.stop(t + d + .05);},
    pad(B, t, notes, d, v, ty) {notes.forEach(m => {const c = B.c, o = c.createOscillator(), g = c.createGain(), l = c.createOscillator(), lg = c.createGain(); o.type = ty || 'triangle'; o.frequency.value = hz(m); l.frequency.value = 4.5; lg.gain.value = 3; l.connect(lg); lg.connect(o.detune); g.gain.setValueAtTime(.0001, t); g.gain.linearRampToValueAtTime(v, t + d * .35); g.gain.linearRampToValueAtTime(.0001, t + d); o.connect(g); g.connect(B.g); o.start(t); l.start(t); o.stop(t + d + .1); l.stop(t + d + .1);});},
    kick(B, t, v) {T.o(B, t, 150, .22, 'sine', v || .5, 40, .003);},
    hat(B, t, v) {T.n(B, t, .05, v || .05, 'highpass', 7000);},
    snare(B, t, v) {T.n(B, t, .14, v || .18, 'bandpass', 1800); T.o(B, t, 190, .08, 'triangle', .1, 120);},
    bell(B, t, m, v) {[[1, 1], [2.76, .4], [5.4, .2]].forEach(([k, a]) => T.o(B, t, hz(m) * k, 1.4 / k + .3, 'sine', (v || .1) * a));},
    key(B, t, m, d, v) {T.o(B, t, hz(m), d || .9, 'triangle', v || .12, 0, .005); T.o(B, t + .002, hz(m) * 2, (d || .9) * .5, 'sine', (v || .12) * .3);}
  };
  const MUS = {
    raid(B, t) {
      for (let i = 0; i < 9; i++) T.o(B, t + i * .62, 560, .6, 'sawtooth', .07, 920, .15);
      for (let i = 0; i < 16; i++) T.kick(B, t + i * .6, .18 + i * .025);
      T.pad(B, t, [33, 39, 45], 7, .06, 'sawtooth');
      [1.8, 2.0, 2.2].forEach(x => {T.n(B, t + x, .12, .35, 'lowpass', 300, 100); T.o(B, t + x, 90, .15, 'sine', .3, 50);});
      for (let i = 0; i < 6; i++) T.n(B, t + 1 + i * .7 + (i % 2) * .15, .12, .05, 'bandpass', 2200 + i * 300);
      T.n(B, t + 3.4, 1.4, .4, 'lowpass', 700, 60); T.o(B, t + 3.4, 60, 1.4, 'sine', .45, 25);
    },
    fired(B, t) {
      [69, 67, 65, 64, 62, 60, 57].forEach((m, i) => T.key(B, t + .4 + i * .9, m, 1.6, .13));
      T.pad(B, t, [45, 52, 57], 8, .045); T.pad(B, t + 4, [41, 48, 53], 5, .045);
      T.n(B, t, 8, .05, 'bandpass', 4000, 3000);
      T.n(B, t + 2.2, .25, .5, 'lowpass', 500, 80); T.o(B, t + 2.2, 80, .4, 'sine', .45, 35);
      T.n(B, t + 4.2, 2.4, .12, 'lowpass', 250, 60);
      [220, 208, 196, 147].forEach((f, i) => T.o(B, t + 5.4 + i * .3, f, .35, 'sawtooth', .06));
    },
    conscience(B, t) {
      T.pad(B, t, [28, 29, 40], 9, .08, 'sawtooth'); T.o(B, t, 55, 9, 'sine', .08);
      let x = 0, gap = .75, v = .3; for (let i = 0; i < 10; i++) {T.o(B, t + x, 62, .16, 'sine', v, 38); T.o(B, t + x + .18, 58, .14, 'sine', v * .8, 36); x += gap; gap *= 1.13; v *= .86;}
      for (let i = 0; i < 18; i++) T.n(B, t + i * .5, .02, .06 * (1 - i / 22), 'highpass', 5000);
      [1, 3.2, 6].forEach((x, i) => {for (let k = 0; k < 3; k++) {T.o(B, t + x + k * .13, 1400 - i * 260, .08, 'square', .06 / (i + 1), 1700 - i * 400); T.o(B, t + x + k * .13, 1700 - i * 300, .08, 'square', .045 / (i + 1));}});
      T.o(B, t + 7.5, 880, 3, 'sine', .04, 400);
    },
    whistle(B, t) {
      for (let i = 0; i < 30; i++) T.n(B, t + i * .09, .08, .03 + i * .004, 'lowpass', 400);
      T.o(B, t, 65, 2.6, 'sine', .3, 65);
      T.n(B, t + 2.7, 2.8, .22, 'highpass', 5000, 3000); T.o(B, t + 2.7, 65, 3, 'sine', .4, 40);
      [60, 64, 67, 72, 76, 79, 84, 79, 76, 72, 67, 64].forEach((m, i) => T.key(B, t + 2.7 + i * .17, m, .8, .09));
      T.pad(B, t + 1, [48, 55, 64], 4, .09); T.pad(B, t + 2.7, [48, 55, 60, 64, 67], 7, .08);
      [79, 83, 84].forEach((m, i) => T.bell(B, t + 3.2 + i * .5, m, .09));
      for (let i = 0; i < 12; i++) T.o(B, t + 3.5 + i * .3 + (i % 3) * .05, 2400 + (i * 137) % 1200, .12, 'sine', .035, 3600);
    },
    rich(B, t) {
      const bpm = 112, s = 60 / bpm / 4, bass = [40, -1, 40, 43, -1, 45, -1, 43, 40, -1, 40, 43, -1, 47, 45, 43];
      for (let bar = 0; bar < 4; bar++) for (let i = 0; i < 16; i++) {
        const x = t + (bar * 16 + i) * s; if (bass[i] >= 0) T.o(B, x, hz(bass[i]), s * 1.6, 'sawtooth', .13, 0, .005);
        if (i % 4 === 0) T.kick(B, x, .45); if (i === 4 || i === 12) T.snare(B, x); T.hat(B, x, i % 2 ? .035 : .06);
        if (i % 8 === 2 && bar > 0) T.pad(B, x, [64, 67, 71, 74], .7, .05, 'sine');
      }
      T.n(B, t + 1.1, 1.2, .25, 'bandpass', 200, 1400); T.n(B, t + 1.7, 1.2, .2, 'bandpass', 1400, 200);
      [3.0, 5.2].forEach(x => {T.o(B, t + x, 2093, .5, 'sine', .12); T.o(B, t + x + .05, 2637, .7, 'sine', .1); T.n(B, t + x, .08, .15, 'highpass', 6000);});
      for (let i = 0; i < 10; i++) T.o(B, t + 2 + i * .45, 1320 + (i % 3) * 220, .15, 'square', .035, 1760);
    },
    survive(B, t) {
      const mel = [65, 69, 72, 69, 74, 72, 69, 67, 65, 69, 72, 77, 76, 74, 72, 69];
      mel.forEach((m, i) => T.bell(B, t + .4 + i * .5, m + 12 * (i % 5 === 4 ? 0 : 0), .08));
      T.pad(B, t, [41, 48, 57], 5, .06); T.pad(B, t + 4.5, [43, 50, 59], 5, .06);
      for (let i = 0; i < 16; i++) T.n(B, t + i * .5, .05, .07, 'lowpass', 350);
      for (let i = 0; i < 7; i++) {const x = t + 1.5 + i * 1.1; T.o(B, x, 3000, .09, 'sine', .04, 4200); T.o(B, x + .12, 3400, .08, 'sine', .035, 4600); T.o(B, x + .22, 3100, .08, 'sine', .03, 4300);}
      T.o(B, t + 3, 98, 6, 'sine', .05);
    }
  };
  /* ---------- общие эффекты кадра ---------- */
  function post(g, t, k, pulse) {
    const v = g.createRadialGradient(W / 2, H / 2, 90, W / 2, H / 2, 470); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,0,' + (.55 + (pulse || 0)) + ')'); g.fillStyle = v; g.fillRect(0, 0, W, H);
    const bar = 22 * Math.min(1, t / .8); g.fillStyle = '#000'; g.fillRect(0, 0, W, bar); g.fillRect(0, H - bar, W, bar);
    if (t < .7) {g.fillStyle = 'rgba(0,0,0,' + (1 - t / .7) + ')'; g.fillRect(0, 0, W, H);}
  }
  const sky = (g, a, b) => {const q = g.createLinearGradient(0, 0, 0, H); q.addColorStop(0, a); q.addColorStop(1, b); g.fillStyle = q; g.fillRect(0, 0, W, H);};
  const em = (g, s, x, y, sz, a, rot) => {g.save(); if (a !== undefined) g.globalAlpha = a; g.translate(x, y); if (rot) g.rotate(rot); g.font = sz + 'px sans-serif'; g.textAlign = 'center'; g.fillStyle = '#fff'; g.fillText(s, 0, 0); g.restore();};
  const city = (g, t, sp, base, col, win, seed) => {const r = rr(seed || 7); g.fillStyle = col; const arr = []; for (let i = 0; i < 14; i++) arr.push([60 + r() * 40, 50 + r() * 110]); let x = -((t * sp) % 1100); for (let k = 0; k < 2; k++) for (const [w, h] of arr) {g.fillStyle = col; g.fillRect(x, base - h, w, h + 80); if (win) {g.fillStyle = win; for (let yy = base - h + 8; yy < base - 8; yy += 16) for (let xx = x + 8; xx < x + w - 12; xx += 18) if (((xx * 7 + yy * 3) | 0) % 5 > 1) g.fillRect(xx, yy, 7, 9);} x += w + 8;}};
  const road = (g, t, y, sp) => {g.fillStyle = '#1c1c24'; g.fillRect(0, y, W, H - y); g.fillStyle = '#3a3a48'; g.fillRect(0, y, W, 5); g.fillStyle = '#e8d060'; for (let i = -1; i < 14; i++) g.fillRect(((i * 90 - t * sp) % 1260 + 1260) % 1260 - 90, y + 40, 50, 5);};
  /* ---------- сцены ---------- */
  const S = {
    raid(g, t) {
      sky(g, '#05060f', '#1a1030'); city(g, 0, 0, 230, '#10101e', '#665533'); city(g, 0, 0, 250, '#0c0c18', '#443'); road(g, 0, 250, 0);
      const f = Math.floor(t * 5) % 2; g.fillStyle = f ? 'rgba(255,40,60,.3)' : 'rgba(40,100,255,.3)'; g.fillRect(0, 0, W, H);
      g.save(); g.globalCompositeOperation = 'lighter'; for (let i = 0; i < 2; i++) {const a = Math.sin(t * 1.3 + i * 2) * .6; g.save(); g.translate(120 + i * 380, 360); g.rotate(a); const q = g.createLinearGradient(0, 0, 0, -360); q.addColorStop(0, 'rgba(255,255,220,.35)'); q.addColorStop(1, 'rgba(255,255,220,0)'); g.fillStyle = q; g.beginPath(); g.moveTo(-8, 0); g.lineTo(-70, -360); g.lineTo(70, -360); g.lineTo(8, 0); g.fill(); g.restore();} g.restore();
      em(g, '🏢', 590, 245, 130);
      const p = Math.min(1, t / 1.4), ease = 1 - Math.pow(1 - p, 3); em(g, '🚓', -80 + ease * 400, 290, 78); em(g, '🚓', -200 + ease * 410, 300, 68); em(g, '🚐', -330 + ease * 390, 295, 70);
      em(g, f ? '🔴' : '🔵', 320 + ease * 0, 80, 26, .9);
      if (t > 1.8) for (let i = 0; i < 4; i++) em(g, '👮', 440 + i * 34 + Math.sin(t * 3 + i) * 2, 300, 38, Math.min(1, (t - 1.8) * 2));
      if (t > 3) {const a = Math.min(1, (t - 3) / 1); em(g, '📦', 560, 300 - Math.sin(t * 5) * 4, 28, a); em(g, '💻', 600, 296, 26, a); g.fillStyle = 'rgba(255,255,255,' + Math.max(0, .5 - (t - 3.4) * .5) + ')'; g.fillRect(0, 0, W, H);}
    },
    fired(g, t) {
      sky(g, '#1e2230', '#0e1018'); g.fillStyle = '#262a38'; g.fillRect(0, 250, W, 110);
      for (let i = 0; i < 6; i++) {g.fillStyle = 'rgba(255,255,255,.04)'; g.fillRect(40 + i * 120, 60, 70, 150);}
      g.fillStyle = '#3a2e22'; g.fillRect(470, 80, 150, 175); g.fillStyle = '#05050a'; g.fillRect(480, 90, 130, 165);
      const rain = rr(3); g.strokeStyle = 'rgba(160,180,220,.35)'; g.lineWidth = 1.2; for (let i = 0; i < 90; i++) {const x = rain() * W, y = (rain() * H + t * 520) % H; g.beginPath(); g.moveTo(x, y); g.lineTo(x - 5, y + 16); g.stroke();}
      const p = Math.min(1, t / 2.8), e = p < .5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2, x = 110 + e * 410;
      for (let i = 0; i < 7; i++) {const k = (t * .4 + i * .15) % 1; em(g, '📄', 60 + i * 95 + Math.sin(t * 2 + i) * 25, 30 + k * 250, 22, 1 - k, Math.sin(t + i));}
      em(g, '🧍', x, 262 + Math.abs(Math.sin(t * 6)) * (p < 1 ? -3 : 0), 62); em(g, '📦', x - 34, 270, 34);
      if (t > 2.2) {const sh = Math.max(0, 1 - (t - 2.2) * 2); g.save(); g.translate(Math.sin(t * 60) * 6 * sh, 0); em(g, '🚪', 545, 230, 100); g.restore(); g.fillStyle = 'rgba(255,255,255,' + Math.max(0, .35 - (t - 2.2) * .4) + ')'; g.fillRect(0, 0, W, H);} else em(g, '🚪', 545, 230, 100);
      if (t > 3.2) em(g, '👋', 545, 130 + Math.sin(t * 5) * 6, 40, Math.min(1, t - 3.2));
      if (Math.sin(t * .9) > .985 || (t > 4.2 && t < 4.35)) {g.fillStyle = 'rgba(220,230,255,.35)'; g.fillRect(0, 0, W, H);}
    },
    conscience(g, t) {
      const gr = Math.max(0, 1 - t / 7); sky(g, '#17171c', '#07070a');
      const r = rr(11); for (let i = 0; i < 40; i++) {const x = r() * W, sp = .15 + r() * .35, k = (t * sp + r()) % 1; g.fillStyle = 'rgba(140,140,160,' + (.55 * (1 - k)) + ')'; g.font = (12 + r() * 14) + 'px monospace'; g.fillText(['₴', '0', '1', '$', '%', '€', '7'][i % 7], x, k * H);}
      const hb = Math.max(0, Math.sin(t * 5.2 / (1 + t * .12))); g.fillStyle = 'rgba(255,255,255,' + (.04 + .06 * gr) + ')'; g.beginPath(); g.ellipse(360, 330, 200 + hb * 20, 40, 0, 0, 7); g.fill();
      em(g, '🧍', 360, 290, 82 - t * 3, .25 + .6 * gr);
      for (let i = 0; i < 5; i++) em(g, '👤', 100 + i * 130, 200 + Math.sin(t + i) * 6, 36, Math.max(0, .35 - t * .05 - i * .04));
      const ring = Math.sin(t * 9) > 0 ? 1 : .15, sh = Math.sin(t * 40) * 3 * (1 - gr); em(g, '📞', 360 + sh, 140, 46, (t < 7 ? ring : 0) * Math.max(.2, gr));
      g.fillStyle = 'rgba(0,0,0,' + Math.min(.85, t * .13) + ')'; g.fillRect(0, 0, W, H);
      post(g, 99, 0, hb * .12);
    },
    whistle(g, t) {
      const dawn = Math.min(1, t / 3); sky(g, 'rgb(' + (40 + dawn * 215) + ',' + (50 + dawn * 140) + ',' + (110 + dawn * 10) + ')', 'rgb(255,' + (190 + dawn * 40) + ',' + (130 + dawn * 80) + ')');
      g.fillStyle = 'rgba(255,240,180,.95)'; g.beginPath(); g.arc(360, 270 - dawn * 120, 50 + dawn * 10, 0, 7); g.fill();
      g.save(); g.translate(360, 270 - dawn * 120); for (let i = 0; i < 16; i++) {g.rotate(Math.PI / 8); g.fillStyle = 'rgba(255,255,200,' + (.1 * dawn) + ')'; g.fillRect(0, -9, 480 + Math.sin(t * 2 + i) * 40, 18);} g.restore();
      city(g, t, 18, 255, '#463460', '#ffd070'); city(g, t, 40, 285, '#2c2044'); em(g, '🏛', 540, 280, 110);
      g.fillStyle = '#2a2430'; g.fillRect(0, 290, W, 70);
      const p = Math.min(1, t / 3.2); em(g, '🧍', 80 + p * 340, 308, 58); em(g, '📁', 120 + p * 340, 308, 30);
      if (t > 3) {const s = Math.min(1, (t - 3) / 1.2); em(g, '🛡', 540, 140, 70 * s, s); g.save(); g.globalCompositeOperation = 'lighter'; g.fillStyle = 'rgba(255,255,255,' + Math.max(0, .5 - (t - 3) * .4) + ')'; g.fillRect(0, 0, W, H); g.restore();}
      for (let i = 0; i < 4; i++) em(g, '🕊', ((t * 70 + i * 190) % 860) - 70, 70 + i * 34 + Math.sin(t * 3 + i) * 10, 28, dawn);
      const r = rr(5); for (let i = 0; i < 24; i++) {const k = (t * .35 + r()) % 1; em(g, '✨', r() * W, 330 - k * 300, 12 + r() * 10, (1 - k) * dawn);}
    },
    rich(g, t) {
      sky(g, '#ff5f8a', '#ffd070'); g.fillStyle = '#ffe9a0'; g.beginPath(); g.arc(540, 170 + t * 5, 62, 0, 7); g.fill();
      city(g, t, 30, 250, '#7a3a78', null, 4); city(g, t, 80, 275, '#4a2050', '#ffd070', 9);
      for (let i = 0; i < 5; i++) {const x = ((i * 190 - t * 260) % 950 + 950) % 950 - 60; em(g, '🌴', x, 285, 56);}
      road(g, t, 290, 520);
      const p = Math.min(1, t / 3), x = 60 + p * 260 + Math.sin(t * 2) * 8; for (let i = 0; i < 10; i++) {g.fillStyle = 'rgba(255,255,255,' + (.2 - i * .018) + ')'; g.fillRect(x - 40 - i * 22, 318 + (i % 3) * 3, 30, 3);}
      em(g, '🚗', x, 322 + Math.sin(t * 26) * 1.2, 76);
      for (let i = 0; i < 16; i++) {const k = (t * .55 + i / 16) % 1; em(g, i % 3 ? '💵' : '🪙', (i * 79 + t * 50) % W, 20 + k * 260, 24, Math.min(1, 2.2 - k * 2.2), t + i);}
      if (t > 2.8) {const s = Math.min(1, (t - 2.8) * 2); em(g, '💰', 360, 130 + Math.sin(t * 3) * 6, 80 * s, s);}
    },
    survive(g, t) {
      const dawn = Math.min(1, t / 4); sky(g, 'rgb(' + (40 + dawn * 130) + ',' + (70 + dawn * 100) + ',' + (130 + dawn * 60) + ')', 'rgb(255,' + (170 + dawn * 50) + ',' + (110 + dawn * 70) + ')');
      g.fillStyle = '#fff3c0'; g.beginPath(); g.arc(360, 300 - dawn * 170, 46, 0, 7); g.fill();
      for (let i = 0; i < 4; i++) em(g, '☁️', ((t * (12 + i * 5) + i * 200) % 900) - 80, 60 + i * 38, 54, .8);
      city(g, t, 10, 260, '#3a4a70', null, 2); city(g, t, 24, 290, '#283250', '#ffd890', 5);
      g.fillStyle = '#2a2a38'; g.fillRect(0, 295, W, 65); g.fillStyle = '#34344a'; g.fillRect(0, 295, W, 5);
      for (let i = 0; i < 6; i++) {const x = ((i * 170 - t * 45) % 1000 + 1000) % 1000 - 60; em(g, '🌳', x, 300, 60);}
      const p = Math.min(1, t / 5), x = 60 + p * 560; em(g, '🚶', x, 326 + Math.abs(Math.sin(t * 7)) * -4, 56);
      for (let i = 0; i < 3; i++) em(g, '🐦', ((t * 60 + i * 260) % 840) - 60, 90 + i * 30 + Math.sin(t * 4 + i) * 8, 22, dawn);
      for (let i = 0; i < 5; i++) {const k = (t * .5 + i / 5) % 1; em(g, '📅', 100 + i * 130, 90 + k * 60, 20, 1 - k);}
      if (t > 1) em(g, '45 / 45', 360, 75, 40, Math.min(1, t - 1));
    }
  };
  const _e = ending;
  ending = function (k) {
    const r = _e.apply(this, arguments);
    try {
      const box = document.querySelector('#scr .box'), fn = S[k]; if (!box || !fn) return r;
      box.insertAdjacentHTML('afterbegin', '<canvas id="endcv" width="' + W + '" height="' + H + '" style="width:100%;border-radius:12px;border:1.5px solid #4a3a82;margin-bottom:8px;background:#000"></canvas>');
      const cv = document.getElementById('endcv'), g = cv.getContext('2d'), t0 = performance.now(); let B = null, plays = 0;
      const play = () => {try {if (vol > 0 && actx()) {B = bus(); if (B) MUS[k](B, B.c.currentTime + .05); plays++;}} catch (e) {}};
      play(); let nextLoop = 9.5;
      const stop = () => {try {if (B) {B.g.gain.cancelScheduledValues(B.c.currentTime); B.g.gain.setTargetAtTime(0, B.c.currentTime, .15);}} catch (e) {}};
      cv.addEventListener('click', () => {if (ctx && ctx.state !== 'running') {ctx.resume(); stop(); play();}});
      (function f(now) {
        const c = document.getElementById('endcv'); if (!c || c !== cv) {stop(); return;}
        const t = (now - t0) / 1000, lt = t > 7 ? 7 + ((t - 7) % 4) * 0 : t;
        try {g.clearRect(0, 0, W, H); g.save(); const z = 1 + Math.min(t, 10) * .008; g.translate(W / 2, H / 2); g.scale(z, z); g.translate(-W / 2, -H / 2); fn(g, Math.min(t, 9), k); g.restore(); post(g, t, k);} catch (e) {}
        if (t > nextLoop && plays < 3) {nextLoop += 9.5; if (k !== 'conscience') play();}
        requestAnimationFrame(f);
      })(t0);
    } catch (e) {}
    return r;
  };
  window.__endAnim = S;
  window.__cine = {T, bus, actx, post, sky, em, city, road, hz, W, H, rr, getVol: () => vol};
})();
