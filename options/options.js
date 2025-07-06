// options/options.js
const $ = (id) => document.getElementById(id);

function load() {
  chrome.runtime.sendMessage({ type: "get-settings" }, (cfg) => {
    $("enabled").checked = cfg.enabled;
    $("delay").value = cfg.delay;
    $("domains").value = cfg.domains.join("\n");
  });
}

$("save").onclick = () => {
  const payload = {
    enabled: $("enabled").checked,
    delay: parseInt($("delay").value, 10) || 5,
    domains: $("domains").value
      .split(/\s+/)
      .map((d) => d.trim())
      .filter(Boolean)
  };
  chrome.runtime.sendMessage({ type: "set-settings", payload }, () => {
    $("status").textContent = "✅ 저장됨";
    setTimeout(() => ($("status").textContent = ""), 1500);
  });
};

document.addEventListener("DOMContentLoaded", load);
