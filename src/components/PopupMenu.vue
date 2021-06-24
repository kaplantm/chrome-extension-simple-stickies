<template>
  <div class="popupWrapper">
    <button
      class="popupButton"
      role="button"
      v-on:click="toggleStickies"
      v-if="hasStickies"
    >
      Toggle Stickies
    </button>
    <button class="popupButton" role="button" v-on:click="newSticky">
      New Sticky
    </button>
    <!-- <button class="popupButton" role="button" v-on:click="viewAll">
      View All Simple Stickies
    </button>
    <button class="popupButton" role="button" v-on:click="options">
      Options
    </button> -->
  </div>
</template>

<script>
import { getStickiesFromStorage } from '../content-scripts/lib/storageUtils';
import { hasMatchingPath } from './StickiesManager/helpers';

export default {
  name: 'PopupMenu',
  beforeCreate() {
    // get initial stickies asynchronously
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const url = new URL(tabs[0].url);

      /* eslint-disable */
      getStickiesFromStorage(url.hostname).then((data) => {
        const stickies = data?.stickies;
        const hasStickies = stickies?.length
          ? !!stickies.filter(
              (el) =>
                el.initialText && hasMatchingPath(el.pathname, url.pathname)
            ).length
          : false;
        this.hasStickies = hasStickies;

        console.log('getStickiesFromStorage', { stickies, hasStickies });
      });
      /* eslint-enable */

      chrome.runtime.sendMessage({ type: 'initPopup' });
    });
  },
  computed: {
    defaultText() {
      return browser.i18n.getMessage('extName');
    },
  },
  data() {
    return {
      hasStickies: false,
    };
  },
  methods: {
    // TODO: now anther method - bring all notes to top
    // TODO: now anther method - donate link
    // Indicator for notes offscreen?
    toggleStickies: () => {
      // TODO: only show if has stickies for page
      // https://stackoverflow.com/questions/45179138/sending-message-from-popup-to-content-script-chrome-extension
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, {
          type: 'toggleStickies',
          url: tabs[0].url,
        });
      });
      window.close();
    },
    newSticky: () => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, {
          type: 'newSticky',
          url: tabs[0].url,
        });
      });
      window.close();
    },
    // viewAll: () => { // how to do this? local storage is site specific
    //   chrome.runtime.sendMessage({ type: 'tabUrl', data: './index.html' });
    // },
    // options: () => {
    //   chrome.runtime.sendMessage({ type: 'tabUrl', data: './options.html' });
    // },
  },
};
</script>

<style scoped>
.popupButton {
  transition: background-color 0.1s, border-color 0.25s;
  width: 100%;
  font-size: 1rem;
  white-space: nowrap;
  background-color: transparent;
  border: none;
  border-left: 5px solid transparent;
  padding: 0.25rem 0.5rem;
  text-align: left;
  text-decoration: none;
  display: inline-block;
  cursor: pointer;
}
.popupButton:hover {
  background-color: hsla(0, 0%, 93%, 1);
  border-color: hsla(200, 40%, 80%, 1);
}
</style>
