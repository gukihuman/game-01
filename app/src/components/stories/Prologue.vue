<template lang="pug">

div
  img(
    v-if='story.scene == "forest"'
    :src="require('@/assets/stories/prologue/forest/forest.webp')"
    class='transition duration-1000 opacity-0'
    :style='imgStyle'
  )
  img(
    v-if='story.scene == "village"'
    :src="require('@/assets/stories/prologue/village/village.webp')"
    class='transition duration-1000 opacity-0'
    :style='imgStyle'
  )
  TextField(text='Oh / Hi!' :color='color')

</template>

<script>
import TextField from "@/components/stories/common/TextField.vue";
import { useCommonStore as cs } from "@/stores/CommonStore";

export default {
  components: {
    TextField,
  },
  watch: {
    step(value) {
      if (value > this.steps.length - 1) {
        cs().gameData.story.scene = "village";
      }
    },
  },
  data() {
    return {
      steps: [
        {
          text: "Oh / Hi!",
          person: "grace",
        },
      ],
    };
  },
  computed: {
    step() {
      return cs().gameData.story.step;
    },
    story() {
      return cs().gameData.story;
    },
    color() {
      if (this.steps[this.step]) {
        let person = this.steps[this.step].person;
        return cs().personColors[person];
      } else {
        return cs().personColors.default;
      }
    },
    imgStyle() {
      return {
        animation: `fade-in 0.3s 0.3s forwards cubic-bezier(0.11, 0, 0.5, 0)`,
      };
    },
  },
};
</script>

<style>
@keyframes fade-in {
  100% {
    opacity: 1;
    filter: blur(0);
  }
}
</style>
