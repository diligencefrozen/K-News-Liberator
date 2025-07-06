const DEFAULTS = {
  enabled: true,
  delay: 5,                // 초
  domains: [
    "news.naver.com",
    "n.news.naver.com",
    "news.daum.net",
    "news.zum.com",
    "news.nate.com",
    "www.dcnewsj.com"
  ]
};

// 초기화
chrome.runtime.onInstalled.addListener(async () => {
  const data = await chrome.storage.sync.get();
  if (Object.keys(data).length === 0) {
    await chrome.storage.sync.set(DEFAULTS);
  }
});

// 팝업/옵션과 통신 (옵션 페이지에서 값 저장)
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === "get-settings") {
    chrome.storage.sync.get().then(sendResponse);
    return true; // async
  }
  if (msg.type === "set-settings") {
    chrome.storage.sync.set(msg.payload).then(() => sendResponse({ ok: true }));
    return true;
  }
});
