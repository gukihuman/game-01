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
    let image3 = new Image();
    image3.src = require("@/assets/animation/goblin-bj.png");
    this.$refs.block.appendChild(image3);
    let image4 = new Image();
    image4.src = require("@/assets/village.png");
    this.$refs.block.appendChild(image4);
  },
};
</script>
