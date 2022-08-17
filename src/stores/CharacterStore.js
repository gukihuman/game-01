import { defineStore } from "pinia";
import { useVillageStore } from "./VillageStore";
import { useCommonStore } from "./CommonStore";

export const useCharacterStore = defineStore("CharacterStore", {
  state: () => {
    return {
      characterRadius: 30,
      pointX: useCommonStore().centerPoint.x,
      pointY: useCommonStore().centerPoint.y - useVillageStore().villageRadius,
      status: "idle",
      speed: 0.02,
    };
  },
  actions: {
    move() {
      let legH = useCommonStore().centerPoint.x - this.pointX;
      let legV = useCommonStore().centerPoint.y - this.pointY;
      let targetLegH =
        useCommonStore().centerPoint.x - useVillageStore().closestEnemyPoint.x;
      let targetLegV =
        useCommonStore().centerPoint.y - useVillageStore().closestEnemyPoint.y;
      let characterAngle = Math.atan2(legV, legH);
      let targetAngle = Math.atan2(targetLegV, targetLegH);
      // if (targetLegH < 0) {
      //   console.log("run");
      //   targetAngle += Math.PI;
      // }
      let diff = characterAngle - targetAngle;

      if ((diff < 0.05 && diff > 0) || (diff > -0.05 && diff < 0)) return;

      console.log("---Start");
      console.log(characterAngle * (180 / Math.PI));
      console.log("---");
      console.log(targetAngle * (180 / Math.PI));
      console.log("---End");
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

      this.pointX = useCommonStore().centerPoint.x - newLegH;
      this.pointY = useCommonStore().centerPoint.y - newLegV;
    },
  },
});
