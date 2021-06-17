<template>
  <div class="stickyManagerWrapper">
    <!-- {{ JSON.stringify(stickiesForPage) }} -->
    <div v-for="item in stickiesForPage.stickies" :key="item.id">
      <Sticky v-bind="item" />
    </div>
  </div>
</template>

<script>
import Sticky from '@/components/Sticky.vue';

export default {
  name: 'StickiesManager',
  components: { Sticky },
  // mounted() {
  //   browser.runtime.sendMessage({});
  // },
  // computed: {
  //   defaultText() {
  //     return browser.i18n.getMessage('extName');
  //   },
  // },
  data() {
    return {
      initialStickies: {
        // TODO: get data from local storage
        'https://www.google.com/': {
          url: 'https://www.google.com/',
          stickies: [
            {
              xLocation: 200,
              yLocation: 400, // vh
              height: 50,
              width: 200,
              text: 'pink',
              bgColor: 'pink',
            },
            {
              xLocation: 500,
              yLocation: 500,
              height: 100,
              width: 300,
              text: 'green',
              bgColor: 'green',
            },
            {
              xLocation: 0,
              yLocation: 0,
              height: 150,
              width: 200,
              text: 'blue',
              bgColor: 'blue',
            },
          ],
        },
      },
    };
  },
  computed: {
    stickiesForPage() {
      const location = window.location.href;
      console.log({ initialStickies: this.initialStickies, location });
      return this.initialStickies[location] || [];
    },
  },
  methods: {
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
.stickyManagerWrapper {
  border: 3px solid green;
  position: absolute;
  top: 0;
  left: 0;
  height: 0;
  width: 0;
}
</style>
