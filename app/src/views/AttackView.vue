<template lang="pug">

div

  Field
  Canvas(ref='canvas' class='absolute')
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
      :lifeTime='object.lifeTime'
    )


</template>

<script>
import Canvas from "@/components/Canvas.vue";
import DrawController from "@/components/attack/DrawController.vue";
import Field from "@/components/attack/Field.vue";
import { useCommonStore as cs } from "@/stores/CommonStore";
import { useAttackStore as as } from "@/stores/AttackStore";

export default {
  components: {
    Canvas,
    DrawController,
    Field,
  },
  data() {
    return {
      characterDefend: [],
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
    deathCheck() {
      as().drawObjects.forEach((object, index, array) => {
        if (object.deathTime <= object.lifeTime) {
          array.splice(index, 1);
        }
      });
    },
    moveCycle() {
      as().drawObjects.forEach((object) => {
        object.lifeTime++;

        // enemy
        if (object.type == "enemy") {
          let currentStep = Math.floor(object.lifeTime * object.speed);
          object.pathEnded =
            as().enemyCoordinates[object.path].length - 1 < currentStep;

          if (object.type == "enemy" && !object.pathEnded) {
            object.remainingFrames =
              (as().enemyCoordinates[object.path].length - currentStep) *
              object.speed;
            object.pointX = as().enemyCoordinates[object.path][currentStep].x;
            object.pointY = as().enemyCoordinates[object.path][currentStep].y;
            object.prevPointX =
              as().enemyCoordinates[object.path][currentStep - 1].x;

            if (object.prevPointX > object.pointX) {
              object.direction = "left";
            } else if (object.prevPointX < object.pointX) {
              object.direction = "right";
            }
          } else {
            if (object.status != "in") {
              object.startGameFrame = cs().gameFrame;
              object.status = "in";
              object.deathTime = object.lifeTime + 119;
            }
          }
        }

        // character
        if (object.type == "character") {
          if (!as().isEnemies) {
            object.status = "idle";
          } else {
            object.status = "move";
            let defendEnemy = as().drawObjects.find((enemy) => {
              if (enemy.type == "enemy") {
                return enemy.defender == object.name;
              }
            });
            if (defendEnemy) {
              if (!defendEnemy.readyToDefend) {
                if (defendEnemy.clockDirection == "up") {
                  object.direction = "right";
                  object.position++;
                } else if (defendEnemy.clockDirection == "down") {
                  object.direction = "left";
                  object.position--;
                }
                if (object.position < 0) {
                  object.position = 1439;
                } else if (object.position > 1439) {
                  object.position = 0;
                }
                object.pointX = as().characterCoordinates[object.position].x;
                object.pointY = as().characterCoordinates[object.position].y;
              }
            } else {
              object.status = "idle";
            }
          }
        }
      });
    },
    sortByY() {
      as().drawObjects.sort((a, b) => a.pointY - b.pointY);
    },
  },
  watch: {
    gameFrame(value) {
      if (value % 200 == 0) {
        as().generateEnemy("goblin");
      }
      as().assignCharacters();
      this.deathCheck();
      this.moveCycle();
      this.sortByY();

      this.$refs.canvas.clear();
    },
  },
  mounted() {
    as().generateCharacter("alice");
  },
};
</script>
