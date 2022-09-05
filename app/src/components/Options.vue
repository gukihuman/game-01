<template lang="pug">

div
  div
    label(htmlFor='outside-brightness')
      p Outside Brightness
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
  
  div
    label(htmlFor='text-speed')
      p Text Speed: {{this.optionsSet.textSpeed}}
    input(
      id='text-speed'
      type='range'
      min='1'
      max='100'
      v-model='optionsSet.textSpeed'
      class="w-80 h-30 bg-slate-700 relative \
      rounded-lg appearance-none"
    )
  div
    label(htmlFor='text-immediately')
      p(class='inline-block') Text Immediately
    input(
      id='text-immediately'
      type='checkbox'
      v-model='optionsSet.textImmediately'
      class="w-6 h-6 "
      )

  Text(
    :textSpeed='optionsSet.textSpeed'
    :textImmediately='optionsSet.textImmediately'
    class='relative -top-[350px] -left-[300px] '
    )

  button(@click='saveChanges()') OK
  button(@click='cancel()') Cancel

</template>

<script>
import { useCommonStore as cs } from "@/stores/CommonStore";
import { updateGameData } from "@/js/common";
import Text from "@/components/stories/common/Text";

export default {
  props: ["toggleOptions"],
  components: {
    Text,
  },
  data() {
    return {
      listeners: {
        outsideBrightness: null,
      },
      startingOptionsSet: {},
      optionsSet: {},
      frameStep: 0,
    };
  },
  methods: {
    saveChanges() {
      cs().gameData.optionsSet = this.optionsSet;
      updateGameData();
      console.log("gameData.optionsSet is pushed to the server.");
      console.log(cs().gameData.optionsSet);
      this.toggleOptions();
    },
    cancel() {
      cs().gameData.optionsSet = this.startingOptionsSet;
      console.log("gameData.optionsSet set to starting state.");
      console.log(cs().gameData.optionsSet);
      this.toggleOptions();
    },
  },
  mounted() {
    this.startingOptionsSet = JSON.parse(
      JSON.stringify(cs().gameData.optionsSet)
    );
    this.optionsSet = cs().gameData.optionsSet;

    this.listeners.outsideBrightness = this.$refs[
      "outside-brightness"
    ].addEventListener("input", () => {
      cs().gameData.optionsSet.outsideBrightness =
        this.optionsSet.outsideBrightness;
    });
  },
  unmounted() {
    clearTimeout(this.listeners.outsideBrightness);
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
#text-speed::-webkit-slider-thumb {
  -webkit-appearance: none;
  -appearance: none;
  width: 40px;
  height: 25px;
  background-color: #f4a261;
  border-radius: 8px;
  cursor: pointer;
}
#text-speed::-moz-range-thumb {
  width: 40px;
  height: 25px;
  background-color: #f4a261;
  border-radius: 8px;
  cursor: pointer;
}
</style>
