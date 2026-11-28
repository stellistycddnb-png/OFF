'use strict';
/* v149: клиенты из России: города, суммы в рублях (оклад и комиссия остаются в гривнах) */
(function () {
  const CITY = ['Самара', 'Тверь', 'Рязань', 'Омск', 'Курск', 'Пермь', 'Тула', 'Ижевск', 'Саратов', 'Воронеж', 'Липецк', 'Тамбов', 'Казань', 'Уфа', 'Новосибирск', 'Брянск', 'Орёл', 'Киров', 'Псков', 'Вологда'];
  const _a = answer;
  answer = function () {_a.apply(this, arguments); try {const c = S && S.call; if (c && !c.city) c.city = CITY[Math.floor(Math.random() * CITY.length)];} catch (e) {}};
  const _r = render;
  render = function () {_r.apply(this, arguments); try {const c = S && S.call; if (!c || S.mode !== 'call') return; const b = document.querySelector('#main .caller .bio'); if (b && c.city && !b.dataset.cy) {b.dataset.cy = 1; b.insertAdjacentHTML('beforeend', ' <span style="color:#7ff3ff">📍 ' + c.city + ', Россия</span>');}} catch (e) {}};
  const _su = success;
  success = function () {const c = S.call; _su.apply(this, arguments); try {const p = document.querySelector('#scr .box.story p'); if (p && c && c.city) p.insertAdjacentHTML('beforebegin', '<p style="color:#7ff3ff;font-size:13px">📍 ' + c.city + ', Россия. Суммы «выводятся» в рублях, ваш оклад и комиссия в гривнах.</p>');} catch (e) {}};
})();
