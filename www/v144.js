'use strict';
/* v144: вторая мини-игра «Ловушка в договоре» (раз в день) */
(function () {
  const $q = s => document.querySelector(s);
  const TRAP = ['Оплата за воздух вносится вперёд, а воздух не возвращается', 'Все споры решает тапок директора, обжалованию не подлежит', 'Клиент обязуется радоваться за свой счёт', 'Штраф за каждое «нет» составляет месячную зарплату', 'Договор вступает в силу, когда его прочитают, но читать запрещено', 'Компания не отвечает ни за что, включая саму себя', 'Подпись ставится кровью или кетчупом, на выбор компании', 'Срок действия договора: пока не закончатся деньги клиента', 'Отказаться можно только лично, в полночь, на Луне', 'Комиссия берётся за факт существования клиента'];
  const OK = ['Оплата производится по факту оказанных услуг', 'Клиент вправе расторгнуть договор в течение 14 дней', 'Стороны обязуются хранить конфиденциальность', 'Цена указана в договоре и не меняется', 'Все споры решаются в суде по месту клиента', 'Акт выполненных работ подписывается обеими сторонами', 'Возврат денег — в течение 3 рабочих дней', 'Компания отвечает за качество услуг', 'Договор можно прочитать до подписания', 'Отказ от услуг не влечёт штрафов'];
  const _sm = scrMenu;
  scrMenu = function () {_sm(); try {const b = $q('#scr [data-a="mini"]') || $q('#scr [data-a="achm"]'); if (b) b.insertAdjacentHTML('afterend', '<button class="btn" data-a="mini2">📑 Перерыв: «Ловушка в договоре»<br><small>' + (S && S.mini2Day === S.day ? 'сегодня уже был' : 'раз в день · −6 сил · деньги за очки') + '</small></button>');} catch (e) {}};
  function game() {
    hideScr(); const ov = document.createElement('div'); ov.id = 'mini'; ov.style.cssText = 'position:fixed;inset:0;z-index:99999;background:rgba(8,4,20,.97);display:flex;align-items:center;justify-content:center;padding:14px;touch-action:manipulation';
    document.body.appendChild(ov); let n = 0, score = 0, time = 40, cur = null, over = false, tm = 0; const N = 12;
    const shuf = a => a.slice().sort(() => Math.random() - .5), pool = shuf(TRAP.map(t => [t, 1]).concat(OK.map(t => [t, 0]))).slice(0, N);
    const sfx = x => {try {Snd.sfx(x);} catch (e) {}};
    function head() {return '<div style="display:flex;justify-content:space-between;color:#ffd23a;font:800 16px sans-serif"><span>★ ' + score + '</span><span>' + (n + 1) + '/' + N + '</span><span style="color:#7ff3ff" id="mt">' + Math.ceil(time) + ' c</span></div>';}
    function show() {
      if (n >= N || time <= 0) return fin(); cur = pool[n];
      ov.innerHTML = '<div style="width:min(94vw,420px);color:#f2ecff;font-family:sans-serif"><div style="text-align:center;font-weight:700;margin-bottom:6px;color:#9a8fb8">📑 Пункт договора. Это ловушка?</div>' + head() + '<div style="background:#1d1442;border:2px solid #4a3a82;border-radius:14px;padding:18px;margin:12px 0;font:600 17px/1.45 sans-serif;min-height:110px;display:flex;align-items:center;text-align:center">«' + cur[0] + '»</div><div style="display:flex;gap:10px"><button class="btn pri" data-m2="1" style="flex:1;padding:16px">🪤 Ловушка</button><button class="btn" data-m2="0" style="flex:1;padding:16px">✅ Нормально</button></div></div>';
    }
    function pick(v) {if (over || !cur) return; const ok = +v === cur[1]; score += ok ? 20 : -10; if (score < 0) score = 0; sfx(ok ? 'good' : 'bad'); n++; ov.style.boxShadow = 'inset 0 0 60px ' + (ok ? 'rgba(80,255,160,.35)' : 'rgba(255,60,90,.4)'); setTimeout(() => {ov.style.boxShadow = '';}, 220); show();}
    function fin() {
      if (over) return; over = true; clearInterval(tm); const bonus = Math.round(Math.max(0, time) * 2), tot = score + bonus, best = Math.max(lsGet('cc_mini2best', 0), tot); lsSet('cc_mini2best', best);
      const gain = Math.min(700, tot * 3); S.money += gain; S.energy = clamp(S.energy - 6, 0, 100); S.mini2Day = S.day; try {checkAch(); renderHud(); save();} catch (e) {}
      ov.innerHTML = '<div style="text-align:center;color:#f2ecff;font:700 18px sans-serif;padding:20px"><div style="font-size:54px">' + (tot >= 200 ? '🏆' : '📑') + '</div><p>Договоры проверены!</p><p style="color:#ffd23a;font-size:30px">' + tot + ' очков</p><p style="font-size:14px;color:#9a8fb8">за точность ' + score + ' · за скорость +' + bonus + '</p><p>Заработано: <b>' + fmt(gain) + '</b></p><p style="color:#9a8fb8;font-size:14px">Рекорд: ' + best + '</p><button class="btn pri" data-a="mini_end">← Вернуться</button></div>'; sfx(tot >= 100 ? 'good' : 'click');
    }
    ov.addEventListener('click', e => {const b = e.target.closest('[data-m2]'); if (b) pick(b.dataset.m2);});
    tm = setInterval(() => {if (over) return; time -= .25; const t = $('mt'); if (t) t.textContent = Math.max(0, Math.ceil(time)) + ' c'; if (time <= 0) fin();}, 250); show();
  }
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-a="mini2"]'); if (!b) return; e.preventDefault(); e.stopImmediatePropagation();
    if (S && S.mini2Day === S.day) toast('Сегодня этот перерыв уже был', 'warn'); else if (S && S.energy < 6) toast('Нет сил на перерыв', 'warn'); else game();
  }, true);
  [{id: 'mini2_150', n: 'Юрист-самоучка', d: '150 очков в «Ловушке в договоре»', c: () => lsGet('cc_mini2best', 0) >= 150}].forEach(a => {if (!ACH.some(x => x.id === a.id)) ACH.push(a);});
})();
