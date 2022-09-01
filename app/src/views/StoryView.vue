<template lang="pug">

div

  Prologue(class='absolute top-0')
  Canvas(:update='update' class='absolute top-0' ref='canvas-wrapper')
    //- TextFieldOut(:update='update' v-if='isTextField' :time='time')
    //- TextFieldIn(:update='update' v-if='!isTextField' :time='time')
  TextField(class='absolute' :style='textFieldStyle')

  button(@click='mainMenu()' class='absolute top-4 left-4') Main menu
  button(v-if='isTextField' @click='showTextField()' class='absolute bottom-5  \
  left-32' :style='showButtonStyle') Toggle
  button(v-if='!isTextField' @click='hideTextField()' class='absolute bottom-5 \
  left-32' :style='showButtonStyle') Toggle

</template>

<script>
import Prologue from "@/components/stories/Prologue";
import Canvas from "@/components/Canvas.vue";
import TextFieldOut from "@/components/common/TextFieldOut.vue";
import TextFieldIn from "@/components/common/TextFieldIn.vue";
import TextField from "@/components/common/TextField.vue";
import { useCommonStore } from "@/stores/CommonStore";
import textSprite from "@/assets/stories/common/text-field-in.json";

export default {
  components: {
    Prologue,
    Canvas,
    TextFieldOut,
    TextFieldIn,
    TextField,
  },
  data() {
    return {
      time: 0,
      changes: 0,
      isTextField: true,
      showButton: true,
      isAnimation: false,
    };
  },
  computed: {
    ratio() {
      return useCommonStore().gameWindow.height / 1080;
    },
    textFieldSize() {
      return {
        height: textSprite.frames[0].sourceSize.h * this.ratio,
        width: textSprite.frames[0].sourceSize.w * this.ratio,
      };
    },
    textFieldStyle() {
      return {
        height: `${this.textFieldSize.height.toFixed()}px`,
        top: `${
          useCommonStore().gameWindow.height - this.textFieldSize.height
        }px`,
        left: `${
          (useCommonStore().gameWindow.width - this.textFieldSize.width) / 2
        }px`,
      };
    },
    gameWindow() {
      return (
        useCommonStore().gameWindow.width.toString() +
        " : " +
        useCommonStore().gameWindow.height.toString()
      );
    },
    update() {
      if (useCommonStore().updateCanvas) {
        this.changes++;
        this.clearCanvas();
      }
    },
    showButtonStyle() {
      if (!this.showButton) {
        return {
          display: "none",
        };
      } else {
        return {
          display: "block",
        };
      }
    },
  },
  methods: {
    hideTextField() {
      this.showButton = false;
      setTimeout(() => {
        this.showButton = true;
      }, 2000);
      this.isTextField = true;
      this.time = 0;
      for (let i = 1; i < 16; i++) {
        setTimeout(() => {
          this.time++;
          this.clearCanvas();
        }, (1000 / 8) * i);
      }
      this.showFieldOut = !this.showFieldOut;
    },
    showTextField() {
      this.showButton = false;
      setTimeout(() => {
        this.showButton = true;
      }, 2000);
      this.isTextField = false;
      this.time = 0;
      this.animation = true;
      for (let i = 1; i < 16; i++) {
        setTimeout(() => {
          this.time++;
          this.clearCanvas();
        }, (1000 / 8) * i);
      }
      setTimeout(() => {
        this.isAnimation = false;
      }, 2020);
      this.showFieldOut = !this.showFieldOut;
    },
    clearCanvas() {
      if (!this.$refs["canvas-wrapper"]) return;
      this.$refs["canvas-wrapper"].provider.context.clearRect(0, 0, 6000, 6000);
    },
    mainMenu() {
      this.$router.push("/");
    },
  },
  mounted() {
    let timeout;
    window.addEventListener("resize", () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        if (this.isTextField) {
          time = 15;
        }
      }, 500);
    });
    this.showTextField();
  },
};
</script>
