<template lang="pug">


div
  label(htmlFor='outside-brightness') Outside Brightness
  input(
    id='outside-brightness'
    ref='outside-brightness'
    type='range'
    min='1'
    max='100'
    v-model='optionsSet.outsideBrightness'
    class="w-80 h-30 bg-gradient-to-r from-black to-white relative \
    rounded-lg appearance-none"
  )

button(@click='saveChanges()') OK

</template>

<script>
import { useCommonStore as cs } from "@/stores/CommonStore";
import { getGameData } from "@/js/common";
import { updateGameData } from "@/js/common";

export default {
  props: ["toggleOptions"],
  data() {
    return {
      optionsSet: {
        outsideBrightness: 50,
        animationSpeed: 1,
      },
    };
  },
  methods: {
    saveChanges() {
      cs().gameData.optionsSet = this.optionsSet;
      updateGameData();
      console.log(this.optionsSet);
      this.toggleOptions();
    },
  },
  mounted() {
    getGameData().then(() => {
      if (!cs().gameData.optionsSet) {
        cs().gameData.optionsSet = this.optionsSet;
      } else {
        this.optionsSet = cs().gameData.optionsSet;
      }
      this.$refs["outside-brightness"].addEventListener("input", () => {
        cs().gameData.optionsSet.outsideBrightness =
          this.optionsSet.outsideBrightness;
      });
    });
  },
};
</script>

<style>
#outside-brightness::-webkit-slider-thumb {
  -webkit-appearance: none;
  -appearance: none;
  width: 40px;
  height: 35px;
  border: solid 4px #f4a261;
  border-radius: 8px;
  cursor: pointer;
}
#outside-brightness::-moz-range-thumb {
  width: 40px;
  height: 35px;
  border: solid 4px #f4a261;
  border-radius: 8px;
  cursor: pointer;
}
</style>
