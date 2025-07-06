const toggle = document.getElementById("toggle");

// 현재 설정 읽기
chrome.runtime.sendMessage({ type: "get-settings" }, (cfg) => {
  toggle.checked = cfg.enabled;
});

// 즉시 저장
toggle.onchange = () => {
  chrome.runtime.sendMessage({
    type: "set-settings",
    payload: { enabled: toggle.checked }
  });
};
