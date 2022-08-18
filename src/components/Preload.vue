<template lang="pug">
div(
  class="hidden"
  ref='block'
)
</template>

<script>
export default {
  mounted() {
    let image = new Image();
    image.src = require("@/assets/animation/character-move.png");
    this.$refs.block.appendChild(image);
    let image2 = new Image();
    image2.src = require("@/assets/animation/character-idle.png");
    this.$refs.block.appendChild(image2);
  },
};
</script>
