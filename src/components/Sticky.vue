<template>
  <div class="sticky" :style="stickyStyle">
    <textarea
      v-model="message"
      placeholder="add multiple lines"
      class="stickyInput"
      :style="stickyInputStyle"
    />
    <div class="movable" />
  </div>
</template>

// TODO: now save data to local storage
<script>
export default {
  name: 'Sticky',
  props: {
    xLocation: Number,
    yLocation: Number,
    height: Number,
    width: Number,
    text: String,
    bgColor: String,
  },
  // TODO: now r u sure delete
  computed: {
    stickyStyle() {
      return {
        top: `${this.position.y}px`,
        left: `${this.position.x}px`,
        // height: `${this.height}px`,
        // width: `${this.width}px`,
      };
    },
    stickyInputStyle() {
      return {
        'background-color': this.bgColor,
        minHeight: `${this.height}px`,
        minWidth: `${this.width}px`,
      };
    },
  },
  data() {
    return {
      message: this.text,
      position: { x: this.xLocation, y: this.yLocation },
    };
  },
  methods: {},
};
</script>

<style scoped lang="scss">
.sticky {
  position: absolute;
}
.stickyInput {
  border: 2px solid hsla(0, 0%, 0%, 0.1);
  box-shadow: 0px 7px 10px 0px hsla(0, 0%, 0%, 0.2);
  padding: 0.5rem;
  border-radius: 4px;
  // resize: none;
}
.movable {
  position: absolute;
  right: 0;
  top: -13px;
  width: 10px;
  height: 10px;
  border-radius: 5px;
  background-color: hsla(0, 0%, 0%, 0.2);
  &:hover {
    background-color: hsla(0, 0%, 0%, 0.3);
  }
}
</style>
