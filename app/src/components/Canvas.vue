<template lang="pug">

div
  canvas(ref="canvas")
    slot
  Transition
    Loading(
      v-if='isLoading'
      class="absolute top-0 left-0 w-screen h-screen"
    )

</template>

<script>
import { useCommonStore } from "@/stores/CommonStore";
import { debounce } from "@/js/common";
import Loading from "@/components/Loading";

export default {
  components: {
    Loading,
  },
  data() {
    return {
      isLoading: false,
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

    this.delayedLoadingHide = debounce(() => (this.isLoading = false), 300);

    window.addEventListener("resize", () => {
      this.$refs.canvas.width = useCommonStore().gameWindow.w;
      this.$refs.canvas.height = useCommonStore().gameWindow.h;
      this.delayedLoadingHide();
      this.isLoading = true;
    });
  },
};
</script>
