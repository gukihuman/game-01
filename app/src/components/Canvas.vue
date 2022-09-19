<template lang="pug">

div
  canvas(ref="canvas")
    slot

</template>

<script>
import { useCommonStore as cs } from "@/stores/CommonStore";

export default {
  data() {
    return {
      provider: {
        context: null,
      },
    };
  },
  provide() {
    return {
      provider: this.provider,
    };
  },
  methods: {
    clear() {
      this.provider.context.clearRect(
        0,
        0,
        cs().gameWindow.w,
        cs().gameWindow.h
      );
    },
  },
  mounted() {
    this.provider.context = this.$refs.canvas.getContext("2d");
    this.$refs.canvas.width = cs().gameWindow.w;
    this.$refs.canvas.height = cs().gameWindow.h;

    window.addEventListener("resize", () => {
      this.$refs.canvas.width = cs().gameWindow.w;
      this.$refs.canvas.height = cs().gameWindow.h;
    });
  },
};
</script>
