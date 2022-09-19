<template lang="pug">

//- add to prologue @isDarken=(getDarken)

div(class='relative')
  Transition
    img(
      class='absolute'
      v-if='story.scene == "forest"'
      :src="require('@/assets/stories/prologue/forest/forest.webp')"
    )
    Loading(
      v-else-if='story.scene == "loading"'
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
  

  div(:class="{ 'brightness-90': isDarken }")
    //- Arrows
    Transition(:name='arrowsTransition')
      img(
        v-if='isText && !thisStep.person'
        class='absolute'
        :style='textFieldStyle'
        :src="require('@/assets/stories/common/arrow-down.webp')"
      )
    Transition(:name='arrowsTransition')
      img(
        v-if="isText && thisStep.person && !thisStep['arrow-right'] && !thisStep['arrow-left']"
        class='absolute'
        :style='textFieldStyle'
        :src="require('@/assets/stories/common/arrow-up.webp')"
      )
    Transition(:name='arrowsTransition')
      img(
        v-if="isText && thisStep.person && thisStep['arrow-right']"
        class='absolute'
        :style='textFieldStyle'
        :src="require('@/assets/stories/common/arrow-right.webp')"
      )
    Transition(:name='arrowsTransition')
      img(
        v-if="isText && thisStep.person && thisStep['arrow-left']"
        class='absolute'
        :style='textFieldStyle'
        :src="require('@/assets/stories/common/arrow-left.webp')"
      )

    TextField(
      :text='this.currentText'
      :color='color'
      @textFieldStyle='getTextFieldStyle'
      @isText='getIsText'
    )

  button(@click='mainMenu()' class='absolute top-4 left-4') Main menu

</template>

<script>
import TextField from "@/components/stories/common/TextField.vue";
import Loading from "@/components/Loading.vue";
import { useCommonStore as cs } from "@/stores/CommonStore";

export default {
  components: {
    TextField,
    Loading,
  },
  watch: {
    initialDataFetched() {
      this.sceneId = this.sceneOrder.findIndex(
        (item) => cs().gameData.story.scene == item
      );
      this.currentText = "";
      setTimeout(() => {
        this.currentText = this[this.currentScene].steps[this.step].text;
      }, 0);
    },
    step(value) {
      if (value > this[this.currentScene].steps.length - 1) {
        this.sceneId++;
        if (this.sceneId > this.sceneOrder.length - 1) {
          // change to another stage
          cs().gameData.story.scene = "forest";
          cs().gameData.story.step = 0;
          this.$router.push("/");
        } else {
          console.log(`Current sceneId: ${this.sceneId}`);
          cs().gameData.story.scene = this.sceneOrder[this.sceneId];
          cs().gameData.story.step = 0;
          console.log(`Current scene: ${this.currentScene}`);
        }
      } else {
        this.currentText = "";
        setTimeout(() => {
          this.currentText = this[this.currentScene].steps[this.step].text;
        }, 0);
      }
    },
  },
  methods: {
    getDarken(value) {
      this.isDarken = value;
    },
    getTextFieldStyle(value) {
      this.textFieldStyle = value;
    },
    mainMenu() {
      this.$router.push("/");
    },
    getIsText(value) {
      this.isText = value;
    },
  },
  data() {
    return {
      textFieldStyle: null,
      isDarken: false,
      isText: null,
      currentText: "",
      sceneId: 0,
      sceneOrder: ["loading", "forest", "village", "house"],
      loading: {
        steps: [{ person: "grace", text: "" }],
      },
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
            "arrow-right": true,
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
            "arrow-right": true,
            person: "grace",
            text: "See? / It's not that bad.",
          },
          {
            "arrow-right": true,
            person: "grace",
            text: "What do you say?",
          },
        ],
      },
    };
  },
  computed: {
    arrowsTransition() {
      if (cs().gameData.optionsSet.textImmediately) {
        return "none";
      } else {
        return "arrows";
      }
    },
    thisStep() {
      return this[this.currentScene].steps[this.step];
    },
    initialDataFetched() {
      return cs().initialDataFetched;
    },
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
      if (this.currentScene == "loading") {
        return cs().personColors.player;
      } else {
        if (this.sceneId < this.sceneOrder.length) {
          if (this[this.currentScene]) {
            if (this[this.currentScene].steps) {
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
          }
        }
      }
    },
  },
  mounted() {
    console.log(`Current scene on mount: ${this.currentScene}`);
    if (this.currentScene.steps) {
      this.currentText = this[this.currentScene].steps[this.step].text;
    }
    if (cs().initialDataFetched == true) {
      this.sceneId = this.sceneOrder.findIndex(
        (item) => cs().gameData.story.scene == item
      );
      this.currentText = "";
      setTimeout(() => {
        this.currentText = this[this.currentScene].steps[this.step].text;
      }, 0);
    }
  },
};
</script>

<style scoped>
.v-enter-active,
.v-leave-active {
  transition: all 1.5s ease-in-out;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
  transform: scale(1.1);
}

.arrows-enter-active,
.arrows-leave-active {
  transition: all 1s ease-in-out;
}

.arrows-enter-from,
.arrows-leave-to {
  opacity: 0;
}
.none-enter-active,
.none-leave-active {
  transition: none;
}

.none-enter-from,
.none-leave-to {
  opacity: 0;
}
</style>
