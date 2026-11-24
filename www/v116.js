/* ======== build 1.4.0: кнопка «Поделиться» ======== */
const SHARE_TXT = '🎧 Играю в «КОЛ-ЦЕНТР: СМЕНА» — сатирическая игра про офис-ад от PESSIMIST. Попробуй пережить смену!\nКанал: https://t.me/+OlavQF1edndlOWY1\nАвтор: @Izzolentaaa';
async function doShare() {
  try {if (navigator.share) {await navigator.share({title: 'КОЛ-ЦЕНТР: СМЕНА', text: SHARE_TXT}); return;}} catch (e) {if (e && e.name === 'AbortError') return;}
  try {if (navigator.clipboard && navigator.clipboard.writeText) {await navigator.clipboard.writeText(SHARE_TXT); toast('📋 Текст скопирован. Вставьте его в чат.', 'ok'); return;}} catch (e) {}
  try {const ta = document.createElement('textarea'); ta.value = SHARE_TXT; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); ta.remove(); toast('📋 Текст скопирован. Вставьте его в чат.', 'ok');} catch (e) {window.open('https://t.me/share/url?url=' + encodeURIComponent('https://t.me/+OlavQF1edndlOWY1') + '&text=' + encodeURIComponent(SHARE_TXT), '_blank');}
}
document.addEventListener('click', e => {const b = e.target.closest('[data-a="sh_share"]'); if (b) {Snd.sfx('click'); doShare();}});
const _hub16 = scrHub; scrHub = function () {_hub16(); const o = document.querySelector('#scr .opts'); if (o) o.insertAdjacentHTML('beforeend', '<button class="btn" data-a="sh_share">📤 Поделиться игрой</button>');};
const _sn16 = scrNews; scrNews = function () {_sn16(); const p = document.querySelector('#scr .box p'); if (p) p.textContent = 'БОЛЬШАЯ ПЕРЕМЕНА · build 1.4.0'; const h3 = document.querySelector('#scr .box h3'); if (h3) h3.insertAdjacentHTML('beforebegin', '<h3>📤 Поделиться</h3><p>• В меню появилась кнопка «Поделиться игрой»: отправляет друзьям текст с каналом и @Izzolentaaa</p>');};
/* «Жильё и быт» из Дома: возврат в Дом, а не в итоги дня */
document.addEventListener('click', e => {const b = e.target.closest('[data-a="lifeback"]'); if (!b || !S || H().from !== 'idle') return; e.stopImmediatePropagation(); Snd.sfx('click'); scrHome();}, true);
/* не больше 3 всплывающих сообщений одновременно */
(function () {const t = document.getElementById('toasts'); if (!t) return; new MutationObserver(() => {while (t.children.length > 3) t.removeChild(t.firstChild);}).observe(t, {childList: true});})();
