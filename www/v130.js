'use strict';
/* v130: эпилог концовок с учётом семьи, питомцев и достижений. MADE BY PESSIMIST */
(function () {
  const _e = ending;
  ending = function (k) {
    const lines = []; try {
      const h = H(), pets = S.pets || [], d = (h.dates || []).find(x => x.id === (h.wife || h.dgf));
      const NM = {oks: 'Оксана', mar: 'Марина', ler: 'Лера', kat: 'Катя', dia: 'Диана', son: 'Соня', ira: 'Ира', nas: 'Настя'};
      if (h.wife) lines.push('💍 ' + (NM[h.wife] || 'Жена') + ' осталась рядом: ' + (k === 'raid' ? 'она принесла передачу и не задала ни одного вопроса.' : k === 'whistle' ? 'она сказала, что гордится тобой.' : 'она встречает тебя дома с чаем.'));
      else if (h.dgf) lines.push('❤ ' + (NM[h.dgf] || 'Она') + ' всё ещё с тобой, и пока вы не решили, что дальше.');
      if (pets.length >= 3) lines.push('🐾 Дома тебя ждут ' + pets.length + ' питомца(ев). Они не спрашивают, чем ты занимался.');
      else if (pets.length) lines.push('🐾 Питомец дома не спрашивает, чем ты занимался. Он просто рад тебе.');
      if (S.corpDone && Object.keys(S.corpDone).length >= 3) lines.push('🪩 Корпоративы ты помнишь лучше, чем рабочие дни.');
      const n = Object.keys(achDone || {}).length; if (n) lines.push('🏆 Достижений: ' + n + ' из ' + ACH.length + '.');
    } catch (e) {}
    const r = _e.apply(this, arguments);
    try {if (lines.length) {const box = document.querySelector('#scr .box'); const st = box && box.querySelector('.stat'); if (st) st.insertAdjacentHTML('afterend', '<p style="margin:6px 0;color:#ffd7a0">' + lines.join('<br>') + '</p>');}} catch (e) {}
    return r;
  };
})();
