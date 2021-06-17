console.log('Hello from the content-script');

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log({ request });
  if (request.type === 'toggleStickies') {
    console.log('toggleStickies');
  }
  if (request.type === 'newSticky') {
    console.log('newSticky');
  }
});
