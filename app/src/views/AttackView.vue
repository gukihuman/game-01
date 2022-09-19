<template lang="pug">

div

  Field
  Canvas(ref='canvas' class='absolute')
    Character
    DrawController(
      v-for='(object, index) in drawObjects'
      :key='index'
      :startGameFrame='object.startGameFrame'
      :type='object.type'
      :name='object.name'
      :direction='object.direction'
      :prevPointX='object.prevPointX'
      :pointX='object.pointX'
      :pointY='object.pointY'
      :status='object.status'
    )


</template>

<script>
import Canvas from "@/components/Canvas.vue";
import DrawController from "@/components/attack/DrawController.vue";
import Field from "@/components/attack/Field.vue";
import Village from "@/components/attack/Village.vue";
import Enemy from "@/components/attack/Enemy.vue";
import Character from "@/components/attack/Character.vue";
import { useCommonStore as cs } from "@/stores/CommonStore";
import { useAttackStore as as } from "@/stores/AttackStore";
import { useVillageStore } from "@/stores/VillageStore";
import { useEnemiesStore } from "@/stores/EnemiesStore";
import { useCharacterStore } from "@/stores/CharacterStore";

export default {
  components: {
    Canvas,
    DrawController,
    Field,
    Village,
    Enemy,
    Character,
  },
  data() {
    return {
      gameSpeed: 1,
      center: {
        pointX: null,
        pointY: null,
      },
    };
  },
  computed: {
    enemies() {
      return useEnemiesStore().enemies;
    },
    drawObjects() {
      return as().drawObjects;
    },
    gameFrame() {
      return cs().gameFrame;
    },
  },
  methods: {
    moveCycle() {
      as().drawObjects.forEach((object) => {
        let pathStep = Math.floor(object.lifetime * object.speed);
        object.pathEnded = as().coordinates[object.path].length - 1 < pathStep;

        if (object.type == "enemy" && !object.pathEnded) {
          object.pointX = as().coordinates[object.path][pathStep].x;
          object.pointY = as().coordinates[object.path][pathStep].y;
          object.prevPointX = as().coordinates[object.path][pathStep - 1].x;

          if (object.prevPointX > object.pointX) {
            object.direction = "left";
          } else if (object.prevPointX < object.pointX) {
            object.direction = "right";
          }
        }

        object.lifetime++;
      });
    },
    sortByY() {
      as().drawObjects.sort((a, b) => {
        if (a.pointY < b.pointY) {
          return -1;
        } else if (a.pointY > b.pointY) {
          return 1;
        }
        return 0;
      });
    },
  },
  watch: {
    gameFrame(value) {
      if (value % 300 == 0 && value < 1300) {
        as().generateEnemy("goblin");
        console.log("generateEnemy");
      }

      this.moveCycle();
      this.sortByY();

      // old

      // if (
      //   useCharacterStore().status === "idle" ||
      //   useCharacterStore().status === "move"
      // ) {
      //   useCharacterStore().move();
      // }

      this.$refs.canvas.clear();
    },
  },
  mounted() {
    this.center.pointX = this.$el.clientWidth / 2;
    this.center.pointY = this.$el.clientHeight / 2;

    cs().centerPoint.x = cs().gameWindow.w / 2;
    cs().centerPoint.y = cs().gameWindow.h / 2;

    //main draw loop
  },
};
</script>
