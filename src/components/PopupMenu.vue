<template>
  <div class="popupWrapper">
    <button class="popupButton" role="button" v-on:click="toggleStickies">
      Toggle Stickies
    </button>
    <button class="popupButton" role="button" v-on:click="newSticky">
      New Sticky
    </button>
    <button class="popupButton" role="button" v-on:click="viewAll">
      View All Simple Stickies
    </button>
    <button class="popupButton" role="button" v-on:click="options">
      Options
    </button>
  </div>
</template>

<script>
export default {
  name: 'PopupMenu',
  mounted() {
    browser.runtime.sendMessage({});
  },
  computed: {
    defaultText() {
      return browser.i18n.getMessage('extName');
    },
  },
  methods: {
    // TODO: now anther method - bring all notes to top
    // TODO: now anther method - donate link
    // Indicator for notes offscreen?
    toggleStickies: () => {
      // https://stackoverflow.com/questions/45179138/sending-message-from-popup-to-content-script-chrome-extension
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        console.log({ tabs });
        chrome.tabs.sendMessage(tabs[0].id, { type: 'toggleStickies' });
      });
    },
    newSticky: () => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        console.log({ tabs });
        chrome.tabs.sendMessage(tabs[0].id, { type: 'newSticky' });
      });
    },
    viewAll: () => {
      chrome.runtime.sendMessage({ type: 'tabUrl', data: './index.html' });
    },
    options: () => {
      chrome.runtime.sendMessage({ type: 'tabUrl', data: './options.html' });
    },
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
