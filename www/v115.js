/* ======== build 1.4.0: интерактивный ДОМ (ходьба по квартире, жильцы, питомцы) ======== */
const HR_ROOMS = {
  bed: {x: 0, y: 0, w: 260, h: 210, n: 'Спальня', lv: 0, fl: '#4b3a60', dx: 130, side: 'b'},
  liv: {x: 260, y: 0, w: 260, h: 210, n: 'Гостиная', lv: 2, fl: '#3f5068', dx: 390, side: 'b'},
  kit: {x: 520, y: 0, w: 200, h: 210, n: 'Кухня', lv: 1, fl: '#56513f', dx: 620, side: 'b'},
  bath: {x: 0, y: 260, w: 200, h: 200, n: 'Ванная', lv: 2, fl: '#2f5662', dx: 100, side: 't'},
  bal: {x: 200, y: 260, w: 260, h: 200, n: 'Балкон', lv: 3, fl: '#2f4b3b', dx: 330, side: 't'},
  ent: {x: 460, y: 260, w: 260, h: 200, n: 'Прихожая', lv: 0, fl: '#4b4150', dx: 590, side: 't'}
};
const HM = {gen: 0, x: 130, y: 235, path: [], keys: {}, t: 0, ents: {}, key: '', acts: [], msg: '', bub: {}, dir: 1, walk: 0};
const hLv = () => (S && S.life ? S.life.h : 0);
const hOpen = id => id === 'hall' || hLv() >= HR_ROOMS[id].lv;
function hRoomAt(x, y) {if (y >= 210 && y <= 260) return 'hall'; for (const k in HR_ROOMS) {const r = HR_ROOMS[k]; if (x >= r.x && x < r.x + r.w && y >= r.y && y < r.y + r.h) return k;} return 'hall';}
function hCan(ox, oy, nx, ny) {
  if (nx < 10 || nx > 710 || ny < 14 || ny > 450) return false; const a = hRoomAt(ox, oy), b = hRoomAt(nx, ny); if (!hOpen(b)) return false;
  if (a !== b) {if (a !== 'hall' && b !== 'hall') return false; const R = HR_ROOMS[a === 'hall' ? b : a]; if (Math.abs(nx - R.dx) > 20 || Math.abs(ox - R.dx) > 20) return false;}
  if (b === 'hall') return ny >= 216 && ny <= 254 || Object.values(HR_ROOMS).some(R => hOpen(Object.keys(HR_ROOMS).find(k => HR_ROOMS[k] === R)) && Math.abs(nx - R.dx) <= 20);
  const R = HR_ROOMS[b]; if (nx < R.x + 12 || nx > R.x + R.w - 12) return false;
  if (R.side === 'b') return ny >= R.y + 16 && (ny <= R.y + R.h - 12 || Math.abs(nx - R.dx) <= 20); return ny <= R.y + R.h - 12 && (ny >= R.y + 12 || Math.abs(nx - R.dx) <= 20);
}
function hPath(x, y, tx, ty) {
  const a = hRoomAt(x, y), b = hRoomAt(tx, ty), p = []; if (a === b) return [[tx, ty]]; const dIn = k => {const R = HR_ROOMS[k]; return [R.dx, R.side === 'b' ? R.y + R.h - 20 : R.y + 22];};
  if (a !== 'hall') {p.push(dIn(a)); p.push([HR_ROOMS[a].dx, 235]);} if (b !== 'hall') {p.push([HR_ROOMS[b].dx, 235]); p.push(dIn(b));} p.push([tx, ty]); return p;
}
function hStep(e, dx, dy) {if (hCan(e.x, e.y, e.x + dx, e.y + dy)) {e.x += dx; e.y += dy; return true;} if (dx && hCan(e.x, e.y, e.x + dx, e.y)) {e.x += dx; return true;} if (dy && hCan(e.x, e.y, e.x, e.y + dy)) {e.y += dy; return true;} return false;}
function hFollow(e, dt, sp) {
  if (!e.path || !e.path.length) return false; const w = e.path[0], dx = w[0] - e.x, dy = w[1] - e.y, d = Math.hypot(dx, dy); if (d < 4) {e.path.shift(); return true;}
  const st = Math.min(d, sp * dt); const ok = hStep(e, dx / d * st, dy / d * st); if (!ok) {e.stuck = (e.stuck || 0) + dt; if (e.stuck > .5) {e.path = []; e.stuck = 0;}} else e.stuck = 0; if (Math.abs(dx) > 1) e.dir = dx > 0 ? 1 : -1; e.walk = (e.walk || 0) + dt * 10; return true;
}
/* --- точки интереса --- */
function hPois() {
  const o = [], h = H(), lv = hLv();
  o.push({id: 'bed', room: 'bed', x: 65, y: 70, ic: '🛏', n: 'Кровать'}, {id: 'ward', room: 'bed', x: 215, y: 95, ic: '🚪', n: 'Шкаф'});
  if (lv >= 1) o.push({id: 'pc', room: 'bed', x: 180, y: 168, ic: '💻', n: 'Компьютер'}); o.push({id: 'door', room: 'ent', x: 590, y: 425, ic: '🚪', n: 'Входная дверь'}, {id: 'ment', room: 'ent', x: 500, y: 310, ic: '🪞', n: 'Зеркало'});
  if (lv >= 1) o.push({id: 'fridge', room: 'kit', x: 685, y: 70, ic: '🧊', n: 'Холодильник'}, {id: 'table', room: 'kit', x: 620, y: 130, ic: '🍽', n: 'Кухонный стол'});
  if (lv >= 2) o.push({id: 'sofa', room: 'liv', x: 335, y: 150, ic: '🛋', n: tier('f', 'sofa') ? 'Диван' : 'Пуф на полу'}, {id: 'tv', room: 'liv', x: 390, y: 52, ic: '📺', n: tier('f', 'tv') ? 'Телевизор' : 'Пустая стена'}, {id: 'shower', room: 'bath', x: 50, y: 330, ic: '🚿', n: 'Душ'}, {id: 'mirror', room: 'bath', x: 150, y: 310, ic: '🪞', n: 'Зеркало в ванной'});
  if (lv >= 2 && tier('f', 'plant')) o.push({id: 'plant', room: 'liv', x: 490, y: 150, ic: '🪴', n: 'Растения'});
  if (lv >= 3) o.push({id: 'view', room: 'bal', x: 330, y: 410, ic: '🌃', n: 'Вид на город'}, {id: 'chair', room: 'bal', x: 260, y: 340, ic: '🪑', n: 'Кресло'});
  (S.pets || []).forEach(id => {if (id === 'fish') o.push({id: 'pet:fish', room: lv >= 2 ? 'liv' : 'bed', x: lv >= 2 ? 300 : 220, y: lv >= 2 ? 60 : 40, ic: '🐟', n: 'Аквариум'}); if (id === 'ham') o.push({id: 'pet:ham', room: 'bed', x: 30, y: 175, ic: '🐹', n: 'Клетка хомяка'});});
  return o;
}
const hPoiPos = id => {const p = hPois().find(x => x.id === id); return p ? [p.x, p.y + 18] : [130, 235];};
/* --- состояние дня --- */
const hUse = (k, max) => {if (!S.hd || S.hd.d !== S.day) S.hd = {d: S.day, u: {}}; return S.hd.u[k] || 0 < max ? (S.hd.u[k] || 0) < max : false;};
const hUsed = k => {if (!S.hd || S.hd.d !== S.day) S.hd = {d: S.day, u: {}}; return S.hd.u[k] || 0;};
const hMark = k => {hUsed(k); S.hd.u[k] = (S.hd.u[k] || 0) + 1;};
const hFx = (e, c, m) => {S.energy = clamp(S.energy + (e || 0), 0, 100); S.cons = clamp(S.cons + (c || 0), 0, 100); if (m) S.money += m;};
const hRm = key => S.rm.find(r => r.key === key);
/* --- жильцы и питомцы как ходячие сущности --- */
function hSync() {
  X3(); const keep = {}; S.rm.forEach(r => {let e = HM.ents[r.key]; if (!e) {const pos = [[300, 150], [580, 150], [130, 150], [420, 120], [650, 100]][Object.keys(HM.ents).length % 5]; e = HM.ents[r.key] = {x: pos[0], y: pos[1], path: [], wait: Math.random() * 3, kind: 'rm', key: r.key, ic: r.ic, n: r.n, rk: r.kind, act: '', dir: 1};} keep[r.key] = 1;});
  (S.pets || []).forEach(id => {if (id === 'cat' || id === 'dog') {const k = 'pet:' + id; if (!HM.ents[k]) HM.ents[k] = {x: 200, y: 150, path: [], wait: 1, kind: 'pet', key: k, ic: id === 'cat' ? '🐈' : '🐕', n: id === 'cat' ? 'Кот' : 'Пёс', act: '', dir: 1}; keep[k] = 1;}});
  Object.keys(HM.ents).forEach(k => {if (!keep[k]) delete HM.ents[k];});
}
const H_ACT_IC = {bed: '💤', tv: '📺', sofa: '📺', fridge: '🍳', table: '🍽', shower: '🚿', view: '🌃', chair: '☕', pc: '💻', plant: '🪴', mirror: '💄', ward: '👔'};
const H_SAY = {hr: ['Как день прошёл?', 'Я приготовила ужин.', 'Поможешь с посудой?', 'Ты сегодня поздно.', 'Давай посмотрим кино?', 'Обними меня.'], tm: ['Можно взять чай?', 'Ты шумный сегодня.', 'Дашь пару сотен до зарплаты?', 'Я тут задержался на кухне.'], st: ['Шеф, дело движется.', 'Спасибо за жильё.', 'Мне завтра рано на смену.']};
function hAI(e, dt) {
  e.wait -= dt; if (e.say) {e.sayT -= dt; if (e.sayT <= 0) e.say = '';}
  if (e.path && e.path.length) {hFollow(e, dt, e.kind === 'pet' ? 55 : 48); return;}
  if (e.wait > 0) return; e.act = ''; const lv = hLv();
  if (e.kind === 'pet') {const rooms = ['bed', 'liv', 'kit', 'ent'].filter(hOpen), r = HR_ROOMS[pick(rooms)]; const tx = r.x + 30 + Math.random() * (r.w - 60), ty = r.y + 40 + Math.random() * (r.h - 80); e.path = hPath(e.x, e.y, tx, ty); e.wait = 4 + Math.random() * 8; return;}
  const ps = hPois().filter(p => hOpen(p.room) && H_ACT_IC[p.id]); if (!ps.length) {e.wait = 5; return;}
  let tgt = pick(ps); const rr = S.rm.find(x => x.key === e.key); if (rr && rr.kind === 'hr' && H().gf === rr.id && Math.random() < .35) {tgt = {x: HM.x + 22, y: HM.y - 6, id: 'me'};}
  const pos = tgt.id === 'me' ? [tgt.x, tgt.y] : [tgt.x, tgt.y + 20]; e.path = hPath(e.x, e.y, pos[0], pos[1]); e.nextAct = tgt.id === 'me' ? '💞' : H_ACT_IC[tgt.id]; e.wait = 7 + Math.random() * 10; e.arr = true;
  if (Math.random() < .3) {e.say = pick(H_SAY[e.rk] || H_SAY.tm); e.sayT = 4;}
}
function hTick(dt) {
  HM.t += dt; const sp = 125, k = HM.keys; let dx = (k.r ? 1 : 0) - (k.l ? 1 : 0), dy = (k.d ? 1 : 0) - (k.u ? 1 : 0);
  if (dx || dy) {HM.path = []; const d = Math.hypot(dx, dy); hStep(HM, dx / d * sp * dt, dy / d * sp * dt); if (dx) HM.dir = dx > 0 ? 1 : -1; HM.walk += dt * 11; HM.moving = true;}
  else if (HM.path.length) {HM.moving = hFollow(HM, dt, sp);} else HM.moving = false;
  Object.values(HM.ents).forEach(e => {const had = e.path && e.path.length; hAI(e, dt); if (had && !(e.path && e.path.length) && e.nextAct) {e.act = e.nextAct; e.nextAct = '';}});
}
/* --- рисование --- */
function hDraw(cv) {
  const g = cv.getContext('2d'), t = HM.t, lvl = hLv(), pent = lvl >= 4; g.clearRect(0, 0, 720, 460); g.fillStyle = '#120d22'; g.fillRect(0, 0, 720, 460);
  const hall = g.createLinearGradient(0, 210, 0, 260); hall.addColorStop(0, '#3a3454'); hall.addColorStop(1, '#2c2744'); g.fillStyle = hall; g.fillRect(0, 210, 720, 50); g.fillStyle = 'rgba(255,255,255,.04)'; for (let x = 0; x < 720; x += 40) g.fillRect(x, 210, 20, 50);
  for (const k in HR_ROOMS) {
    const R = HR_ROOMS[k], on = hOpen(k); g.fillStyle = on ? R.fl : '#1d1830'; g.fillRect(R.x, R.y, R.w, R.h);
    if (on) {g.fillStyle = 'rgba(255,255,255,.035)'; for (let i = 0; i < R.w; i += 26) g.fillRect(R.x + i, R.y, 13, R.h);} else {g.fillStyle = '#6a5f8a'; g.font = '700 14px sans-serif'; g.textAlign = 'center'; g.fillText('🔒 ' + R.n, R.x + R.w / 2, R.y + R.h / 2 - 4); g.font = '11px sans-serif'; g.fillStyle = '#5a5078'; g.fillText('нужно жильё побольше', R.x + R.w / 2, R.y + R.h / 2 + 14);}
  }
  const tv = tier('f', 'tv'), sf = tier('f', 'sofa'), bd = tier('f', 'bed'), kt = tier('f', 'kit'), rg = tier('f', 'rug'), lp = tier('f', 'lamp'), pl = tier('f', 'plant');
  // спальня
  g.fillStyle = bd ? ['', '#6a4a2a', '#e8e0f0', '#4a2a7a'][bd] : '#6a6a6a'; g.fillRect(20, 30, 90, bd ? 78 : 56); g.fillStyle = '#f0f0ff'; g.fillRect(26, 36, 30, 16); if (bd >= 2) g.fillRect(60, 36, 30, 16); g.fillStyle = 'rgba(0,0,0,.2)'; g.fillRect(20, 30 + (bd ? 78 : 56) - 6, 90, 6);
  g.fillStyle = '#3a2a22'; g.fillRect(195, 40, 40, 110); g.fillStyle = '#5a4030'; g.fillRect(199, 44, 15, 102); g.fillRect(217, 44, 15, 102); g.fillStyle = '#d0b070'; g.fillRect(212, 90, 2, 10); g.fillRect(217, 90, 2, 10);
  if (lvl >= 1) {g.fillStyle = '#4a3a2a'; g.fillRect(140, 150, 80, 34); g.fillStyle = '#111'; g.fillRect(168, 130, 26, 18); g.fillStyle = '#4ac8ff'; g.fillRect(170, 132, 22, 14);}
  g.fillStyle = '#08122a'; g.fillRect(140, 4, 80, 12); g.fillStyle = '#ffe9a0'; g.fillRect(150, 7, 4, 4); g.fillRect(190, 8, 3, 3);
  if ((S.pets || []).includes('ham')) {g.font = '20px sans-serif'; g.textAlign = 'center'; g.fillText('🛖', 30, 185); }
  // гостиная
  if (lvl >= 2) {
    if (rg) {g.fillStyle = ['', '#7a3a3a', '#3a5a7a', '#8a6a2a'][rg]; g.beginPath(); g.ellipse(390, 112, 60 + rg * 8, 34 + rg * 5, 0, 0, 7); g.fill(); if (rg === 3) {g.strokeStyle = '#ffd23a'; g.lineWidth = 2; g.stroke();}}
    g.fillStyle = sf ? ['', '#6a6a7a', '#7a4a2a', '#9a2a3a'][sf] : '#5a5a6a'; if (sf) {g.fillRect(325, 135, 120 + (sf === 3 ? 30 : 0), 48); g.fillStyle = 'rgba(0,0,0,.2)'; g.fillRect(325, 135, 120 + (sf === 3 ? 30 : 0), 12);} else {g.beginPath(); g.arc(335, 160, 18, 0, 7); g.fill();}
    if (tv) {const w = [0, 46, 62, 80][tv]; g.fillStyle = '#111'; g.fillRect(390 - w / 2, 22, w, w * .55); g.fillStyle = 'hsl(' + (t * 40 % 360) + ',70%,45%)'; g.fillRect(392 - w / 2, 24, w - 4, w * .55 - 4); g.fillStyle = '#222'; g.fillRect(360, 22 + w * .55, 60, 8);} else {g.fillStyle = '#2a2a3a'; g.fillRect(360, 22, 60, 10);}
    if (lp === 3) {g.save(); g.shadowColor = '#ff3ac8'; g.shadowBlur = 14; g.fillStyle = '#ff7adf'; g.font = '900 13px Impact,sans-serif'; g.textAlign = 'center'; g.fillText('MAKE MONEY', 470, 24); g.restore();} else if (lp) {g.font = '22px sans-serif'; g.textAlign = 'center'; g.fillText(lp === 1 ? '💡' : '🪔', 285, 40);}
    if (pl) {g.font = (18 + pl * 5) + 'px sans-serif'; g.textAlign = 'center'; g.fillText(pl === 1 ? '🌵' : pl === 2 ? '🪴' : '🌴', 495, 160);}
    if ((S.pets || []).includes('fish')) {g.fillStyle = '#12446a'; g.fillRect(285, 40, 48, 30); g.fillStyle = '#3aa0ff'; g.fillRect(287, 42, 44, 26); g.font = '14px sans-serif'; g.fillText('🐟', 300 + Math.sin(t) * 10, 62);}
    // ванная
    g.fillStyle = '#dfe8ee'; g.fillRect(20, 290, 56, 80); g.fillStyle = '#9ad0ee'; g.fillRect(24, 294, 48, 72); g.fillStyle = '#e8eef2'; g.fillRect(130, 280, 40, 26); g.fillStyle = '#6ab0d0'; g.fillRect(138, 266, 24, 12); g.fillStyle = '#e8eef2'; g.beginPath(); g.ellipse(150, 400, 22, 28, 0, 0, 7); g.fill();
  }
  if (lvl >= 1) {
    // кухня
    g.fillStyle = ['#3a3a4a', '#5a4a3a', '#6a6a7a', '#2a2a3a'][kt]; g.fillRect(528, 10, 180, 34); g.fillStyle = '#d8e0e8'; g.fillRect(668, 44, 34, 56); g.fillStyle = '#222'; g.fillRect(670, 70, 30, 2); g.fillStyle = '#ccd'; g.fillRect(548, 14, 40, 10); g.beginPath(); g.arc(610, 28, 6, 0, 7); g.arc(630, 28, 6, 0, 7); g.fillStyle = '#111'; g.fill();
    g.fillStyle = kt >= 3 ? '#c0b090' : '#5a4430'; g.beginPath(); g.ellipse(620, 138, 52, 30, 0, 0, 7); g.fill(); g.font = '15px sans-serif'; g.textAlign = 'center'; g.fillText('🪑', 575, 142); g.fillText('🪑', 665, 142); g.fillText('☕', 620, 142);
  }
  if (lvl >= 3) {g.fillStyle = '#1d3b2c'; g.fillRect(204, 264, 252, 12); g.fillStyle = '#6a8a7a'; g.fillRect(204, 440, 252, 6); g.font = '22px sans-serif'; g.textAlign = 'center'; g.fillText('🌿', 230, 300); g.fillText('🪴', 430, 300); g.fillText('🌆', 330, 440);}
  g.fillStyle = '#2a2230'; g.fillRect(560, 442, 60, 14); g.fillStyle = '#c09050'; g.fillRect(564, 444, 52, 10); g.fillStyle = '#5a4a3a'; g.fillRect(680, 280, 24, 60); g.font = '16px sans-serif'; g.textAlign = 'center'; g.fillText('🧥', 692, 305); g.fillText(CARS[H().car].ic, 480, 430); g.font = '10px sans-serif'; g.fillStyle = '#9a8fb8'; g.fillText('ключи', 480, 444);
  // стены (с проёмами)
  g.strokeStyle = pent ? '#d8b04a' : '#0d0919'; g.lineWidth = 6; g.lineCap = 'butt';
  const seg = (x1, y1, x2, y2) => {g.beginPath(); g.moveTo(x1, y1); g.lineTo(x2, y2); g.stroke();};
  seg(0, 210, 720, 210); /* перекрываем проёмы цветом коридора */ g.strokeStyle = '#2f2a48'; g.lineWidth = 8; for (const k in HR_ROOMS) {const R = HR_ROOMS[k]; if (!hOpen(k)) continue; const y = R.side === 'b' ? 210 : 260; seg(R.dx - 20, y, R.dx + 20, y);}
  g.strokeStyle = pent ? '#d8b04a' : '#0d0919'; g.lineWidth = 6; seg(0, 260, 720, 260); g.strokeStyle = '#2f2a48'; g.lineWidth = 8; for (const k in HR_ROOMS) {const R = HR_ROOMS[k]; if (!hOpen(k)) continue; const y = R.side === 'b' ? 210 : 260; seg(R.dx - 20, y, R.dx + 20, y); g.fillStyle = '#c09050'; g.fillRect(R.dx - 21, y - 4, 3, 8); g.fillRect(R.dx + 18, y - 4, 3, 8);}
  g.strokeStyle = pent ? '#d8b04a' : '#0d0919'; g.lineWidth = 6; seg(260, 0, 260, 210); seg(520, 0, 520, 210); seg(200, 260, 200, 460); seg(460, 260, 460, 460); g.strokeRect(3, 3, 714, 454);
  for (const k in HR_ROOMS) {if (!hOpen(k)) continue; const R = HR_ROOMS[k]; g.fillStyle = 'rgba(255,255,255,.5)'; g.font = '700 11px sans-serif'; g.textAlign = 'left'; g.fillText(R.n.toUpperCase(), R.x + 12, R.side === 'b' ? R.y + 202 : R.y + 30);}
  // подсветка точек интереса
  hPois().forEach(p => {if (!hOpen(p.room)) return; const near = Math.hypot(HM.x - p.x, HM.y - p.y - 18) < 46; if (near) {g.fillStyle = 'rgba(255,210,58,.18)'; g.beginPath(); g.arc(p.x, p.y, 26, 0, 7); g.fill();} g.font = '12px sans-serif'; g.textAlign = 'center'; g.globalAlpha = .55 + .35 * Math.sin(t * 3 + p.x); g.fillText('✨', p.x + 16, p.y - 14); g.globalAlpha = 1;});
  // люди
  const list = [{y: HM.y, me: 1}].concat(Object.values(HM.ents)).sort((a, b) => a.y - b.y);
  list.forEach(e => e.me ? hPerson(g, HM.x, HM.y, 1, HM.dir, HM.walk, HM.moving, t) : e.kind === 'pet' ? hPet(g, e, t) : hPerson(g, e.x, e.y, 0, e.dir, e.walk, e.path && e.path.length, t, e));
  if (HM.target) {g.strokeStyle = 'rgba(255,210,58,.7)'; g.lineWidth = 2; g.beginPath(); g.arc(HM.target[0], HM.target[1], 7 + Math.sin(t * 8) * 2, 0, 7); g.stroke();}
}
function hPet(g, e, t) {const mv = e.path && e.path.length; g.fillStyle = 'rgba(0,0,0,.3)'; g.beginPath(); g.ellipse(e.x, e.y + 3, 10, 4, 0, 0, 7); g.fill(); g.font = '22px sans-serif'; g.textAlign = 'center'; g.save(); g.translate(e.x, e.y - 4 + (mv ? Math.sin(t * 14) * 2 : 0)); g.scale(e.dir, 1); g.fillText(e.ic, 0, 0); g.restore(); if (!mv && e.wait > 0 && e.key !== 'x') {g.font = '11px sans-serif'; g.fillText('💤', e.x + 12, e.y - 18 + Math.sin(t * 2) * 2);}}
function hPerson(g, x, y, me, dir, walk, moving, t, e) {
  const bob = moving ? Math.sin(walk) * 1.8 : Math.sin(t * 2 + x) * .6, top = tier('w', 'top'), sh = tier('w', 'shoes');
  g.fillStyle = 'rgba(0,0,0,.35)'; g.beginPath(); g.ellipse(x, y + 4, 12, 4.5, 0, 0, 7); g.fill();
  const lg = moving ? Math.sin(walk) * 4 : 0; g.fillStyle = me ? ['#e8e8e8', '#4a3020', '#c0a040'][sh] : '#2a2a3a'; g.fillRect(x - 7, y - 2 + (lg > 0 ? 0 : -1), 6, 5); g.fillRect(x + 1, y - 2 + (lg < 0 ? 0 : -1), 6, 5);
  g.fillStyle = me ? ['#6a6a7a', '#e8e8f0', '#1a2a4a', '#111'][top] : ({hr: '#c04a8a', tm: '#4a7ac0', st: '#5aa070'}[e.rk] || '#7a7a9a'); g.fillRect(x - 9, y - 26 + bob, 18, 25); if (me && top === 3) {g.fillStyle = '#ffd23a'; g.fillRect(x - 1, y - 24 + bob, 2, 12);} if (me && top === 2) {g.fillStyle = '#f0f0f0'; g.fillRect(x - 3, y - 26 + bob, 6, 10);}
  if (me) {g.fillStyle = '#e0b090'; g.beginPath(); g.arc(x, y - 33 + bob, 8, 0, 7); g.fill(); g.fillStyle = '#3a2a1a'; g.fillRect(x - 8, y - 42 + bob, 16, 6); g.fillStyle = '#111'; g.fillRect(x + dir * 3 - 1, y - 34 + bob, 2, 2); const ac = tier('w', 'acc'); if (ac >= 1) {g.fillStyle = ac === 3 ? '#9ad0ff' : '#ffd23a'; g.fillRect(x + 9, y - 14 + bob, 4, 4);}}
  else {g.font = '22px sans-serif'; g.textAlign = 'center'; g.fillText(e.ic, x, y - 28 + bob);}
  g.font = '800 10px sans-serif'; g.textAlign = 'center'; g.lineWidth = 3; g.strokeStyle = 'rgba(0,0,0,.8)'; const nm = me ? '★ ' + (S.nick || 'ВЫ') : e.n; g.strokeText(nm, x, y + 16); g.fillStyle = me ? '#ffd23a' : '#fff'; g.fillText(nm, x, y + 16);
  if (!me) {const hh = H(); if (e.rk === 'hr' && hh.gf === (S.rm.find(r => r.key === e.key) || {}).id) {g.font = '13px sans-serif'; g.fillText('❤', x + 14, y - 42 + Math.sin(t * 3) * 2);}
    const txt = e.say || (e.act && !moving ? e.act : ''); if (txt) {g.font = e.say ? '700 11px sans-serif' : '18px sans-serif'; const w = e.say ? g.measureText(txt).width + 14 : 28; g.fillStyle = 'rgba(255,255,255,.95)'; g.beginPath(); g.roundRect ? g.roundRect(x - w / 2, y - 76, w, 22, 8) : g.rect(x - w / 2, y - 76, w, 22); g.fill(); g.fillStyle = '#222'; g.textAlign = 'center'; g.fillText(txt, x, y - 60 + (e.say ? 0 : 2));}}
}
/* --- действия --- */
const TALK_HR = ['Вы просидели на кухне до полуночи, говоря обо всём подряд.', 'Она рассказала про детство, вы про первую работу. Стало тепло.', 'Вы просто молчали вместе, и это было приятно.', 'Вы вспомнили смешной случай, оба смеялись до слёз.'];
const TALK_TM = ['Коллега рассказал, кто на этаже кого недолюбливает.', 'Вы обсудили, как лучше пережить квартальную проверку.', 'Он поделился хитростью со звонками, которую нигде не прочитаешь.'];
function hActsFor(ent) {
  X3(); const A = [], id = ent.id, put = (t, m, lim, fn, dis) => A.push({t, m, lim, fn, dis});
  if (ent.type === 'poi') {
    if (id === 'bed') {put('😴 Вздремнуть (60 мин)', 60, ['nap', 1], () => {hFx(12, 0); return 'Вы вздремнули. Голова чище, силы вернулись.';}); put('🛏 Заправить кровать', 3, ['mk', 1], () => {hFx(0, 1); return 'Кровать заправлена. Мелочь, а приятно.';});}
    else if (id === 'ward') put('👔 Выбрать одежду', 0, null, () => {scrShop('ward'); return '';});
    else if (id === 'pc') {put('📊 Проверить расходы', 2, null, () => 'Расходы в день: ' + fmt(billsSum()) + '. Деньги сейчас: ' + fmt(S.money) + '.'); put('📰 Почитать новости города', 10, ['news', 2], () => {S.cons = clamp(S.cons - 0, 0, 100); return pick(RUMORS);});}
    else if (id === 'door') put('🚪 Выйти из дома', 0, null, () => {homeBack(); return '';});
    else if (id === 'ment' || id === 'mirror') put('🪞 Посмотреть на себя', 1, null, () => {const s = styleScore(); return s >= 7 ? 'Из зеркала смотрит человек с деньгами. Почти настоящий.' : s >= 4 ? 'Выглядите прилично. Можно в люди.' : 'Из зеркала смотрит уставший человек в дешёвой одежде.';});
    else if (id === 'fridge') {put('🍳 Приготовить ужин (₴60)', 40, ['cook', 1], () => {if (S.money < 60) return 'Не хватает на продукты.'; hFx(6, 0, -60); return 'Вы приготовили ужин. На кухне пахнет домом.';}, S.money < 60); put('🍕 Заказать пиццу (₴200)', 5, ['pizza', 1], () => {if (S.money < 200) return 'Нет денег на пиццу.'; hFx(4, 0, -200); return 'Курьер приехал быстрее, чем остыл чайник.';}, S.money < 200); put('☕ Заварить чай', 10, ['tea', 3], () => {hFx(2, 0); return 'Чай горячий. Мир сразу стал проще.';});}
    else if (id === 'table') put('🍽 Поесть', 25, ['eat', 1], () => {hFx(5, 0); return 'Вы спокойно поели, без телефона и звонков.';});
    else if (id === 'sofa') put('🛋 Отдохнуть', 30, ['rest', 2], () => {hFx(tier('f', 'sofa') ? 6 : 3, 0); return 'Вы просто лежите и смотрите в потолок. Хорошо.';});
    else if (id === 'tv') {const tvv = tier('f', 'tv'); put('📺 Смотреть сериал (45 мин)', 45, ['tv', 1], () => {if (!tvv) return 'Телевизора нет, смотрите на стену.'; const co = Object.values(HM.ents).filter(e => e.kind === 'rm' && hRoomAt(e.x, e.y) === 'liv').length; hFx(3 + tvv + co, 1); if (co) S.rm.forEach(r => {if (r.kind === 'hr') H().hr[r.id].aff = clamp(H().hr[r.id].aff + 2, 0, 100);}); return co ? 'Вы смотрели сериал вместе. Уютно и без разговоров.' : 'Серия за серией. Время ушло, настроение выросло.';}, !tvv);}
    else if (id === 'plant') put('🪴 Полить', 3, ['water', 1], () => {hFx(0, 1); return 'Растениям стало лучше, вам тоже.';});
    else if (id === 'shower') put('🚿 Принять душ', 20, ['shw', 1], () => {hFx(5, 1); return 'Горячая вода смыла весь рабочий день.';});
    else if (id === 'view') {put('🌃 Постоять и подышать', 15, ['air', 2], () => {hFx(3, 1); return 'Внизу огни, наверху звёзды. Хорошо думать.';}); put('📞 Позвонить маме', 15, ['mom', 1], () => {hFx(-2, 3); return 'Мама рада. Вы сказали, что всё хорошо. Почти не соврали.';});}
    else if (id === 'chair') put('☕ Посидеть с чашкой', 20, ['chair', 1], () => {hFx(5, 1); return 'Тихо. Только ветер и город внизу.';});
    else if (id === 'pet:fish') put('🐟 Покормить рыбок', 2, ['fish', 1], () => {hFx(0, .5); return 'Рыбки собрались у поверхности. Благодарные существа.';});
    else if (id === 'pet:ham') put('🐹 Покормить хомяка', 2, ['ham', 1], () => {hFx(0, .5); return 'Хомяк набил щёки и убежал на колесо.';});
  } else if (ent.type === 'pet') {
    put('🤲 Погладить', 3, ['pp' + id, 2], () => {hFx(2, .5); return ent.n + ' доволен: ' + (id === 'pet:cat' ? 'мурчит и топчется' : 'виляет хвостом') + '.';}); put('🍖 Покормить', 2, ['pf' + id, 1], () => {hFx(0, 1); return ent.n + ' съел всё до крошки.';});
  } else if (ent.type === 'rm') {
    const r = hRm(ent.key); if (!r) return A; const touch = () => {r.last = S.day;};
    if (r.kind === 'hr') {const g = H().hr[r.id], gd = HRS.find(x => x.id === r.id);
      put('💬 Поговорить по душам', 20, ['t' + id, 2], () => {touch(); g.aff = clamp(g.aff + 3, 0, 100); g.ann = Math.max(0, g.ann - 5); hFx(0, 1); return pick(TALK_HR) + ' ' + gd.n + ': «' + pick(gd.ok).replace(/^«|»$/g, '') + '»';});
      put('🍝 Приготовить ужин вместе (₴60)', 40, ['c' + id, 1], () => {if (S.money < 60) return 'Нужны ₴60 на продукты.'; touch(); S.money -= 60; g.aff = clamp(g.aff + 4, 0, 100); hFx(5, 1); return 'Вы вдвоём на кухне, мука на носу и смех. Ужин вышел так себе, вечер отличный.';}, S.money < 60);
      put('🎬 Смотреть кино вместе', 60, ['f' + id, 1], () => {touch(); g.aff = clamp(g.aff + 4, 0, 100); hFx(3, 1); return 'Вы смотрели кино под одним пледом. Конец фильма никто не запомнил.';});
      put('💐 Подарить цветы (₴150)', 5, ['g' + id, 1], () => {if (S.money < 150) return 'Не хватает на цветы.'; touch(); S.money -= 150; g.aff = clamp(g.aff + 6, 0, 100); g.ann = Math.max(0, g.ann - 8); return gd.n + ' прячет улыбку в букете: «Не стоило... но спасибо».';}, S.money < 150);
      put('🤗 Обнять', 2, ['h' + id, 2], () => {touch(); g.aff = clamp(g.aff + 2, 0, 100); hFx(1, 1); return gd.n + ' на секунду прижимается к вам. Всё остальное подождёт.';});
      put('🌙 Остаться на ночь', 0, ['n' + id, 1], () => {touch(); const m = night(r.id); return m || '';}, HM.from === 'idle' && S.min < DAY_END - 150);
    } else if (r.kind === 'tm') {
      put('☕ Выпить чаю вместе', 15, ['t' + id, 2], () => {touch(); relAdd(r.id, .5); hFx(2, 0); return Math.random() < .5 ? pick(TALK_TM) : r.n + ' рассказал про слухи: ' + pick(RUMORS);});
      put('💼 Обсудить работу', 20, ['w' + id, 1], () => {touch(); relAdd(r.id, .5); addSt('Совет от ' + r.n, '🧠', 1, {calm: 2}); return r.n + ' подсказал, как не нервничать на звонках. Пригодится завтра.';});
      put('🃏 Сыграть в карты (на ₴150)', 40, ['k' + id, 1], () => {touch(); relAdd(r.id, .5); const w = Math.random() < .5; hFx(0, 0, w ? 150 : -150); return w ? 'Вы обыграли ' + r.n + ' на ₴150. Он ворчит, но смеётся.' : r.n + ' обыграл вас на ₴150.';}, S.money < 150);
      put('💵 Попросить в долг ₴300', 3, ['l' + id, 1], () => {touch(); hFx(0, -1, 300); S.q.push({day: S.day + 2, t: r.n + ' просит вернуть ₴330 за долг', fx: {money: -330}}); return r.n + ' одолжил ₴300 и напомнил, что вернуть надо ₴330.';});
    } else {const p = S.staff && S.staff.find(q => q.id === r.id);
      put('💼 Обсудить дела на смене', 20, ['w' + id, 1], () => {touch(); if (p) p.loy = clamp(p.loy + 2, 0, 100); return r.n + ' доложил, кто из команды сачкует, и предложил план.';});
      put('🍺 Угостить ужином (₴100)', 30, ['d' + id, 1], () => {if (S.money < 100) return 'Нет ₴100.'; touch(); S.money -= 100; if (p) p.loy = clamp(p.loy + 6, 0, 100); return r.n + ' растроган: «Шеф, вы человек».';}, S.money < 100);
      put('💰 Выдать премию (₴300)', 3, ['b' + id, 1], () => {if (S.money < 300) return 'Нет ₴300.'; touch(); S.money -= 300; if (p) p.loy = clamp(p.loy + 10, 0, 100); return r.n + ' кивает: «Не подведу».';}, S.money < 300);
    }
    put('🧹 Попросить помочь по дому', 10, ['hp' + id, 1], () => {touch(); hFx(3, 0); return r.n + ' вымыл посуду и вынес мусор без споров.';});
    A.push({t: '🚪 Попросить съехать', raw: 'y_evict', v: ent.key});
  }
  return A;
}
function hNearest() {
  let best = null, bd = 48; Object.values(HM.ents).forEach(e => {const d = Math.hypot(HM.x - e.x, HM.y - e.y); if (d < bd) {bd = d; best = {type: e.kind === 'pet' ? 'pet' : 'rm', id: e.key, key: e.key, n: e.n, ic: e.ic};}});
  if (best) return best; hPois().forEach(p => {if (!hOpen(p.room)) return; const d = Math.hypot(HM.x - p.x, HM.y - p.y - 18); if (d < bd) {bd = d; best = {type: 'poi', id: p.id, n: p.n, ic: p.ic};}}); return best;
}
function hPanel(force) {
  const box = document.getElementById('hctx'); if (!box) return; const ent = hNearest(), key = ent ? ent.type + ent.id + '|' + S.day + '|' + JSON.stringify(S.hd && S.hd.u) + '|' + Math.floor(S.money / 50) : 'none';
  if (!force && key === HM.key) return; HM.key = key;
  if (!ent) {HM.acts = []; box.innerHTML = '<div style="color:#9a8fb8;font-size:12.5px;padding:6px">Подойдите к предмету или человеку (стрелки или касание по плану), чтобы взаимодействовать.</div>'; return;}
  const A = hActsFor(ent); HM.acts = A; box.innerHTML = '<div style="font-weight:800;margin-bottom:4px">' + ent.ic + ' ' + ent.n + '</div>' + A.map((a, i) => {if (a.raw) return '<button class="btn sm warn" data-a="' + a.raw + '" data-v="' + a.v + '">' + a.t + '</button>'; const used = a.lim && hUsed(a.lim[0]) >= a.lim[1]; return '<button class="btn sm' + (used || a.dis ? '' : ' pri') + '" data-a="m_act" data-v="' + i + '"' + (used || a.dis ? ' disabled' : '') + '>' + a.t + (used ? ' · сегодня было' : '') + '</button>';}).join('');
}
function hDoAct(i) {
  const a = HM.acts[i]; if (!a || !S) return; if (a.lim && hUsed(a.lim[0]) >= a.lim[1]) return;
  if (a.dis) {toast(HM.from === 'idle' && S.min < DAY_END - 150 ? 'Рано, смена ещё идёт.' : 'Сейчас не получится.', 'bad'); return;}
  if (HM.from === 'idle' && a.m && S.min + a.m >= DAY_END - 5) return toast('До конца смены не хватит времени.', 'bad');
  const msg = a.fn(); if (msg === undefined || msg === null) return; if (a.lim && msg) hMark(a.lim[0]); if (HM.from === 'idle' && a.m && msg) S.min += a.m; Snd.sfx('good'); renderHud && renderHud();
  const el = document.getElementById('hmsg'); if (el && msg) {el.style.display = 'block'; el.innerHTML = msg;} hStat(); hPanel(true);
}
/* --- экран --- */
function hStat() {const el = document.getElementById('hstat'); if (!el) return; const h = H(); el.innerHTML = '🛏 ' + HOUSES[S.life.h].n + ' · Уют ' + comfortScore() + '/'+(Object.keys(FURN).length*3)+' · Стиль ' + styleScore() + '/9 · ' + CARS[h.car].ic + '<br>⚡ ' + Math.round(S.energy) + ' · 💰 ' + fmt(S.money) + ' · 🏠 жильцов ' + S.rm.length + '/' + rmCap() + (h.gf ? ' · ❤ ' + HRS.find(x => x.id === h.gf).n : '');}
function scrHome(from) {
  X3(); const h = H(); if (from) h.from = from; HM.from = h.from; hSync(); const gen = ++HM.gen; HM.path = []; HM.keys = {}; HM.target = null;
  if (!hOpen(hRoomAt(HM.x, HM.y))) {HM.x = 590; HM.y = 330;} if (HM.lastDay !== S.day && S.rm.length) {HM.lastDay = S.day; HM.greet = 1;}
  const greet = HM.greet ? (HM.greet = 0, '🏡 ' + pick(S.rm.map(r => r.n + (r.kind === 'hr' && H().gf === r.id ? ' встречает вас у двери.' : ' машет вам с кухни.')))) : (h.log || '');
  showScr('<div class="box" style="padding:10px"><h2 style="margin:0 0 6px">🏠 Дом</h2><canvas id="hmc" width="720" height="460" style="width:100%;border-radius:12px;border:1.5px solid #4a3a82;touch-action:none;background:#120d22"></canvas>' +
    '<div style="display:flex;gap:8px;margin-top:6px;align-items:stretch"><div id="hpad" style="display:grid;grid-template-columns:repeat(3,44px);grid-template-rows:repeat(2,44px);gap:4px;flex:none"><span></span><button class="btn sm" data-k="u">▲</button><span></span><button class="btn sm" data-k="l">◀</button><button class="btn sm" data-k="d">▼</button><button class="btn sm" data-k="r">▶</button></div><div id="hctx" style="flex:1;min-width:0;display:flex;flex-direction:column;gap:4px"></div></div>' +
    '<div id="hmsg" class="help" style="margin:6px 0;' + (greet ? '' : 'display:none') + '">' + greet + '</div><div id="hstat" style="color:#9a8fb8;font-size:12.5px;margin:4px 0"></div>' +
    '<div class="opts" style="grid-template-columns:repeat(2,1fr)"><button class="btn" data-a="h_shop" data-v="furn">🛋 Мебель</button><button class="btn" data-a="h_shop" data-v="ward">👔 Гардероб</button><button class="btn" data-a="h_shop" data-v="car">🚗 Транспорт</button><button class="btn" data-a="h_eve">' + (h.eve === S.day ? '🌙 Вечер проведён' : '🌙 Провести вечер') + '</button><button class="btn" data-a="y_room">🏡 Жильцы</button><button class="btn" data-a="h_hr">💘 HR-отдел</button>' + '<button class="btn" data-a="lifeopen">🏘 Жильё, питомцы</button>' + '</div><div class="row" style="margin-top:8px"><button class="btn pri" data-a="h_back">← Назад</button></div></div>', true);
  const cv = document.getElementById('hmc'); hStat(); hPanel(true); let last = performance.now(), acc = 0;
  const loop = now => {if (gen !== HM.gen || !document.getElementById('hmc') || document.getElementById('hmc') !== cv) return; const dt = Math.min(.05, (now - last) / 1000); last = now; hTick(dt); hDraw(cv); acc += dt; if (acc > .25) {acc = 0; hPanel(false);} requestAnimationFrame(loop);}; requestAnimationFrame(loop);
  const pt = e => {const r = cv.getBoundingClientRect(); return [(e.clientX - r.left) / r.width * 720, (e.clientY - r.top) / r.height * 460];};
  cv.addEventListener('pointerdown', e => {e.preventDefault(); Snd.resume && Snd.resume(); const [x, y] = pt(e); let tgt = null;
    Object.values(HM.ents).forEach(en => {if (Math.hypot(en.x - x, en.y - 20 - y) < 30) tgt = [en.x + (HM.x < en.x ? -22 : 22), en.y];}); if (!tgt) hPois().forEach(p => {if (hOpen(p.room) && Math.hypot(p.x - x, p.y - y) < 32) tgt = [p.x, p.y + 18];});
    if (!tgt) {const rm = hRoomAt(x, y); if (!hOpen(rm)) return toast('Комната закрыта: нужно жильё побольше.', 'bad'); tgt = [x, y];}
    if (!hCan(tgt[0], tgt[1], tgt[0], tgt[1])) {const nx = clamp(tgt[0], 24, 696), ny = clamp(tgt[1], 28, 440); tgt = hCan(tgt[0], tgt[1], nx, ny) ? [nx, ny] : tgt;}
    HM.path = hPath(HM.x, HM.y, tgt[0], tgt[1]); HM.target = tgt; setTimeout(() => {if (HM.target === tgt) HM.target = null;}, 1200);});
  document.getElementById('hpad').querySelectorAll('[data-k]').forEach(b => {const k = b.dataset.k, on = e => {e.preventDefault(); HM.keys[k] = true;}, off = () => {HM.keys[k] = false;}; b.addEventListener('pointerdown', on); b.addEventListener('pointerup', off); b.addEventListener('pointerleave', off); b.addEventListener('pointercancel', off); b.addEventListener('contextmenu', e => e.preventDefault());});
}
document.addEventListener('keydown', e => {if (!document.getElementById('hmc')) return; const m = {ArrowUp: 'u', ArrowDown: 'd', ArrowLeft: 'l', ArrowRight: 'r', w: 'u', s: 'd', a: 'l', d: 'r'}[e.key]; if (m) {HM.keys[m] = true; e.preventDefault();}});
document.addEventListener('keyup', e => {const m = {ArrowUp: 'u', ArrowDown: 'd', ArrowLeft: 'l', ArrowRight: 'r', w: 'u', s: 'd', a: 'l', d: 'r'}[e.key]; if (m) HM.keys[m] = false;});
document.addEventListener('click', e => {const b = e.target.closest('[data-a="m_act"]'); if (!b || b.disabled) return; hDoAct(+b.dataset.v);});
/* жильцы скучают, если их не замечать */
const _td15 = teamDaily; teamDaily = function () {_td15(); X3(); S.rm.forEach(r => {if (r.kind === 'hr' && S.day - (r.last || r.since || 0) >= 3) {const g = H().hr[r.id]; g.aff = Math.max(0, g.aff - 3); S.rmLog.push('💔 ' + r.n + ' жалуется, что вы её не замечаете: отношение −3.');}});};
/* новости */
const _sn15 = scrNews; scrNews = function () {_sn15(); const p = document.querySelector('#scr .box p'); if (p) p.textContent = 'БОЛЬШАЯ ПЕРЕМЕНА · build 1.4.0'; const h3 = document.querySelector('#scr .box h3'); if (h3) h3.insertAdjacentHTML('beforebegin', '<h3>🏠 Новый «Дом»</h3><p>• Видно план квартиры, по нему ходит ваш герой (стрелки или касание)<br>• Комнаты открываются с переездом: кухня, ванная, гостиная, балкон<br>• Жильцы и питомцы живут своей жизнью: готовят, смотрят ТВ, спят<br>• К каждому человеку и предмету можно подойти и что-то сделать<br>• Жильцы скучают, если их не замечать</p>'); lsSet('cc_news_130', 1);};
