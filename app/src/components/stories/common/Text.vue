<template lang="pug">

div
  img(
    :src="require('@/assets/stories/common/text-field.webp')"
    class='absolute'
    :style='textFieldStyle'
  )

  p(
    class='absolute align-middle'
    :style='textStyle'
  ) {{contentFilled}}

</template>

<script>
import { useCommonStore as cs } from "@/stores/CommonStore";
import spriteInfo from "@/assets/stories/common/text-field-in.json";

export default {
  props: ["textSpeed", "frameStep"],
  watch: {
    textSpeed() {
      this.startFillingText();
    },
  },
  data() {
    return {
      w: 593,
      h: 121,
      topOffset: 90,
      content:
        "Fuck my ass, daddy! Please! I need it so bad! Oh..." +
        "Harder! Oh my God! Just like that! Oh yes!",
      contentFillStore: "",
      contentArray: [],
      drawFrames: [],
    };
  },
  methods: {
    startFillingText() {
      this.$emit("clear");
      this.contentFillStore = "";
      this.contentArray = this.content.split("");
      this.drawFrames = [];
      for (let i = 0; i < this.contentArray.length; i++) {
        this.drawFrames.push(
          Math.floor(cs().gameFrame + (i * 50) / this.textSpeed + 10)
        );
      }
    },
  },
  computed: {
    contentFilled() {
      if (this.drawFrames[this.frameStep] == cs().gameFrame) {
        this.$emit("nextStep");
        this.contentFillStore += this.contentArray[this.frameStep];
      }
      if (this.frameStep == this.content.length) {
        this.$emit("clear");
        console.log("done");
      }
      return this.contentFillStore;
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
    _textSize() {
      return {
        w: (this.w * cs().gameWindowRatio).toFixed(),
        h: (this.h * cs().gameWindowRatio).toFixed(),
      };
    },
    _textTopOffset() {
      return parseInt((this.topOffset * cs().gameWindowRatio).toFixed());
    },
    textStyle() {
      return {
        width: `${this._textSize.w}px`,
        height: `${this._textSize.h}px`,
        top: `${
          cs().gameWindow.h - this._textFieldSize.h + this._textTopOffset
        }px`,
        left: `${(cs().gameWindow.w - this._textSize.w) / 2}px`,
        fontSize: `${32 * cs().gameWindowRatio}px`,
        "line-height": `${39 * cs().gameWindowRatio}px`,
      };
    },
  },
};
</script>
