<template lang="pug">


Preload
main(id="main" ref="main" class="h-screen w-screen overflow-hidden flex \
justify-center items-center" :style='outsideColor')

  div(ref='game-window' class='bg-slate-500 relative overflow-hidden'
  )

    button(
      @click='toggleFullscreen()'
      class='absolute top-5 right-5 z-20'
    ) Fullscreen

    router-view(v-slot='{Component}')

      transition(:name="transitionOnStart" mode='out-in')

        component(:is="Component")

    DevTools

</template>

<script>
import Preload from "@/components/Preload.vue";
import DevTools from "@/components/DevTools.vue";
import Cookies from "js-cookie";
import { updateCookie } from "@/js/common";
import { getGameData } from "@/js/common";
import { generateEnemyCoordinates } from "@/js/common";
import { generateCharacterCoordinates } from "@/js/common";
import { enemyCharacterRelation } from "@/js/common";
import { showLocalStorageSize } from "@/js/common";
import { useCommonStore as cs } from "@/stores/CommonStore";

export default {
  components: {
    Preload,
    DevTools,
  },
  data() {
    return {};
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
      let setWidth = (val) => (this.$refs["game-window"].style.width = val);
      let setHeight = (val) => (this.$refs["game-window"].style.height = val);

      if (cs().window.w / cs().window.h < 16 / 9) {
        setWidth(cs().window.w.toString() + "px");
        setHeight(((cs().window.w * 9) / 16).toString() + "px");
      } else {
        setWidth(((cs().window.h * 16) / 9).toString() + "px");
        setHeight(cs().window.h.toString() + "px");
      }

      cs().gameWindow.w = this.$refs["game-window"].clientWidth;
      cs().gameWindow.h = this.$refs["game-window"].clientHeight;
    },
  },
  computed: {
    transitionOnStart() {
      if (cs().loadingDone) {
        return "fade";
      } else {
        return "none";
      }
    },
    outsideColor() {
      let brightness = "0.5";
      if (cs().gameData.optionsSet) {
        brightness = cs().gameData.optionsSet.outsideBrightness;
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
      // localStorage
      if (localStorage.getItem("outside-brightness")) {
        cs().gameData.optionsSet.outsideBrightness =
          localStorage.getItem("outside-brightness");
      }
      if (!localStorage.getItem("enemy-coordinates")) {
        localStorage.setItem(
          "enemy-coordinates",
          JSON.stringify(generateEnemyCoordinates())
        );
      }
      if (!localStorage.getItem("character-coordinates")) {
        localStorage.setItem(
          "character-coordinates",
          JSON.stringify(generateCharacterCoordinates())
        );
      }
      if (!localStorage.getItem("enemy-character-relation")) {
        localStorage.setItem(
          "enemy-character-relation",
          JSON.stringify(enemyCharacterRelation())
        );
      }
      showLocalStorageSize();

      getGameData()
        .then(() => {
          console.log("App is mounted. Data fetched.");
          console.log(cs().gameData);
        })
        .then(() => {
          cs().initialDataFetched = true;
        });
    } else {
      console.log("App is mounted with default Data for guest");
      console.log(cs().gameData);
    }

    cs().window.w = window.innerWidth;
    cs().window.h = window.innerHeight;

    this.updateGameWindowSize();

    window.addEventListener("resize", () => {
      cs().window.w = window.innerWidth;
      cs().window.h = window.innerHeight;
      this.updateGameWindowSize();
    });

    cs().startGameFrame();
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

.none-enter-active,
.none-leave-active {
  transition: opacity 0.5s ease;
}

.none-enter-from,
.none-leave-to {
  opacity: 0;
}
</style>
