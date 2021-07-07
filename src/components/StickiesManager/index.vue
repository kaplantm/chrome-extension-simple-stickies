<template>
  <div class="stickyManagerOuterWrapper">
    <div class="stickyManagerWrapper" v-if="showStickies">
      <div v-for="item in initialStickies.stickies" :key="item.id">
        <Sticky
          v-bind="item"
          :hostname="hostname"
          :exampleSticky="exampleSticky"
        />
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
  optionsPageKey,
  defaultSticky,
} from '../../content-scripts/lib/storageUtils';

export default {
  name: 'StickiesManager',
  components: { Sticky },
  created() {
    this.setupListeners();
  },
  props: {
    showByDefault: Boolean,
  },
  methods: {
    setupListeners() {
      if (window.location.protocol === 'chrome-extension:') {
        this.hostname = `simpleStickies${window.location.pathname}`;
      } else {
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
            const exampleStickyData = await getStickiesFromStorage(
              optionsPageKey,
              true
            );
            this.exampleSticky = exampleStickyData?.stickies?.length
              ? exampleStickyData.stickies[0]
              : defaultSticky;

            const safeStickies = stickyData?.stickies || [];
            /* eslint-disable */
            const filteredStickyData = {
              ...stickyData,
              stickies: safeStickies.filter((el) =>
                matchesPageSpecificity(
                  el,
                  this.exampleSticky.initialIgnoreQueryParams,
                  url.pathname,
                  url.href
                )
              ),
            };
            console.log({ filteredStickyData });
            /* eslint-enable */

            // remove empty notes
            await setItemInStorage(null, {
              ...stickyData,
              stickies: safeStickies.filter((el) => el.initialText),
            });

            this.initialStickies = filteredStickyData;
            this.showStickies = !this.showStickies;
          }
          if (request.type === 'newSticky') {
            const stickyData = await addNewSticky(url);
            /* eslint-disable */
            this.initialStickies = {
              ...stickyData,
              stickies: stickyData.stickies.filter((el) =>
                matchesPageSpecificity(
                  el,
                  this.exampleSticky.initialIgnoreQueryParams,
                  url.pathname,
                  url.href
                )
              ),
            };

            /* eslint-enable */
            this.showStickies = true;
          }
        });
      }
      this.initialize();
    },
    initialize() {
      this.showStickies = this.showByDefault || false;
      this.getStickies();
    },
    getStickies() {
      getStickiesFromStorage(optionsPageKey, true).then((data) => {
        console.log('getStickiesFromStorage optionsPageKey', data);
        this.exampleSticky = data?.stickies?.length
          ? data.stickies[0]
          : defaultSticky;
      });
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
      exampleSticky: null,
    };
  },
};
</script>

<style lang="scss">
.stickyManagerOuterWrapper {
  z-index: 100000;
  button {
    cursor: pointer;
    &:focus {
      outline: none;
    }
  }
  * {
    line-height: unset;
    letter-spacing: unset;
    padding: unset;
    min-width: unset;
    max-width: unset;
  }
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
