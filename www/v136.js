'use strict';
/* v136: лёгкое интро — режим для слабых телефонов. MADE BY PESSIMIST */
(function () {
  try {
    const it = document.getElementById('intro'); if (!it) return;
    const weak = (navigator.hardwareConcurrency || 8) <= 6 || (navigator.deviceMemory || 8) <= 4 || /Android/i.test(navigator.userAgent);
    if (weak || (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches)) it.classList.add('lite');
  } catch (e) {}
})();
