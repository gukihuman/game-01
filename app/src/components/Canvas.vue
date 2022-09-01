<template lang="pug">

div(
  class="w-full h-full overflow-hidden"
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
    this.$refs.canvas.width = useCommonStore().gameWindow.width;
    this.$refs.canvas.height = useCommonStore().gameWindow.height;
    useCommonStore().canvas.width = this.$refs.canvas.width;
    useCommonStore().canvas.height = this.$refs.canvas.height;
    window.addEventListener("resize", () => {
      this.$refs.canvas.width = useCommonStore().gameWindow.width;
      this.$refs.canvas.height = useCommonStore().gameWindow.height;
    });
  },
};
</script>
