<template lang="pug">

div
  img(
    class='absolute'
    :src ='"data:image/png;base64," + this.loadingBackground'
  )
  img(
    class='absolute animate-spin-100'
    :src ='"data:image/png;base64," + this.loadingRing1'
    style='animation-direction: reverse'
  )
  img(
    class='absolute animate-spin-70'
    :src ='"data:image/png;base64," + this.loadingRing2'
  )
  img(
    class='absolute animate-spin-30'
    :src ='"data:image/png;base64," + this.loadingRing3'
    style='animation-direction: reverse'
  )
  img(
    class='absolute animate-spin-10'
    :src ='"data:image/png;base64," + this.loadingRing4'
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
  mounted() {
    cs().loadingDone = true;
  },
};
</script>
