// options/options.js
const $ = (id) => document.getElementById(id);

/* === 화면 로드시 값 채우기 === */
function load() {
  chrome.runtime.sendMessage({ type: "get-settings" }, (cfg) => {
    $("enabled").checked = cfg.enabled;
    $("delay").value    = cfg.delay;
    $("domains").value  = (cfg.domains || []).join("\n");
  });
}

/* === 저장 함수 === */
function save() {
  const payload = {
    enabled: $("enabled").checked,
    delay:   parseInt($("delay").value, 10) || 5,
    domains: $("domains").value
      .split(/\s+/)      // 줄바꿈,스페이스 등 모두 분리
      .map((d) => d.trim())
      .filter(Boolean)   // 빈 문자열 제거
  };

  chrome.runtime.sendMessage({ type: "set-settings", payload }, () => {
    $("status").textContent = "✅ 저장됨";
    setTimeout(() => ($("status").textContent = ""), 1500);
  });
}

/* === 이벤트 연결 === */
document.addEventListener("DOMContentLoaded", load);
$("save").addEventListener("click", save);

/* 토글·딜레이 입력 시 바로 저장되길 원하면: */
$("enabled").addEventListener("change", save);
$("delay").addEventListener("change", save);
