import { defineStore } from "pinia";
import { useCommonStore as cs } from "@/stores/CommonStore";

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
        if (object.type == "enemy" && !object.pathEnded) {
          isEnemies = true;
        }
      });
      return isEnemies;
    },
  },
  actions: {
    _nullEnemiesDefenders() {
      this.drawObjects.forEach((enemy) => {
        if (enemy.type == "enemy") {
          enemy.defender = null;
          enemy.clockDirection = null;
        }
      });
    },
    _canReach(difference, characterSpeed, remainingFrames) {
      let absDifference = Math.abs(difference);
      if (difference > 720) {
        absDifference = Math.abs(difference - 1440);
      } else if (difference < -720) {
        absDifference = difference + 1440;
      }
      return absDifference / characterSpeed < remainingFrames ? true : false;
    },
    _defendEnemy(character) {
      let pickedEnemy = null;
      let minRemainingFrames = Infinity;
      this.drawObjects.forEach((enemy) => {
        if (enemy.type == "enemy") {
          if (
            !enemy.pathEnded &&
            !enemy.defender &&
            !enemy.cantReach.includes(character.name) &&
            enemy.remainingFrames < minRemainingFrames
          ) {
            minRemainingFrames = enemy.remainingFrames;
            pickedEnemy = enemy;
          }
        }
      });
      if (pickedEnemy) {
        let difference = pickedEnemy.dangerPosition - character.position;
        let canReach = this._canReach(
          difference,
          character.speed,
          pickedEnemy.remainingFrames
        );
        // console.log(pickedEnemy.name, pickedEnemy.id, canReach);
        if (!canReach) {
          pickedEnemy.cantReach.push(character.name);
          pickedEnemy = this._defendEnemy(character);
        }
      }
      return pickedEnemy;
    },
    assignCharacters() {
      this._nullEnemiesDefenders();
      if (this.isEnemies) {
        this.drawObjects.forEach((character) => {
          if (character.type == "character") {
            let defendEnemy = this._defendEnemy(character);
            if (defendEnemy) {
              let difference = defendEnemy.dangerPosition - character.position;
              defendEnemy.defender = character.name;
              if (difference > 720) {
                defendEnemy.clockDirection = "down";
              } else if (
                difference > 0 + character.speed &&
                difference <= 720
              ) {
                defendEnemy.clockDirection = "up";
              } else if (
                difference > -720 &&
                difference < 0 - character.speed
              ) {
                defendEnemy.clockDirection = "down";
              } else if (difference <= -720) {
                defendEnemy.clockDirection = "up";
              } else {
                defendEnemy.clockDirection = "down";
                defendEnemy.readyToDefend = true;
              }
            }
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
      let speed = this.enemies[name].speed;
      if (path) {
        this.drawObjects.push({
          id: this.freeId,
          startGameFrame: cs().gameFrame,
          type: "enemy",
          name: name,
          speed: speed,
          path: path,
          lifeTime: 1,
          deathTime: Infinity,
          direction: "right",
          prevPointX: 0,
          pointX: 0,
          pointY: 0,
          pathEnded: false,
          remainingFrames: Number(
            (this.enemyCoordinates[path].length / speed).toFixed(0)
          ),
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
        prevPointX: null,
        pointX: this.characterCoordinates[0].x,
        pointY: this.characterCoordinates[0].y,
        status: "idle",
      });
    },
  },
});
