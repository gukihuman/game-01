import { defineStore } from "pinia";

export const useCommonStore = defineStore("CommonStore", {
  state: () => {
    return {
      gameFrame: 0,
      canvas: { width: null, height: null },
      centerPoint: { x: null, y: null },
      window: { width: null, height: null },
    };
  },
});
