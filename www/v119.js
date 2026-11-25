/* ======== build 1.5.0: связные диалоги — убираем случайные реплики-«мимо», сливаем посторонние шумы в одну естественную реплику клиента ======== */
const KEEP19 = /^«(Вы повторяетесь|Вас плохо слышно)/;
const _ch19 = choose;
choose = function (type) {
  const c0 = S.call, n0 = c0 ? c0.log.length : 0, isTalk = ['pressure', 'flattery', 'jargon', 'empathy'].includes(type);
  if (c0) {c0.lastLine = null; c0.lastReply = null;}
  window.__commit = true; try {_ch19(type);} finally {window.__commit = false;}
  const c = S.call; if (!isTalk || !c || c !== c0) return;
  const fresh = c.log.splice(n0), main = fresh.find(l => l.w === 'me' && l.t === c.lastLine), rep = fresh.find(l => l.w === 'them' && l.t === c.lastReply);
  const keep = fresh.filter(l => KEEP19.test(l.t) || l === main || l === rep);
  const noise = fresh.find(l => l.w === 'them' && l !== rep && !KEEP19.test(l.t) && INTERJ[c.p.mood] && INTERJ[c.p.mood].includes(l.t));
  if (noise && rep && Math.random() < .4 && !/^«(Допустим|Хм|Ну|Ладно|Нет)/.test(rep.t) && !rep.t.includes('?')) {const f = isFem(c.p); rep.t = '«' + noise.t.replace(/^«|»$/g, '').replace(/[.…]+$/, '') + '… ' + rep.t.replace(/^«/, '').replace(/^./, m => m); }
  if (!main && !rep && !keep.length) fresh.forEach(l => c.log.push(l)); else keep.forEach(l => c.log.push(l));
  if (typeof render === 'function' && S.call === c && S.mode === 'call') render();
};
const _sn19 = scrNews; scrNews = function () {_sn19(); const p = document.querySelector('#scr .box p'); if (p) p.textContent = 'БОЛЬШАЯ ПЕРЕМЕНА · build 1.5.0'; const h3 = document.querySelector('#scr .box h3'); if (h3) h3.insertAdjacentHTML('beforebegin', '<h3>💬 Живые диалоги</h3><p>• Клиенты отвечают по-разному: пожилой, скептик, студент, занятой, подозрительный<br>• Реплики зависят от этапа разговора и вашего приёма<br>• Агент здоровается по имени и отвечает на сомнения клиента<br>• Меньше случайных реплик «мимо»</p>');};
