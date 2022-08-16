<template lang="pug">

Canvas(class="bg-slate-800 w-screen h-screen" ref='canvas')
  Village(:x1='x1', :x2='x2' :radius='100')


</template>

<script>
import Village from "@/components/Village.vue";
import Canvas from "@/components/Canvas.vue";

export default {
  components: {
    Village,
    Canvas,
  },
  data() {
    return {
      x1: null,
      x2: null,
    };
  },
  mounted() {
    this.x1 = this.$el.clientWidth / 2;
    this.x2 = this.$el.clientHeight / 2;
  },
};
</script>
