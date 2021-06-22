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
      <div class="header">
        <button class="delete" v-on:click="onDelete" v-on:mousedown="blocker" />
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

<script>
import VueDraggableResizable from 'vue-draggable-resizable';

import 'vue-draggable-resizable/dist/VueDraggableResizable.css';
import debounce from 'lodash/debounce';
import { updateStoredStickyNote, removeStoredStickyNote } from './helpers';

export default {
  name: 'Sticky',
  components: { VueDraggableResizable },
  props: {
    // TODO: now custom fonts?
    id: Number,
    initialX: Number,
    initialY: Number,
    initialHeight: Number,
    initialWidth: Number,
    initialText: String,
    initialBgColor: String,
  },
  data() {
    return {
      width: this.initialWidth,
      height: this.initialHeight,
      x: this.initialX,
      y: this.initialY,
      message: this.initialText || '',
      deleted: false,
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
      if (window.confirm('Delete this note?') === true) {
        await removeStoredStickyNote(this.id);
        chrome.runtime.sendMessage({
          type: 'deleteSticky',
        });
        this.deleted = true;
      }
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
    // eslint-disable-next-line prefer-arrow-callback
    syncStorage: debounce(function doDebounce() {
      updateStoredStickyNote({
        id: this.id,
        initialX: this.x,
        initialY: this.y,
        initialHeight: this.height,
        initialWidth: this.width,
        initialText: this.message,
        initialBgColor: this.initialBgColor,
      });
    }, 3000),
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
}
.delete {
  cursor: pointer;
  width: 12px;
  height: 12px;
  margin: 2px;
  border-radius: 6px;
  background-color: hsla(0, 50%, 60%, 1);
  border: 1px solid hsla(0, 50%, 50%, 1);
  padding: 0;
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
</style>
