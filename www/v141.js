'use strict';
/* v141: обучение от Лесного — подсказки по всем кнопкам в первые дни (с юмором). */
(function () {
  const $q = s => document.querySelector(s), TK = 'cc_tut';
  let T = Object.assign({off: 0, done: {}}, lsGet(TK, {})), open = null, prevRun = null, queue = [];
  const sv = () => lsSet(TK, T);
  /* id: {t — текст, hl — что подсветить, w — условие появления} */
  const STEPS = {
    hello: {t: 'Здорово, новичок! Я Лесной, из администрации, работаю здесь с тех пор, как динозавры звонили по таксофону. Вижу по тебе: толк будет, хуле. Я тут, чтобы ты быстро въехал и не ебался с кнопками. Слушай, повторять не стану. Хотя стану, мне за это платят, блядь.'},
    hud: {pos: 'mid', hl: '#hud', t: 'Это твоя приборка, красавчик. 🧠 Совесть: упадёт до нуля, и ты выгоришь. 🚨 Подозрения: заполнятся, и нагрянет проверка. 😠 Шеф: если разозлится, уволит. ⚡ Силы: на нуле работать нечем. Внизу план. Выполнишь, и тебе пиздато, и шефу хорошо.'},
    ring: {hl: '[data-c="answer"]', t: 'Звонит, ёпта! Красота какая. Жми «ВЗЯТЬ ТРУБКУ» и работай, у тебя получится, я в тебя верю.'},
    open: {hl: '.dil', t: 'С чего начнёшь? Официально: для серьёзных людей. По-дружески: для добряков. «Срочно!»: для тех, кого надо подтолкнуть. Угадаешь, и разговор пойдёт как по маслу. Не угадаешь, не беда, в следующий раз получится.'},
    act: {hl: '.meters', t: 'Смотри на клиента: возраст, характер, настроение. Здесь интерес, там подозрение. Вырос интерес, и «сделка» твоя. Выросло подозрение, и клиент слился. Всё просто, ты быстро въедешь.'},
    acts: {hl: '.reply', t: 'Это твои реплики. Каждая давит на своё: нажим, лесть, умные слова, сочувствие. Бабушкам лесть, студентам термины, занятым нажим. Попал в точку, и клиент твой. Промазал, подозрение растёт, но ты ж не железный, бывает.'},
    acts2: {hl: '[data-c="warn"],[data-c="hang"],[data-c="delay"],[data-c="transfer"]', t: 'Остальные кнопки. «Минутку, проверю» тянет время. «Передать специалисту» отдаёт клиента коллеге. «Положить» кладёт трубку. А «Предупредить» нужна, если хочешь сберечь совесть и сбросить подозрения: денег не даст, зато нервы целее.'},
    story: {hl: '.story', t: 'Видишь? «Сделка» закрыта: комиссия твоя, оборот в плане. Вот это пиздато! Так держать, ты на верном пути. Чем больше таких, тем быстрее повышение.'},
    bar: {hl: '#bar button:not(.r2)', t: 'Нижние кнопки. ☕ Кофе: силы. 🍜 Обед: больше сил и меньше денег. 🚬 Перекур: отдых, но шеф косится. 👥 Команда: коллеги и должности. ☰ Меню: настройки и всякое. Жми по очереди, ничего не сломаешь.'},
    bar2: {hl: '#bar .r2', t: 'Вторая строка для личной жизни. 🏡 Дом, 💘 Отношения, 🗺 Поездки, 🛍 Магазин. Нормальный человек не только работает, но и живёт, ёпта.'},
    c_coffee: {t: 'Кофе. Дёшево, бодрит, пахнет моей молодостью. Бери, когда силы на исходе, и дальше работай как зверь.'},
    c_lunch: {t: 'Обед. Дороже кофе, зато сытнее. Голодный оператор делает ошибки, а сытый красавчик закрывает «сделки». Хорошо пожрал, хорошо поработал.'},
    c_smoke: {t: 'Перекур. Бесплатно, но шеф всё замечает. Если не куришь, просто постой у окна, подыши. Минут пять, не дольше.'},
    c_team: {t: 'Команда. Коллеги, должности, повышения. Дружи с нужными людьми, и тебя продвинут. Здесь это работает охуенно.'},
    c_menu: {t: 'Меню. Достижения, навыки, настройки и мини-игры на перерыве. Сохранение идёт само, так что можно не париться.'},
    c_home: {t: 'Дом. Там живут питомцы, жена, если повезёт, и ты. Покорми зверей, они тебя ждут и любят. Пиздато же!'},
    c_love: {t: 'Отношения. Знакомства, свидания, свадьба. Заведёшь семью, и жизнь заиграет. Попробуй, не пожалеешь.'},
    c_trip: {t: 'Поездки. Рестораны, боулинг, караоке. Исходы разные, но отдых обычно идёт на пользу. Развеешься, и в понедельник снова в бой.'},
    c_shop: {t: 'Магазин. Техника, мебель, всякая годнота. Не трать всё сразу, прикинь, что тебе реально поможет. Хорошая вещь работает на тебя каждый день.'},
    summary: {t: 'Конец дня. Оклад минус расходы, итоги по плану и настроение шефа. Выполнил план, и шеф улыбается, а это дорогого стоит. Не выполнил, не парься, завтра новый день.'},
    hub: {t: 'Вечер. Свободных действий мало, так что выбирай с умом. Что бы ты ни выбрал, это будет не хуже, чем у большинства.'},
    event: {t: 'Случайное событие. Правильных ответов тут нет, есть последствия. Думай головой, ты у нас парень толковый.'},
    plan: {pos: 'mid', hl: '#plan', t: 'План на день. Набрал оборот, и шеф доволен. Не добрал, и шеф бурчит. Идёшь хорошо, продолжай в том же духе.'},
    rank: {t: 'Тебя повысили! Поздравляю, блядь, заслужил! Теперь у тебя больше денег и больше возможностей. Но и спрос выше, так что держи марку.'},
    heat: {pos: 'mid', hl: '#bHeat', t: 'Глянь на подозрения. Красная полоса растёт, а если дойдёт до конца, нагрянет проверка. Сходи к Палычу, купи VPN, найми адвоката. Решай вопрос, пока не припекло, ты справишься.'},
    cons: {pos: 'mid', hl: '#bCons', t: 'Совесть на исходе. Подзарядись: предупреди кого-нибудь из клиентов, это бесплатно. Лучше не доводить до нуля, поверь старому Лесному.'},
    bye: {t: 'Ну всё, красавчик, дальше сам. Ты шустро схватываешь, из тебя выйдет толк. Буду иногда писать и подбадривать, без этого никак. Не звони, я на рыбалке. Удачи, ёпта!'}
  };
  const ORDER = Object.keys(STEPS);

  /* ---------- окно ---------- */
  const css = document.createElement('style'); css.textContent = '#lesn{position:fixed;inset:0;z-index:9500;display:flex;align-items:flex-start;justify-content:center;padding:70px 10px 0;background:rgba(0,0,0,.18)}#lesn .lb{width:min(94vw,430px);background:#1d1442;border:2px solid #ffd23a;border-radius:16px;padding:12px;box-shadow:0 8px 30px rgba(0,0,0,.6);color:#f2ecff;font:600 14px/1.45 sans-serif;animation:lpop .25s ease-out}#lesn .lh{display:flex;align-items:center;gap:10px;margin-bottom:6px}#lesn .la{width:46px;height:46px;border-radius:50%;background:#2c1d5e;border:2px solid #ffd23a;display:flex;align-items:center;justify-content:center;font-size:28px}#lesn .ln{font:800 15px sans-serif;color:#ffd23a}#lesn .ls{font-size:11px;color:#9a8fb8;font-weight:600}#lesn .lr{display:flex;gap:8px;margin-top:10px}#lesn .lr .btn{flex:1}@keyframes lpop{from{transform:translateY(-14px);opacity:0}}.tut-hl{outline:3px solid #ffd23a !important;outline-offset:2px;border-radius:10px;animation:thl 1s ease-in-out infinite}@keyframes thl{50%{outline-color:#ff3ac8}}body.perf2 .tut-hl{animation:none}'; document.head.appendChild(css);
  function clearHl() {document.querySelectorAll('.tut-hl').forEach(e => e.classList.remove('tut-hl'));}
  function showNext() {
    if (open || !queue.length) return; const id = queue.shift(), s = STEPS[id]; if (!s || T.done[id] || T.off) return showNext();
    open = id; prevRun = running; if (S && S.mode === 'ring') {try {clearTimeout(ringTO);} catch (e) {}} running = false; clearHl();
    if (s.hl) {try {document.querySelectorAll(s.hl).forEach(e => e.classList.add('tut-hl'));} catch (e) {}}
    const left = ORDER.filter(x => !T.done[x]).length, d = document.createElement('div'); d.id = 'lesn'; if (s.pos === 'mid') d.style.cssText = 'align-items:center;padding-top:0;background:transparent';
    d.innerHTML = '<div class="lb"><div class="lh"><div class="la">🧔</div><div><div class="ln">Лесной</div><div class="ls">наставник · обучение</div></div></div><div>' + s.t + '</div><div class="lr"><button class="btn pri" data-t="ok">Понял ✔</button><button class="btn sm" data-t="off" style="flex:.6">Хватит учить</button></div></div>'; document.body.appendChild(d); try {Snd.sfx('pop');} catch (e) {}
  }
  function close(off) {
    const d = $('lesn'); if (d) d.remove(); clearHl(); if (open) {T.done[open] = 1;} if (off) T.off = 1; sv(); const was = open; open = null;
    if (S && prevRun && S.mode !== 'ending') {running = true; T0 = performance.now();} prevRun = null; try {if (S) render();} catch (e) {}
    setTimeout(showNext, 250);
  }
  document.addEventListener('click', e => {const b = e.target.closest('#lesn [data-t]'); if (b) {e.preventDefault(); e.stopPropagation(); try {Snd.resume(); Snd.sfx('click');} catch (er) {} close(b.dataset.t === 'off');}}, true);
  const ask = id => {if (!T.off && !T.done[id] && !queue.includes(id) && open !== id) {queue.push(id); showNext();}};
  window.__tut = {ask, reset: () => {T = {off: 0, done: {}}; sv();}, state: () => T};

  /* ---------- триггеры ---------- */
  const scrEmpty = () => !$('scr').innerHTML;
  setInterval(() => {
    if (!S || T.off || open || $('app').classList.contains('hide') || document.getElementById('dailypop') || document.getElementById('mini') || document.getElementById('updpop')) return;
    if (!T.init) {T.init = 1; if (S.day >= 3 || S.total >= 5) ORDER.forEach(x => T.done[x] = 1); sv();}
    const c = S.call, m = S.mode;
    if (m === 'idle' && scrEmpty()) {
      if (S.day === 1 && !S.total && !S.spared) {ask('hello'); ask('hud');}
      if (S.total + S.spared >= 1 || S.day >= 2) {ask('bar'); ask('bar2');}
      if (S.day >= 2) ask('plan');
      if (S.heat >= 50) ask('heat'); if (S.cons <= 40) ask('cons'); if (S.rank >= 1) ask('rank');
      if (S.day >= 6) ask('bye');
    }
    if (m === 'ring') ask('ring');
    if (m === 'call' && c && scrEmpty()) {if (c.open) ask('open'); else {ask('act'); ask('acts'); if (c.turn >= 1) ask('acts2');}}
    if (m === 'story') ask('story');
    if (m === 'summary') ask('summary');
    if (m === 'event' && S.day >= 2) ask('event');
  }, 450);
  $('bar').addEventListener('click', e => {const b = e.target.closest('button'); if (!b || T.off) return; const k = 'c_' + b.dataset.b; if (STEPS[k]) setTimeout(() => ask(k), 350);}, true);
  new MutationObserver(() => {if (!S || T.off) return; const h = $q('#scr .box h2'); if (h && /Вечер/.test(h.textContent)) ask('hub');}).observe($('scr'), {childList: true, subtree: true});

  /* ---------- кнопка в настройках ---------- */
  const _ss = scrSet;
  scrSet = function (from) {_ss(from); try {const bk = $q('#scr [data-a="back"]'); if (bk) bk.parentNode.insertAdjacentHTML('beforebegin', '<button class="btn sm" data-a="tutt" style="width:100%;margin-bottom:8px">🧔 Обучение Лесного: ' + (T.off ? 'выкл (включить и повторить)' : 'вкл (сбросить подсказки)') + '</button>');} catch (e) {}};
  document.addEventListener('click', e => {const b = e.target.closest('[data-a="tutt"]'); if (!b) return; e.preventDefault(); e.stopImmediatePropagation(); T = {off: 0, done: {}}; sv(); toast('🧔 Лесной вернулся. Подсказки сброшены.', 'ok'); const bx = $q('#scr .box'); scrSet(bx ? bx.dataset.from : 'title');}, true);
})();
