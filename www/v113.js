/* ======== build 1.1.2: живые реплики вместо ярлыков тактик ======== */
const OPEN_S = [c => '«Добрый день! Скажите, вам удобно сейчас говорить?»', c => '«Здравствуйте! Меня зовут ' + ((c.legend && c.legend.n) || 'Андрей').split(' ')[0] + ', я из «Золотого Бульбаша». У вас найдётся минутка?»', c => '«Добрый день. Звоню по важному вопросу, который касается вас лично. Не отключайтесь, пожалуйста».'];
const shuf = (a, seed) => {let s = seed || 1; const r = () => (s = (s * 9301 + 49297) % 233280) / 233280; const b = a.slice(); for (let i = b.length - 1; i > 0; i--) {const j = Math.floor(r() * (i + 1)); [b[i], b[j]] = [b[j], b[i]];} return b;};
function buildReplies(c) {
  const key = c.turn + ':' + c.log.length + ':' + (c.hist || []).length + ':' + (c.asked ? 1 : 0) + ':' + Object.keys(c.rused || {}).length; if (c.R && c.R.key === key) return c.R.list;
  const list = [];
  ['empathy', 'flattery', 'jargon', 'pressure'].forEach(k => list.push({k, t: lineFor(c, k, stageOf(c))}));
  if (!c.asked) {const q = pick(ASKQ[c.p.mood]); list.push({k: 'ask', t: q[0], q});}
  const ra = (RANK_ACTS[S.rank] || []).filter(a => a.me && !(a.once && c.rused && c.rused[a.id]) && !a.end); if (ra.length) {const a = pick(ra); list.push({k: 'r:' + a.id, t: pick(a.me)});}
  const seed = c.turn * 31 + c.log.length * 7 + (c.p.age | 0); c.R = {key, list: shuf(list, seed)}; return c.R.list;
}
const _rn13 = render;
render = function () {
  _rn13(); if (!S || S.mode !== 'call' || !S.call) return; const c = S.call, m = $('main');
  if (c.open) {m.scrollTop = 0; const t = m.querySelector('.dil > b'); if (t) t.textContent = '💬 Что скажете первым?'; m.querySelectorAll('[data-c^="open:"]').forEach((b, k) => {const s = OPEN_S[k](c); OPENERS[k].d = s; b.innerHTML = s; b.classList.add('reply'); b.classList.remove('btn');}); return;}
  if (c.dil) return; const o = m.querySelector('.opts'); if (!o) return; const L = buildReplies(c);
  const html = '<div class="talk">' + L.map(x => '<button class="reply" data-r="' + x.k + '">' + x.t + '</button>').join('') + '</div><div class="chips"><button class="chip" data-c="delay"' + (c.delays >= 2 ? ' disabled' : '') + '>⏳ Минутку, проверю…</button><button class="chip" data-c="r:help">🙋 Позвать коллегу</button><button class="chip" data-c="r:logic">🧩 Сверить детали</button><button class="chip" data-c="bluff">🎭 Представиться ещё раз</button>' + (c.pers >= 30 ? '<button class="chip" data-c="transfer">📲 Передать специалисту (₴' + (60 + S.rank * 20) + ')</button>' : '') + '</div>';
  o.outerHTML = '<div id="replies">' + html + '</div>';
};
$('main').addEventListener('click', e => {
  const b = e.target.closest('[data-r]'); if (!b || !S || !S.call) return; e.stopImmediatePropagation(); Snd.resume(); const c = S.call, k = b.dataset.r, it = c.R && c.R.list.find(x => x.k === k); if (!it) return; const n0 = c.log.length;
  if (k === 'ask') {const q = it.q; c.asked = true; c.knows = true; c.detail = q[2]; c.pers += ri(4, 9); c.susp = Math.max(0, c.susp - 4); c.turn++; S.min += 3; Snd.sfx('typing'); c.log.push({w: 'me', t: q[0]}); c.log.push({w: 'them', t: q[1]}); return render();}
  if (k.startsWith('r:')) choose(k); else choose(k);
  if (S.call === c && S.mode === 'call') {for (let i = n0; i < c.log.length; i++) if (c.log[i].w === 'me' && !/^🙋|^🎧/.test(c.log[i].t)) {c.log[i].t = it.t; break;} render();}
}, true);
