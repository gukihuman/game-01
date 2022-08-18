import { defineStore } from "pinia";
import { useVillageStore } from "./VillageStore";
import { useCommonStore } from "./CommonStore";
import { useEnemiesStore } from "./EnemiesStore";

export const useCharacterStore = defineStore("CharacterStore", {
  state: () => {
    return {
      characterRadius: 30,
      prevPointX: 0,
      pointX: useCommonStore().centerPoint.x,
      pointY: useCommonStore().centerPoint.y - useVillageStore().villageRadius,
      status: "idle",
      speed: 0.005,
    };
  },
  actions: {
    move() {
      if (useEnemiesStore().enemies.length === 0) {
        this.status = "idle";
      } else {
        this.status = "move";
      }
      let legH = useCommonStore().centerPoint.x - this.pointX;
      let legV = useCommonStore().centerPoint.y - this.pointY;
      let targetLegH =
        useCommonStore().centerPoint.x - useVillageStore().closestEnemyPoint.x;
      let targetLegV =
        useCommonStore().centerPoint.y - useVillageStore().closestEnemyPoint.y;
      let characterAngle = Math.atan2(legV, legH);
      let targetAngle = Math.atan2(targetLegV, targetLegH);
      let diff = characterAngle - targetAngle;

      if (Math.floor(useCommonStore().gameFrame / 30) % 2) {
        this.prevPointX = this.pointX;
      }

      if ((diff < 0.05 && diff > 0) || (diff > -0.05 && diff < 0)) {
        let enemyStatus = null;
        useEnemiesStore().enemies.forEach((enemy) => {
          if (enemy.status == "fight") enemyStatus = "fight";
        });
        if (enemyStatus === "fight") {
          this.status = "fight";
        } else {
          this.status = "idle";
        }
        return;
      }

      let newAngle = null;
      if (
        (targetAngle < characterAngle &&
          targetAngle + Math.PI < characterAngle) ||
        (targetAngle > characterAngle && targetAngle - Math.PI < characterAngle)
      ) {
        newAngle = characterAngle + this.speed;
      } else {
        newAngle = characterAngle - this.speed;
      }

      let newLegH = Math.cos(newAngle) * useVillageStore().villageRadius;
      let newLegV = Math.sin(newAngle) * useVillageStore().villageRadius;

      this.pointX = Number(
        (useCommonStore().centerPoint.x - newLegH).toFixed(2)
      );
      this.pointY = Number(
        (useCommonStore().centerPoint.y - newLegV).toFixed(2)
      );
    },
  },
});
