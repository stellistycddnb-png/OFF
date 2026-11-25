/* ======== build 1.7.0 · питомцы 2.0: новые животные, бегают по дому, играют с хозяином ======== */
PETS.push(
  {id: 'turtle', n: 'Черепаха Инфляция', ic: '🐢', price: 250, up: 6, cons: 1, en: 0, q: ['Инфляция ползёт медленно, но верно. Как и всё остальное.', 'Черепаха смотрит на вас с мудростью веков.']},
  {id: 'hedge', n: 'Ёж Штраф', ic: '🦔', price: 300, up: 8, cons: 1.5, en: 0, q: ['Ёж Штраф свернулся клубком: как будто тоже читал отчёты.', 'Штраф опять фыркает на вашу обувь.']},
  {id: 'rabbit', n: 'Кролик Профит', ic: '🐇', price: 350, up: 12, cons: 2, en: 1, q: ['Профит прыгает по комнате быстрее, чем растёт ваш оборот.', 'Кролик нервно жуёт морковь. Вы его понимаете.']},
  {id: 'parrot', n: 'Попугай Кредит', ic: '🦜', price: 450, up: 14, cons: 2, en: 0, q: ['Попугай Кредит кричит: «Ваш звонок очень важен для нас!»', 'Кредит передразнил шефа. Слишком похоже.']},
  {id: 'raccoon', n: 'Енот Налог', ic: '🦝', price: 800, up: 25, cons: 2.5, en: 2, q: ['Енот Налог постирал ваш носок вместе с миской. Ничего личного.', 'Налог утащил пульт и не признаётся.']},
  {id: 'fox', n: 'Лис Конфликт', ic: '🦊', price: 1200, up: 35, cons: 3, en: 3, q: ['Лис Конфликт устроил в прихожей засаду на ботинки.', 'Конфликт ходит по дому как хозяин. Формально он прав.']}
);
const PET_INFO = {
  ham: {ic: '🐹', n: 'Хомяк Бульба', sp: 70, rooms: ['bed', 'liv'], snd: ['*топ-топ*', 'Колесо! Колесо!']},
  turtle: {ic: '🐢', n: 'Черепаха Инфляция', sp: 12, rooms: ['liv', 'kit'], snd: ['Не спеши…', 'Всё растёт. Всё дорожает.']},
  hedge: {ic: '🦔', n: 'Ёж Штраф', sp: 30, rooms: ['bed', 'ent'], snd: ['Фыр-фыр.', 'Штраф вам, штраф всем.']},
  rabbit: {ic: '🐇', n: 'Кролик Профит', sp: 90, rooms: ['liv', 'kit', 'ent'], snd: ['Прыг-скок!', 'Морковь где?']},
  parrot: {ic: '🦜', n: 'Попугай Кредит', sp: 60, rooms: ['liv', 'bed'], snd: ['Ваш звонок важен!', 'Оформляем?', 'Кра-кредит!']},
  raccoon: {ic: '🦝', n: 'Енот Налог', sp: 70, rooms: ['kit', 'ent'], snd: ['Тут моё.', 'Не трогай, постираю.']},
  fox: {ic: '🦊', n: 'Лис Конфликт', sp: 95, rooms: ['liv', 'ent', 'bed'], snd: ['Тяв!', 'Кто виноват?']}
};
/* все питомцы (кроме рыбок) ходят по квартире */
const _hs23 = hSync;
hSync = function () {
  _hs23(); (S.pets || []).forEach(id => {const pi = PET_INFO[id]; if (!pi) return; const k = 'pet:' + id; if (!HM.ents[k]) HM.ents[k] = {x: 300 + Math.random() * 100, y: 150, path: [], wait: 1, kind: 'pet', key: k, ic: pi.ic, n: pi.n, act: '', dir: 1, sp: pi.sp};});
  const have = new Set((S.pets || []).map(x => 'pet:' + x)); Object.keys(HM.ents).forEach(k => {if (k.startsWith('pet:') && !have.has(k)) delete HM.ents[k];});
};
/* у каждого вида своя скорость и комнаты */
const _hAI23 = hAI;
hAI = function (e, dt) {
  const pi = e.kind === 'pet' && PET_INFO[e.key.slice(4)];
  if (pi && !(e.path && e.path.length) && e.wait <= 0 && !e.say && Math.random() < .35) {e.say = pick(pi.snd); e.sayT = 3;}
  if (pi && e.path && e.path.length) {hFollow(e, dt, pi.sp); e.wait -= dt; if (e.say) {e.sayT -= dt; if (e.sayT <= 0) e.say = '';} return;}
  if (pi && e.wait <= 0 && !(e.path && e.path.length)) {const rooms = pi.rooms.filter(hOpen); if (rooms.length) {const r = HR_ROOMS[pick(rooms)]; e.path = hPath(e.x, e.y, r.x + 30 + Math.random() * (r.w - 60), r.y + 40 + Math.random() * (r.h - 80)); e.wait = 3 + Math.random() * 7; return;}}
  _hAI23(e, dt);
};
/* реплики питомцев над головой */
const _hp23 = hPet;
hPet = function (g, e, t) {_hp23(g, e, t); if (e.say) {g.font = '700 11px sans-serif'; const w = g.measureText(e.say).width + 12; g.fillStyle = 'rgba(255,255,255,.92)'; g.beginPath(); g.roundRect ? g.roundRect(e.x - w / 2, e.y - 42, w, 18, 8) : g.rect(e.x - w / 2, e.y - 42, w, 18); g.fill(); g.fillStyle = '#222'; g.textAlign = 'center'; g.fillText(e.say, e.x, e.y - 29);}};
/* игры с питомцами */
const PET_ACTS = {
  dog: [['🎾 Бросить мячик', 15, 'pt', () => {hFx(4, 2); return 'Откат принёс мячик семь раз подряд и всё равно хочет ещё.';}]],
  cat: [['🧶 Поиграть с клубком', 10, 'pt', () => {hFx(2, 2); return 'Дивиденд устроил на клубке «слияние и поглощение».';}]],
  ham: [['🎡 Покрутить колесо', 5, 'pt', () => {hFx(1, 1.5); return 'Бульба бежит, как вы в понедельник: быстро и в никуда.';}]],
  turtle: [['⏳ Сидеть рядом', 20, 'pt', () => {hFx(5, 2); return 'Вы молча сидели рядом. Инфляция не торопится, и вам стало спокойнее.';}]],
  hedge: [['🍎 Угостить яблоком', 5, 'pt', () => {hFx(0, 2); return 'Штраф понёс яблоко в угол, как будто прячет улику.';}]],
  rabbit: [['🥕 Дать морковку', 5, 'pt', () => {hFx(2, 2); return 'Профит схрумкал морковку и благодарно дрыгнул ногой.';}]],
  parrot: [['🗣 Научить слову', 10, 'pt', () => {const w = pick(['«Ваш кредит одобрен»', '«Не кладите трубку»', '«Шеф, я всё объясню»']); hFx(0, 2); return 'Кредит выучил слово ' + w + ' и теперь повторяет всем гостям.';}]],
  raccoon: [['🧦 Дать постирать носок', 5, 'pt', () => {hFx(1, 2); return 'Налог долго тёр носок в миске. Носок теперь чище, миска — нет.';}]],
  fox: [['🙈 Поиграть в прятки', 15, 'pt', () => {hFx(4, 2.5); return 'Конфликт спрятался в ботинке, но хвост торчал на всю прихожую.';}]]
};
const _hAF23 = hActsFor;
hActsFor = function (ent) {
  const A = _hAF23(ent); if (ent.type !== 'pet') return A; const id = String(ent.id).replace('pet:', ''), L = PET_ACTS[id]; if (L) L.forEach((x, i) => A.push({t: x[0], m: x[1], lim: [x[2] + id, 2], fn: x[3]})); return A;
};
/* питомцы в «Что нового» уже в v121 */
