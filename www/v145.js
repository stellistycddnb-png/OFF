'use strict';
/* v145: «обыск-предупреждение» для новичков, случайные повороты во время звонка (разнообразие) */
(function () {
  const $q = s => document.querySelector(s);
  const TW = [
    {ic: '👶', t: 'Внучка берёт трубку', x: '«Тётя, а вы кто? А бабушка в магазине!» Ребёнок явно что-то понимает.', ch: [{a: 'Включить «голос доброго дяди»', fx: {pers: 6, susp: 6}, r: 'Девочка хихикает. Бабушка скоро вернётся.'}, {a: 'Вежливо попросить позвать взрослых', fx: {susp: -6}, r: 'Ребёнок серьёзно кивает и уходит искать бабушку.'}]},
    {ic: '🚪', t: 'Шеф идёт по залу', x: 'По проходу идёт шеф и смотрит на ваш экран. Секунда на решение.', ch: [{a: 'Сделать вид, что работаете честно', fx: {boss: 2, pers: -8}, r: 'Шеф кивнул и ушёл. Клиент остыл.'}, {a: 'Продолжить как есть', fx: {boss: -4, pers: 8}, r: 'Шеф прищурился, но промолчал. Пока.'}]},
    {ic: '📡', t: 'Связь пропадает', x: 'В трубке шипение, голос клиента то уходит, то возвращается.', ch: [{a: 'Спокойно перезвонить', fx: {susp: 5}, r: 'Клиент ответил раздражённо, но трубку взял.'}, {a: 'Орать в трубку', fx: {pers: 6, susp: 8}, r: 'Клиент слышит всё. Включая то, что вы нервничаете.'}]},
    {ic: '🐕', t: 'Лает собака', x: 'У клиента на фоне заливается пёс. Клиент нервничает.', ch: [{a: '«Какая милая собачка!»', fx: {pers: 8, susp: -4}, r: 'Клиент расплылся: «Это Бобик, он у нас охранник».'}, {a: 'Попросить убрать собаку', fx: {susp: 6}, r: 'Клиент обиделся за пса.'}]},
    {ic: '🤝', t: 'Коллега шепчет подсказку', x: 'Сосед по кабинке сунул вам бумажку: «Скажи, что у тебя скидка до конца дня».', ch: [{a: 'Прислушаться', fx: {pers: 10, cons: -2}, r: 'Сработало. Ты в долгу перед соседом.'}, {a: 'Отмахнуться', fx: {cons: 2}, r: 'Сосед закатил глаза. Ну и ладно.'}]},
    {ic: '🪪', t: 'Клиент просит проверить вас', x: '«А назовите-ка номер вашей лицензии!» — говорит клиент и ждёт.', ch: [{a: 'Назвать любой номер', fx: {susp: 10, pers: 6}, r: 'Клиент записал. Вы чувствуете, что зря.'}, {a: 'Сменить тему', fx: {susp: 3}, r: 'Клиент хмыкнул, но продолжил слушать.'}]},
    {ic: '🧔', t: 'Лесной в наушнике', x: 'В общем канале хрипит Лесной: «Слушай сюда, ёпта. Говори помедленнее и уверенно, у тебя получится».', ch: [{a: 'Послушать Лесного', fx: {pers: 10, susp: -5}, r: 'Лесной знает, что делает. Клиент слушает внимательнее.'}, {a: 'Выключить наушник', fx: {cons: 2}, r: 'Лесной в эфире обиженно сопит: помогал же, блядь.'}]},
    {ic: '😢', t: 'Клиент плачет', x: 'В трубке всхлипывания. Кажется, у человека тяжёлый день.', ch: [{a: 'Утешить по-человечески', fx: {pers: 8, cons: 4, susp: -6}, r: 'Клиент благодарно высморкался. Вам стало неловко и тепло.'}, {a: 'Давить дальше', fx: {pers: 12, cons: -6, susp: 4}, r: 'Вы почувствовали себя последним мудаком. Но сработало.'}]},
    {ic: '🧓', t: 'Просит позвонить сыну', x: '«Давайте сын вам перезвонит, он у меня в юристах разбирается».', ch: [{a: 'Согласиться', fx: {susp: -8, pers: 4}, r: 'Клиент успокоился. Сын, скорее всего, никогда не позвонит.'}, {a: 'Отказать', fx: {susp: 8}, r: 'Клиент напрягся. Про сына он уже не вспоминает.'}]},
    {ic: '☕', t: 'Кофе на клавиатуру', x: 'Вы опрокинули кружку. Клавиатура мокрая, клиент ждёт.', ch: [{a: 'Продолжить разговор', fx: {pers: -5}, r: 'Клавиши липнут, зато клиент ничего не заметил.'}, {a: 'Быстро вытереть', fx: {susp: -3}, r: 'Вы извинились за паузу. Клиент отнёсся с пониманием.'}]}
  ];
  const clamp2 = (v, a, b) => Math.max(a, Math.min(b, v));
  const _ch = choose;
  choose = function () {
    const c = S && S.call; _ch.apply(this, arguments);
    if (!c || !S || S.call !== c || S.mode !== 'call' || c.tw || c.turn < 2 || S.day < 3 || Math.random() > .18) return;
    c.tw = 1; setTimeout(() => {if (S && S.call === c && S.mode === 'call' && !$('scr').innerHTML && !document.getElementById('lesn')) show(c);}, 450);
  };
  function show(c) {
    const i = Math.floor(Math.random() * TW.length), b = TW[i]; S.mode = 'event'; running = false; window.__twC = c;
    showScr('<div class="box corp"><div class="corp-hd small"><div class="corp-ic">' + b.ic + '</div></div><h2>' + b.t + '</h2><p>' + b.x + '</p><div class="col">' + b.ch.map((x, k) => '<button class="btn' + (k ? '' : ' pri') + '" data-a="tw_pick" data-v="' + i + ':' + k + '">' + x.a + '</button>').join('') + '</div></div>', true); try {Snd.sfx('phone');} catch (e) {}
  }
  function pick(v) {
    const [i, k] = v.split(':').map(Number), b = TW[i], x = b.ch[k], f = x.fx, c = window.__twC || S.call;
    if (c) {if (f.pers) c.pers = clamp2(c.pers + f.pers, 0, 95); if (f.susp) c.susp = clamp2(c.susp + f.susp, 0, 95);}
    ['boss', 'cons'].forEach(q => {if (f[q]) S[q] = clamp2(S[q] + f[q], 0, 100);});
    const chips = (f.pers ? '<span class="chip">' + (f.pers > 0 ? '🙂 интерес +' : '🙂 интерес ') + f.pers + '</span>' : '') + (f.susp ? '<span class="chip">' + (f.susp > 0 ? '🚨 подозрение +' : '🚨 подозрение ') + f.susp + '</span>' : '') + (f.boss ? '<span class="chip">😠 шеф ' + (f.boss > 0 ? '+' : '') + f.boss + '</span>' : '') + (f.cons ? '<span class="chip">🧠 совесть ' + (f.cons > 0 ? '+' : '') + f.cons + '</span>' : '');
    showScr('<div class="box corp"><div class="corp-hd small"><div class="corp-ic">' + b.ic + '</div></div><h2>' + b.t + '</h2><p>' + x.r + '</p><div class="chips">' + chips + '</div><div class="row"><button class="btn pri" data-a="tw_done">Вернуться к звонку</button></div></div>', true); try {renderHud();} catch (e) {}
  }
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-a="tw_pick"],[data-a="tw_done"]'); if (!b) return; e.preventDefault(); e.stopImmediatePropagation(); try {Snd.resume(); Snd.sfx('click');} catch (er) {}
    if (b.dataset.a === 'tw_pick') return pick(b.dataset.v);
    hideScr(); if (S.cons <= 0) return ending('conscience'); if (S.boss <= 0) return ending('fired'); S.mode = 'call'; running = true; T0 = performance.now(); try {render(); save();} catch (er) {}
  }, true);

  /* новичкам: первый обыск до 8 дня срывается один раз */
  const _e = ending;
  ending = function (k) {
    if (k === 'raid' && S && S.day <= 7 && !S.pass && S.diff !== 'hell') {
      S.pass = 1; S.heat = 55; S.mode = 'idle'; running = true; T0 = performance.now(); try {hideScr();} catch (e) {}
      try {toast('🚔 Обыск сорвался: Палыч выдернул рубильник! Подозрения сброшены до 55. Второго шанса не будет.', 'warn'); Snd.sfx('boom'); renderHud(); save();} catch (e) {}
      setTimeout(() => {try {window.__lesnSay && window.__lesnSay('heat', true);} catch (e) {}}, 1500); return;
    }
    return _e.apply(this, arguments);
  };
})();
