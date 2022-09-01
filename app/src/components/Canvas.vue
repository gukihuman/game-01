<template lang="pug">

div
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
    this.$refs.canvas.width = useCommonStore().gameWindow.w;
    this.$refs.canvas.height = useCommonStore().gameWindow.h;

    window.addEventListener("resize", () => {
      this.$refs.canvas.width = useCommonStore().gameWindow.w;
      this.$refs.canvas.height = useCommonStore().gameWindow.h;
    });
  },
};
</script>
