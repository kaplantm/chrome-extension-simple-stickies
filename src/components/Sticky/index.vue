<template>
  <div v-if="!deleted">
    <vue-draggable-resizable
      class="sticky"
      class-name-dragging="dragging-sticky"
      :style="stickyStyle"
      :min-width="100"
      :min-height="100"
      :w="width"
      :h="height"
      :x="x"
      :y="y"
      :drag-handle="'.header'"
      @dragging="onDrag"
      @resizing="onResize"
    >
      <div v-bind:class="[{ active: showSettings }, 'settingsWrapper']">
        <div v-if="showSettings">
          <SettingsPanel
            :syncStorage="syncStorage"
            :hostname="hostname"
            :pathname="pathname"
            :href="href"
            :initialBgColor="bgColor"
            :initialUseHrefSpecificity="useHrefSpecificity"
          />
        </div>
      </div>
      <div class="header">
        <button class="delete" v-on:click="onDelete" v-on:mousedown="blocker" />
        <button
          v-if="hasPageSpecificitySettings"
          class="settings"
          v-on:click="onSettingsClick"
          v-on:mousedown="blocker"
        >
          <img :src="settingsImg" alt="settings" width="100%" />
        </button>
      </div>
      <textarea
        :value="message"
        @input="onMessageChange"
        placeholder="Add some notes"
        class="stickyInput"
        :style="stickyInputStyle"
      />
    </vue-draggable-resizable>
  </div>
</template>

<!-- TODO: sticky manager use page specificyty -->
<script>
import 'vue-draggable-resizable/dist/VueDraggableResizable.css';
import debounce from 'lodash/debounce';
import VueDraggableResizable from 'vue-draggable-resizable';
import SettingsPanel from './SettingsPanel/index.vue';
import { updateStoredStickyNote, removeStoredStickyNote } from './helpers';

export default {
  name: 'Sticky',
  components: { VueDraggableResizable, SettingsPanel },
  props: {
    hostname: String,
    // TODO: now custom fonts?
    pathname: String,
    href: String,
    id: Number,
    initialX: Number,
    initialY: Number,
    initialHeight: Number,
    initialWidth: Number,
    initialText: String,
    initialBgColor: String,
    initialUseHrefSpecificity: Boolean,
  },
  data() {
    console.log({ href: this.href, path: this.pathname });
    return {
      width: this.initialWidth,
      height: this.initialHeight,
      x: this.initialX,
      y: this.initialY,
      message: this.initialText || '',
      deleted: false,
      settingsImg: chrome.runtime.getURL('assets/settings.svg'),
      showSettings: false,
    };
  },
  computed: {
    stickyStyle() {
      return {
        'background-color': this.initialBgColor,
        top: 0,
        left: 0,
      };
    },
    stickyInputStyle() {
      return {
        'background-color': this.initialBgColor,
        width: '100%',
      };
    },
  },
  methods: {
    onResize(x, y, width, height) {
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
      this.syncStorage();
    },
    onDrag(x, y) {
      this.x = x;
      this.y = y;
      this.syncStorage();
    },
    async onDelete(event) {
      this.blocker(event);
      // eslint-disable-next-line no-alert
      if (!this.message || window.confirm('Delete this note?') === true) {
        await removeStoredStickyNote(this.id, this.hostname);
        chrome.runtime.sendMessage({
          type: 'deleteSticky',
        });
        this.deleted = true;
      }
    },
    onSettingsClick() {
      this.showSettings = !this.showSettings;
    },
    blocker(event) {
      // Don't trigger draggable when items in container are clicked / mousedown
      event.stopImmediatePropagation();
      event.stopPropagation();
    },
    onMessageChange(event) {
      this.message = event.target.value;
      this.syncStorage();
    },
    onPageSpecificityChangeWrapper(event) {
      this.useHrefSpecificity = event.target.value === 'true';
      this.syncStorage();
    },
    // eslint-disable-next-line prefer-arrow-callback
    syncStorage: debounce(function doDebounce() {
      updateStoredStickyNote(
        {
          pathname: this.pathname,
          href: this.href,
          id: this.id,
          initialX: this.x,
          initialY: this.y,
          initialHeight: this.height,
          initialWidth: this.width,
          initialText: this.message,
          initialBgColor: this.initialBgColor,
          initialUseHrefSpecificity: this.useHrefSpecificity,
        },
        this.hostname
      );
    }, 1000),
  },
};
</script>

<style scoped lang="scss">
$border-rad: 3px;

.sticky {
  -webkit-transition: opacity 200ms linear;
  -ms-transition: opacity 200ms linear;
  transition: opacity 200ms linear;
  border: 2px solid hsla(200, 50%, 50%, 1);
  z-index: 100000000 !important;
  position: absolute;
  display: flex;
  flex-direction: column;
  box-shadow: 0px 7px 10px 0px hsla(0, 0%, 0%, 0.2);
  border-radius: $border-rad;
  border: none;
}
.dragging-sticky {
  opacity: 0.65;
}
.header {
  cursor: move;
  border-top-left-radius: $border-rad;
  border-top-right-radius: $border-rad;
  border: 2px solid hsla(0, 0%, 0%, 0.05);
  display: flex;
  align-items: center;
  width: 100%;
  height: 20px;
  padding-left: 0.25rem;
  padding-right: 0.25rem;
  background-color: hsla(0, 0%, 0%, 0.075);
  & button {
    cursor: pointer;
    width: 12px;
    height: 12px;
    margin: 2px;
    border-radius: 6px;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
.settings {
  background-color: transparent;
  border: none;
}
.delete {
  background-color: hsla(0, 50%, 60%, 1);
  border: 1px solid hsla(0, 50%, 50%, 1);
  &:hover {
    background-color: hsla(0, 70%, 50%, 1);
  }
}
.stickyInput {
  flex: 1;
  min-height: 1rem;
  min-width: 1rem;
  border: 2px solid hsla(0, 0%, 0%, 0.1);
  border-top: none;
  padding: 0.5rem;
  border-radius: 0;
  border-bottom-left-radius: $border-rad;
  border-bottom-right-radius: $border-rad;
  resize: none;
  color: black;
  font-size: 16px;
  margin: 0;
  &:focus {
    outline: none;
  }
}
.settingsWrapper {
  background-color: hsla(0, 0%, 90%, 1);
  border: 2px solid hsla(0, 0%, 0%, 0.1);
  border-radius: $border-rad;
  position: absolute;
  top: 0;
  bottom: -0.5em;
  left: 0;
  opacity: 0;
  max-width: 0;
  padding: 1em;
  transform: translateY(100%);
  max-width: 500px;
  overflow: 'scroll'; // -webkit-transition: transform 200ms linear;
  // -ms-transition: transform 200ms linear;
  // transition: transform 200ms linear;
  // -webkit-transition: opacity, max-width 300ms linear;
  // -ms-transition: opacity, max-width 300ms linear;
  // transition: opacity, max-width 300ms linear;
  &.active {
    max-width: unset;
    opacity: 1;
    animation: fadeIn 0.5s;
    -webkit-animation: fadeIn 0.5s;
    -moz-animation: fadeIn 0.5s;
    -o-animation: fadeIn 0.5s;
    -ms-animation: fadeIn 0.5s;
  }
}
@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

@-moz-keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

@-webkit-keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

@-o-keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

@-ms-keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

* {
  box-sizing: border-box;
  font-family: sans-serif;
}
</style>
