'use strict';
/* v138: красивое и лёгкое интро — всё рисуется один раз заранее, в кадре только drawImage; авто-снижение качества. MADE BY PESSIMIST */
(function () {
  const it = document.getElementById('intro'); if (!it) return;
  try {
    const weak = /Android/i.test(navigator.userAgent) && ((navigator.hardwareConcurrency || 8) <= 6 || (navigator.deviceMemory || 8) <= 4);
    let dpr = Math.min(window.devicePixelRatio || 1, weak ? 1 : 1.5);
    let cw = Math.round(innerWidth * dpr), ch = Math.round(innerHeight * dpr); const px = cw * ch, MAXPX = weak ? 520000 : 1100000; if (px > MAXPX) {const k = Math.sqrt(MAXPX / px); cw = Math.round(cw * k); ch = Math.round(ch * k); dpr *= k;}
    it.classList.add('cv', 'lite');
    const cv = document.createElement('canvas'); cv.width = cw; cv.height = ch; cv.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block'; it.insertBefore(cv, it.firstChild); const g = cv.getContext('2d', {alpha: false});
    const mk = (w, h) => {const c = document.createElement('canvas'); c.width = w; c.height = h; return c;};
    const U = cw / 390, TAU = Math.PI * 2, clamp = (a, b, c) => Math.max(b, Math.min(c, a)), ease = x => 1 - Math.pow(1 - clamp(x, 0, 1), 3), hr = i => {const v = Math.sin(i * 127.1 + 311.7) * 43758.5453; return v - Math.floor(v);};
    /* --- предрисовка: фон --- */
    const sky = mk(cw, ch), sg = sky.getContext('2d'); let q = sg.createLinearGradient(0, 0, 0, ch); q.addColorStop(0, '#05030f'); q.addColorStop(.55, '#1a0c3c'); q.addColorStop(1, '#3a1450'); sg.fillStyle = q; sg.fillRect(0, 0, cw, ch);
    for (let i = 0; i < 70; i++) {sg.fillStyle = 'rgba(255,255,255,' + (.25 + hr(i + 3) * .6) + ')'; const s = (1 + hr(i + 9) * 1.6) * U * .8; sg.fillRect(hr(i) * cw, hr(i + 1) * ch * .55, s, s);}
    const moon = sg.createRadialGradient(cw * .78, ch * .16, 0, cw * .78, ch * .16, 80 * U); moon.addColorStop(0, 'rgba(255,230,200,.9)'); moon.addColorStop(.25, 'rgba(255,200,230,.25)'); moon.addColorStop(1, 'rgba(255,200,230,0)'); sg.fillStyle = moon; sg.fillRect(0, 0, cw, ch * .5);
    const wins = [];
    function layer(base, minH, maxH, col, win, seed, widthK) {const c = mk(cw * 2, ch), x = c.getContext('2d'); let px0 = 0; x.fillStyle = col; while (px0 < cw * 2) {const w = (30 + hr(seed + px0) * 44) * U * widthK, h = (minH + hr(seed + px0 * 3) * (maxH - minH)) * U; x.fillStyle = col; x.fillRect(px0, base - h, w, h + ch); if (win) {for (let yy = base - h + 8 * U; yy < base - 6 * U; yy += 14 * U) for (let xx = px0 + 6 * U; xx < px0 + w - 8 * U; xx += 13 * U) {if (hr(xx * .13 + yy * .7 + seed) > .5) {x.fillStyle = win; x.fillRect(xx, yy, 6 * U, 7 * U);} else if (win && hr(xx + yy) > .93) wins.push([xx, yy]);}} px0 += w + 4 * U;} return c;}
    const far = layer(ch * .66, 50, 150, '#150a30', 'rgba(255,200,110,.55)', 3, 1), near = layer(ch * .76, 60, 190, '#0b0620', 'rgba(255,215,120,.9)', 17, 1.15);
    const road = mk(cw, ch), rg = road.getContext('2d'); rg.fillStyle = '#07040f'; rg.fillRect(0, ch * .76, cw, ch * .24); rg.strokeStyle = 'rgba(255,58,200,.35)'; rg.lineWidth = Math.max(1, U); for (let i = -12; i <= 12; i++) {rg.beginPath(); rg.moveTo(cw / 2 + i * 14 * U, ch * .76); rg.lineTo(cw / 2 + i * 90 * U, ch); rg.stroke();} for (let y = 0; y < 7; y++) {const yy = ch * .76 + Math.pow(y / 6, 2) * ch * .24; rg.beginPath(); rg.moveTo(0, yy); rg.lineTo(cw, yy); rg.stroke();}
    /* --- предрисовка: логотип PESSIMIST --- */
    function neon(text, size, fill, glow, w) {const c = mk(w, Math.round(size * 1.8)), x = c.getContext('2d'); x.font = '900 ' + size + 'px "Arial Black",Impact,sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.lineJoin = 'round'; x.shadowColor = glow; x.shadowBlur = size * .45; x.fillStyle = glow; x.fillText(text, w / 2, c.height / 2); x.shadowBlur = size * .15; x.lineWidth = size * .06; x.strokeStyle = 'rgba(255,255,255,.85)'; x.strokeText(text, w / 2, c.height / 2); x.shadowBlur = 0; const gg = x.createLinearGradient(0, c.height * .25, 0, c.height * .75); gg.addColorStop(0, '#fff'); gg.addColorStop(1, fill); x.fillStyle = gg; x.fillText(text, w / 2, c.height / 2); return c;}
    let fs = 64 * U; const tmp = mk(10, 10).getContext('2d'); tmp.font = '900 ' + fs + 'px "Arial Black",Impact,sans-serif'; const tw = tmp.measureText('PESSIMIST').width; if (tw > cw * .88) fs *= cw * .88 / tw;
    const logo = neon('PESSIMIST', fs, '#ffc4f0', '#ff3ac8', cw), gfs = 30 * U, game = neon('КОЛ-ЦЕНТР: СМЕНА', gfs, '#fff2a8', '#ffb400', cw);
    const by = mk(cw, 40 * U), bx = by.getContext('2d'); bx.font = '700 ' + 14 * U + 'px sans-serif'; bx.textAlign = 'center'; bx.fillStyle = '#b8a8d8'; bx.letterSpacing = (8 * U) + 'px'; bx.fillText('MADE BY', cw / 2, 24 * U);
    const ver = mk(cw, 40 * U), vx = ver.getContext('2d'); vx.font = '700 ' + 13 * U + 'px sans-serif'; vx.textAlign = 'center'; vx.fillStyle = '#ff7adf'; vx.letterSpacing = (3 * U) + 'px'; vx.fillText('build ' + (typeof BUILD_V !== 'undefined' ? BUILD_V : '') + ' · «' + (typeof BUILD_NAME2 !== 'undefined' ? BUILD_NAME2 : (typeof BUILD_NAME !== 'undefined' ? BUILD_NAME : '')) + '»', cw / 2, 24 * U);
    const sparks = []; for (let i = 0; i < 34; i++) sparks.push([hr(i + 40) * cw, hr(i + 41) * ch, .3 + hr(i + 42) * .7, 1 + hr(i + 43) * 2]);
    const PH = ['Подключаем линии…', 'Разогреваем телефоны…', 'Репетируем «Мурку»…', 'Наливаем кофе…', 'Готово!']; let skipped = false, t0 = performance.now(), last = 0, slow = 0, lowQ = false, fired = {};
    const sfx = (k, n) => {if (fired[k]) return; fired[k] = 1; try {Snd.sfx(n);} catch (e) {}};
    function frame(now) {
      if (!document.body.contains(cv)) return; requestAnimationFrame(frame);
      if (now - last < 30) return; const dt = now - last; last = now; if (dt > 44) {if (++slow > 12) lowQ = true;} else slow = Math.max(0, slow - 1);
      const t = (now - t0) / 1000, cx = cw / 2, cy = ch * .42;
      g.globalAlpha = 1; g.drawImage(sky, 0, 0);
      const sh1 = lowQ ? 0 : (t * 6 * U) % cw, sh2 = lowQ ? 0 : (t * 14 * U) % cw; g.drawImage(far, -sh1, 0); g.drawImage(near, -sh2, 0); g.drawImage(road, 0, 0);
      if (!lowQ) {g.fillStyle = 'rgba(255,230,160,.9)'; for (let i = 0; i < wins.length; i += 3) {const w = wins[i], on = hr(i + Math.floor(t * 1.5)) > .5; if (on) g.fillRect(((w[0] - sh2) % (cw * 2) + cw * 2) % (cw * 2) - 0, w[1], 5 * U, 6 * U);}}
      // свет-развёртка
      const sw = ((t * .45) % 1.6 - .3) * cw; g.save(); g.globalCompositeOperation = 'lighter'; const lg = g.createLinearGradient(sw - 90 * U, 0, sw + 90 * U, 0); lg.addColorStop(0, 'rgba(255,58,200,0)'); lg.addColorStop(.5, 'rgba(255,58,200,.10)'); lg.addColorStop(1, 'rgba(255,58,200,0)'); g.fillStyle = lg; g.fillRect(0, 0, cw, ch); g.restore();
      if (!lowQ) {g.fillStyle = 'rgba(255,180,240,.7)'; for (const s of sparks) {const y = ((s[1] - t * s[2] * 40 * U) % ch + ch) % ch; g.globalAlpha = .15 + .5 * s[2]; g.fillRect(s[0], y, s[3] * U, s[3] * U);} g.globalAlpha = 1;}
      // MADE BY
      const a1 = clamp((t - .4) / .8, 0, 1); if (a1 > 0) {g.globalAlpha = a1; g.drawImage(by, 0, cy - 70 * U);}
      // PESSIMIST
      const tl = (t - 1.0) / 1.0; if (tl > 0) {sfx('b', 'boom'); const e = ease(tl), sc = 1.18 - .18 * e; g.save(); g.globalAlpha = clamp(tl * 1.6, 0, 1); g.translate(cx, cy); g.scale(sc, sc); g.translate(-cx, -cy); const h = logo.height;
        if (t > 1.05 && t < 1.4 && !lowQ) {for (let k = 0; k < 5; k++) {const sy = k * h / 5, off = (hr(k + Math.floor(t * 30)) - .5) * 24 * U; g.drawImage(logo, 0, sy, cw, h / 5, off, cy - h / 2 + sy, cw, h / 5);}} else g.drawImage(logo, 0, cy - h / 2); g.restore();
        if (t > 1.0 && t < 1.5) {g.fillStyle = 'rgba(255,255,255,' + (1.5 - t) * .7 + ')'; g.fillRect(0, 0, cw, ch);} sfx('s', 'sparkle');}
      g.globalAlpha = 1;
      // линия
      const ln = ease((t - 2.0) / .8); if (ln > 0) {const w = cw * .62 * ln, x0 = cx - w / 2, yy = cy + logo.height * .5 + 4 * U, lg2 = g.createLinearGradient(x0, 0, x0 + w, 0); lg2.addColorStop(0, '#ffd23a'); lg2.addColorStop(.5, '#ff3ac8'); lg2.addColorStop(1, '#5dffc0'); g.fillStyle = lg2; g.fillRect(x0, yy, w, 3 * U);}
      // название игры
      const gt = (t - 2.5) / .9; if (gt > 0) {const e = ease(gt); g.globalAlpha = e; g.drawImage(game, 0, cy + 84 * U + (1 - e) * 16 * U); g.globalAlpha = e * .9; g.drawImage(ver, 0, cy + 84 * U + game.height * .55 + (1 - e) * 16 * U); g.globalAlpha = 1;}
      // полоса загрузки
      const bt = clamp((t - 3.0) / 2.0, 0, 1); if (t > 3.0) {const bw = cw * .6, bx0 = cx - bw / 2, by0 = ch * .74 - 40 * U; g.fillStyle = 'rgba(255,255,255,.1)'; g.fillRect(bx0, by0, bw, 5 * U); const lg3 = g.createLinearGradient(bx0, 0, bx0 + bw, 0); lg3.addColorStop(0, '#ffd23a'); lg3.addColorStop(.5, '#ff3ac8'); lg3.addColorStop(1, '#5dffc0'); g.fillStyle = lg3; g.fillRect(bx0, by0, bw * bt, 5 * U); g.font = '600 ' + 12 * U + 'px sans-serif'; g.textAlign = 'center'; g.fillStyle = '#9a8fb8'; g.fillText(PH[Math.min(PH.length - 1, Math.floor(bt * PH.length))], cx, by0 + 22 * U);}
      // затемнение на входе и выходе
      if (t < .5) {g.fillStyle = 'rgba(0,0,0,' + (1 - t / .5) + ')'; g.fillRect(0, 0, cw, ch);}
      if (t > 5.3 && !skipped) {skipped = true; try {endIntro();} catch (e) {}}
    }
    requestAnimationFrame(frame);
  } catch (e) {try {document.getElementById('intro').classList.remove('cv');} catch (er) {}}
})();

/* ---------- Что нового в игре: 1.9.2 → 1.9.6 ---------- */
(function () {
  if (typeof scrNews !== 'function') return; const _sn38 = scrNews;
  scrNews = function () {_sn38(); try {const p = document.querySelector('#scr .box p'); if (p && typeof BUILD_NAME2 !== 'undefined') p.textContent = BUILD_NAME2 + ' · build ' + BUILD_V; const h3 = document.querySelector('#scr .box h3'); if (h3 && !document.querySelector('#scr .newsnew')) h3.insertAdjacentHTML('beforebegin', '<h3 class="newsnew">🆕 Версии 1.9.2 – 1.9.14</h3><p>• 1.9.14: «Ад» стал настоящим адом: жёсткие множители, инфляция, штрафы каждые 4 дня, но комиссия +25%<br>• 1.9.13: случайные повороты во время звонка, новичкам легче первые дни (подозрения растут медленнее, один «спасательный» обыск)<br>• 1.9.12: мини-игра «Ловушка в договоре», две новые сюжетные линии (Зоя и Алина), исправлено обновление APK поверх старого<br>• 1.9.11: резервная копия сохранения, размер текста, экран статистики<br>• 1.9.10: Лесной стал жёстче и грамотнее, переписаны реплики<br>• 1.9.9: Лесной стал живым персонажем и подъёбывает по ходу игры, новые реплики обучения<br>• 1.9.8: обучение от Лесного, 6 новых типов клиентов (в т.ч. подставная закупка), 15 новых «сделок», 12 особых концовок и эпилоги по сюжету, семье и питомцам<br>• 1.9.7: Новая игра+, сложность (Лёгкая/Обычная/Ад), 12 новых достижений с наградой, мини-игра «Лови звонки», 3 сюжетные линии, крупнее жители дома, настройки эффектов<br>• 1.9.6: новое красивое интро PESSIMIST без лагов<br>• 1.9.5: ежедневная награда (серия 7 дней), исправлен сбой в звонке, меньше нагрева в фоне<br>• 1.9.4: исправлено зависание при «Предложить встречаться»<br>• 1.9.3: окно «Вышло обновление» и красная метка<br>• 1.9.2: «Дом 4.0» — жена и гостья ходят по квартире, питомцы с лицами, звуки дома</p>');} catch (e) {}};
})();
