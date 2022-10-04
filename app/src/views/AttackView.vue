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
      as().drawObjects.forEach((enemy, index, array) => {
        if (enemy.type == "enemy") {
          if (enemy.deathTime <= enemy.lifeTime) {
            array.splice(index, 1);
          }
        }
      });
    },
    statusCheck() {
      as().drawObjects.forEach((character) => {
        if (
          character.type == "character" &&
          (character.status != "idle" || character.status != "move")
        ) {
          if (character.actionFinalGameFrame == cs().gameFrame) {
            character.startGameFrame = cs().gameFrame;
            character.status = character.defendEnemy.name + "-final";
          }
          if (character.freeGameFrame == cs().gameFrame) {
            character.startGameFrame = cs().gameFrame;
            character.status = "idle";
            character.defendEnemy.startGameFrame = cs().gameFrame;
            character.defendEnemy.status = "out";
            character.defendEnemy.deathTime =
              character.defendEnemy.lifeTime + 59;
          }
        }
      });
    },
    _enemyIn(enemy) {
      enemy.startGameFrame = cs().gameFrame;
      enemy.status = "in";
      enemy.deathTime = enemy.lifeTime + 119;
    },
    _enemyMove(enemy) {
      let currentStep = Math.floor(enemy.lifeTime * enemy.speed);
      if (as().enemyCoordinates[enemy.path].length - 1 < currentStep) {
        enemy.pathEnded = true;
      }

      if (!enemy.pathEnded) {
        enemy.remainingFrames = Number(
          (
            (as().enemyCoordinates[enemy.path].length - currentStep) /
            enemy.speed
          ).toFixed(0)
        );
        enemy.pointX = as().enemyCoordinates[enemy.path][currentStep].x;
        enemy.pointY = as().enemyCoordinates[enemy.path][currentStep].y;
        enemy.prevPointX = as().enemyCoordinates[enemy.path][currentStep - 1].x;

        if (enemy.prevPointX > enemy.pointX) {
          enemy.direction = "left";
        } else if (enemy.prevPointX < enemy.pointX) {
          enemy.direction = "right";
        }
      } else {
        if (enemy.status == "move") {
          if (enemy.readyToDefend) {
            let founded = false;
            this.drawObjects.forEach((character) => {
              if (
                character.type == "character" &&
                character.name == enemy.defender
              ) {
                founded = true;
                character.status = enemy.name;
                character.startGameFrame = cs().gameFrame;
                character.direction = enemy.direction;
                character.actionFinalGameFrame = cs().gameFrame + 300;
                character.freeGameFrame = character.actionFinalGameFrame + 119;
                enemy.status = "hide";
              }
            });
            if (!founded) {
              this._enemyIn(enemy);
            }
          } else {
            this._enemyIn(enemy);
          }
        }
      }
    },
    _characterMove(character) {
      if (!as().isEnemies) {
        character.status = "idle";
      } else {
        character.status = "move";
        let defendEnemy = as().drawObjects.find((enemy) => {
          if (enemy.type == "enemy") {
            return enemy.defender == character.name;
          }
        });
        if (defendEnemy) {
          character.defendEnemy = defendEnemy;
          if (
            Math.abs(character.position - defendEnemy.dangerPosition) >
            0 + character.speed
          ) {
            character.prevPointX =
              as().characterCoordinates[character.position].x;
            if (defendEnemy.clockDirection == "up") {
              character.position++;
            } else if (defendEnemy.clockDirection == "down") {
              character.position--;
            }
            if (character.position < 0) {
              character.position = 1439;
            } else if (character.position > 1439) {
              character.position = 0;
            }
            character.pointX = as().characterCoordinates[character.position].x;
            character.pointY = as().characterCoordinates[character.position].y;
            if (character.prevPointX > character.pointX) {
              character.direction = "left";
            } else if (character.prevPointX < character.pointX) {
              character.direction = "right";
            }
          } else {
            defendEnemy.readyToDefend = true;
            character.status = "idle";
          }
        } else {
          character.defendEnemy = null;
          character.status = "idle";
        }
      }
    },
    moveCycle() {
      as().drawObjects.forEach((object) => {
        object.lifeTime++;

        // enemy
        if (object.type == "enemy") {
          this._enemyMove(object);
        }

        // character
        if (
          object.type == "character" &&
          (object.status == "idle" || object.status == "move")
        ) {
          this._characterMove(object);
        }
      });
    },
    sortByY() {
      as().drawObjects.sort((a, b) => a.pointY - b.pointY);
    },
  },
  watch: {
    gameFrame(value) {
      if (value == 50) as().generateEnemy("goblin");
      if (value % 300 == 0) as().generateEnemy("goblin");
      if (value % 15 == 0) as().assignCharacters();
      this.statusCheck();
      this.deathCheck();
      this.moveCycle();
      if (value % 15 == 0) this.sortByY();

      this.$refs.canvas.clear();
    },
  },
  mounted() {
    as().generateCharacter("alice");
  },
};
</script>
