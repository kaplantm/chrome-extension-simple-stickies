<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
    <PopupMenu msg="Welcome to Your Vue.js App" />
  </div>
</template>

<script>
// @ is an alias to /src
import PopupMenu from '@/components/PopupMenu.vue';

export default {
  name: 'Home',
  components: {
    PopupMenu,
  },
};
</script>
