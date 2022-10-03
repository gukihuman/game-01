<template lang="pug">

div
  div(class='bg-[url("@/assets/attack/common/ground.webp")] flex items-center \
  justify-center absolute' :style='fieldStyle')
    img(
      :src="require('@/assets/attack/common/village.webp')"
      :style='villageStyle'
    )
</template>

<script>
import { useCommonStore as cs } from "@/stores/CommonStore";

export default {
  data() {
    return {
      village: 960,
    };
  },
  computed: {
    fieldStyle() {
      return {
        width: `${cs().gameWindow.w}px`,
        height: `${cs().gameWindow.h}px`,
      };
    },
    villageStyle() {
      return {
        width: `${this.village * cs().gameWindowRatio2k}px`,
        height: `${this.village * cs().gameWindowRatio2k}px`,
      };
    },
  },
};
</script>
