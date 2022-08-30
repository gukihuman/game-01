<template lang="pug">

Preload

main(class="bg-slate-400 h-screen w-screen" ref="main")
  router-view

</template>

<script>
import Preload from "@/components/Preload.vue";
import { updateCookie } from "@/js/common";
import { useCommonStore } from "@/stores/CommonStore";
import { updateWindowSize } from "@/js/common";

export default {
  components: {
    Preload,
  },
  mounted() {
    // won't do anything if there is no such a cookie, default update = 7 days
    updateCookie("jwttoken");
    updateCookie("username");

    updateWindowSize(useCommonStore());
    window.addEventListener("resize", () => {
      updateWindowSize(useCommonStore());
    });
  },
};
</script>
