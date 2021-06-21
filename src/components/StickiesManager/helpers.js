/* eslint-disable import/prefer-default-export */
import {
  getItemInStorage,
  setItemInStorage,
} from '../../content-scripts/lib/storageUtils';

// const exampleStickyData = {
//   // TODO: get data from local storage
//   'https://www.google.com/': {
//     url: 'https://www.google.com/',
//     stickies: [
//   {
//     initialX: 500,
//     initialY: 500,
//     initialHeight: 100,
//     initialWidth: 300,
//     initialText: 'hsla(50, 100%, 70%, 1)',
//     initialBgColor: 'hsla(50, 100%, 70%, 1)',
//   },
//     ],
//   },
// };

const getDefaultStickySite = (stickies = []) => ({
  hostname: window.location.hostname,
  pathname: window.location.pathname,
  href: window.location.href,
  id: new Date().getTime(),
  stickies,
});

const defaultSticky = {
  id: new Date().getTime(),
  initialX: 100,
  initialY: 100,
  initialHeight: 100,
  initialWidth: 300,
  initialText: '',
  initialBgColor: 'hsla(50, 100%, 70%, 1)',
};

const getDefaultSticky = (partial = {}) => ({
  ...defaultSticky,
  id: new Date().getTime(),
  ...partial,
});

export function getNewSticky(count) {
  const scroll = document.documentElement.scrollTop || document.body.scrollTop;
  const partial = {
    initialX: defaultSticky.initialX + 20 * Math.floor(count + 1 / 10),
    initialY: defaultSticky.initialY + 25 * count + scroll,
  };
  return getDefaultSticky(partial);
}

export async function addNewSticky() {
  let stickySite = await getItemInStorage();
  if (!stickySite?.id) {
    stickySite = getDefaultStickySite([getDefaultSticky()]);
  } else {
    stickySite = {
      ...stickySite,
      stickies: [
        ...stickySite.stickies,
        getNewSticky(stickySite.stickies.length),
      ],
    };
  }
  await setItemInStorage(null, stickySite);
  return stickySite;
}
