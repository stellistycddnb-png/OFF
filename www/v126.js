'use strict';
/* v126: новые достижения и звук достижения. MADE BY PESSIMIST */
ACH.push(
  {id: 'pet3', n: 'Зоопарк на дому', d: 'Завести 3 питомцев', c: () => S.pets && S.pets.length >= 3},
  {id: 'pet5', n: 'Ной местного разлива', d: 'Завести 5 питомцев', c: () => S.pets && S.pets.length >= 5},
  {id: 'party1', n: 'Душа компании', d: 'Устроить вечеринку дома', c: () => {const h = H(); return !!(h && h.party);}},
  {id: 'chore3', n: 'Чистюля', d: 'Сделать все дела по дому за день', c: () => {const h = H(); return !!(h && h.chores && h.chores.list && h.chores.list.length && h.chores.list.every(x => x.done));}},
  {id: 'corp3', n: 'Король корпоративов', d: 'Побывать на 3 корпоративах', c: () => S.corpDone && Object.keys(S.corpDone).length >= 3}
);
(function () {
  const _t = toast;
  toast = function (m, k) {if (typeof m === 'string' && m.indexOf('🏆') === 0) {try {Snd.sfx('levelup');} catch (e) {}} return _t.apply(this, arguments);};
})();
