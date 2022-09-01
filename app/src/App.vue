<template lang="pug">

Preload

main(id="main" ref="main" class="h-screen w-screen overflow-hidden flex \
justify-center items-center" :style='outsideColor')
  div(ref='game-window' class='bg-slate-500 relative')
    button(@click='toggleFullscreen()' class='absolute top-5 right-5 z-20') Fullscreen
    router-view(v-slot='{Component}')
      transition(name="fade" mode='out-in')
        component(:is="Component")

</template>

<script>
import Preload from "@/components/Preload.vue";
import { updateCookie } from "@/js/common";
import { useCommonStore } from "@/stores/CommonStore";
import { updateWindowSize } from "@/js/common";
import { getGameData } from "@/js/common";
import Cookies from "js-cookie";

export default {
  components: {
    Preload,
  },
  methods: {
    toggleFullscreen() {
      if (!document.fullscreenElement) {
        this.$refs["main"].requestFullscreen();
      } else if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    },
    updateGameWindowSize() {
      if (
        useCommonStore().window.width / useCommonStore().window.height <
        16 / 9
      ) {
        this.$refs["game-window"].style.width =
          useCommonStore().window.width.toString() + "px";
        this.$refs["game-window"].style.height =
          ((useCommonStore().window.width * 9) / 16).toString() + "px";
      } else {
        this.$refs["game-window"].style.width =
          ((useCommonStore().window.height * 16) / 9).toString() + "px";
        this.$refs["game-window"].style.height =
          useCommonStore().window.height.toString() + "px";
      }
      useCommonStore().gameWindow.width = this.$refs["game-window"].clientWidth;
      useCommonStore().gameWindow.height =
        this.$refs["game-window"].clientHeight;
      useCommonStore().updateCanvas++;
    },
  },
  computed: {
    outsideColor() {
      let brightness = "0.5";
      if (useCommonStore().gameData.optionsSet) {
        brightness = useCommonStore().gameData.optionsSet.outsideBrightness;
        brightness = brightness / 100;
      }
      brightness = brightness * 255;
      return { background: `rgba(${brightness},${brightness},${brightness})` };
    },
  },
  mounted() {
    // won't do anything if there is no such a cookie, default update = 7 days
    updateCookie("jwttoken");
    updateCookie("username");

    if (Cookies.get("jwttoken") && Cookies.get("username")) {
      getGameData();
    }

    updateWindowSize(useCommonStore());
    this.updateGameWindowSize();
    window.addEventListener("resize", () => {
      updateWindowSize(useCommonStore());
      this.updateGameWindowSize();
      useCommonStore().updateCanvas++;
    });
  },
};
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
