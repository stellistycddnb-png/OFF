/* ======== Жильцы и романтика (build 1.1.0) ======== */
HOUSES.push({n: 'Двухкомнатная квартира', ic: '🏡', c: 1400, cons: 3, en: 10, d: 'Просторно: +10 энергии, +3 совести. Можно селить до 3 жильцов.'}, {n: 'Пентхаус', ic: '🌆', c: 3000, cons: 5, en: 14, d: 'Роскошь: +14 энергии, +5 совести. До 5 жильцов.'});
const RM_CAP = [0, 1, 2, 3, 5];
const RM_DAYS_LINES = ['{n} оставил(а) на кухне записку: «Купи хлеб».', '{n} сегодня пел(а) в душе. Громко.', '{n} приготовил(а) ужин. Дом пахнет лучше.', '{n} занял(а) ванную на час.', '{n} починил(а) полку, которую вы обещали починить год.', '{n} смотрел(а) сериал до трёх ночи.', '{n} рассказал(а) смешную историю про работу.'];
const X3 = () => {X2(); if (!S.rm) S.rm = []; if (!S.rmLog) S.rmLog = []; return S;};
const rmCap = () => RM_CAP[Math.min(4, S.life.h)] || 0;
const rmKey = (k, id) => k + ':' + id;
function rmCands() {
  X3(); const o = [];
  HRS.forEach(g => {const r = H().hr[g.id]; o.push({key: rmKey('hr', g.id), kind: 'hr', id: g.id, n: g.n, ic: g.ic, sub: g.role, aff: r.aff, blocked: r.blocked, gf: H().gf === g.id});});
  TEAM.forEach(t => {o.push({key: rmKey('tm', t.n), kind: 'tm', id: t.n, n: t.n, ic: t.ic, sub: RANKS[t.r].n, aff: ((S.rel && S.rel[t.n]) || 0) * 25});});
  if (S.staff && S.maxRank >= 4) S.staff.forEach(p => o.push({key: rmKey('st', p.id), kind: 'st', id: p.id, n: p.n, ic: '🧑‍💼', sub: 'ваш сотрудник', aff: p.loy}));
  return o;
}
const rmHas = key => S.rm.some(r => r.key === key);
function scrRoom(msg) {
  X3(); const cap = rmCap(), C = rmCands();
  const cur = S.rm.map(r => '<div class="tech"><div>' + r.ic + ' <b>' + r.n + '</b><br><small>' + r.note + '</small></div><button class="btn sm warn" data-a="y_evict" data-v="' + r.key + '">Выселить</button></div>').join('') || '<p style="color:#9a8fb8">Пока никого. Живёте один.</p>';
  const rows = C.filter(c => !rmHas(c.key)).map(c => {let st = '', ok = true; if (c.kind === 'hr') {if (c.blocked) {st = '🚫 жалоба'; ok = false;} else if (c.aff < 55) {st = 'Отношение ' + c.aff + '% — рано'; ok = false;} else st = 'Отношение ' + c.aff + '%' + (c.gf ? ' · ❤ вместе' : '');} else if (c.kind === 'tm') {if (c.aff < 50) {st = 'нужно сблизиться: поговорите с ним в «Офисе»'; ok = false;} else st = 'доверие ' + c.aff / 25 + '/4';} else st = 'лояльность ' + Math.round(c.aff) + '%';
    return '<div class="tech"><div>' + c.ic + ' <b>' + c.n + '</b> · ' + c.sub + '<br><small>' + st + '</small></div><div style="display:flex;flex-direction:column;gap:4px">' + (c.kind === 'hr' ? '<button class="btn sm" data-a="y_night" data-v="' + c.id + '"' + (!ok ? ' disabled' : '') + '>🌙 Ночь</button>' : '') + '<button class="btn sm' + (ok ? ' pri' : '') + '" data-a="y_move" data-v="' + c.key + '"' + (!ok || S.rm.length >= cap ? ' disabled' : '') + '>🏠 Заселить</button></div></div>';}).join('');
  showScr('<div class="box"><h2>🏡 Жильцы и романтика</h2><p>Жильё: <b>' + HOUSES[S.life.h].n + '</b> · мест для жильцов: <b>' + S.rm.length + '/' + cap + '</b>' + (cap ? '' : '<br><small style="color:#ff8a8a">В хостеле селить некого. Переезжайте в «Комнату» или лучше (раздел «Быт»).</small>') + '</p>' + (msg ? '<p class="help">' + msg + '</p>' : '') + '<h3>Живут у вас</h3>' + cur + '<h3>Кого позвать</h3>' + rows + '<p style="color:#9a8fb8;font-size:12px">Только по взаимному согласию. Жильцы дают бонусы и приносят заботы: платят за комнату, готовят, но иногда ссорятся.</p><div class="row" style="margin-top:8px"><button class="btn pri" data-a="' + (S.mode === 'summary' ? 'v_hub' : 'resume') + '">← Назад</button></div></div>', true);
}
const NIGHT_OK = ['Вы зашли «на минуточку выпить чаю». Свет погас, и до утра вы просто были вдвоём.', 'Разговор затянулся до глубокой ночи, а потом ни один из вас уже не хотел уходить.', 'Вы закрыли дверь, и мир за ней перестал существовать. Утром пахло кофе.', 'Тихий вечер, музыка, чьё-то плечо. Остальное осталось за кадром.'];
const NIGHT_NO = ['{n} улыбается, но качает головой: «Не сегодня. Мне надо подумать».', '{n}: «Давай не будем торопиться, ладно?»', '{n} мягко отодвигается: «Я устала. Но спасибо за вечер».'];
function night(id) {
  X3(); const h = H(), g = HRS.find(x => x.id === id), r = h.hr[id]; if (!g || r.blocked) return null; if (r.night === S.day) return toast('Сегодня уже была ночь. Дайте отдохнуть.', 'bad');
  if (r.aff < 75 && h.gf !== id) return toast('Она пока не готова. Сблизьтесь (отношение 75%+ или станьте парой).', 'bad');
  if (id === 'yulia' && h.gf !== id && r.aff < 90) return toast('Юлия: «Мы коллеги. Давай сначала определимся, что мы».', 'bad');
  r.night = S.day; const p = h.gf === id ? .95 : r.aff >= 85 ? .85 : .6; if (Math.random() < p) {r.aff = clamp(r.aff + 8, 0, 100); r.ann = Math.max(0, r.ann - 15); S.cons = clamp(S.cons + 3, 0, 100); S.energy = clamp(S.energy - 8, 0, 100); S.nextEn = (S.nextEn || 0) + 4; Snd.sfx('heart'); addSt('Тёплое утро', '💞', 2, {calm: 3, cons: 1}); const rm = S.rm.find(x => x.key === rmKey('hr', id)); if (rm && !h.gf && r.aff >= 85) {h.gf = id; toast('❤ ' + g.n + ' теперь ваша девушка', 'ok');}
    return '🌙 ' + pick(NIGHT_OK) + ' ' + g.n + ': «' + pick(g.ok).replace(/^«|»$/g, '') + '»';}
  r.aff = Math.max(0, r.aff - 4); r.ann = clamp(r.ann + 8, 0, 100); Snd.sfx('bad'); return pick(NIGHT_NO).replace('{n}', g.n);
}
function moveIn(key) {
  X3(); const c = rmCands().find(x => x.key === key); if (!c || rmHas(key) || S.rm.length >= rmCap()) return null;
  const p = c.kind === 'hr' ? (c.aff >= 70 ? 1 : .5) : c.kind === 'tm' ? .85 : 1; const h = H();
  if (Math.random() > p) {if (c.kind === 'hr') {const r = h.hr[c.id]; r.ann = clamp(r.ann + 10, 0, 100);} return c.n + ': «Спасибо, но мне пока рано съезжаться».';}
  const note = c.kind === 'hr' ? 'платит еду пополам, тепло дома (+совесть, +энергия), но дорожит вниманием' : c.kind === 'tm' ? 'платит ₴90 в день, шумит по вечерам' : 'платит ₴60 в день, лояльность растёт';
  S.rm.push({key, kind: c.kind, id: c.id, n: c.n, ic: c.ic, note, since: S.day}); Snd.sfx('door'); toast('🏠 ' + c.n + ' заселился(ась)', 'ok'); return c.n + ' занесла(л) вещи и разложил(а) их по всей квартире. Дом ожил.';
}
function rmDaily() {
  X3(); S.rmLog = []; S.rm.forEach(r => {
    if (r.kind === 'hr') {const g = H().hr[r.id]; S.cons = clamp(S.cons + 1.5, 0, 100); S.energy = clamp(S.energy + 1, 0, 100); S.money -= 40; if (H().gf === r.id) {S.cons = clamp(S.cons + 1, 0, 100); g.aff = clamp(g.aff + 1, 0, 100);}}
    else if (r.kind === 'tm') {S.money += 90; S.energy = clamp(S.energy - 1, 0, 100);}
    else {S.money += 60; const p = S.staff && S.staff.find(q => q.id === r.id); if (p) p.loy = clamp(p.loy + 3, 0, 100);}
    if (Math.random() < .35) S.rmLog.push('🏡 ' + pick(RM_DAYS_LINES).replace('{n}', r.n));
    if (r.kind !== 'hr' && Math.random() < .12) {S.cons = clamp(S.cons - 1, 0, 100); S.rmLog.push('😤 ' + r.n + ' поругался(ась) с вами из-за шума: совесть −1.');}
  });
}
const _td11 = teamDaily; teamDaily = function () {_td11(); rmDaily();};
const _ds11 = daySummary; daySummary = function () {_ds11(); const bx = document.querySelector('#scr .box'); if (!bx || S.mode !== 'summary' || !S.rmLog || !S.rmLog.length) return; const h2 = bx.querySelector('h2'); if (h2) h2.insertAdjacentHTML('afterend', '<div class="help" style="margin:6px 0">' + S.rmLog.join('<br>') + '</div>');};
document.addEventListener('click', e => {
  const b = e.target.closest('[data-a^="y_"]'); if (!b || b.disabled) return; X3(); const a = b.dataset.a, v = b.dataset.v; Snd.sfx('click');
  if (a === 'y_room') scrRoom(); else if (a === 'y_move') {const m = moveIn(v); renderHud(); scrRoom(m);}
  else if (a === 'y_evict') {const r = S.rm.find(x => x.key === v); S.rm = S.rm.filter(x => x.key !== v); if (r && r.kind === 'hr') {const g = H().hr[r.id]; g.aff = Math.max(0, g.aff - 20); if (H().gf === r.id) H().gf = null;} Snd.sfx('lock'); scrRoom(r ? r.n + ' съехал(а).' : '');}
  else if (a === 'y_night') {const m = night(v); if (m) {showScr('<div class="box" style="text-align:center"><div style="font-size:54px">🌙</div><p>' + m + '</p><div class="row"><button class="btn pri" data-a="y_room">Дальше</button></div></div>', true);} renderHud();}
});
/* кнопки в HR-карточке и в хабе */
const _hr11 = scrHR; scrHR = function (id) {_hr11(id); X3(); const bx = document.querySelector('#scr .box'); if (!bx) return; const rows = bx.querySelectorAll('.row'), last = rows[rows.length - 1]; const html = id ? '<div class="row" style="margin-top:6px"><button class="btn" data-a="y_night" data-v="' + id + '">🌙 Остаться на ночь</button><button class="btn" data-a="y_move" data-v="' + rmKey('hr', id) + '">🏠 Заселить к себе</button></div>' : '<div class="row" style="margin-top:6px"><button class="btn" data-a="y_room">🏡 Жильцы и романтика</button></div>'; if (last) last.insertAdjacentHTML('beforebegin', html); else bx.insertAdjacentHTML('beforeend', html);};
const _hub11 = scrHub; scrHub = function () {_hub11(); const o = document.querySelector('#scr .opts'); if (o) o.insertAdjacentHTML('beforeend', '<button class="btn" data-a="y_room">🏡 Жильцы и романтика</button>');};
