import { defineStore } from "pinia";
import { useEnemiesStore } from "./EnemiesStore";
import { useCommonStore } from "./CommonStore";

export const useVillageStore = defineStore("VillageStore", {
  state: () => {
    return {
      villageRadius: 150,
      closestEnemyPoint: { x: useCommonStore().centerPoint.x, y: 0 },
    };
  },
  actions: {
    _getClosestEnemyPosition() {
      let hypo = Infinity;
      let pointX = null;
      let pointY = null;
      useEnemiesStore().enemies.forEach((enemy) => {
        if (enemy.hypo < hypo) {
          hypo = enemy.hypo;
          pointX = enemy.pointX;
          pointY = enemy.pointY;
        }
      });
      return { pointX, pointY };
    },
    updateClosestEnemyPoint() {
      if (useEnemiesStore().enemies.length === 0) return;

      let legH = null;
      let legV = null;
      let { pointX, pointY } = this._getClosestEnemyPosition();
      legH = useCommonStore().centerPoint.x - pointX;
      legV = useCommonStore().centerPoint.y - pointY;
      const hypo = Math.sqrt(legH ** 2 + legV ** 2);
      const ratio = useVillageStore().villageRadius / hypo;
      const newLegH = legH * ratio;
      const newLegV = legV * ratio;
      this.closestEnemyPoint.x = Number(
        (useCommonStore().centerPoint.x - newLegH).toFixed(2)
      );
      this.closestEnemyPoint.y = Number(
        (useCommonStore().centerPoint.y - newLegV).toFixed(2)
      );
    },
  },
});
