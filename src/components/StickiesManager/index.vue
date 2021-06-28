<template>
  <div class="stickyManagerOuterWrapper">
    <!-- <h1>{{ showStickies }}</h1> -->
    <div class="stickyManagerWrapper" v-if="showStickies">
      <div v-for="item in initialStickies.stickies" :key="item.id">
        <Sticky v-bind="item" :hostname="hostname" />
      </div>
    </div>
  </div>
</template>

<script>
import Sticky from '@/components/Sticky/index.vue';
import { addNewSticky, matchesPageSpecificity } from './helpers';
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
          if (this.initOn !== url.href) {
            this.initOn = url.href;
            this.hostname = url.hostname;
            this.initialize();
          }
        }
        if (request.type === 'toggleStickies') {
          // if notes are visible: get only non-empty notes for current page
          const stickyData = await getStickiesFromStorage(url.hostname, true);

          const safeStickies = stickyData?.stickies || [];
          /* eslint-disable */
          const filteredStickyData = {
            ...stickyData,
            // if notes are visible: get only non-empty notes for current pagec
            // else: get only non-empty notes and update storage to remove empty ones
            stickies: safeStickies.filter((el) =>
              matchesPageSpecificity(el, url.pathname, url.href)
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
          const stickyData = await addNewSticky(url);
          /* eslint-disable */
          this.initialStickies = {
            ...stickyData,
            stickies: stickyData.stickies.filter((el) =>
              matchesPageSpecificity(el, url.pathname, url.href)
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
      getStickiesFromStorage(this.hostname, true).then((data) => {
        this.initialStickies = data;
      });
    },
  },
  data() {
    return {
      initialStickies: { stickies: [] },
      showStickies: false,
      initOn: null,
      hostname: null,
    };
  },
};
</script>

<style scoped>
.stickyManagerOuterWrapper {
  z-index: 100000;
}
.stickyManagerWrapper {
  position: absolute;
  top: 0;
  left: 0;
  height: 0;
  width: 0;
  font-size: 16px;
}
* {
  box-sizing: border-box;
  font-family: sans-serif;
}
</style>
