import { defineStore } from "pinia";
import { useCommonStore as cs } from "@/stores/CommonStore";

export const useAttackStore = defineStore("AttackStore", {
  state: () => {
    return {
      enemyCoordinates: JSON.parse(localStorage.getItem("enemy-coordinates")),
      characterCoordinates: JSON.parse(
        localStorage.getItem("character-coordinates")
      ),
      freeId: 0,
      villageRadius: 340,
      drawObjects: [],
      enemies: {
        goblin: {
          speed: 1.5,
        },
      },
    };
  },
  actions: {
    generateEnemy(name) {
      let path = Math.floor(Math.random() * 100);
      this.drawObjects.push({
        id: this.freeId,
        startGameFrame: cs().gameFrame,
        type: "enemy",
        name: name,
        speed: this.enemies[name].speed,
        path: path,
        pathEnded: false,
        lifetime: 1,
        direction: "right",
        prevPointX: 0,
        pointX: 0,
        pointY: 0,
        status: "move",
      });
      this.freeId++;
    },
    generateCharacter(name) {
      this.drawObjects.push({
        startGameFrame: cs().gameFrame,
        type: "character",
        name: name,
        direction: "right",
        position: 0,
        prevPointX: 0,
        pointX: 23,
        pointY: 33,
        status: "idle",
      });
    },
  },
});
