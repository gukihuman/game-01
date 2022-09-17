<template lang="pug">

div
  img(
    class='absolute'
    :src ='"data:image/png;base64," + this.loadingBackground'
  )
  img(
    class='absolute'
    :src ='"data:image/png;base64," + this.loadingRing1'
    :style='spinStyle1'
  )
  img(
    class='absolute'
    :src ='"data:image/png;base64," + this.loadingRing2'
    :style='spinStyle2'
  )
  img(
    class='absolute'
    :src ='"data:image/png;base64," + this.loadingRing3'
    :style='spinStyle3'
  )
  img(
    class='absolute'
    :src ='"data:image/png;base64," + this.loadingRing4'
    :style='spinStyle4'
  )

</template>

<script>
import { useCommonStore as cs } from "@/stores/CommonStore";

export default {
  data() {
    return {
      loadingBackground: localStorage.getItem("loading-background"),
      loadingRing1: localStorage.getItem("loading-ring-1"),
      loadingRing2: localStorage.getItem("loading-ring-2"),
      loadingRing3: localStorage.getItem("loading-ring-3"),
      loadingRing4: localStorage.getItem("loading-ring-4"),
    };
  },
  computed: {
    spinStyle1() {
      return { animation: "spin 100s linear infinite" };
    },
    spinStyle2() {
      return {
        animation: "spin 70s linear infinite",
        "animation-direction": "reverse",
      };
    },
    spinStyle3() {
      return { animation: "spin 30s linear infinite" };
    },
    spinStyle4() {
      return {
        animation: "spin 10s linear infinite",
        "animation-direction": "reverse",
      };
    },
  },
  mounted() {
    cs().loadingMounted = true;
  },
};
</script>

<style>
@keyframes spin {
  from {
    transform: rotate (0deg);
  }
  to {
    transform: rotate (360deg);
  }
}
</style>
