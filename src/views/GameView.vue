<template lang="pug">

Canvas(class="bg-slate-800 w-screen h-screen" ref='canvas')
  Village(:x1='center.x1', :x2='center.x2' :radius='villageRadius')
  Enemy(:x1='enemyPosition.x1', :x2='enemyPosition.x2', :radius='enemyRadius')
  Character(:x1='enemyAngle().x1', :x2='enemyAngle().x2', :radius='characterRadius')


</template>

<script>
import Village from "@/components/Village.vue";
import Canvas from "@/components/Canvas.vue";
import Enemy from "@/components/Enemy.vue";
import Character from "@/components/Character.vue";

export default {
  components: {
    Village,
    Canvas,
    Enemy,
    Character,
  },
  data() {
    return {
      center: {
        x1: null,
        x2: null,
      },
      villageRadius: 130,
      enemyPosition: {
        x1: 500,
        x2: 1000,
      },
      enemyRadius: 20,
      characterRadius: 30,
    };
  },
  methods: {
    enemyAngle() {
      const legH = this.center.x1 - this.enemyPosition.x1;
      const legV = this.center.x2 - this.enemyPosition.x2;
      const hypo = Math.sqrt(legH ** 2 + legV ** 2);
      const ratio = this.villageRadius / hypo;
      const newLegH = legH * ratio;
      const newLegV = legV * ratio;
      const x1 = this.center.x1 - newLegH;
      const x2 = this.center.x2 - newLegV;
      return { x1, x2 };
    },
  },
  mounted() {
    this.center.x1 = this.$el.clientWidth / 2;
    this.center.x2 = this.$el.clientHeight / 2;
    // setInterval(() => {
    //   this.enemyPosition.x1 += 10;
    // }, 1000 / 60);
  },
};
</script>
