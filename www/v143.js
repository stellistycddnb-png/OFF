'use strict';
/* v143: резервная копия сохранения (код), размер текста, экран статистики. */
(function () {
  const $q = s => document.querySelector(s);
  const KEYS = [SAVE_KEY, SET_KEY, 'cc_ach', 'cc_ng', 'cc_end2', 'cc_minibest', 'cc_tut', 'cc_diff', 'cc_ngon', 'cc_lesq', 'cc_daily'];
  const enc = s => btoa(unescape(encodeURIComponent(s))), dec = s => decodeURIComponent(escape(atob(s)));
  function exportCode() {const o = {v: 1}; KEYS.forEach(k => {try {const x = localStorage.getItem(k); if (x !== null) o[k] = x;} catch (e) {}}); return 'CC1:' + enc(JSON.stringify(o));}
  function importCode(c) {
    c = (c || '').trim(); if (c.indexOf('CC1:') !== 0) throw new Error('Код должен начинаться с CC1:'); const o = JSON.parse(dec(c.slice(4))); if (!o || o.v !== 1) throw new Error('Неверный формат'); let n = 0;
    KEYS.forEach(k => {if (typeof o[k] === 'string') {JSON.parse(o[k]); n++;}}); if (!n) throw new Error('В коде нет данных'); KEYS.forEach(k => {if (typeof o[k] === 'string') localStorage.setItem(k, o[k]);}); return n;
  }
  function scrBk(msg, code) {
    const from = ($q('#scr .box') || {dataset: {}}).dataset.from || 'title'; showScr('<div class="box" data-from="' + from + '"><h2>💾 Резервная копия</h2><p>Скопируй код и сохрани его (например, в «Избранное» Telegram). Чтобы вернуть игру, вставь код ниже.</p>' + (msg ? '<p style="color:#ffd23a">' + msg + '</p>' : '') + '<textarea id="bkt" rows="5" style="width:100%;background:#120b2c;color:#f2ecff;border:1px solid #4a3a82;border-radius:10px;padding:8px;font:12px monospace" placeholder="Вставь код сюда">' + (code || '') + '</textarea><div class="col" style="margin-top:8px"><button class="btn pri" data-a="bk_exp">📤 Получить код моего сохранения</button><button class="btn" data-a="bk_cp">📋 Копировать код</button><button class="btn" data-a="bk_imp">📥 Загрузить сохранение из кода</button><button class="btn sm" data-a="bk_back">← Назад</button></div></div>', true);
  }
  /* размер текста */
  const applyFs = () => {document.body.classList.toggle('fs1', setg.fs === 1); document.body.classList.toggle('fs2', setg.fs === 2);}; if (setg.fs === undefined) setg.fs = 0; applyFs();
  const st = document.createElement('style'); st.textContent = 'body.fs1 #scr .box,body.fs1 #main,body.fs1 #lesn .lb,body.fs1 #lesq{zoom:1.12}body.fs2 #scr .box,body.fs2 #main,body.fs2 #lesn .lb,body.fs2 #lesq{zoom:1.26}'; document.head.appendChild(st);
  const _ss = scrSet;
  scrSet = function (from) {
    _ss(from); try {const bk = $q('#scr [data-a="back"]'); if (!bk) return; bk.parentNode.insertAdjacentHTML('beforebegin', '<h3>🔤 Размер текста</h3><div class="row two">' + ['Обычный', 'Крупный', 'Огромный'].map((n, i) => '<button class="btn sm' + (setg.fs === i ? ' pri' : '') + '" data-a="fs" data-v="' + i + '">' + n + '</button>').join('') + '</div><button class="btn sm" data-a="bk" style="width:100%;margin:8px 0">💾 Резервная копия сохранения</button>');} catch (e) {}
  };
  /* статистика */
  const _sm = scrMenu;
  scrMenu = function () {_sm(); try {const b = $q('#scr [data-a="achm"]'); if (b) b.insertAdjacentHTML('afterend', '<button class="btn" data-a="stats">📊 Статистика</button>');} catch (e) {}};
  function scrStats() {
    const g = lsGet('cc_ng', {lvl: 0}), e2 = Object.keys(lsGet('cc_end2', {})).length, nv = (window.__endV || []).length, ac = S.ac || {}, h = (() => {try {return H();} catch (e) {return {};}})(), st = S.st || {}, sd = [0, 1, 2, 3, 4].filter(c => (st['i' + c] || 0) >= 3).length;
    const row = (a, b) => '<div style="display:flex;justify-content:space-between;padding:4px 0;border-bottom:1px solid #2c1d5e"><span>' + a + '</span><b>' + b + '</b></div>';
    showScr('<div class="box"><h2>📊 Статистика</h2>' + row('📅 День', S.day + ' / ' + DAYS) + row('💰 Деньги', fmt(S.money)) + row('📞 «Сделок» закрыто', S.total || 0) + row('🧠 Людей предупреждено', S.spared || 0) + row('🗂 Улик собрано', S.evidence || 0) + row('🎖 Должность', RK().ic + ' ' + RK().n) + row('⚖ Сложность', ({easy: 'Лёгкая', norm: 'Обычная', hell: 'Ад'})[S.diff || 'norm']) + row('🔁 Новая игра+', g.lvl ? 'ур. ' + g.lvl : 'нет') + row('🏆 Достижения', Object.keys(achDone || {}).length + ' / ' + ACH.length) + row('🌟 Особые концовки', e2 + ' / ' + nv) + row('📖 Сюжетных линий пройдено', sd + ' / 5') + row('🚔 Подставных раскрыто', ac.stingCaught || 0) + row('💍 Жена', h.wife ? 'есть' : h.dgf ? 'девушка' : 'нет') + row('🐾 Питомцев', (S.pets || []).length) + row('🎮 Рекорд «Лови звонки»', lsGet('cc_minibest', 0)) + '<div class="row" style="margin-top:10px"><button class="btn pri" data-a="stats_back">← Назад</button></div></div>', true);
  }
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-a]'); if (!b) return; const a = b.dataset.a; let h = true;
    if (a === 'fs') {setg.fs = +b.dataset.v; lsSet(SET_KEY, setg); applyFs(); const bx = $q('#scr .box'); scrSet(bx ? bx.dataset.from : 'title');}
    else if (a === 'bk') scrBk();
    else if (a === 'bk_exp') {try {if (S) save();} catch (er) {} scrBk('Код готов. Нажми «Копировать» или выдели текст.', exportCode());}
    else if (a === 'bk_cp') {const t = $('bkt'); if (t) {t.select(); let ok = false; try {ok = document.execCommand('copy');} catch (er) {} try {navigator.clipboard && navigator.clipboard.writeText(t.value).catch(() => {});} catch (er) {} toast(ok ? '📋 Код скопирован' : 'Выдели код и скопируй вручную', 'ok');}}
    else if (a === 'bk_imp') {const t = $('bkt'); try {const n = importCode(t ? t.value : ''); toast('Сохранение загружено (' + n + '). Перезапуск…', 'ok'); setTimeout(() => location.reload(), 900);} catch (er) {toast('Не вышло: ' + er.message, 'bad');}}
    else if (a === 'bk_back') {const bx = $q('#scr .box'); scrSet(bx ? bx.dataset.from : 'title');}
    else if (a === 'stats') scrStats();
    else if (a === 'stats_back') scrMenu();
    else h = false;
    if (h) {e.preventDefault(); e.stopImmediatePropagation(); try {Snd.resume(); Snd.sfx('click');} catch (er) {}}
  }, true);
})();
