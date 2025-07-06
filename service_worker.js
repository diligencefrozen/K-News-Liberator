// service_worker.js
const DEFAULTS = {
  enabled: true,
  delay: 5,
  domains: [
    "news.naver.com",
    "n.news.naver.com",
    "news.daum.net",
    "news.zum.com",
    "news.nate.com",
    "www.dcnewsj.com"
  ]
};

/* 확장 최초 설치 시 기본값 저장 */
chrome.runtime.onInstalled.addListener(async () => {
  const cur = await chrome.storage.sync.get();
  if (Object.keys(cur).length === 0) {
    await chrome.storage.sync.set(DEFAULTS);
  }
});

/* popup / options 와 통신 */
chrome.runtime.onMessage.addListener((msg, _sender, send) => {
  if (msg.type === "get-settings") {
    chrome.storage.sync.get().then(send);
    return true;
  }
  if (msg.type === "set-settings") {
    chrome.storage.sync.set(msg.payload).then(() => send({ ok: true }));
    return true;
  }
});
