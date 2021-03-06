/* eslint-disable import/prefer-default-export */
import {
  getStickiesFromStorage,
  setItemInStorage,
} from '../../content-scripts/lib/storageUtils';

export async function updateStoredStickyNote(sticky, key) {
  console.log({ key });
  const stickyData = await getStickiesFromStorage(key);
  if (!stickyData) {
    return false; // TODO: error handling
  }
  const stickiesClone = [...(stickyData?.stickies || [])];
  const index = stickiesClone.findIndex((val) => val.id === sticky.id);
  if (index === -1) {
    stickiesClone.push(sticky);
  } else {
    stickiesClone[index] = sticky;
  }
  await setItemInStorage(key, { ...stickyData, stickies: stickiesClone });
  return true;
}

export async function removeStoredStickyNote(id, key) {
  const stickyData = await getStickiesFromStorage(key);
  const safeStickies = stickyData.stickies || [];
  const stickiesClone = safeStickies.filter((val) => val.id !== id);
  await setItemInStorage(key, { ...stickyData, stickies: stickiesClone });
}
