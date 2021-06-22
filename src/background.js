browser.runtime.onMessage.addListener((request) => {
  if (request) {
    if (request.type === 'initPopup') {
      console.log('bg init popup');
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
