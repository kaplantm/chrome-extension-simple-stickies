// https://stackoverflow.com/questions/11922964/how-do-i-view-the-storage-of-a-chrome-extension-ive-installed
// Enter these in background page console
// chrome.storage.local.get(console.log)
// chrome.storage.local.clear()

// export const getDomainKey = () => window.location.hostname;
export const optionsPageKey = 'simpleStickies/options.html';

export const defaultSticky = {
  pathname: window.location.pathname,
  href: window.location.href,
  id: new Date().getTime(),
  initialX: 100,
  initialY: 100,
  initialHeight: 0,
  initialWidth: 0,
  initialText: '',
  initialBgColor: '',
  initialIgnoreQueryParams: 0, // 0 - unset, 1 - false, 2 - true
  // these start out undefined so they inherit parent's style
  // fontStyle: 'sans-serif',
  // fontSize: 1,
};

export const getDefaultSticky = (partial = {}) => ({
  ...defaultSticky,
  id: new Date().getTime(),
  ...partial,
});

export async function getItemInStorage(key) {
  const storageKey = key;
  return new Promise((resolve) => {
    chrome.storage.local.get(storageKey, (data) => {
      resolve(data && storageKey ? data[storageKey] : data);
    });
  });
}

export async function setItemInStorage(key, value) {
  const storageKey = key;
  return new Promise((resolve) => {
    chrome.storage.local.set({ [storageKey]: value }, () => {
      resolve(value);
    });
  });
}

export const exampleStickyInitialText =
  'Update the settings on this sticky to change the default note appearance. Toggle your open stickies to see your changes in effect.';

export const exampleSticky = getDefaultSticky({
  initialText: exampleStickyInitialText,
  initialHeight: 100,
  initialWidth: 300,
  initialIgnoreQueryParams: 1,
  initialBgColor: 'yellow',
  fontStyle: 'sans-serif',
  fontSize: 1,
});

export async function getStickiesFromStorage(key, omitEmpty) {
  const data = (await getItemInStorage(key)) || {};
  let safeStickies = data.stickies || [];

  if (!safeStickies.length && key === optionsPageKey) {
    safeStickies = [exampleSticky];
  }

  if (omitEmpty) {
    return {
      ...data,
      stickies: safeStickies.filter((el) => el?.initialText),
    };
  }
  return data;
}
