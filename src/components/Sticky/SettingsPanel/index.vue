<template>
  <div>
    <div class="v-padding color-options-container">
      <span>Background:&nbsp;</span>
      <div v-for="colorName in Object.keys(colorOptions)" :key="colorName">
        <button
          class="color-button"
          :style="getBackgroundStyle(colorOptions[colorName])"
          v-on:click="onBgColorChange(colorName)"
        />
      </div>
    </div>
    <div class="v-padding color-options-container">
      <span>Font Size:&nbsp;</span>
      <div v-for="size in fontSizes" :key="size">
        <button
          class="font-button"
          :style="getFontSizeStyle(size)"
          v-on:click="onFontSizeChange(size)"
        >
          A
        </button>
      </div>
    </div>
    <div class="v-padding color-options-container">
      <span>Font Style:&nbsp;</span>
      <div v-for="style in fontStyles" :key="style">
        <button
          class="font-button"
          :style="getFontStyleStyle(style)"
          v-on:click="onFontStyleChange(style)"
        >
          A
        </button>
      </div>
    </div>
    <details class="advancedSettings">
      <summary class="v-padding">Advanced Settings</summary>

      <div class="v-padding">
        <input
          type="checkbox"
          id="pageSpecificityCheckbox"
          :checked="ignoreQueryParams"
          @input="onPageSpecificityChange"
        />
        <span for="pageSpecificityCheckbox"
          >&nbsp;Ignore URL query parameters
          <span class="params-info"
            >Sticky will show on all pages with matching URL path</span
          ><br />
          <div class="params-flex" v-if="notExtensionPage">
            <span class="params-info">URL:&nbsp;</span
            ><span class="params">{{ href }}</span>
          </div></span
        >
      </div>
      <p v-if="willHide && !disableAdvancedSubmit" class="v-padding warning">
        This sticky will no longer be shown on this page.
      </p>
      <button
        :disabled="disableAdvancedSubmit"
        v-on:click="onSavedAdvanced"
        class="saveButton"
      >
        Save
      </button>
    </details>
  </div>
</template>

<script>
import { colors } from '../../../content-scripts/lib/colors';
import { fontStyles, fontSizes } from '../../../content-scripts/lib/fonts';

export default {
  name: 'SettingsPanel',
  props: {
    href: String,
    initialBgColor: String,
    initialIgnoreQueryParams: Number,
    updateNoteSettings: Function,
    initialFontSize: Number,
    initialFontStyle: String,
    exampleSticky: Object,
  },
  data() {
    return {
      fontStyles,
      fontSizes,
      colorOptions: colors,
      showAdvanced: false,
      ignoreQueryParams:
        (this.initialIgnoreQueryParams ||
          this.exampleSticky.initialIgnoreQueryParams) >= 2,
      notExtensionPage: !window.location.protocol.includes('chrome-extension'),
    };
  },
  computed: {
    disableAdvancedSubmit() {
      const disable =
        (this.initialIgnoreQueryParams ||
          this.exampleSticky.initialIgnoreQueryParams) >=
          2 ===
        this.ignoreQueryParams;
      return disable;
    },
    willHide() {
      return !this.ignoreQueryParams && window.location.href !== this.href;
    },
  },
  methods: {
    onPageSpecificityChange(event) {
      this.ignoreQueryParams = event.target.checked;
    },
    onSavedAdvanced() {
      this.updateNoteSettings(this.ignoreQueryParams ? 2 : 1);
    },
    getBackgroundStyle(color) {
      return {
        'background-color': color || this.bgColor,
      };
    },
    getFontSizeStyle(size) {
      return {
        'font-size': `${size || this.fontSize}em`,
      };
    },
    getFontStyleStyle(style) {
      return {
        'font-family': style || this.fontStyle,
      };
    },
    onBgColorChange(color) {
      this.updateNoteSettings(undefined, color);
    },

    onFontSizeChange(size) {
      console.log('onFontSizeChange', size);
      this.updateNoteSettings(undefined, undefined, size);
    },
    onFontStyleChange(style) {
      this.updateNoteSettings(undefined, undefined, undefined, style);
    },
  },
};
</script>

<style scoped lang="scss">
.advancedSettings {
  background-color: hsla(0, 0%, 0%, 0.075);
  border: 2px solid hsla(0, 0%, 0%, 0.1);
  padding: 0.5em;
  border-radius: 3px;
}
.v-padding {
  margin-top: 0.5em;
  margin-bottom: 0.5em;
}
.warning {
  color: hsla(0, 50%, 50%, 1);
}
.params-info {
  font-size: 0.8em;
}
.params-flex {
  margin-top: 0.25em;
  display: flex;
  align-items: center;
}
.params {
  flex: 1;
  // display: inline-block;
  font-size: 0.8em;
  padding: 0.25em;
  width: 100%;
  // max-height: 2em;
  white-space: nowrap;
  border: 2px solid hsla(0, 0%, 0%, 0.1);
  background: hsla(0, 0%, 0%, 0.05);
  word-wrap: break-word;
  overflow: scroll;
  &::-webkit-scrollbar {
    display: none;
  }
}
.color-button {
  width: 1em;
  height: 1em;
}
.font-button {
  background-color: transparent;
  border: none;
}
.color-options-container {
  display: flex;
  align-items: center;
  & button {
    margin: 0.25em;
  }
}

button {
  border: 2px solid hsla(0, 0%, 0%, 0.1);
  cursor: pointer;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 2em;
  width: 100%;
}
* {
  box-sizing: border-box;
  font-family: sans-serif;
  font-size: 1em;
}
</style>
