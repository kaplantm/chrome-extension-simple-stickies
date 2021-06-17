browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Hello from the background');
  console.log({ request, sender });
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
