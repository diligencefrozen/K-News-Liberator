(async () => {
  // 현재 설정 로드
  const settings = await chrome.storage.sync.get();
  if (!settings.enabled) return;

  const host = location.hostname;
  if (!settings.domains.includes(host)) return;

  // 카운트다운 UI 주입
  const overlay = document.createElement("div");
  overlay.id = "n2gn-overlay";
  overlay.innerHTML = `
    <style>
      #n2gn-overlay { position:fixed; inset:0; background:#0009; z-index:999999;
                      display:flex; flex-direction:column; align-items:center; justify-content:center;
                      font-family:Arial, sans-serif; color:#fff; }
      #n2gn-box { background:#222; padding:24px 36px; border-radius:8px; text-align:center; }
      #n2gn-timer { font-size:48px; margin:12px 0; }
      #n2gn-cancel { margin-top:8px; cursor:pointer; }
    </style>
    <div id="n2gn-box">
      <h2>Google News로 이동합니다…</h2>
      <div id="n2gn-timer">${settings.delay}</div>
      <button id="n2gn-cancel">취소</button>
    </div>`;
  document.body.appendChild(overlay);

  // 카운트다운
  let sec = settings.delay;
  const timerEl = overlay.querySelector("#n2gn-timer");
  const int = setInterval(() => {
    sec--;
    timerEl.textContent = sec;
    if (sec <= 0) {
      clearInterval(int);
      location.href = `https://news.google.com/`;
    }
  }, 1000);

  // 취소 버튼
  overlay.querySelector("#n2gn-cancel").onclick = () => {
    clearInterval(int);
    overlay.remove();
  };
})();
