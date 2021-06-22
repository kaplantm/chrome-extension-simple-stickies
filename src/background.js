browser.runtime.onMessage.addListener((request) => {
  // browser.tabs.executeScript({
  //   file: 'content-script.js',
  // });
  if (request) {
    if (request.type === 'tabUrl') {
      chrome.tabs.create({
        url: request.data,
      });
    }
  }
});
