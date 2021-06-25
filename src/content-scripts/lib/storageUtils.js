// https://stackoverflow.com/questions/11922964/how-do-i-view-the-storage-of-a-chrome-extension-ive-installed
// Enter these in background page console
// chrome.storage.local.get(console.log)
// chrome.storage.local.clear()

export const getDomainKey = () => window.location.hostname;

export async function getItemInStorage(key) {
  const storageKey = key || getDomainKey();
  return new Promise((resolve) => {
    chrome.storage.local.get(storageKey, (data) => {
      resolve(data ? data[storageKey] : data);
    });
  });
}

export async function setItemInStorage(key, value) {
  const storageKey = key || getDomainKey();
  return new Promise((resolve) => {
    chrome.storage.local.set({ [storageKey]: value }, () => {
      resolve(value);
    });
  });
}

export async function getStickiesFromStorage(key, omitEmpty) {
  const data = (await getItemInStorage(key)) || {};
  const safeStickies = data.stickies || [];
  if (omitEmpty) {
    return {
      ...data,
      stickies: safeStickies.filter((el) => el?.initialText),
    };
  }
  return data;
}
