<template lang="pug">

div

  Prologue(class='absolute top-0')
  TextField

  button(@click='mainMenu()' class='absolute top-4 left-4') Main menu

</template>

<script>
import Prologue from "@/components/stories/Prologue";
import TextField from "@/components/stories/common/TextField.vue";

export default {
  components: {
    Prologue,
    TextField,
  },
  methods: {
    mainMenu() {
      this.$router.push("/");
    },
  },
};
</script>
