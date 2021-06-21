/* eslint-disable import/prefer-default-export */
import {
  getStickiesFromStorage,
  setItemInStorage,
} from '../../content-scripts/lib/storageUtils';

export async function updateStoredStickyNote(sticky) {
  const stickyData = await getStickiesFromStorage();
  if (!stickyData) {
    return false; // TODO: error handling
  }
  const stickiesClone = [...(stickyData?.stickies || [])];
  const index = stickiesClone.findIndex((val) => val.id === sticky.id);
  if (index === -1) {
    return false;
  }
  stickiesClone[index] = sticky;
  await setItemInStorage(null, { ...stickyData, stickies: stickiesClone });
  return true;
}

export async function removeStoredStickyNote(id) {
  const stickyData = await getStickiesFromStorage();
  const safeStickies = stickyData.stickies || [];
  const stickiesClone = safeStickies.filter((val) => val.id !== id);
  await setItemInStorage(null, { ...stickyData, stickies: stickiesClone });
}