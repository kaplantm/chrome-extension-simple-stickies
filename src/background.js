browser.runtime.onMessage.addListener((request) => {
  if (request) {
    if (request.type === 'initPopup') {
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
