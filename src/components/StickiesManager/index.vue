<template>
  <div>
    <div class="stickyManagerWrapper" v-if="showStickies">
      <div v-for="item in initialStickies.stickies" :key="item.id">
        <Sticky v-bind="item" />
      </div>
    </div>
  </div>
</template>

<script>
import Sticky from '@/components/Sticky/index.vue';
import { addNewSticky } from './helpers';
import {
  getStickiesFromStorage,
  setItemInStorage,
} from '../../content-scripts/lib/storageUtils';

export default {
  name: 'StickiesManager',
  components: { Sticky },
  beforeCreate() {
    // setup listeners
    chrome.runtime.onMessage.addListener(async (request) => {
      console.log('msg');
      if (request.type === 'toggleStickies') {
        const stickyData = await getStickiesFromStorage();

        if (this.showStickies) {
          const safeStickies = stickyData?.stickies || [];
          const filteredStickyData = {
            ...stickyData,
            // clear empty notes when we hide them
            stickies: safeStickies.filter((sticky) => sticky?.initialText),
          };
          await setItemInStorage(null, filteredStickyData);
          this.initialStickies = filteredStickyData;
        } else {
          this.initialStickies = stickyData;
        }
        this.showStickies = !this.showStickies;
      }
      if (request.type === 'newSticky') {
        const stickyData = await addNewSticky();
        console.log('newSticky', { stickyData: JSON.stringify(stickyData) });
        this.initialStickies = stickyData;
        this.showStickies = true;
      }
    });
    // get initial stickies asynchronously
    getStickiesFromStorage().then((data) => {
      this.initialStickies = data;
    });
  },
  data() {
    return {
      initialStickies: { stickies: [] },
      showStickies: false,
    };
  },
};
</script>

<style scoped>
.stickyManagerWrapper {
  /* border: 3px solid green; */
  position: absolute;
  top: 0;
  left: 0;
  height: 0;
  width: 0;
}
</style>
