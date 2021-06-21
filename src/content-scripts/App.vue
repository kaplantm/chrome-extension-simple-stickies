<template>
  <div id="simpleStickiesChromeAppWrapper">
    <StickiesManager />
  </div>
</template>

<script>
import StickiesManager from '@/components/StickiesManager/index.vue';

export default {
  name: 'App',
  components: { StickiesManager },
};
</script>

<style lang="scss">
#simpleStickiesChromeAppWrapper {
  // border: 3px solid red;
  position: absolute;
  top: 0;
  left: 0;
  height: 0;
  width: 0;
}
* {
  box-sizing: border-box;
  font-family: sans-serif;
}
</style>
