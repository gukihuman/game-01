<template lang="pug">

div
  img(
    :src="require('@/assets/stories/common/text-field.webp')"
    class='absolute'
    :style='textFieldStyle'
  )

  div(
    ref='text-container'
    class='absolute flex items-center justify-center flex-wrap'
    :style='textStyle'
    )
    span(
      v-for='(word, index) in textArray'
      :key='index'
      class='blur-sm opacity-0 cursor-pointer'
      :style='spanStyle(index)'
    )
      | {{word}}&nbsp

</template>

<script>
import { useCommonStore as cs } from "@/stores/CommonStore";
import spriteInfo from "@/assets/stories/common/text-field-in.json";

export default {
  props: ["textSpeed", "textImmediately"],
  watch: {
    textSpeed() {
      this.refresh();
    },
    textImmediately() {
      this.refresh();
    },
  },
  data() {
    return {
      listeners: {
        refresh: null,
      },
      w: 593,
      h: 121,
      topOffset: 90,
      content:
        "Fuck my ass, daddy! Please! I need it so bad! Oh..." +
        "Harder! Oh my God! Just like that! Oh yes!",
      remember: "",
      delay: 5,
    };
  },
  methods: {
    refresh() {
      this.content = "";
      setTimeout(() => {
        this.content = this.remember;
      }, (1000 / 60) * this.delay);
    },
    spanStyle(index) {
      if (this.textImmediately == false) {
        return {
          animation: `fade-in ${(0.8 - this.textSpeed / 180).toFixed(1)}s ${
            ((index / 10) * (100 - this.textSpeed)) / 50
          }s forwards cubic-bezier(0.11, 0, 0.5, 0)`,
        };
      } else {
        return {
          opacity: 1,
          filter: "blur(0)",
        };
      }
    },
  },
  computed: {
    textArray() {
      if (this.content.includes(" ")) {
        return [""].concat(this.content.split(" "));
      } else {
        return [this.content];
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
        "max-width": `${this._textSize.w}px`,
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
  mounted() {
    this.remember = this.content;

    this.listeners.refresh = this.$refs["text-container"].addEventListener(
      "click",
      () => {
        this.refresh();
      }
    );
  },
  unmounted() {
    clearTimeout(this.listeners.refresh);
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
