<template>
  <div v-if="!deleted && !hidden">
    <vue-draggable-resizable
      class="sticky"
      class-name-dragging="dragging-sticky"
      :style="stickyStyle"
      :min-width="100"
      :min-height="100"
      :w="width || this.exampleSticky.initialWidth"
      :h="height || this.exampleSticky.initialHeight"
      :x="x"
      :y="y"
      :drag-handle="'.header'"
      @dragging="onDrag"
      @resizing="onResize"
      :handles="['tl', 'tr', 'br', 'bl']"
      :active.sync="sizingActive"
    >
      <div v-bind:class="[{ active: showSettings }, 'settingsWrapper']">
        <div v-if="showSettings">
          <SettingsPanel
            :updateNoteSettings="updateNoteSettings"
            :href="href"
            :initialBgColor="bgColor"
            :initialFontSize="fontSize"
            :initialFontStyle="fontStyle"
            :initialIgnoreQueryParams="ignoreQueryParams"
            :exampleSticky="exampleSticky"
          />
        </div>
      </div>
      <div class="header">
        <button class="delete" v-on:click="onDelete" v-on:mousedown="blocker" />
        <button
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
        v-on:click="disabledSizingActive"
      />
    </vue-draggable-resizable>
  </div>
</template>

<script>
import 'vue-draggable-resizable/dist/VueDraggableResizable.css';
import debounce from 'lodash/debounce';
import VueDraggableResizable from 'vue-draggable-resizable';
import SettingsPanel from './SettingsPanel/index.vue';
import { updateStoredStickyNote, removeStoredStickyNote } from './helpers';
import { colors } from '../../content-scripts/lib/colors';
import {
  exampleStickyInitialText,
  optionsPageKey,
} from '../../content-scripts/lib/storageUtils';

export default {
  name: 'Sticky',
  components: { VueDraggableResizable, SettingsPanel },
  props: {
    hostname: String,
    pathname: String,
    href: String,
    id: Number,
    initialX: Number,
    initialY: Number,
    initialHeight: Number,
    initialWidth: Number,
    initialText: String,
    initialBgColor: String,
    initialIgnoreQueryParams: Number,
    initialFontSize: Number,
    initialFontStyle: String,
    exampleSticky: Object,
    getStickies: Function,
  },

  data() {
    console.log('sticky stickyData', {
      message: this.initialText || '',
      ignoreQueryParams: this.initialIgnoreQueryParams,
      initialIgnoreQueryParams: this.initialIgnoreQueryParams,
    });
    return {
      width: this.initialWidth,
      height: this.initialHeight,
      x: this.initialX,
      y: this.initialY,
      message: this.initialText || '',
      deleted: false,
      bgColor: this.initialBgColor,
      settingsImg: chrome.runtime.getURL('assets/settings.svg'),
      showSettings: false,
      ignoreQueryParams: this.initialIgnoreQueryParams,
      sizingActive: false,
      fontSize: this.initialFontSize,
      fontStyle: this.initialFontStyle,
    };
  },
  computed: {
    hidden() {
      console.log({
        ig: this.ignoreQueryParams,
        same: window.location.href !== this.href,
      });
      return this.ignoreQueryParams < 2 && window.location.href !== this.href;
    },
    stickyStyle() {
      return {
        'background-color':
          colors[this.bgColor || this.exampleSticky.initialBgColor],
        top: 0,
        left: 0,
      };
    },
    stickyInputStyle() {
      console.log({ exampleSticky: this.exampleSticky, bgColor: this.bgColor });
      return {
        'background-color':
          colors[this.bgColor || this.exampleSticky.initialBgColor],
        width: '100%',
        'font-size': `${this.fontSize || this.exampleSticky.initialFontSize}em`,
        'font-family': this.fontStyle || this.exampleSticky.initialFontStyle,
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
      // if (this.hostname !== optionsPageKey) {
      this.message =
        this.hostname === optionsPageKey
          ? exampleStickyInitialText
          : event.target.value;
      this.syncStorage();
      // }
    },
    updateNoteSettings(
      newIgnoreQueryParams,
      newBgColor,
      newFontSize,
      newFontStyle
    ) {
      this.ignoreQueryParams =
        newIgnoreQueryParams !== undefined
          ? newIgnoreQueryParams
          : this.ignoreQueryParams;

      this.bgColor = newBgColor !== undefined ? newBgColor : this.bgColor;
      this.fontSize = newFontSize !== undefined ? newFontSize : this.fontSize;
      this.fontStyle =
        newFontStyle !== undefined ? newFontStyle : this.fontStyle;
      this.syncStorage();
    },
    syncStorage: debounce(function doDebounce() {
      console.log('syncStorage', this.hostname);
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
          initialBgColor: this.bgColor,
          initialIgnoreQueryParams: this.ignoreQueryParams,
          initialFontSize: this.fontSize,
          initialFontStyle: this.fontStyle,
        },
        this.hostname
      );
    }, 1000),
    disabledSizingActive() {
      this.sizingActive = false;
    },
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
    width: 12px !important;
    height: 12px !important;
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
  bottom: -0.5em;
  left: 0;
  opacity: 0;
  padding: 0.5em;
  transform: translateY(100%);
  max-width: min(100%, 500px);
  min-width: 400px;
  &.active {
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
