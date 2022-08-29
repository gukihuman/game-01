<template lang="pug">
div(
  class="hidden"
  ref='block'
)
</template>

<script>
const format = ".png";
const files = {
  animation: ["character-move", "character-idle", "goblin-bj", "goblin-bj-cum"],
  common: ["village", "ground"],
};

export default {
  mounted() {
    Object.keys(files).forEach((key) => {
      files[key].forEach((name) => {
        let image = new Image();
        image.src = require(`@/assets/${key}/${name}${format}`);
        this.$refs.block.appendChild(image);
      });
    });
  },
};
</script>
