// content-script.js
(async () => {
  /* === 설정 로드 === */
  const { enabled, delay = 5, domains = [] } = await chrome.storage.sync.get([
    "enabled",
    "delay",
    "domains"
  ]);
  if (!enabled) return;

  const host = location.hostname;

  /* === 하위 도메인까지 허용하는 매칭 === */
  const hit = domains.some((d) => host === d || host.endsWith("." + d));
  if (!hit) return;

  /* === 오버레이 UI === */
  const overlay = document.createElement("div");
  overlay.id = "knl-overlay";
  overlay.innerHTML = `
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap" rel="stylesheet">
    <style>
      :root{
        --accent:#4f7cff;
        --glass-bg:rgba(255,255,255,0.25);
        --blur:12px;
        --text:#0f1117;
      }
      @media (prefers-color-scheme: dark){
        :root{
          --glass-bg:rgba(28,30,38,0.35);
          --text:#f3f4f6;
        }
      }
      #knl-overlay{
        position:fixed; inset:0; z-index:2147483647;
        display:flex; align-items:center; justify-content:center;
        backdrop-filter:blur(4px);
        background:rgba(0,0,0,0.35);
        font-family:'Inter',sans-serif;
      }
      #knl-card{
        background:var(--glass-bg);
        backdrop-filter:blur(var(--blur));
        padding:32px 40px;
        border-radius:18px;
        box-shadow:0 12px 40px rgba(0,0,0,0.35);
        text-align:center;
      }
      #knl-card h2{margin:0 0 14px;font-size:20px;font-weight:600;color:var(--text);}
      #knl-timer{position:relative;width:140px;height:140px;margin:0 auto 20px;}
      #knl-timer svg{transform:rotate(-90deg);}
      #knl-sec{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;
               font-size:32px;font-weight:700;color:var(--text);}
      #knl-cancel{
        padding:10px 32px;font-size:14px;font-weight:600;color:#fff;
        background:var(--accent);border:none;border-radius:12px;cursor:pointer;
        transition:transform .15s;
      }
      #knl-cancel:active{transform:scale(.95);}
    </style>
    <div id="knl-card">
      <h2>Google&nbsp;News로 이동합니다</h2>
      <div id="knl-timer">
        <svg width="140" height="140">
          <circle cx="70" cy="70" r="60"
                  stroke="#cdd1e0" stroke-width="10" fill="none"/>
          <circle id="knl-ring" cx="70" cy="70" r="60"
                  stroke="var(--accent)" stroke-width="10" fill="none"
                  stroke-linecap="round"
                  stroke-dasharray="377" stroke-dashoffset="0"/>
        </svg>
        <div id="knl-sec">${delay}</div>
      </div>
      <button id="knl-cancel">취소</button>
    </div>
  `;
  document.body.appendChild(overlay);

  /* === 카운트다운 === */
  const secEl = overlay.querySelector("#knl-sec");
  const ring  = overlay.querySelector("#knl-ring");
  const total = 377, step = total / delay;
  let remain  = delay;

  const timer = setInterval(() => {
    remain--;
    secEl.textContent = remain;
    ring.style.strokeDashoffset = String(step * (delay - remain));
    if (remain <= 0) {
      clearInterval(timer);
      location.href = "https://news.google.com/";
    }
  }, 1000);

  overlay.querySelector("#knl-cancel").onclick = () => {
    clearInterval(timer);
    overlay.remove();
  };
})();
