<template>
  <div v-if="stickyDomains">
    <input
      :value="search"
      @input="onSearchChange"
      placeholder="Search Stickies"
    />
    currentStickies{{ currentStickies.length }}
    <!-- TODO: repositioning on search? wierdness -->
    <div class="allStickiesWrapper" :style="allStickiesWrapperDynamicStyle">
      <div v-for="(item, index) in currentStickies" :key="item.id">
        <Sticky
          v-bind="item"
          :hostname="getHostname(item.href)"
          :exampleSticky="exampleSticky"
          :readOnly="true"
          :initialX="(exampleSticky.initialWidth + 10) * (index % itemsPerRow)"
          :initialY="
            (exampleSticky.initialHeight + 10) * Math.floor(index / itemsPerRow)
          "
          :initialHeight="exampleSticky.initialHeight"
          :initialWidth="exampleSticky.initialWidth"
        />
        Index: {{ index + 1 }}<br />
        itemsPerRow: {{ itemsPerRow }}<br />
        Ciel: {{ Math.ceil(index + 1 / itemsPerRow) }}<br />
        raw: {{ (index + 1) / itemsPerRow }} {{ index + 1 }} / {{ itemsPerRow
        }}<br />
        ------<br />
      </div>
    </div>
    <!-- WIDTH: {{ exampleSticky.width }} {{ window?.innerWidth }} -->
    <!-- <PopupMenu /> -->
  </div>
</template>

<script>
import Sticky from '@/components/Sticky/index.vue';
import debounce from 'lodash/debounce';
import {
  exampleSticky,
  optionsPageKey,
} from '../content-scripts/lib/storageUtils';

export default {
  name: 'App',
  components: { Sticky },
  created() {
    this.loadStickies();
  },
  data() {
    return {
      stickyDomains: null,
      search: '',
      debouncedSearch: '',
      exampleSticky,
    };
  },
  methods: {
    getHostname(href) {
      return new URL(href).hostname;
    },
    loadStickies() {
      chrome.storage.local.get(undefined, (data) => {
        this.stickyDomains = { ...data, [optionsPageKey]: { stickies: [] } };
        this.exampleSticky =
          data[optionsPageKey] && data[optionsPageKey].stickies?.length
            ? data[optionsPageKey].stickies[0]
            : exampleSticky;
        console.log({ dom: this.stickyDomains, optionsPageKey });
      });
    },
    onSearchChange(event) {
      this.search = event.target.value;
      this.updateDebouncedSearch();
    },
    updateDebouncedSearch: debounce(function doDebounce() {
      this.debouncedSearch = this.search;
    }, 500),
  },
  computed: {
    itemsPerRow() {
      console.log('itemsPerRow', {
        window: window.innerWidth,
        ex: this.exampleSticky.initialWidth || exampleSticky.initialWidth,
        res: Math.floor(
          (window.innerWidth - 60) /
            (this.exampleSticky.initialWidth || exampleSticky.initialWidth)
        ),
      });
      return Math.floor(
        (window.innerWidth - 60) /
          (this.exampleSticky.initialWidth || exampleSticky.initialWidth)
      );
    },
    windowInnerWidth() {
      return window.innerWidth || 1000;
    },
    allStickiesWrapperDynamicStyle() {
      console.log('allStickiesWrapperDynamicStyle', {
        items: this.itemsPerRow,
        width: this.itemsPerRow * this.exampleSticky.initialWidth,
        init: this.exampleSticky.initialWidth,
      });
      return {
        width: `${this.itemsPerRow * this.exampleSticky.initialWidth}px`,
        // border: '2px solid red',
      };
    },
    flatStickiesArray() {
      return Object.values(this.stickyDomains || {})
        .map((stickyDomain) => stickyDomain.stickies)
        .flat();
    },
    /* eslint-disable */
    currentStickies() {
      return this.debouncedSearch
        ? this.flatStickiesArray.filter((sticky) =>
            sticky.initialText.includes(this.debouncedSearch)
          )
        : this.flatStickiesArray;
    },
  },
  /* eslint-enable */
};
</script>

<style lang="scss">
.allStickiesWrapper {
  position: relative;
  margin: 20px;
  // border: 2px solid blue;
}
</style>

// TODO: different font sizes on regular page vs options?
