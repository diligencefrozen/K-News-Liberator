const $ = (id) => document.getElementById(id);

/* === 도메인 정리 함수 === */
function sanitize(line) {
  line = line.trim();

  // 1. https:// 또는 http:// 제거
  line = line.replace(/^https?:\/\//i, '');

  // 2. 경로(/...), 쿼리(?...), 해시(#...) 제거
  line = line.replace(/[\/?#].*$/, '');

  // 3. www. 제거
  line = line.replace(/^www\./i, '');

  return line.toLowerCase();
}

/* === 설정 불러오기 === */
function load() {
  chrome.runtime.sendMessage({ type: "get-settings" }, (cfg) => {
    $("enabled").checked = cfg.enabled;
    $("delay").value     = cfg.delay;
    $("domains").value   = (cfg.domains || []).join("\n");
  });
}

/* === 저장하기 === */
function save() {
  const rawLines = $("domains").value.split(/\s+/); // 공백, 줄바꿈 모두 인식
  const domains = rawLines
    .map(sanitize)
    .filter(Boolean); // 빈 줄 제거

  const payload = {
    enabled: $("enabled").checked,
    delay: parseInt($("delay").value, 10) || 5,
    domains: domains
  };

  chrome.runtime.sendMessage({ type: "set-settings", payload }, () => {
    $("status").textContent = "✅ 저장됨";
    setTimeout(() => ($("status").textContent = ""), 1500);
  });
}

/* === 이벤트 연결 === */
document.addEventListener("DOMContentLoaded", load);
$("save").addEventListener("click", save);
$("enabled").addEventListener("change", save);
$("delay").addEventListener("change", save);
