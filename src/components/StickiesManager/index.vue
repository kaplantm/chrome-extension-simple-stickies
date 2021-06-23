<template>
  <div class="stickyManagerTestWrapper">
    <div class="stickyManagerWrapper" v-if="showStickies">
      <div v-for="item in initialStickies.stickies" :key="item.id">
        <Sticky v-bind="item" />
      </div>
    </div>
  </div>
</template>

<script>
import Sticky from '@/components/Sticky/index.vue';
import { addNewSticky, hasMatchingPath } from './helpers';
import {
  getStickiesFromStorage,
  setItemInStorage,
} from '../../content-scripts/lib/storageUtils';

export default {
  name: 'StickiesManager',
  components: { Sticky },
  created() {
    this.setupListeners();
  },
  methods: {
    setupListeners() {
      // setup listeners
      chrome.runtime.onMessage.addListener(async (request) => {
        const url = new URL(request.url);
        // if (request.type === 'pageLoading') {
        // this.showStickies = false;
        // }
        if (request.type === 'pageLoadingComplete') {
          console.log('do init on complete?');
          if (this.initOn !== url.href) {
            console.log('doing init on complete', url.href);
            this.initOn = url.href;
            this.initialize();
          }
        }
        if (request.type === 'toggleStickies') {
          const stickyData = await getStickiesFromStorage(url.hostname);

          const safeStickies = stickyData?.stickies || [];
          /* eslint-disable */
          const filteredStickyData = {
            ...stickyData,
            // if notes are visible: get only non-empty notes for current pagec
            // else: get only non-empty notes and update storage to remove empty ones
            stickies: safeStickies.filter(
              (el) =>
                el?.pathname === url.pathname &&
                (this.showStickies || el?.initialText)
            ),
          };
          /* eslint-enable */
          if (this.showStickies) {
            await setItemInStorage(null, filteredStickyData);
          }
          this.initialStickies = filteredStickyData;
          this.showStickies = !this.showStickies;
        }
        if (request.type === 'newSticky') {
          console.log('newSticky', url);
          const stickyData = await addNewSticky(url);
          /* eslint-disable */
          this.initialStickies = {
            ...stickyData,
            stickies: stickyData.stickies.filter((el) =>
              hasMatchingPath(el?.pathname, url.pathname)
            ),
          };
          /* eslint-enable */
          this.showStickies = true;
        }
      });
      this.initialize();
    },
    initialize() {
      this.showStickies = false;
      // get initial stickies asynchronously
      getStickiesFromStorage().then((data) => {
        this.initialStickies = data;
      });
    },
  },
  data() {
    return {
      initialStickies: { stickies: [] },
      showStickies: false,
      initOn: null,
    };
  },
};
</script>

<style scoped>
.stickyManagerTestWrapper {
  z-index: 100000;
}
.stickyManagerWrapper {
  position: absolute;
  top: 0;
  left: 0;
  height: 0;
  width: 0;
}
* {
  box-sizing: border-box;
  font-family: sans-serif;
}
</style>
