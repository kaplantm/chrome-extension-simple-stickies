browser.runtime.onMessage.addListener((request, sender) => {
  if (request) {
    if (request.type === 'initPopup') {
      if (process.env.NODE_ENV !== 'development') {
        // somehow this happens magically when running the live reload server but not in prod
        // attempt this in dev throws an error so we skip it
        chrome.tabs.insertCSS({ file: 'css/content-script.css' });
      }
      browser.tabs.executeScript({
        file: 'js/content-script.js',
      });
    }
    if (request.type === 'tabUrl') {
      chrome.tabs.create({
        url: request.data,
      });
    }
  }
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, {
      type:
        changeInfo.status === 'complete'
          ? 'pageLoadingComplete'
          : 'pageLoading',
      url: tabs[0] ? tabs[0].url : null,
    });
  });
});
