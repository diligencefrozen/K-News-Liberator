// content-script.js 
(async () => {
  /* 1. 현재 설정 로드 */
  const { enabled, delay = 5, domains = [] } = await chrome.storage.sync.get([
    "enabled",
    "delay",
    "domains",
  ]);
  if (!enabled || !domains.includes(location.hostname)) return;

  /* 2. 오버레이 삽입 */
  const overlay = document.createElement("div");
  overlay.id = "n2gn-overlay";
  overlay.innerHTML = `
    <!-- Google Font -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap" rel="stylesheet">
    
    <style>
      /* ------ 디자인 변수 ------ */
      :root{
        --accent:#4f7cff;
        --glass-bg:rgba(255,255,255,0.25);
        --glass-blur:12px;
        --radius:20px;
        --text:#0f1117;
      }
      @media (prefers-color-scheme: dark){
        :root{
          --glass-bg:rgba(28,30,38,0.35);
          --text:#f3f4f6;
        }
      }

      /* ------ 레이아웃 ------ */
      #n2gn-overlay{
        position:fixed; inset:0; z-index:2147483647;
        display:flex; align-items:center; justify-content:center;
        backdrop-filter:blur(4px);
        background:rgba(0,0,0,0.35);
        font-family:'Inter',sans-serif;
      }

      #n2gn-card{
        background:var(--glass-bg);
        backdrop-filter:blur(var(--glass-blur));
        padding:32px 40px;
        border-radius:var(--radius);
        box-shadow:0 12px 40px rgba(0,0,0,0.35);
        text-align:center;
      }

      #n2gn-card h2{
        margin:0 0 14px;
        font-size:20px;
        font-weight:600;
        color:var(--text);
      }

      /* ------ 원형 타이머 ------ */
      #n2gn-timer{ position:relative; width:140px; height:140px; margin:0 auto 20px; }
      #n2gn-timer svg{ transform:rotate(-90deg); }
      #n2gn-sec{
        position:absolute; inset:0;
        display:flex; align-items:center; justify-content:center;
        font-size:32px; font-weight:700; color:var(--text);
      }

      /* ------ 취소 버튼 ------ */
      #n2gn-cancel{
        padding:10px 32px;
        font-size:14px; font-weight:600; color:#fff;
        background:var(--accent); border:none; border-radius:12px;
        cursor:pointer; transition:transform .15s;
      }
      #n2gn-cancel:active{ transform:scale(.95); }
    </style>

    <div id="n2gn-card">
      <h2>Google&nbsp;News로 이동합니다</h2>

      <!-- 타이머 -->
      <div id="n2gn-timer">
        <svg width="140" height="140">
          <!-- 회색 베이스 -->
          <circle cx="70" cy="70" r="60"
                  stroke="#cdd1e0" stroke-width="10" fill="none"/>
          <!-- 진행 링 -->
          <circle id="n2gn-ring" cx="70" cy="70" r="60"
                  stroke="var(--accent)" stroke-width="10" fill="none"
                  stroke-linecap="round"
                  stroke-dasharray="377" stroke-dashoffset="0"/>
        </svg>
        <div id="n2gn-sec">${delay}</div>
      </div>

      <button id="n2gn-cancel">취소</button>
    </div>
  `;
  document.body.appendChild(overlay);

  /* 3. 카운트다운 & 링 애니메이션 */
  const secEl  = overlay.querySelector("#n2gn-sec");
  const ring   = overlay.querySelector("#n2gn-ring");
  const totalC = 377;                 // 2πr  (r = 60)
  const step   = totalC / delay;      // 초당 줄어드는 길이

  let remaining = delay;
  ring.style.strokeDashoffset = "0";

  const timer = setInterval(() => {
    remaining--;
    secEl.textContent = remaining;
    ring.style.strokeDashoffset = String(step * (delay - remaining));

    if (remaining <= 0) {
      clearInterval(timer);
      location.href = "https://news.google.com/";
    }
  }, 1000);

  /* 4. 취소 버튼 */
  overlay.querySelector("#n2gn-cancel").onclick = () => {
    clearInterval(timer);
    overlay.remove();
  };
})();
