<template lang="pug">

div

  Prologue(v-if='isPrologue' )
  button(@click='mainMenu()' class='absolute top-4 left-4') Main menu

</template>

<script>
import Prologue from "@/components/stories/Prologue";
import { useCommonStore as cs } from "@/stores/CommonStore";

export default {
  components: {
    Prologue,
  },
  methods: {
    mainMenu() {
      this.$router.push("/");
    },
  },
  computed: {
    isPrologue() {
      if (cs().gameData.story.stage == "prologue") {
        return true;
      } else {
        return false;
      }
    },
  },
};
</script>
