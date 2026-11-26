'use strict';
/* v134: Дом 4.0 — векторные жильцы и питомцы, жена и гостья ходят по квартире, звуки дома. MADE BY PESSIMIST */
(function () {
  const P = window.__person; if (!P) return; const TAU = Math.PI * 2;
  const sn = n => {try {Snd.sfx(n);} catch (e) {}};
  const hash = s => {let h = 0; String(s).split('').forEach(c => h = (h * 31 + c.charCodeAt(0)) | 0); return Math.abs(h);};
  const NM = {oks: 'Оксана', mar: 'Марина', ler: 'Лера', kat: 'Катя', dia: 'Диана', son: 'Соня', ira: 'Ира', nas: 'Настя'};
  const HAIR = ['#2a1a10', '#6a3a1a', '#d8a040', '#111', '#8a4a2a'], DRESS = ['#e86a9a', '#6a8ae8', '#e8a040', '#7ac86a', '#b070e0'];
  /* ---------- люди ---------- */
  hPerson = function (g, x, y, me, dir, walk, moving, t, e) {
    const S0 = 1.0, top = tier('w', 'top'); let o;
    if (me) {const near = Object.values(HM.ents).some(q => q.kind !== 'pet' && Math.hypot(q.x - HM.x, q.y - HM.y) < 60); o = {col: ['#6a6a7a', '#e8e8f0', '#1a2a4a', '#2a2a30'][top], pants: top === 3 ? '#15151c' : '#2a2f4a', hair: '#3a2a1a', dir, t: moving ? walk : t, walk: moving ? 1 : 0, mood: near ? 'happy' : 'flat', tie: top === 2 ? '#c8a030' : null, seed: 1};}
    else {const hs = hash(e.key || e.n), fam = String(e.key).indexOf('fam:') === 0, girl = e.rk === 'hr' || fam; o = {dir: e.dir || 1, t: moving ? (e.walk || t) : t, walk: moving ? 1 : 0, mood: e.say ? 'open' : (fam || e.rk === 'hr') ? 'happy' : 'flat', seed: hs % 7, hair: HAIR[hs % 5]};
      if (girl) {o.dress = DRESS[hs % 5]; o.col = o.dress; o.hairStyle = hs % 3 === 0 ? 'bun' : 'long'; o.skin = '#f2cfae';} else {o.col = {tm: '#4a7ac0', st: '#5aa070'}[e.rk] || '#7a7a9a'; o.tie = '#c8a030'; o.pants = '#262a44';}}
    P(g, x, y, S0, o);
    g.font = '800 10px sans-serif'; g.textAlign = 'center'; g.lineWidth = 3; g.strokeStyle = 'rgba(0,0,0,.8)'; const nm = me ? '★ ' + (S.nick || 'ВЫ') : e.n; g.strokeText(nm, x, y + 21); g.fillStyle = me ? "#ffd23a" : "#fff"; g.fillText(nm, x, y + 21);
    if (!me) {const hh = H(), fam = String(e.key).indexOf('fam:') === 0;
      if (fam && (e.key === 'fam:wife' || Math.sin(t * 2) > -2)) {g.font = '13px sans-serif'; g.fillText('❤', x + 14, y - 52 + Math.sin(t * 3) * 2);} else if (e.rk === 'hr' && hh.gf === (S.rm.find(r => r.key === e.key) || {}).id) {g.font = '13px sans-serif'; g.fillText('❤', x + 14, y - 52 + Math.sin(t * 3) * 2);}
      const txt = e.say || (e.act && !moving ? e.act : ''); if (txt) {g.font = e.say ? '700 11px sans-serif' : '18px sans-serif'; const w = e.say ? g.measureText(txt).width + 14 : 28; g.fillStyle = 'rgba(255,255,255,.95)'; g.beginPath(); g.roundRect ? g.roundRect(x - w / 2, y - 86, w, 22, 8) : g.rect(x - w / 2, y - 86, w, 22); g.fill(); g.fillStyle = '#222'; g.textAlign = 'center'; g.fillText(txt, x, y - 70 + (e.say ? 0 : 2));}}
  };
  /* ---------- питомцы ---------- */
  const SP = {
    cat: {c: '#e8a050', c2: '#b8702a', rx: 11, ry: 6.5, hr: 5.8, ear: 'tri', tail: 'curl', st: 1}, dog: {c: '#c8905a', c2: '#8a5a30', rx: 13, ry: 7.5, hr: 6.5, ear: 'flop', tail: 'wag'},
    ham: {c: '#e8c890', c2: '#fff', rx: 8, ry: 6.5, hr: 5, ear: 'round', tail: 'none'}, turtle: {c: '#6aa860', c2: '#2f7a40', rx: 10, ry: 6, hr: 3.8, ear: 'none', tail: 'none', shell: 1},
    hedge: {c: '#a58a70', c2: '#4a3626', rx: 10, ry: 6.5, hr: 4.5, ear: 'round', tail: 'none', spikes: 1}, rabbit: {c: '#f2f2f2', c2: '#f0b0b8', rx: 10, ry: 7, hr: 5.5, ear: 'long', tail: 'puff'},
    parrot: {c: '#3ac85a', c2: '#e8c030', rx: 6, ry: 9, hr: 5, ear: 'none', tail: 'long', bird: 1}, raccoon: {c: '#8a8a98', c2: '#222', rx: 12, ry: 7, hr: 6, ear: 'round', tail: 'ring', mask: 1},
    fox: {c: '#e8742a', c2: '#fff', rx: 12, ry: 6.5, hr: 6, ear: 'tri', tail: 'bush', white: 1}, fish: {c: '#4ac8ff', c2: '#fff', rx: 8, ry: 5, hr: 0, ear: 'none', tail: 'none'}
  };
  hPet = function (g, e, t) {
    const id = String(e.key).replace('pet:', ''), sp = SP[id]; if (!sp) {g.font = '22px sans-serif'; g.textAlign = 'center'; g.fillText(e.ic, e.x, e.y - 4); return;}
    const mv = e.path && e.path.length, ph = (e.walk || 0) + (mv ? 0 : 0), bob = mv ? Math.abs(Math.sin(t * 13)) * 2.2 : Math.sin(t * 2 + e.x) * .5;
    g.save(); g.translate(e.x, e.y + 3); g.fillStyle = 'rgba(0,0,0,.28)'; g.beginPath(); g.ellipse(0, 0, sp.rx + 2, 3.5, 0, 0, TAU); g.fill(); g.scale((e.dir || 1) * 1.35, 1.35);
    const by = -sp.ry - 3 - bob, k = id === 'parrot';
    // хвост
    g.strokeStyle = sp.c; g.fillStyle = sp.c; g.lineCap = 'round';
    if (sp.tail === 'wag') {g.lineWidth = 3; g.beginPath(); g.moveTo(-sp.rx + 2, by); g.quadraticCurveTo(-sp.rx - 6, by - 6 + Math.sin(t * (mv ? 18 : 9)) * 3, -sp.rx - 7, by - 10); g.stroke();}
    else if (sp.tail === 'curl') {g.lineWidth = 3.2; g.beginPath(); g.moveTo(-sp.rx + 2, by); g.quadraticCurveTo(-sp.rx - 8, by - 4, -sp.rx - 5 + Math.sin(t * 3) * 2, by - 13); g.stroke();}
    else if (sp.tail === 'bush') {g.beginPath(); g.ellipse(-sp.rx - 4, by - 2, 9, 4.5, -.4 + Math.sin(t * 4) * .1, 0, TAU); g.fill(); g.fillStyle = '#fff'; g.beginPath(); g.ellipse(-sp.rx - 11, by - 4, 3.5, 3, -.4, 0, TAU); g.fill();}
    else if (sp.tail === 'ring') {g.beginPath(); g.ellipse(-sp.rx - 4, by - 1, 9, 4, -.3, 0, TAU); g.fill(); g.fillStyle = '#222'; [-3, 2, 7].forEach(o => {g.beginPath(); g.ellipse(-sp.rx - 4 - o, by - 1 + o * .1, 1.6, 3.8, -.3, 0, TAU); g.fill();});}
    else if (sp.tail === 'puff') {g.fillStyle = '#fff'; circ(g, -sp.rx, by + 1, 3.5);} else if (sp.tail === 'long') {g.fillStyle = '#2a9a4a'; g.beginPath(); g.moveTo(-3, by + 6); g.lineTo(-8, by + 20); g.lineTo(-1, by + 12); g.fill(); g.fillStyle = '#e83a3a'; g.beginPath(); g.moveTo(-1, by + 8); g.lineTo(-3, by + 20); g.lineTo(2, by + 12); g.fill();}
    // ноги
    if (!k) {g.fillStyle = sp.c2 === '#fff' ? '#d8b078' : sp.c2; [[-1, 0], [-.4, Math.PI], [.4, 0], [1, Math.PI]].forEach(([a, p]) => {const l = mv ? Math.sin(t * 14 + p) * 2.5 : 0; g.beginPath(); g.ellipse(a * sp.rx * .65 + l, -1.5, 2.4, 2.8, 0, 0, TAU); g.fill();});} else {g.strokeStyle = '#d89a30'; g.lineWidth = 1.6; [-2, 2].forEach(o => {g.beginPath(); g.moveTo(o, by + sp.ry); g.lineTo(o, -1); g.stroke();});}
    // тело
    g.fillStyle = sp.c; g.beginPath(); g.ellipse(0, by, sp.rx, sp.ry, 0, 0, TAU); g.fill();
    if (sp.st) {g.strokeStyle = sp.c2; g.lineWidth = 1.5; [-4, 0, 4].forEach(o => {g.beginPath(); g.moveTo(o, by - sp.ry + .5); g.lineTo(o - 1, by - sp.ry + 4); g.stroke();});}
    if (sp.shell) {g.fillStyle = sp.c2; g.beginPath(); g.ellipse(0, by - 2, sp.rx, sp.ry + 1.5, 0, Math.PI, TAU); g.fill(); g.strokeStyle = '#1a5a2a'; g.lineWidth = 1; for (let i = -1; i <= 1; i++) {g.beginPath(); g.moveTo(i * 4, by - 2); g.lineTo(i * 3, by - sp.ry - 3); g.stroke();}}
    if (sp.spikes) {g.fillStyle = sp.c2; for (let i = -4; i <= 4; i++) {g.beginPath(); g.moveTo(i * 2.2 - 1.6, by - sp.ry + 2); g.lineTo(i * 2.2, by - sp.ry - 5 - (Math.abs(i) < 3 ? 1.5 : 0)); g.lineTo(i * 2.2 + 1.6, by - sp.ry + 2); g.fill();}}
    if (sp.white) {g.fillStyle = '#fff'; g.beginPath(); g.ellipse(sp.rx * .45, by + 2, 5, 3.5, 0, 0, TAU); g.fill();}
    if (k) {g.fillStyle = '#2a9a4a'; g.beginPath(); g.ellipse(-2, by + 1, 3.5, 6.5, .25, 0, TAU); g.fill(); g.fillStyle = '#4ac8ff'; g.beginPath(); g.ellipse(-1, by + 4, 2, 3.5, .25, 0, TAU); g.fill();}
    // голова
    const hx = k ? 2 : sp.rx - 2, hy = k ? by - sp.ry - 2 : by - 2.5; if (sp.hr) {
      g.fillStyle = sp.c; circ(g, hx, hy, sp.hr);
      if (sp.mask) {g.fillStyle = '#222'; g.beginPath(); g.ellipse(hx + 1.5, hy - .5, sp.hr * .95, 2.2, 0, 0, TAU); g.fill();}
      if (sp.ear === 'tri') {g.fillStyle = sp.c; [-1, 1].forEach(a => {g.beginPath(); g.moveTo(hx + a * 4.8 - 2.4, hy - sp.hr + 1.5); g.lineTo(hx + a * 3.8, hy - sp.hr - 6); g.lineTo(hx + a * 4.8 + 2.4, hy - sp.hr + 1.5); g.fill();});}
      else if (sp.ear === 'long') {g.fillStyle = sp.c; [-1, 1].forEach(a => {g.beginPath(); g.ellipse(hx + a * 2.6, hy - sp.hr - 5, 1.9, 6.5, a * .22 + Math.sin(t * 2) * .05, 0, TAU); g.fill();}); g.fillStyle = sp.c2; [-1, 1].forEach(a => {g.beginPath(); g.ellipse(hx + a * 2.6, hy - sp.hr - 5, .9, 4.5, a * .22, 0, TAU); g.fill();});}
      else if (sp.ear === 'flop') {g.fillStyle = sp.c2; [-1, 1].forEach(a => {g.beginPath(); g.ellipse(hx + a * 4.6, hy - 1, 2.4, 4.6, a * .25, 0, TAU); g.fill();});}
      else if (sp.ear === 'round') {g.fillStyle = sp.c; [-1, 1].forEach(a => circ(g, hx + a * 3.8, hy - sp.hr + 1, 1.9));}
      if (k) {g.fillStyle = '#e83a3a'; g.beginPath(); g.arc(hx, hy - 1.5, sp.hr, Math.PI, TAU); g.fill(); g.fillStyle = '#f0a030'; g.beginPath(); g.moveTo(hx + 4, hy - 1); g.quadraticCurveTo(hx + 10, hy + 1, hx + 5, hy + 4); g.lineTo(hx + 3, hy + 1); g.fill();}
      const bl = Math.sin(t * 1.3 + e.x) > .97 ? .2 : 1; g.fillStyle = '#fff'; g.beginPath(); g.ellipse(hx + 2.4, hy - 1, 1.7, 1.7 * bl, 0, 0, TAU); g.fill(); g.fillStyle = '#111'; g.beginPath(); g.ellipse(hx + 2.9, hy - 1, .9, .95 * bl, 0, 0, TAU); g.fill();
      if (!k) {g.fillStyle = id === 'cat' || id === 'dog' || id === 'fox' || id === 'raccoon' ? '#222' : '#e07a8a'; circ(g, hx + sp.hr - .8, hy + 1.5, 1.2); if (id === 'dog' && mv) {g.fillStyle = '#ff7a9a'; g.beginPath(); g.ellipse(hx + sp.hr - 2, hy + 4, 1.2, 2.2 + Math.sin(t * 20), 0, 0, TAU); g.fill();}}
    }
    g.restore();
    if (!mv && e.wait > 0 && e.key !== 'x') {g.font = '11px sans-serif'; g.textAlign = 'center'; g.fillStyle = '#fff'; g.fillText('💤', e.x + 12, e.y - 22 + Math.sin(t * 2) * 2);}
    if (e.say) {g.font = '700 11px sans-serif'; const w = g.measureText(e.say).width + 12; g.fillStyle = 'rgba(255,255,255,.92)'; g.beginPath(); g.roundRect ? g.roundRect(e.x - w / 2, e.y - 44, w, 18, 7) : g.rect(e.x - w / 2, e.y - 44, w, 18); g.fill(); g.fillStyle = '#222'; g.fillText(e.say, e.x, e.y - 31);}
  };
  function circ(g, x, y, r) {g.beginPath(); g.arc(x, y, r, 0, TAU); g.fill();}
  /* ---------- жена и гостья ходят по дому ---------- */
  const _hs = hSync;
  hSync = function () {
    _hs.apply(this, arguments);
    try {const h = H(), add = (key, id) => {const nm = NM[id] || 'Она'; let e = HM.ents[key]; if (!e) {const pos = [[300, 130], [440, 150], [150, 140]][hash(key) % 3]; e = HM.ents[key] = {x: pos[0], y: pos[1], path: [], wait: Math.random() * 2, kind: 'rm', key, ic: '👩', n: nm, rk: 'hr', act: '', dir: 1};} e.n = nm;};
      if (h.wife && hOpen('liv')) add('fam:wife', h.wife); else if (h.wife) add('fam:wife', h.wife);
      if (h.guest === S.day && h.guestId && h.guestId !== h.wife) add('fam:guest', h.guestId);
      ['fam:wife', 'fam:guest'].forEach(k => {if (HM.ents[k] && !((k === 'fam:wife' && h.wife) || (k === 'fam:guest' && h.guest === S.day && h.guestId && h.guestId !== h.wife))) delete HM.ents[k];});
    } catch (e) {}
  };
  const _ha = hActsFor;
  hActsFor = function (ent) {
    if (ent.type === 'rm' && String(ent.id).indexOf('fam:') === 0) {
      const h = H(), id = ent.id === 'fam:wife' ? h.wife : h.guestId, A = [], who = NM[id] || 'Она', put = (t, m, lim, fn) => A.push({t, m, lim, fn}), rec = () => (h.dates || []).find(x => x.id === id);
      put('💬 Поговорить', 15, ['fmt' + ent.id, 2], () => {hFx(3, 2); const r = rec(); if (r) r.aff = clamp(r.aff + 2, 0, 100); return pick([who + ' рассказала про свой день, вы про свой. Без лишних слов.', who + ' смеётся над вашей историей про коллег.', 'Вы вдвоём молчали на кухне, и это было хорошо.']);});
      put('🤗 Обнять', 5, ['fmh' + ent.id, 2], () => {hFx(4, 2); sn('heart'); return who + ' прижалась и тихо сказала: «Всё будет хорошо».';});
      put('🍳 Приготовить вместе (₴60)', 30, ['fmc' + ent.id, 1], () => {if (S.money < 60) return 'Не хватает на продукты.'; hFx(9, 2, -60); sn('coffee'); return 'Вдвоём готовить веселее. Ужин вышел почти как в ресторане.';});
      if (ent.id === 'fam:wife') put('💐 Сделать сюрприз (₴250)', 20, ['fms', 1], () => {if (S.money < 250) return 'Не хватает денег.'; hFx(6, 4, -250); sn('good'); return who + ' долго молчала, а потом обняла так, что дух перехватило.';});
      return A;
    }
    return _ha.apply(this, arguments);
  };
  /* вместо h.guestN запоминаем id гостьи (для карты) */
  const _ce = document.addEventListener.bind(document);
  document.addEventListener('click', e => {const b = e.target.closest('[data-a="dt"]'); if (b && /:home$/.test(b.dataset.v || '')) {const id = b.dataset.v.split(':')[0]; setTimeout(() => {try {if (H().guest === S.day) H().guestId = id;} catch (er) {}}, 0);}}, false);
  /* ---------- звуки дома ---------- */
  let stp = 0, amb = 4, tk = 3, last = 0;
  const _ht = hTick;
  hTick = function (dt) {
    _ht.apply(this, arguments);
    try {
      if (HM.moving) {stp += dt; if (stp > .3) {stp = 0; sn('step');}} else stp = .2;
      amb -= dt; tk -= dt;
      if (tk <= 0) {tk = 6 + Math.random() * 6; sn('tick');}
      if (amb <= 0) {amb = 5 + Math.random() * 7; const r = hRoomAt(HM.x, HM.y);
        const near = Object.values(HM.ents).filter(q => q.kind === 'pet' && Math.hypot(q.x - HM.x, q.y - HM.y) < 90);
        const PS = {dog: 'woof', cat: 'meow', ham: 'squeak', turtle: 'bloop', hedge: 'snuf', rabbit: 'thump', parrot: 'chirp', raccoon: 'splash', fox: 'yip'};
        if (near.length && Math.random() < .7) sn(PS[String(near[0].key).replace('pet:', '')] || 'pop');
        else if (r === 'liv' && tier('f', 'tv')) sn('voice'); else if (r === 'kit') sn(Math.random() < .5 ? 'coffee' : 'paper'); else if (r === 'bath') sn('bubble'); else if (r === 'bal') sn('whoosh');
        if (HM.ents['fam:wife'] && Math.random() < .25) sn('notif');}
    } catch (e) {}
  };
})();
