import { defineStore } from "pinia";
import { useCommonStore as cs } from "@/stores/CommonStore";
import { enemyCharacterRelation } from "@/js/common.mjs";

export const useAttackStore = defineStore("AttackStore", {
  state: () => {
    return {
      enemyCoordinates: JSON.parse(localStorage.getItem("enemy-coordinates")),
      characterCoordinates: JSON.parse(
        localStorage.getItem("character-coordinates")
      ),
      enemyCharacterRelation: JSON.parse(
        localStorage.getItem("enemy-character-relation")
      ),
      freeId: 0,
      villageRadius: 340,
      drawObjects: [],
      dangerPositions: [],
      enemies: {
        goblin: {
          speed: 1.5,
        },
      },
    };
  },
  getters: {
    activePaths: (state) => {
      let activePaths = [];
      state.drawObjects.forEach((object) => {
        if (object.type == "enemy") {
          activePaths.push(object.path);
        }
      });
      return activePaths;
    },
    isEnemies: (state) => {
      let isEnemies = false;
      state.drawObjects.forEach((object) => {
        if (object.type == "enemy") {
          isEnemies = true;
        }
      });
      if (isEnemies) {
        return true;
      } else {
        return false;
      }
    },
  },
  actions: {
    _willMakeIt(difference, speed, remainingFrames) {
      let absDifference = difference;
      if (difference > 720) {
        absDifference = Math.abs(difference - 1440);
      } else if (difference < -720) {
        absDifference = difference + 1440;
      }
      if (absDifference / speed <= remainingFrames) {
        console.log("make it");
        return true;
      } else {
        console.log("dont make it");
        return false;
      }
    },
    assignCharacters() {
      this.drawObjects.forEach((enemy) => {
        console.log("nulled");
        if (enemy.type == "enemy") {
          enemy.defender == null;
        }
      });
      if (this.isEnemies) {
        this.drawObjects.forEach((character) => {
          if (character.type == "character") {
            let closestDistance = Infinity;
            let closestFreeEnemy;
            let drawObjects = this.drawObjects;
            let getWillMakeIt = this._willMakeIt;
            function _getFreeEnemy() {
              let moreEnemies = false;
              drawObjects.forEach((enemy, index) => {
                if (enemy.type == "enemy") {
                  if (
                    enemy.remainingFrames <= closestDistance &&
                    !enemy.defender &&
                    !enemy.cantReach.includes(character.name)
                  ) {
                    moreEnemies = true;
                    closestDistance = enemy.remainingFrames;
                    closestFreeEnemy = drawObjects[index];
                  }
                }
              });
              if (moreEnemies) {
                let difference =
                  closestFreeEnemy.dangerPosition - character.position;
                let willMakeIt = getWillMakeIt(
                  difference,
                  character.speed,
                  closestFreeEnemy.remainingFrames
                );
                if (willMakeIt) {
                  drawObjects.forEach((enemy) => {
                    if (enemy.defender == character.name) {
                      enemy.defender == null;
                    }
                  });
                  console.log(
                    "Defender is set for ",
                    closestFreeEnemy.name,
                    closestFreeEnemy.id
                  );
                  closestFreeEnemy.defender = character.name;
                  if (difference > 720) {
                    closestFreeEnemy.clockDirection = "down";
                  } else if (
                    difference > 0 + character.speed &&
                    difference <= 720
                  ) {
                    closestFreeEnemy.clockDirection = "up";
                  } else if (
                    difference > -720 &&
                    difference < 0 - character.speed
                  ) {
                    closestFreeEnemy.clockDirection = "down";
                  } else if (difference <= -720) {
                    closestFreeEnemy.clockDirection = "up";
                  } else {
                    closestFreeEnemy.readyToDefend = true;
                  }
                  return;
                } else {
                  closestFreeEnemy.cantReach.push(character.name);
                  _getFreeEnemy();
                }
              }
            }
            _getFreeEnemy();
          }
        });
      }
    },
    _cleanPath(path) {
      let cleanedPath = path;
      if (this.activePaths.length < 100) {
        this.activePaths.forEach((existingPath) => {
          if (existingPath == cleanedPath) {
            cleanedPath += 1;
            if (cleanedPath > 99) {
              cleanedPath = 0;
            }
            cleanedPath = this._cleanPath(cleanedPath);
          }
        });
      } else {
        cleanedPath = false;
      }
      return cleanedPath;
    },
    generateEnemy(name) {
      let path = Math.floor(Math.random() * 100);
      path = this._cleanPath(path);
      if (path) {
        this.drawObjects.push({
          id: this.freeId,
          startGameFrame: cs().gameFrame,
          type: "enemy",
          name: name,
          speed: this.enemies[name].speed,
          path: path,
          lifeTime: 1,
          deathTime: Infinity,
          direction: "right",
          prevPointX: 0,
          pointX: 0,
          pointY: 0,
          remainingFrames:
            this.enemyCoordinates[path].length * this.enemies[name].speed,
          status: "move",
          dangerPosition: this.enemyCharacterRelation[path],
          defender: null,
          clockDirection: null,
          readyToDefend: false,
          cantReach: [],
        });
        this.freeId++;
      }
    },
    generateCharacter(name) {
      this.drawObjects.push({
        startGameFrame: cs().gameFrame,
        type: "character",
        speed: 1,
        name: name,
        lifeTime: 1,
        deathTime: Infinity,
        direction: "right",
        position: 0,
        prevPointX: this.characterCoordinates[0].x,
        pointX: this.characterCoordinates[0].x,
        pointY: this.characterCoordinates[0].y,
        status: "idle",
      });
    },
  },
});
