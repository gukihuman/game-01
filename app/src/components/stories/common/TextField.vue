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
  Canvas(class='absolute top-0' ref='canvas')
    TextFieldIn(
      v-if='isTextFieldIn'
      :drawFrames='drawFrames'
      :frameStep='frameStep'
      :gameFrame='gameFrame'
      @nextStep='nextStep()'
    )
    TextFieldOut(
      v-if='isTextFieldOut'
      :drawFrames='drawFrames'
      :frameStep='frameStep'
      :gameFrame='gameFrame'
      @nextStep='nextStep()'
    )
  button(
    v-if='showToggleButton'
    class='absolute bg-red-500/20 rounded-full blur-sm'
    :style='toggleButtonStyle'
    @click='toggleTextField'
  )

</template>

<script>
import { useCommonStore as cs } from "@/stores/CommonStore";
import Canvas from "@/components/Canvas.vue";
import TextFieldIn from "@/components/stories/common/TextFieldIn.vue";
import TextFieldOut from "@/components/stories/common/TextFieldOut.vue";
import spriteInfo from "@/assets/stories/common/text-field-in.json";

export default {
  components: {
    Canvas,
    TextFieldIn,
    TextFieldOut,
  },
  data() {
    return {
      clearCanvasInterval: null,
      isTextField: false,
      isTextFieldNone: true,
      isTextFieldIn: false,
      isTextFieldOut: false,
      showToggleButton: true,
      drawFrames: [],
      frameStep: 0,
    };
  },
  methods: {
    nextStep() {
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
      this.isTextFieldNone = false;
      this.isTextFieldIn = true;
      setTimeout(() => {
        this.isTextField = true;
        this.isTextFieldIn = false;
      }, 2000 / this.animationSpeed);
    },
    _timeoutFieldOut() {
      this.isTextField = false;
      this.isTextFieldOut = true;
      setTimeout(() => {
        this.isTextFieldNone = true;
        this.isTextFieldOut = false;
      }, 2000 / this.animationSpeed);
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
    animationSpeed() {
      return 1;
    },
    gameFrame() {
      return cs().gameFrame;
    },
    textFieldSize() {
      return {
        h: (spriteInfo.frames[0].sourceSize.h * cs().gameWindowRatio).toFixed(),
        w: (spriteInfo.frames[0].sourceSize.w * cs().gameWindowRatio).toFixed(),
      };
    },
    textFieldStyle() {
      return {
        height: `${this.textFieldSize.h}px`,
        top: `${cs().gameWindow.h - this.textFieldSize.h}px`,
        left: `${(cs().gameWindow.w - this.textFieldSize.w) / 2}px`,
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
  },
  mounted() {
    this.toggleTextField();

    this.clearCanvasInterval = setInterval(() => {
      if (
        !this.isTextFieldIn &&
        !this.isTextFieldOut &&
        this.$refs["canvas"].provider
      ) {
        this.$refs["canvas"].provider.context.clearRect(0, 0, 6000, 6000);
      }
    }, 1000);
  },
  unmounted() {
    clearInterval(this.clearCanvasInterval);
  },
};
</script>
