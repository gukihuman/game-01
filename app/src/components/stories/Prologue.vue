<template lang="pug">

div(class='relative')
  Transition
    img(
      class='absolute'
      v-if='story.scene == "forest"'
      :src="require('@/assets/stories/prologue/forest/forest.webp')"
    )
    img(
      class='absolute'
      v-else-if='story.scene == "village"'
      :src="require('@/assets/stories/prologue/village/village.webp')"
    )
    img(
      class='absolute'
      v-else-if='story.scene == "house"'
      :src="require('@/assets/stories/prologue/house/house.webp')"
    )
  Transition
    img(
      class='absolute'
      v-if='story.scene == "house"'
      :src="require('@/assets/stories/prologue/house/grace.webp')"
    )
  TextField(:text='this.currentText' :color='color' ref='text-field')

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
      if (this.sceneId > this.sceneOrder.length - 1) {
        // change to another stage
        cs().gameData.story.scene = "forest";
        this.$router.push("/");
      } else {
        if (value > this[this.currentScene].steps.length - 1) {
          this.sceneId++;
          cs().gameData.story.scene = this.sceneOrder[this.sceneId];
          cs().gameData.story.step = 0;
          this.$refs["text-field"].toggleTextField();
          console.log(`Current scene: ${this.currentScene}`);
        } else {
          this.currentText = "";
          setTimeout(() => {
            this.currentText = this[this.currentScene].steps[this.step].text;
          }, 0);
        }
      }
    },
  },
  data() {
    return {
      currentText: "",
      sceneId: 0,
      sceneOrder: ["forest", "village", "house"],
      forest: {
        steps: [
          {
            person: "grace",
            text: "Oh / Hi!",
          },
          {
            text: "Hi there!",
          },
        ],
      },
      village: {
        steps: [
          {
            person: "grace",
            text: "Here we are!",
          },
          {
            text: "Is it the house?",
          },
        ],
      },
      house: {
        steps: [
          {
            person: "grace",
            text: "See? / It's not that bad.",
          },
          {
            person: "grace",
            text: "What do you say?",
          },
        ],
      },
    };
  },
  computed: {
    currentScene() {
      return cs().gameData.story.scene;
    },
    step() {
      return cs().gameData.story.step;
    },
    story() {
      return cs().gameData.story;
    },
    color() {
      if (this.sceneId < this.sceneOrder.length) {
        if (this[this.currentScene].steps[this.step]) {
          if (this[this.currentScene].steps[this.step].person) {
            let person = this[this.currentScene].steps[this.step].person;
            return cs().personColors[person];
          } else {
            return cs().personColors.player;
          }
        } else {
          return cs().personColors.player;
        }
      }
    },
  },
  mounted() {
    console.log(`Current scene: ${this.currentScene}`);
    this.currentText = this[this.currentScene].steps[this.step].text;
  },
};
</script>

<style>
.v-enter-active,
.v-leave-active {
  transition: all 1.5s ease-in-out;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
  transform: scale(1.1);
}
</style>
