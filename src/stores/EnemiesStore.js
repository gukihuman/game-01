import { defineStore } from "pinia";
import { useCommonStore } from "./CommonStore";
import { useVillageStore } from "./VillageStore";
import { getTriangle } from "@/js/common";

export const useEnemiesStore = defineStore("EnemiesStore", {
  state: () => {
    return {
      enemySpeed: 1,
      enemyRadius: 20,
      enemies: [],
      statusAll: "move",
    };
  },
  actions: {
    _generateRandomSidePosition() {
      const randomX = Math.random() * useCommonStore().canvas.width;
      const randomY = Math.random() * useCommonStore().canvas.height;
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
          pointY = useCommonStore().canvas.height;
        }
      } else {
        // left or right
        if (Math.random() > 0.5) {
          // left
          pointX = 0;
          pointY = randomY;
        } else {
          // right
          pointX = useCommonStore().canvas.width;
          pointY = randomY;
        }
      }
      return { pointX: Math.floor(pointX), pointY: Math.floor(pointY) };
    },
    _getRatio(hypo, speed) {
      return Number(((hypo - speed) / hypo).toFixed(3));
    },
    generateEnemy() {
      const { pointX, pointY } = this._generateRandomSidePosition();
      const distance = getTriangle(pointX, pointY);
      const speed = this.enemySpeed;
      const ratio = this._getRatio(distance.hypo, speed);
      const status = "move";
      this.enemies.push({ pointX, pointY, ...distance, ratio, speed, status });
    },
    move() {
      this.enemies.forEach((enemy) => {
        if (enemy.status === "fight") return;
        if (enemy.hypo < useVillageStore().villageRadius + 50) {
          enemy.status = "fight";
          return;
        }

        enemy.ratio = this._getRatio(enemy.hypo, enemy.speed);
        enemy.hypo -= enemy.speed;
        enemy.legH = Number((enemy.legH * enemy.ratio).toFixed(2));
        enemy.legV = Number((enemy.legV * enemy.ratio).toFixed(2));
        enemy.pointX = useCommonStore().centerPoint.x - enemy.legH;
        enemy.pointY = useCommonStore().centerPoint.y - enemy.legV;
      });
    },
  },
});
