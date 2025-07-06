// popup/popup.js
const toggle = document.getElementById("toggle");
chrome.runtime.sendMessage({ type: "get-settings" }, (cfg) => {
  toggle.checked = cfg.enabled;
});
toggle.onchange = () => {
  chrome.runtime.sendMessage({ type: "set-settings", payload: { enabled: toggle.checked } });
};
