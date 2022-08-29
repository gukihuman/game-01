<template lang="pug">

Preload

main(class="bg-slate-400 h-screen w-screen" ref="main")
  router-view

</template>

<script>
import Preload from "@/components/Preload.vue";
const { updateCookie } = require("@/js/common");
const { useCommonStore } = require("@/stores/CommonStore");
import { updateWindowSize } from "@/js/common";

export default {
  components: {
    Preload,
  },
  data() {
    return {};
  },
  mounted() {
    // won't do anything if there is no such a cookie
    updateCookie("jwttoken");

    updateWindowSize(useCommonStore());
    window.addEventListener("resize", () => {
      updateWindowSize(useCommonStore());
    });
  },
};
</script>
