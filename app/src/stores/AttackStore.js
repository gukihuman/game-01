import { defineStore } from "pinia";
import { useCommonStore as cs } from "@/stores/CommonStore";

export const useAttackStore = defineStore("AttackStore", {
  state: () => {
    return {
      coordinates: JSON.parse(localStorage.getItem("coordinates")),
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
        direction: "left",
        prevPointX: 0,
        pointX: 0,
        pointY: 0,
        status: "move",
      });
      this.freeId++;
    },
  },
});
