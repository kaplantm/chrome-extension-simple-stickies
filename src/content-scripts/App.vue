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

<style>
#simpleStickiesChromeAppWrapper {
  /* border: 30px solid red; */
  z-index: 10000000;
  position: absolute;
  top: 0;
  left: 0;
}
* {
  box-sizing: border-box;
  font-family: sans-serif;
}
</style>
