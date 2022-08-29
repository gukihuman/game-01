<template lang="pug">

div(
  class="w-screen h-screen overflow-hidden bg-[url('@/assets/ground.jpg')]"
  ref="canvas-wrapper"
)

  canvas(ref="canvas")
    slot

</template>

<script>
import { useCommonStore } from "@/stores/CommonStore";
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
  mounted() {
    this.provider.context = this.$refs.canvas.getContext("2d");
    this.$refs.canvas.width = this.$refs["canvas-wrapper"].clientWidth;
    this.$refs.canvas.height = this.$refs["canvas-wrapper"].clientHeight;
    useCommonStore().canvas.width = this.$refs.canvas.width;
    useCommonStore().canvas.height = this.$refs.canvas.height;
  },
};
</script>
