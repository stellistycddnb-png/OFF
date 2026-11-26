'use strict';
/* v139: сложность, Новая игра+, награды за достижения, настройки производительности, мини-игра «Лови звонки», сюжетные линии */
(function () {
  const ngS = () => Object.assign({lvl: 0, hell: 0}, lsGet('cc_ng', {}));
  const DIFF = {easy: {n: '🙂 Лёгкая', d: '+₴600, подозрения и удар по совести слабее', hu: .7, cd: .7, bd: .8, m: 600}, norm: {n: '😐 Обычная', d: 'как задумано', hu: 1, cd: 1, bd: 1, m: 0}, hell: {n: '😈 Ад', d: '−₴200, подозрения и штрафы жёстче', hu: 1.35, cd: 1.3, bd: 1.25, m: -200}};
  const achBonus = () => Object.keys(achDone || {}).length * 50;
  const $q = s => document.querySelector(s);

  /* ---------- достижения + награды ---------- */
  const stDone = c => (S && S.st && (S.st['i' + c] || 0) >= 3);
  [
    {id: 'd20', n: 'Полпути', d: 'Дожить до 20 дня', c: () => S.day >= 20},
    {id: 'd40', n: 'Ветеран смены', d: 'Дожить до 40 дня', c: () => S.day >= 40},
    {id: 'rich50', n: 'Миллионер по-украински', d: 'Иметь ₴50 000', c: () => S.money >= 50000},
    {id: 'deals100', n: 'Сотка', d: '100 «сделок» за игру', c: () => S.total >= 100},
    {id: 'spare30', n: 'Ангел-хранитель', d: 'Предупредить 30 человек', c: () => S.spared >= 30},
    {id: 'pets3', n: 'Зоопарк', d: '3 питомца дома', c: () => S.pets && S.pets.length >= 3},
    {id: 'mini200', n: 'Рефлексы', d: '200 очков в мини-игре «Лови звонки»', c: () => lsGet('cc_minibest', 0) >= 200},
    {id: 'hell10', n: 'Ад — это работа', d: 'Дожить до 10 дня на сложности «Ад»', c: () => S.diff === 'hell' && S.day >= 10},
    {id: 'hellwin', n: 'Выжил в аду', d: 'Закончить игру на сложности «Ад»', c: () => ngS().hell >= 1},
    {id: 'ngp1', n: 'Ещё разок', d: 'Завершить игру и открыть «Новую игру+»', c: () => ngS().lvl >= 1},
    {id: 'story1', n: 'Сюжетный человек', d: 'Пройти одну сюжетную линию', c: () => stDone(0) || stDone(1) || stDone(2)},
    {id: 'story3', n: 'Знаю всех', d: 'Пройти все три сюжетные линии', c: () => stDone(0) && stDone(1) && stDone(2)}
  ].forEach(a => {if (!ACH.some(x => x.id === a.id)) ACH.push(a);});
  const _sa = scrAch;
  scrAch = function (from) {_sa(from); try {const b = $q('#scr .box'), p = b && b.querySelector('p'); if (p) p.insertAdjacentHTML('afterend', '<p style="color:#ffd23a">🎁 Награда: за каждое достижение +₴50 к стартовым деньгам новых игр. Сейчас: +' + fmt(achBonus()) + '</p>');} catch (e) {}};

  /* ---------- старт: сложность и Новая игра+ ---------- */
  const _begin = begin;
  begin = function (f) {
    if (f === true && S && !S._ini) {
      S._ini = 1; const d = lsGet('cc_diff', 'norm'), ng = ngS(), on = lsGet('cc_ngon', 0) && ng.lvl > 0, L = on ? ng.lvl : 0;
      S.diff = DIFF[d] ? d : 'norm'; S.ngl = L; S.money += DIFF[S.diff].m + 600 * L + achBonus(); S.boss = Math.min(100, S.boss + 5 * L); S.cons = Math.min(100, S.cons + 3 * L);
      setTimeout(() => {try {toast(DIFF[S.diff].n + (L ? ' · Новая игра+ ур.' + L : '') + (achBonus() ? ' · награды +' + fmt(achBonus()) : ''), 'ok');} catch (e) {}}, 1200);
    }
    return _begin(f);
  };
  /* множители: подозрения / совесть / шеф */
  let lastS = null, lv = {};
  setInterval(() => {
    if (!S || S.mode === 'ending') {lastS = null; return;}
    const D = DIFF[S.diff || 'norm'] || DIFF.norm, L = S.ngl || 0;
    if (lastS !== S) {lastS = S; lv = {heat: S.heat, cons: S.cons, boss: S.boss};}
    const hu = D.hu * (1 + .08 * L);
    let d = S.heat - lv.heat; if (d > .01 && hu !== 1) S.heat = clamp(S.heat + d * (hu - 1), 0, 100);
    d = S.cons - lv.cons; if (d < -.01 && D.cd !== 1) S.cons = clamp(S.cons + d * (D.cd - 1), 0, 100);
    d = S.boss - lv.boss; if (d < -.01 && D.bd !== 1) S.boss = clamp(S.boss + d * (D.bd - 1), 0, 100);
    lv = {heat: S.heat, cons: S.cons, boss: S.boss};
  }, 200);

  const _sn = scrNick;
  scrNick = function () {
    _sn(); try {
      const go = $q('#scr [data-a="v_nickgo"]'); if (!go) return; const cur = lsGet('cc_diff', 'norm'), ng = ngS();
      go.parentNode.insertAdjacentHTML('beforebegin', '<div id="difbox"><h3>⚖ Сложность</h3><div class="col">' + Object.keys(DIFF).map(k => '<button class="btn' + (k === cur ? ' pri' : '') + '" data-a="dif" data-v="' + k + '">' + DIFF[k].n + '<br><small>' + DIFF[k].d + '</small></button>').join('') + '</div>' + (ng.lvl > 0 ? '<button class="btn' + (lsGet('cc_ngon', 0) ? ' pri' : '') + '" data-a="ngt" style="margin-top:8px;width:100%">🔁 Новая игра+ ур.' + ng.lvl + ': ' + (lsGet('cc_ngon', 0) ? 'ВКЛ' : 'выкл') + '<br><small>+₴' + 600 * ng.lvl + ', +' + 5 * ng.lvl + ' к шефу, но подозрения растут быстрее</small></button>' : '') + '</div>');
    } catch (e) {}
  };

  /* ---------- конец игры: Новая игра+ ---------- */
  const _end = ending;
  ending = function (k) {
    try {if (S && !S._ngd) {S._ngd = 1; if (k === 'rich' || k === 'survive' || k === 'whistle') {const g = ngS(); g.lvl = Math.min(5, g.lvl + 1); if (S.diff === 'hell') g.hell = 1; lsSet('cc_ng', g);}}} catch (e) {}
    const r = _end(k); try {checkAch();} catch (e) {} return r;
  };
  new MutationObserver(() => {
    const sc = $('scr'); if (!sc || sc.querySelector('.ngbtn') || !S || S.mode !== 'ending') return; const b = sc.querySelector('[data-a="menu"]'), g = ngS(); if (!b || !g.lvl) return;
    b.insertAdjacentHTML('beforebegin', '<button class="btn ngbtn" data-a="ng_go">🔁 Новая игра+ (ур. ' + g.lvl + ')</button>');
  }).observe($('scr'), {childList: true, subtree: true});

  /* ---------- настройки: производительность и вибро ---------- */
  const weak = /Android/i.test(navigator.userAgent) && ((navigator.hardwareConcurrency || 8) <= 6 || (navigator.deviceMemory || 8) <= 4);
  if (setg.perf === undefined) setg.perf = weak ? 1 : 0; if (setg.vib === undefined) setg.vib = true;
  const applyPerf = () => {document.body.classList.toggle('perf1', setg.perf >= 1); document.body.classList.toggle('perf2', setg.perf >= 2); window.__perf = setg.perf;};
  applyPerf();
  try {const ov = navigator.vibrate && navigator.vibrate.bind(navigator); if (ov) navigator.vibrate = p => setg.vib === false ? false : ov(p);} catch (e) {}
  const _ss = scrSet;
  scrSet = function (from) {
    _ss(from); try {
      const bk = $q('#scr [data-a="back"]'); if (!bk) return; const P = ['✨ Красиво', '⚡ Лёгкий', '🪫 Минимум'];
      bk.parentNode.insertAdjacentHTML('beforebegin', '<h3>🎞 Эффекты</h3><div class="row two">' + P.map((n, i) => '<button class="btn sm' + (setg.perf === i ? ' pri' : '') + '" data-a="perf" data-v="' + i + '">' + n + '</button>').join('') + '</div><p style="color:#9a8fb8;font-size:12px">«Лёгкий» и «Минимум» отключают лишние анимации — для слабых телефонов.</p><button class="btn sm" data-a="vibt" style="width:100%">📳 Вибрация: ' + (setg.vib === false ? 'выкл' : 'вкл') + '</button><p style="height:6px"></p>');
    } catch (e) {}
  };

  /* ---------- мини-игра «Лови звонки» ---------- */
  const _sm = scrMenu;
  scrMenu = function () {
    _sm(); try {const b = $q('#scr [data-a="achm"]'); if (b) b.insertAdjacentHTML('afterend', '<button class="btn" data-a="mini">🎮 Перерыв: «Лови звонки»<br><small>' + (S && S.miniDay === S.day ? 'сегодня уже был перерыв' : 'раз в день · −8 сил · деньги за очки') + '</small></button>');} catch (e) {}
  };
  function mini() {
    hideScr(); const W = 320, H = 440, ov = document.createElement('div'); ov.id = 'mini'; ov.style.cssText = 'position:fixed;inset:0;z-index:99999;background:rgba(8,4,20,.96);display:flex;flex-direction:column;align-items:center;justify-content:center;touch-action:none';
    const cv = document.createElement('canvas'); cv.width = W; cv.height = H; cv.style.cssText = 'width:min(94vw,calc(78vh*' + (W / H) + '));border-radius:14px;border:2px solid #4a3a82;background:#150a33;touch-action:none'; ov.appendChild(cv);
    ov.insertAdjacentHTML('beforeend', '<div style="color:#9a8fb8;font:600 13px sans-serif;margin-top:8px">Двигайте палец · 📞 +10 · 💰 +25 · 🚨 проверка −1 жизнь</div>'); document.body.appendChild(ov);
    const g = cv.getContext('2d'); let px = W / 2, score = 0, lives = 3, time = 25, last = performance.now(), items = [], spawn = 0, over = false, raf = 0;
    const mv = e => {const r = cv.getBoundingClientRect(), t = e.touches ? e.touches[0] : e; px = clamp((t.clientX - r.left) / r.width * W, 28, W - 28); e.preventDefault && e.preventDefault();};
    ov.addEventListener('pointermove', mv); ov.addEventListener('pointerdown', mv); ov.addEventListener('touchmove', mv, {passive: false});
    const sfx = n => {try {Snd.sfx(n);} catch (e) {}};
    function fin() {
      if (over) return; over = true; cancelAnimationFrame(raf); const best = Math.max(lsGet('cc_minibest', 0), score); lsSet('cc_minibest', best);
      const gain = Math.min(900, Math.round(score * 3)); S.money += gain; S.energy = clamp(S.energy - 8, 0, 100); S.miniDay = S.day; S.miniN = (S.miniN || 0) + 1; try {checkAch(); renderHud(); save();} catch (e) {}
      ov.innerHTML = '<div style="text-align:center;color:#f2ecff;font:700 18px sans-serif;padding:20px"><div style="font-size:54px">' + (score >= 200 ? '🏆' : '📞') + '</div><p>Перерыв окончен!</p><p style="color:#ffd23a;font-size:30px">' + score + ' очков</p><p>Заработано: <b>' + fmt(gain) + '</b></p><p style="color:#9a8fb8;font-size:14px">Рекорд: ' + best + '</p><button class="btn pri" data-a="mini_end">← Вернуться</button></div>'; sfx(score >= 100 ? 'good' : 'click');
    }
    function loop(now) {
      if (over) return; raf = requestAnimationFrame(loop); const dt = Math.min(.05, (now - last) / 1000); last = now; time -= dt; spawn -= dt;
      if (spawn <= 0) {spawn = .42 - Math.min(.2, (25 - time) * .008); const r = Math.random(); items.push({x: 20 + Math.random() * (W - 40), y: -20, v: 110 + Math.random() * 90 + (25 - time) * 4, k: r < .6 ? '📞' : r < .8 ? '💰' : '🚨'});}
      items.forEach(i => i.y += i.v * dt);
      for (const i of items) {if (i.y > H - 54 && i.y < H - 12 && Math.abs(i.x - px) < 34) {i.dead = 1; if (i.k === '🚨') {lives--; sfx('bad'); try {vib(40);} catch (e) {}} else {score += i.k === '💰' ? 25 : 10; sfx(i.k === '💰' ? 'cash' : 'tick');}} else if (i.y > H + 20) i.dead = 1;}
      items = items.filter(i => !i.dead);
      g.fillStyle = '#150a33'; g.fillRect(0, 0, W, H); g.fillStyle = '#1e1040'; for (let b = 0; b < 8; b++) g.fillRect(b * 42, H - 120 - (b * 37 % 5) * 20, 36, 200);
      g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = '#fff'; g.font = '26px sans-serif'; for (const i of items) g.fillText(i.k, i.x, i.y);
      g.font = '38px sans-serif'; g.fillText('🧺', px, H - 32);
      g.font = '800 16px sans-serif'; g.textAlign = 'left'; g.fillStyle = '#ffd23a'; g.fillText('★ ' + score, 10, 18); g.textAlign = 'right'; g.fillStyle = '#7ff3ff'; g.fillText(Math.max(0, Math.ceil(time)) + ' c', W - 10, 18); g.textAlign = 'center'; g.fillStyle = '#ff7a9a'; g.fillText('❤'.repeat(Math.max(0, lives)), W / 2, 18);
      if (time <= 0 || lives <= 0) fin();
    }
    raf = requestAnimationFrame(loop);
  }

  /* ---------- сюжетные линии ---------- */
  const STORY = [
    [{d: 8, ic: '🧑‍💻', t: 'Стажёр Витя', x: () => 'Новенький Витя шепчет: «Слушай, а это точно честная работа?»', ch: [{a: 'Сказать как есть', fx: {cons: 4, boss: -3}, v: 1, r: 'Витя бледнеет и молча кивает. Теперь вы — его единственный друг в этой конторе.'}, {a: '«Конечно честная. Работай.»', fx: {boss: 3, cons: -4}, v: 0, r: 'Витя вздыхает и надевает наушники. Шеф доволен вашим «наставничеством».'}]},
     {d: 17, ic: '🧑‍💻', t: 'Витя и папка', x: s => s.v0 ? 'Витя нашёл у Палыча папку с договорами. «Помоги скопировать, пока никто не видит?»' : 'Витя стал лучшим закрывателем в зале и предлагает вам 10% от своих «сделок».', ch: [{a: s => s.v0 ? 'Помочь скопировать' : 'Взять 10%', fx: s => s.v0 ? {heat: 6, cons: 4} : {money: 400, cons: -4}, ev: s => s.v0 ? 1 : 0, r: 'Всё прошло тихо. Почти.'}, {a: s => s.v0 ? 'Сделать вид, что ничего не видели' : 'Отказаться', fx: s => s.v0 ? {cons: -3, heat: -2} : {cons: 2, boss: 2}, r: 'Витя пожимает плечами. «Ну ладно.»'}]},
     {d: 28, ic: '🧑‍💻', t: 'Итог с Витей', x: s => s.v0 ? 'Витя увольняется и уходит в журналисты. Шеф спрашивает, не знаете ли вы что-нибудь.' : 'Шеф хочет повысить Витю. Он просит вашего мнения.', ch: [{a: 'Прикрыть Витю', fx: {boss: -4, cons: 6}, r: 'Витя машет вам из окна автобуса. Вы сделали правильно.'}, {a: 'Сдать Витю', fx: {boss: 6, cons: -8, money: 300}, r: 'Шеф доволен. А Витя больше не пишет.'}]}],
    [{d: 12, ic: '🕵️', t: 'Журналистка Лена', x: () => 'В рабочем чате появилась «Лена из редакции»: «Расскажите, как у вас всё устроено. Анонимно.»', ch: [{a: 'Ответить анонимно', fx: {cons: 4, heat: 4}, ev: 1, v: 1, r: 'Вы отправили пару общих фраз. Лена благодарит.'}, {a: 'Проигнорировать', fx: {heat: -2}, v: 0, r: 'Чат удаляется сам собой. Вы выдыхаете.'}]},
     {d: 22, ic: '🕵️', t: 'Встреча с Леной', x: s => s.v0 ? 'Лена нашла вас сама: «Давайте поговорим лично. Вы же всё видите.»' : 'Лена снова пишет и предлагает встретиться в кафе напротив.', ch: [{a: 'Передать документ', fx: {cons: 6, heat: 8}, ev: 1, v: 1, r: 'Лена прячет флешку и уходит, не оборачиваясь.'}, {a: 'Отказать', fx: {cons: -2, boss: 2}, v: 0, r: 'Лена кивает: «Я понимаю». Но в её взгляде разочарование.'}]},
     {d: 34, ic: '🕵️', t: 'Статья Лены', x: s => s.v1 ? 'Вышла статья «Как работает кол-центр». В зале паника, шеф бегает с телефоном.' : 'Вышла статья без вашей помощи. Она получилась слабой, но шумной.', ch: [{a: 'Сказать, что вы ни при чём', fx: {boss: 3, cons: -3}, r: 'Шеф верит. Почти.'}, {a: 'Промолчать', fx: s => s.v1 ? {heat: 8, cons: 6} : {cons: 2}, r: 'Вы молча допиваете кофе. Что-то изменилось.'}]}],
    [{d: 10, ic: '🧓', t: 'Палыч просит', x: () => 'Охранник Палыч шепчет: «Прикрой, я отойду на часок. Никому ни слова.»', ch: [{a: 'Прикрыть', fx: {heat: 3, boss: -1}, v: 1, r: 'Палыч вернулся с пакетом пирожков. Вы теперь друзья.'}, {a: 'Отказать', fx: {boss: 2}, v: 0, r: 'Палыч обиженно уходит, бормоча что-то про молодёжь.'}]},
     {d: 20, ic: '🧓', t: 'Ключ от серверной', x: s => s.v1 ? 'Палыч протягивает ключ от серверной: «Ты мне как сын. Там много интересного.»' : 'Палыч нашёл ключ от серверной и спрашивает, что с ним делать.', ch: [{a: 'Заглянуть в серверную', fx: {heat: 5}, ev: 1, v: 1, r: 'Вы нашли неплохой список клиентов. И много пыли.'}, {a: 'Вернуть ключ шефу', fx: {boss: 4}, v: 0, r: 'Шеф удивлён вашей честностью. Это подозрительно.'}]},
     {d: 30, ic: '🧓', t: 'Рыбалка с Палычем', x: () => 'Палыч зовёт на рыбалку в выходные: «Лучше места нет. Без телефона и начальства.»', ch: [{a: 'Поехать', fx: {energy: 15, cons: 3, money: -150}, r: 'Тишина, поплавок, пирожки. Вы вернулись другим человеком.'}, {a: 'Остаться дома', fx: {energy: -5}, r: 'Палыч кивает: «В следующий раз».'}]}]
  ];
  const ST = () => (S.st = S.st || {});
  const val = (x, s) => typeof x === 'function' ? x(s) : x;
  function storyDue() {
    if (!S || S.mode !== 'idle' || $('scr').innerHTML) return; const st = ST();
    for (let c = 0; c < STORY.length; c++) {const i = st['i' + c] || 0, b = STORY[c][i]; if (b && b.d <= S.day) return storyShow(c, i);}
  }
  function storyShow(c, i) {
    const b = STORY[c][i], st = ST(), s = {v0: st['v' + c] === 0, v1: st['v' + c] === 1}; S.mode = 'event'; running = false; try {Snd.ringStop();} catch (e) {}
    showScr('<div class="box corp"><div class="corp-hd small"><div class="corp-ic">' + b.ic + '</div></div><h2>' + b.t + '</h2><p>' + val(b.x, s) + '</p><div class="col">' + b.ch.map((x, k) => '<button class="btn' + (k ? '' : ' pri') + '" data-a="st_pick" data-v="' + c + ':' + i + ':' + k + '">' + val(x.a, s) + '</button>').join('') + '</div></div>', true); Snd.sfx('phone'); render();
  }
  function storyPick(v) {
    const [c, i, k] = v.split(':').map(Number), b = STORY[c][i], st = ST(), s = {v0: st['v' + c] === 0, v1: st['v' + c] === 1}, x = b.ch[k], f = val(x.fx, s) || {};
    ['boss', 'heat', 'cons', 'energy'].forEach(q => {if (f[q]) S[q] = clamp(S[q] + f[q], 0, 100);}); if (f.money) S.money += f.money; if (val(x.ev, s)) S.evidence = (S.evidence || 0) + 1;
    if (x.v !== undefined) st['v' + c] = x.v; st['i' + c] = i + 1; const last = i + 1 >= STORY[c].length;
    showScr('<div class="box corp"><div class="corp-hd small"><div class="corp-ic">' + b.ic + '</div></div><h2>' + b.t + '</h2><p>' + x.r + '</p><div class="chips">' + fxChips(f) + '</div>' + (last ? '<p style="color:#ffd23a">★ Сюжетная линия завершена</p>' : '') + '<div class="row"><button class="btn pri" data-a="st_done">Продолжить смену</button></div></div>', true); Snd.sfx(((f.cons || 0) + (f.boss || 0)) >= 0 ? 'good' : 'bad'); renderHud(); try {checkAch();} catch (e) {}
  }
  window.__storyDue = storyDue;
  const _nd = nextDay; nextDay = function () {_nd(); setTimeout(storyDue, 1800);};

  /* ---------- обработчики ---------- */
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-a]'); if (!b) return; const a = b.dataset.a, v = b.dataset.v; let h = true;
    if (a === 'dif') {lsSet('cc_diff', v); document.querySelectorAll('#difbox [data-a="dif"]').forEach(x => x.classList.toggle('pri', x === b));}
    else if (a === 'ngt') {const on = lsGet('cc_ngon', 0) ? 0 : 1; lsSet('cc_ngon', on); scrNick();}
    else if (a === 'ng_go') {lsSet('cc_ngon', 1); startNew();}
    else if (a === 'perf') {setg.perf = +v; lsSet(SET_KEY, setg); applyPerf(); const bx = $q('#scr .box'); scrSet(bx ? bx.dataset.from : 'title');}
    else if (a === 'vibt') {setg.vib = setg.vib === false; lsSet(SET_KEY, setg); const bx = $q('#scr .box'); scrSet(bx ? bx.dataset.from : 'title');}
    else if (a === 'mini') {if (S && S.miniDay === S.day) toast('Сегодня перерыв уже был', 'warn'); else if (S && S.energy < 8) toast('Нет сил на перерыв', 'warn'); else mini();}
    else if (a === 'mini_end') {const m = $('mini'); if (m) m.remove(); scrMenu();}
    else if (a === 'st_pick') storyPick(v);
    else if (a === 'st_done') {hideScr(); if (S.cons <= 0) return ending('conscience'); if (S.heat >= 100) return ending('raid'); if (S.boss <= 0) return ending('fired'); S.mode = 'idle'; running = true; T0 = performance.now(); render(); save(); setTimeout(storyDue, 900);}
    else h = false;
    if (h) {e.preventDefault(); e.stopImmediatePropagation(); try {Snd.resume(); Snd.sfx('click');} catch (er) {}}
  }, true);
})();
