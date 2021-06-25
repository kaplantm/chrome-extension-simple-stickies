<template>
  <div v-if="hasPageSpecificitySettings">
    <span for="pageSpecificityCheckbox"
      >Show only on pages with matching queries</span
    >
    <input
      type="checkbox"
      id="pageSpecificityCheckbox"
      @input="onPageSpecificityChange"
    />
  </div>
</template>

<!-- TODO: sticky manager use page specificyty -->
<script>
export default {
  name: 'SettingsPanel',
  props: {
    hostname: String,
    // TODO: now custom fonts?
    pathname: String,
    href: String,
    initialBgColor: String,
    initialUseHrefSpecificity: Boolean,
    onPageSpecificityChange: Function,
  },
  data() {
    console.log({ href: this.href, path: this.pathname });
    return {
      useHrefSpecificity: this.initialUseHrefSpecificity || false,
      hrefEnding: `/${this.href
        .split('/')
        .slice(3)
        .join('/')}`,
    };
  },
  computed: {
    hasPageSpecificitySettings() {
      console.log('hasPageSpecificitySettings', {
        ending: this.hrefEnding,
        path: this.pathname,
      });
      // figure out what to do about when setting this the sticky should disappear
      // confirmation? This will hide this sticky on this page. It will still be visible on x.
      return this.hrefEnding !== this.pathname;
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
