<script>
// import spriteIdle from "@/assets/animation/character-idle.json";
// import spriteMove from "@/assets/animation/character-move.json";
// import spriteGoblin from "@/assets/animation/goblin-bj.json";
// import { useCharacterStore } from "@/stores/CharacterStore";
// import { useCommonStore } from "@/stores/CommonStore";
// import { useVillageStore } from "@/stores/VillageStore";

export default {
  inject: ["provider"],
  render() {
    if (!this.provider.context) return;

    const c = this.provider.context;
    const image = new Image();
    let sprite = null;

    // if (useCharacterStore().status === "move") {
    //   image.src = require("@/assets/animation/character-move.png");
    //   sprite = spriteMove;
    // } else if (useCharacterStore().status === "fight") {
    //   image.src = require("@/assets/animation/goblin-bj.png");
    //   sprite = spriteGoblin;
    // } else {
    //   image.src = require("@/assets/animation/character-idle.png");
    //   sprite = spriteIdle;
    // }

    const width = sprite.frames[0].sourceSize.w * 0.2;
    const height = sprite.frames[0].sourceSize.h * 0.2;

    if (
      useCharacterStore().prevPointX > useCharacterStore().pointX ||
      useCharacterStore().status === "idle"
    ) {
      //- right animation
      c.drawImage(
        image,
        sprite.frames[0].sourceSize.w *
          (Math.floor(useCommonStore().gameFrame / 15) % 4),
        0,
        sprite.frames[0].sourceSize.w,
        sprite.frames[0].sourceSize.h,
        useCharacterStore().pointX - width / 2,
        useCharacterStore().pointY - height / 2,
        width,
        height
      );
    } else {
      //- left animation
      c.save();
      c.scale(-1, 1);
      c.drawImage(
        image,
        sprite.frames[0].sourceSize.w *
          (Math.floor(useCommonStore().gameFrame / 15) % 4),
        0,
        sprite.frames[0].sourceSize.w,
        sprite.frames[0].sourceSize.h,
        (useCharacterStore().pointX - width / 2) * -1 - width,
        useCharacterStore().pointY - height / 2,
        width,
        height
      );
      c.restore();
    }
  },
};
</script>
