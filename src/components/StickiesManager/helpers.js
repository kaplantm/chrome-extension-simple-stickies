/* eslint-disable import/prefer-default-export */
import {
  getItemInStorage,
  setItemInStorage,
  getDefaultSticky,
  defaultSticky,
} from '../../content-scripts/lib/storageUtils';

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
    initialIgnoreQueryParams: 0,
  };
  return getDefaultSticky(partial);
}

export async function addNewSticky(url) {
  console.log({ url });
  let stickySite = await getItemInStorage(url.hostname);
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
  await setItemInStorage(window.location.hostname, stickySite);
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
    sticky.initialIgnoreQueryParams === 0
      ? exampleInitialIgnoreQueryParams
      : sticky.initialIgnoreQueryParams;
  return settingToUse >= 2
    ? sticky.pathname === currentPath
    : sticky.href === currentHref;
};
