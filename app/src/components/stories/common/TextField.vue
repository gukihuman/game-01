<template lang="pug">

div
  img(
    v-if='isTextField'
    :src="require('@/assets/stories/common/text-field.webp')"
    class='absolute'
    :style='textFieldStyle'
  )
  img(
    v-if='isTextFieldNone'
    :src="require('@/assets/stories/common/text-field-none.webp')"
    class='absolute'
    :style='textFieldStyle'
  )

  Canvas(v-if='isCanvas' class='absolute top-0' ref='canvas')
    TextFieldIn(
      v-if='isTextFieldIn'
      :drawFrames='drawFrames'
      :frameStep='frameStep'
      @nextFrameStep='nextFrameStep()'
    )
    TextFieldOut(
      v-if='isTextFieldOut'
      :drawFrames='drawFrames'
      :frameStep='frameStep'
      @nextFrameStep='nextFrameStep()'
    )
  button(
    v-if='isStoryButton'
    @click='nextStoryStep()'
    class='absolute top-0 cursor-default appearance-none'
    :style='stepButtonStyle'
  )
  button(
    v-if='showToggleButton'
    class='absolute bg-red-500/20 rounded-full blur-sm'
    :style='toggleButtonStyle'
    @click='toggleTextField'
  )

  Text(v-if='isText' :content='text' :color='color')

</template>

<script>
import { useCommonStore as cs } from "@/stores/CommonStore";
import Canvas from "@/components/Canvas.vue";
import TextFieldIn from "@/components/stories/common/TextFieldIn.vue";
import TextFieldOut from "@/components/stories/common/TextFieldOut.vue";
import spriteInfo from "@/assets/stories/common/text-field-in.json";
import Text from "@/components/stories/common/Text.vue";
import { debounce } from "@/js/common";
import { updateGameData } from "@/js/common";

export default {
  props: ["text", "color"],
  components: {
    Canvas,
    Text,
    TextFieldIn,
    TextFieldOut,
  },
  data() {
    return {
      isText: false,
      isTextField: false,
      isTextFieldNone: true,
      isTextFieldIn: false,
      isTextFieldOut: false,
      isStoryButton: false,
      showToggleButton: true,
      animationSpeed: 1,
      drawFrames: [],
      frameStep: 0,
    };
  },
  methods: {
    nextStoryStep() {
      cs().gameData.story.step++;
      this.delayedUpdateGameData();
      console.log(cs().gameData.story.step);
    },
    nextFrameStep() {
      if (!this.$refs["canvas"]) return;
      this.$refs["canvas"].provider.context.clearRect(0, 0, 6000, 6000);
      this.frameStep++;
    },
    _timeoutButton() {
      this.showToggleButton = false;
      setTimeout(() => {
        this.showToggleButton = true;
      }, 2000 / this.animationSpeed);
    },
    _timeoutFieldIn() {
      this.isTextFieldIn = true;
      setTimeout(() => {
        this.isTextFieldNone = false;
      }, 2000 / 16 / this.animationSpeed);
      setTimeout(() => {
        this.isTextField = true;
        this.isTextFieldIn = false;
        this.isText = true;
        this.isStoryButton = true;
      }, ((2000 / 16) * 15) / this.animationSpeed);
    },
    _timeoutFieldOut() {
      this.isStoryButton = false;
      this.isText = false;
      this.isTextFieldOut = true;
      setTimeout(() => {
        this.isTextField = false;
      }, 2000 / 16 / this.animationSpeed);
      setTimeout(() => {
        this.isTextFieldNone = true;
        this.isTextFieldOut = false;
      }, ((2000 / 16) * 15) / this.animationSpeed);
    },
    _fillFrames() {
      this.frameStep = 0;
      this.drawFrames = [];
      for (let i = 0; i < 16; i++) {
        this.drawFrames.push(
          Math.floor(cs().gameFrame + (7.5 / this.animationSpeed) * i)
        );
      }
    },
    toggleTextField() {
      this._fillFrames();
      if (!this.isTextField) {
        this._timeoutButton();
        this._timeoutFieldIn();
      } else {
        this._timeoutButton();
        this._timeoutFieldOut();
      }
    },
  },
  computed: {
    isCanvas() {
      if (this.isTextFieldOut || this.isTextFieldIn) {
        return true;
      } else {
        return false;
      }
    },
    _textFieldSize() {
      return {
        h: (spriteInfo.frames[0].sourceSize.h * cs().gameWindowRatio).toFixed(),
        w: (spriteInfo.frames[0].sourceSize.w * cs().gameWindowRatio).toFixed(),
      };
    },
    textFieldStyle() {
      return {
        height: `${this._textFieldSize.h}px`,
        top: `${cs().gameWindow.h - this._textFieldSize.h}px`,
        left: `${(cs().gameWindow.w - this._textFieldSize.w) / 2}px`,
      };
    },
    toggleButtonStyle() {
      let h = 70 * cs().gameWindowRatio;
      let w = 50 * cs().gameWindowRatio;
      let bottomOffset = (42 - h / 2) * cs().gameWindowRatio;
      let leftOffset = (688 - w / 2) * cs().gameWindowRatio;
      return {
        width: `${w.toFixed()}px`,
        height: `${h.toFixed()}px`,
        top: `${(cs().gameWindow.h - h - bottomOffset).toFixed()}px`,
        left: `${leftOffset.toFixed()}px`,
      };
    },
    stepButtonStyle() {
      return {
        width: `${cs().gameWindow.w}px`,
        height: `${cs().gameWindow.h}px`,
      };
    },
  },
  mounted() {
    this.toggleTextField();
    this.delayedUpdateGameData = debounce(() => {
      updateGameData();
      console.log("Data is sent");
    }, 2000);
  },
};
</script>
