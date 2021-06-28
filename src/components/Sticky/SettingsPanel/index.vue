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
          <div class="params-flex">
            <span class="params-info">URL:&nbsp;</span
            ><span class="params">{{ href }}</span>
          </div></span
        >
      </div>
      <p v-if="willHide" class="v-padding warning">
        This sticky will no longer be shown on this page.
      </p>
      <button
        :disabled="initialIgnoreQueryParams === ignoreQueryParams"
        v-on:click="onSavedAdvanced"
      >
        Save
      </button>
    </details>
  </div>
</template>

<!-- TODO: sticky manager use page specificyty -->
<script>
import { colors } from '../../../content-scripts/lib/colors';

export default {
  name: 'SettingsPanel',
  props: {
    hostname: String,
    // TODO: now custom fonts?
    pathname: String,
    href: String,
    initialBgColor: String,
    initialIgnoreQueryParams: Boolean,
    updateNoteSettings: Function,
  },
  data() {
    console.log({ href: this.href, path: this.pathname });
    return {
      colorOptions: colors,
      hrefEnding: `/${this.href
        .split('/')
        .slice(3)
        .join('/')}`,
      showAdvanced: false,
      ignoreQueryParams: this.initialIgnoreQueryParams,
    };
  },
  computed: {
    willHide() {
      console.log(
        this.initialIgnoreQueryParams,
        window.location.href,
        this.href
      );
      return this.ignoreQueryParams && window.location.href !== this.href;
    },
  },
  methods: {
    onPageSpecificityChange(event) {
      this.ignoreQueryParams = event.target.checked;
      console.log(
        'onPageSpecificityChange',
        this.ignoreQueryParams,
        event.target
      );
    },
    onSavedAdvanced() {
      this.updateNoteSettings(this.ignoreQueryParams);
    },
    getBackgroundStyle(color) {
      console.log('getBackgroundStyle', color);
      return {
        'background-color': color || this.bgColor,
      };
    },
    onBgColorChange(color) {
      console.log('onBgColorChange', color);
      this.updateNoteSettings(undefined, color);
    },
  },
};
</script>

<style scoped lang="scss">
.advancedSettings {
  background-color: hsla(0, 0%, 0%, 0.075);
  border: 2px solid hsla(0, 0%, 0%, 0.1);
  padding: 0.5rem;
  border-radius: 3px;
}
.v-padding {
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
}
.warning {
  color: hsla(0, 50%, 50%, 1);
}
.params-info {
  font-size: 0.8rem;
}
.params-flex {
  margin-top: 0.25rem;
  display: flex;
  align-items: center;
}
.params {
  flex: 1;
  // display: inline-block;
  font-size: 0.8rem;
  padding: 0.25rem;
  width: 100%;
  // max-height: 2rem;
  white-space: nowrap;
  border: 2px solid hsla(0, 0%, 0%, 0.1);
  background: hsla(0, 0%, 0%, 0.05);
  word-wrap: break-word;
  overflow: scroll;
  text-overflow: ellipsis;
  &::-webkit-scrollbar {
    display: none;
  }
}
.color-button {
  width: 1rem;
  height: 1rem;
}
.color-options-container {
  display: flex;
  align-items: center;
  & button {
    margin: 0.25rem;
  }
}

button {
  cursor: pointer;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 2rem;
  width: 100%;
}
* {
  box-sizing: border-box;
  font-family: sans-serif;
  font-size: 1rem;
}
</style>
