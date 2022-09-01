import { defineStore } from "pinia";

export const useCommonStore = defineStore("CommonStore", {
  state: () => {
    return {
      gameFrame: 0,
      canvas: { width: null, height: null },
      centerPoint: { x: null, y: null },
      window: { width: null, height: null },
      gameWindow: { width: null, height: null },
      logged: false,
      updateCanvas: 0,
      fullscreen: false,
      gameData: {
        optionsSet: null,
      },
    };
  },
});
