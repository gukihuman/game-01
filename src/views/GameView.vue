<template lang="pug">

Canvas(class="bg-slate-800 w-screen h-screen" ref='canvas')
  Village(
    :pointX ='center.pointX'
    :pointY ='center.pointY'
    :radius ='villageRadius'
    :update ='update'
  )
  Enemy(
    v-for ='(enemy, index) in enemies'
    :key = 'index'
    :pointX ='enemy.pointX'
    :pointY ='enemy.pointY'
    :radius ='enemyRadius'
    :update ='update'
  )
  Character(
    :pointX ='characterPosition().pointX'
    :pointY ='characterPosition().pointY'
    :radius ='characterRadius'
    :update ='update'
  )


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
        pointX: null,
        pointY: null,
      },
      villageRadius: 130,
      enemyRadius: 20,
      characterRadius: 30,
      update: 0,
      enemies: [],
    };
  },
  methods: {
    clearCanvas() {
      if (!this.$refs.canvas) return;
      this.$refs.canvas.provider.context.clearRect(
        0,
        0,
        this.$el.clientWidth,
        this.$el.clientHeight
      );
    },
    characterPosition() {
      let legH = null;
      let legV = null;
      if (this.enemies.length === 0) {
        legH = this.center.pointX;
        legV = this.center.pointY;
      } else {
        legH = this.center.pointX - this.enemies[0].pointX;
        legV = this.center.pointY - this.enemies[0].pointY;
      }
      const hypo = Math.sqrt(legH ** 2 + legV ** 2);
      const ratio = this.villageRadius / hypo;
      const newLegH = legH * ratio;
      const newLegV = legV * ratio;
      const pointX = this.center.pointX - newLegH;
      const pointY = this.center.pointY - newLegV;
      return { pointX, pointY };
    },
    generateEnemyPosition() {
      const randomX = Math.random() * this.$el.clientWidth;
      const randomY = Math.random() * this.$el.clientHeight;
      let pointX = null;
      let pointY = null;

      // top/bottom or left/right
      if (Math.random() > 0.5) {
        // top or bottom
        if (Math.random() > 0.5) {
          // top
          pointX = randomX;
          pointY = 0;
        } else {
          // bottom
          pointX = randomX;
          pointY = this.$el.clientHeight;
        }
      } else {
        // left or right
        if (Math.random() > 0.5) {
          // left
          pointX = 0;
          pointY = randomY;
        } else {
          // right
          pointX = this.$el.clientWidth;
          pointY = randomY;
        }
      }
      return { pointX, pointY };
    },
    generateEnemy() {
      const { pointX, pointY } = this.generateEnemyPosition();
      this.enemies.push({
        pointX: pointX,
        pointY: pointY,
      });
    },
    enemyMove(pointX, pointY, speed) {
      const legH = this.center.pointX - pointX;
      const legV = this.center.pointY - pointY;
      const hypo = Math.sqrt(legH ** 2 + legV ** 2);
      const ratio = (hypo - speed) / hypo;
      const newLegH = legH * ratio;
      const newLegV = legV * ratio;
      const newPointX = this.center.pointX - newLegH;
      const newPointY = this.center.pointY - newLegV;
      return { newPointX, newPointY, hypo };
    },
  },
  mounted() {
    this.center.pointX = this.$el.clientWidth / 2;
    this.center.pointY = this.$el.clientHeight / 2;
    this.generateEnemy();

    //main draw loop
    setInterval(() => {
      this.clearCanvas();
      this.enemies.forEach((enemy) => {
        const { newPointX, newPointY, hypo } = this.enemyMove(
          enemy.pointX,
          enemy.pointY,
          2
        );
        if (hypo > this.villageRadius + 50) {
          enemy.pointX = newPointX;
          enemy.pointY = newPointY;
        }
      });
      this.update++;
    }, 1000 / 60);

    setInterval(() => {
      this.generateEnemy();
    }, 5000);
  },
};
</script>
