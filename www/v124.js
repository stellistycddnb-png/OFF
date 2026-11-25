'use strict';
/* v124: больше звуков — интерфейс, питомцы, дом, корпоративы. MADE BY PESSIMIST */
(function () {
  const sf = n => {try {Snd.sfx(n);} catch (e) {}};
  let lastScr = 0;
  /* открытие экранов */
  const _ss = showScr;
  showScr = function (h, d) {const r = _ss(h, d); const t = Date.now(); if (t - lastScr > 350) {sf('swish'); lastScr = t;} return r;};
  /* питомцы */
  const PS = {dog: 'woof', cat: 'purr', ham: 'squeak', turtle: 'bloop', hedge: 'snuf', rabbit: 'thump', parrot: 'chirp', raccoon: 'splash', fox: 'yip'};
  Object.keys(PET_ACTS).forEach(id => PET_ACTS[id].forEach(a => {const f = a[3]; a[3] = function () {const r = f.apply(this, arguments); sf(PS[id] || 'pop'); if (r) setTimeout(() => sf('sparkle'), 250); return r;};}));
  const _hp = hDoAct; hDoAct = function (i) {sf('pop'); return _hp.apply(this, arguments);};
  /* корпоратив и вечеринка */
  const _cs = corpShow; corpShow = function (d) {const r = _cs.apply(this, arguments); sf('fanfare'); setTimeout(() => sf('clink'), 700); setTimeout(() => sf('cheer'), 900); return r;};
  /* новый день */
  const _nd = nextDay; nextDay = function () {const r = _nd.apply(this, arguments); sf('rooster'); return r;};
  /* клик по кнопкам дома/уборки/вечеринки */
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-a]'); if (!b) return; const a = b.dataset.a;
    if (a === 'chore') sf('sweep'); else if (a === 'party') sf('drum'); else if (a === 'upd_check') sf('ding');
    else if (/^h_buy|^h_car/.test(a)) sf('cash'); else if (a === 'chores') sf('swish');
  }, true);
  /* интро */
  setTimeout(() => {const it = document.getElementById('intro'); if (!it) return; const go = () => {sf('boom'); setTimeout(() => sf('sparkle'), 600); setTimeout(() => sf('whoosh'), 1500);}; document.addEventListener('pointerdown', function f() {document.removeEventListener('pointerdown', f); go();}, {once: true});}, 100);
})();
