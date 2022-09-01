<template lang="pug">
div(
  class="hidden"
  ref='block'
)
</template>

<script>
const png = ".png";
const webp = ".webp";
const pngFiles = {
  animation: ["character-move", "character-idle", "goblin-bj", "goblin-bj-cum"],
  common: ["village", "ground"],
};
const webpFiles = {
  "stories/common": ["text-field-out", "text-field-in"],
  "stories/prologue/forest": [
    "forest",
    "angry",
    "drill",
    "eyes-side",
    "tongue",
  ],
};

function putIn(files, format) {
  let images = [];
  Object.keys(files).forEach((key) => {
    files[key].forEach((name) => {
      let image = new Image();
      image.src = require(`@/assets/${key}/${name}${format}`);
      images.push(image);
    });
  });
  return images;
}

export default {
  mounted() {
    putIn(pngFiles, png).forEach((image) =>
      this.$refs.block.appendChild(image)
    );
    putIn(webpFiles, webp).forEach((image) =>
      this.$refs.block.appendChild(image)
    );
  },
};
</script>
