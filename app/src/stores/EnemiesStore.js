import { defineStore } from "pinia";
import { useCommonStore as cs } from "./CommonStore";
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
      const randomX = Math.random() * cs().gameWindow.w;
      const randomY = Math.random() * cs().gameWindow.h;
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
          pointY = cs().gameWindow.y;
        }
      } else {
        // left or right
        if (Math.random() > 0.5) {
          // left
          pointX = 0;
          pointY = randomY;
        } else {
          // right
          pointX = cs().gameWindow.w;
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

      // dev generation
      // const pointX = cs().centerPoint.x;
      // const pointY = cs().gameWindow.h;

      const distance = getTriangle(pointX, pointY);
      const speed = this.enemySpeed;
      const ratio = this._getRatio(distance.hypo, speed);
      const status = "move";
      const prevPointX = pointX;

      this.enemies.push({
        pointX,
        pointY,
        ...distance,
        ratio,
        speed,
        status,
        prevPointX,
      });
    },
    move() {
      this.enemies.forEach((enemy) => {
        if (enemy.status === "fight") return;
        if (enemy.hypo < useVillageStore().villageRadius + 10) {
          enemy.status = "fight";
          return;
        }

        enemy.prevPointX = enemy.pointX;
        enemy.ratio = this._getRatio(enemy.hypo, enemy.speed);
        enemy.hypo -= enemy.speed;
        enemy.legH = Number((enemy.legH * enemy.ratio).toFixed(2));
        enemy.legV = Number((enemy.legV * enemy.ratio).toFixed(2));
        enemy.pointX = cs().centerPoint.x - enemy.legH;
        enemy.pointY = cs().centerPoint.y - enemy.legV;
      });
    },
  },
});
