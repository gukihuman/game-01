<template lang="pug">

//- wrapper
div

  canvas(ref="my-canvas")
    slot

</template>

<script>
export default {
  data() {
    return {
      provider: {
        context: null,
      },
    };
  },

  provide() {
    return {
      provider: this.provider,
    };
  },
  mounted() {
    this.provider.context = this.$refs["my-canvas"].getContext("2d");
    this.$refs["my-canvas"].width = this.$el.clientWidth;
    this.$refs["my-canvas"].height = this.$el.clientHeight;
  },
};
</script>
