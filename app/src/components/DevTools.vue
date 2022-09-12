<template lang="pug">

div
  p(class='absolute top-40 right-5 z-20') {{counter}}
  button(
    @click='buttonAction'
    class='absolute top-48 right-5 z-20 bg-slate-400 opacity-50 w-7 h-7 \
    rounded'
  )
  form(@submit.prevent='takeInput' v-if='false')
    input(
      v-model='input'
      class='absolute top-64 right-5 z-20 w-8 opacity-50 text-center'
    )

</template>

<script>
import { useCommonStore as cs } from "@/stores/CommonStore";

export default {
  data() {
    return {
      input: "",
    };
  },
  methods: {
    takeInput() {
      cs().gameData.story.step = this.input;
      this.input = "";
    },
    buttonAction() {
      cs().gameData.story.step = 0;
      cs().gameData.story.scene = "forest";
      this.$router.push("/");
      console.log("Button activated");
    },
  },
  computed: {
    counter() {
      return cs().gameFrame;
    },
  },
};
</script>
