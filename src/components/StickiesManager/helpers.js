/* eslint-disable import/prefer-default-export */
import {
  getItemInStorage,
  setItemInStorage,
  getDefaultSticky,
  defaultSticky,
} from '../../content-scripts/lib/storageUtils';

// const exampleStickyData = {
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
  id: new Date().getTime(),
  stickies,
});

export function getNewSticky(count, pathname, href) {
  const scroll = document.documentElement.scrollTop || document.body.scrollTop;
  const partial = {
    initialX: defaultSticky.initialX + 20 * Math.floor(count + 1 / 10),
    initialY: defaultSticky.initialY + 25 * count + scroll,
    pathname,
    href,
  };
  return getDefaultSticky(partial);
}

export async function addNewSticky(url) {
  let stickySite = await getItemInStorage(url.domain);
  if (!stickySite?.id) {
    stickySite = getDefaultStickySite([
      getNewSticky(0, url.pathname, url.href),
    ]);
  } else {
    stickySite = {
      ...stickySite,
      stickies: [
        ...stickySite.stickies,
        getNewSticky(stickySite.stickies.length, url.pathname, url.href),
      ],
    };
  }
  await setItemInStorage(null, stickySite);
  return stickySite;
}

export const matchesPageSpecificity = (
  sticky,
  exampleInitialIgnoreQueryParams,
  currentPathOverride,
  currentHrefOverride
) => {
  const currentPath = currentPathOverride || window.location.pathname;
  const currentHref = currentHrefOverride || window.location.href;
  const settingToUse =
    sticky.initialIgnoreQueryParams === undefined
      ? exampleInitialIgnoreQueryParams
      : sticky.initialIgnoreQueryParams;
  console.log({
    exampleInitialIgnoreQueryParams,
    settingToUse,
    initialIgnoreQueryParams: sticky.initialIgnoreQueryParams,
  });
  return settingToUse
    ? sticky.pathname === currentPath
    : sticky.href === currentHref;
};
