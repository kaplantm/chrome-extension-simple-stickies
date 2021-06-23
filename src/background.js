browser.runtime.onMessage.addListener((request) => {
  if (request) {
    if (request.type === 'initPopup') {
      chrome.tabs.insertCSS({ file: 'css/content-script.css' });
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
