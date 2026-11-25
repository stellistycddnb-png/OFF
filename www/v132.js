'use strict';
/* v132: кинематографичные заставки — свадьба и корпоратив (анимация + музыка). MADE BY PESSIMIST */
(function () {
  const C = window.__cine; if (!C) return; const {T, bus, actx, post, sky, em, hz, W, H, rr} = C;
  const SC = {
    wed(g, t) {
      sky(g, '#ffd6e8', '#fff3d0'); g.fillStyle = 'rgba(255,255,255,.8)'; g.beginPath(); g.arc(560, 80, 40, 0, 7); g.fill();
      for (let i = 0; i < 4; i++) em(g, '☁️', ((t * (10 + i * 4) + i * 190) % 900) - 80, 50 + i * 30, 56, .85);
      g.fillStyle = '#9ad08a'; g.fillRect(0, 285, W, 80); for (let i = 0; i < 9; i++) em(g, '🌷', 30 + i * 85, 300 + (i % 2) * 14, 28);
      em(g, '⛪', 360, 270, 170);
      const p = Math.min(1, t / 3), x1 = 80 + p * 200, x2 = 640 - p * 200;
      em(g, '🤵', x1, 312, 62); em(g, '👰', x2, 312, 62);
      if (t > 3) {const s = Math.min(1, (t - 3) * 1.5); em(g, '💍', 360, 150 - Math.sin(t * 3) * 4, 56 * s, s); for (let i = 0; i < 6; i++) em(g, '💗', 360 + Math.cos(t * 1.5 + i) * 70, 150 - ((t * 40 + i * 40) % 160), 20, .8);}
      for (let i = 0; i < 40; i++) {const k = (t * (.25 + (i % 5) * .05) + (i * .618) % 1) % 1; if (t > 3) em(g, ['🌸', '🎊', '✨', '🌹'][i % 4], (i * 97 + i * i * 13) % W, -10 + k * 340, 16 + (i % 4) * 4, 1 - k * .5, t + i);}
      if (t > 3 && Math.floor(t * 3) % 2) em(g, '🔔', 120, 60, 34, 1), em(g, '🔔', 600, 60, 34, 1);
      for (let i = 0; i < 3; i++) em(g, '🕊', ((t * 60 + i * 270) % 840) - 60, 90 + i * 24, 26, 1);
    },
    party(g, t) {
      sky(g, '#1c0a3a', '#08041a'); const hue = t * 90;
      g.save(); g.globalCompositeOperation = 'lighter'; for (let i = 0; i < 6; i++) {g.save(); g.translate(60 + i * 120, 0); g.rotate(Math.sin(t * 1.6 + i) * .5); const q = g.createLinearGradient(0, 0, 0, 340); const col = 'hsla(' + ((hue + i * 60) % 360) + ',100%,60%,'; q.addColorStop(0, col + '.5)'); q.addColorStop(1, col + '0)'); g.fillStyle = q; g.beginPath(); g.moveTo(-6, 0); g.lineTo(-60, 340); g.lineTo(60, 340); g.lineTo(6, 0); g.fill(); g.restore();} g.restore();
      g.fillStyle = '#17102e'; g.fillRect(0, 280, W, 90); for (let i = 0; i < 9; i++) {g.fillStyle = 'hsla(' + ((hue + i * 40) % 360) + ',90%,55%,.6)'; g.fillRect(i * 80, 284, 76, 6);}
      em(g, '🪩', 360, 52 + Math.sin(t * 2) * 3, 70, 1, t * .8);
      const dn = ['💃', '🕺', '🧍', '🕺', '💃', '🧑‍🎤', '🕺']; dn.forEach((d, i) => em(g, d, 70 + i * 100, 318 - Math.abs(Math.sin(t * 6 + i)) * 26, 50 + (i % 3) * 3, 1, Math.sin(t * 6 + i) * .12));
      em(g, '🎤', 600, 250 + Math.sin(t * 4) * 3, 40); em(g, '🍸', 90, 270, 30); em(g, '🎸', 640, 300, 40, 1, -.3);
      for (let i = 0; i < 30; i++) {const r = rr(i + 9), k = (t * .3 + r()) % 1; g.fillStyle = 'hsl(' + ((i * 47 + hue) % 360) + ',90%,60%)'; g.fillRect(r() * W, k * H, 7, 4);}
      const beat = Math.max(0, Math.sin(t * Math.PI * 2 * 2)); g.fillStyle = 'rgba(255,255,255,' + (beat * beat * .07) + ')'; g.fillRect(0, 0, W, H);
    }
  };
  const MS = {
    wed(B, t) {
      const mel = [[67, 0], [72, .7], [72, 1.4], [72, 2.1], [67, 2.8], [67, 3.4], [69, 4.1], [71, 4.8], [72, 5.6], [76, 6.4], [79, 7.2]];
      mel.forEach(([m, x]) => {T.key(B, t + x, m, 1.3, .13); T.key(B, t + x, m - 12, 1.3, .06);});
      [[48, 0], [55, 2.8], [53, 4.2], [48, 5.6], [55, 7.2]].forEach(([m, x]) => T.pad(B, t + x, [m, m + 7, m + 16], 3, .06));
      [3, 3.8, 4.6].forEach(x => {T.bell(B, t + x, 84, .1); T.bell(B, t + x + .15, 76, .07);});
      for (let i = 0; i < 10; i++) T.n(B, t + 3.1 + i * .08, .12, .08, 'highpass', 3500 + i * 200);
      for (let i = 0; i < 6; i++) T.o(B, t + 3.2 + i * .35, 1800 + i * 160, .14, 'sine', .04, 3000);
      T.n(B, t + 5.8, 1.5, .1, 'bandpass', 1500, 4000);
    },
    party(B, t) {
      const s = 60 / 122 / 4, bass = [43, -1, 43, 50, -1, 48, -1, 46, 43, -1, 43, 50, -1, 53, 52, 50];
      for (let bar = 0; bar < 5; bar++) for (let i = 0; i < 16; i++) {
        const x = t + (bar * 16 + i) * s; if (bass[i] >= 0) T.o(B, x, hz(bass[i]), s * 1.7, 'sawtooth', .12, 0, .005);
        if (i % 4 === 0) T.kick(B, x, .5); if (i === 4 || i === 12) T.snare(B, x, .2); T.hat(B, x, i % 2 ? .04 : .07);
        if (i % 8 === 6) T.pad(B, x, [62 + bar % 2 * 3, 66, 69, 73], .5, .05, 'sawtooth');
        if (bar > 1 && i % 4 === 2) T.o(B, x, hz(79 + (i % 8 ? 0 : 3)), s * 1.2, 'square', .035);
      }
      for (let i = 0; i < 16; i++) T.n(B, t + 7 + i * .08, .1, .05, 'highpass', 6000);
      [1.5, 5.5].forEach(x => T.n(B, t + x, 1, .12, 'bandpass', 1800, 900));
    }
  };
  function run(kind, hideSel) {
    try {
      const box = document.querySelector('#scr .box'); if (!box || box.querySelector('#cinecv')) return; const fn = SC[kind];
      if (hideSel) box.querySelectorAll(hideSel).forEach(e => e.style.display = 'none');
      box.insertAdjacentHTML('afterbegin', '<canvas id="cinecv" width="' + W + '" height="' + H + '" style="width:100%;border-radius:12px;border:1.5px solid #4a3a82;margin-bottom:8px;background:#000"></canvas>');
      const cv = document.getElementById('cinecv'), g = cv.getContext('2d'), t0 = performance.now(); let B = null, n = 0;
      const play = () => {try {if (C.getVol() > 0 && actx()) {B = bus(); if (B) MS[kind](B, B.c.currentTime + .05); n++;}} catch (e) {}};
      const stop = () => {try {if (B) B.g.gain.setTargetAtTime(0, B.c.currentTime, .15);} catch (e) {}};
      play(); let nx = 9;
      (function f(now) {
        const c = document.getElementById('cinecv'); if (!c || c !== cv) {stop(); return;}
        const t = (now - t0) / 1000; try {g.clearRect(0, 0, W, H); g.save(); const z = 1 + Math.min(t, 10) * .006; g.translate(W / 2, H / 2); g.scale(z, z); g.translate(-W / 2, -H / 2); fn(g, t); g.restore(); post(g, t);} catch (e) {}
        if (t > nx && n < 3) {nx += 9; play();} requestAnimationFrame(f);
      })(t0);
    } catch (e) {}
  }
  window.__cineRun = run; window.__cineSC = SC;
  const _cs = corpShow;
  corpShow = function (d) {const r = _cs.apply(this, arguments); setTimeout(() => run('party', '.corp-hd'), 0); return r;};
})();
