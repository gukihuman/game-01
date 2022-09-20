<script>
import { useEnemiesStore } from "@/stores/EnemiesStore";
import { useCommonStore } from "@/stores/CommonStore";
// import spriteMove from "@/assets/animation/goblin-move.json";

export default {
  inject: ["provider"],
  props: ["pointX", "pointY", "status", "prevPointX"],
  render() {
    if (!this.provider.context) return;

    const c = this.provider.context;

    const image = new Image();
    let width = null;
    let height = null;
    let sprite = null;

    if (this.status === "move") {
      // image.src = require("@/assets/animation/goblin-move.png");
      sprite = spriteMove;
      width = sprite.frames[0].sourceSize.w * 0.2;
      height = sprite.frames[0].sourceSize.h * 0.2;
    } else {
      sprite = spriteMove;
      image.src = "";
      width = sprite.frames[0].sourceSize.w * 0.2;
      height = sprite.frames[0].sourceSize.h * 0.2;
    }

    if (this.prevPointX > this.pointX) {
      //- right animation
      c.drawImage(
        image,
        sprite.frames[0].sourceSize.w *
          (Math.floor(useCommonStore().gameFrame / 15) % 4),
        0,
        sprite.frames[0].sourceSize.w,
        sprite.frames[0].sourceSize.h,
        this.pointX - width / 2,
        this.pointY - height / 2,
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
        (this.pointX - width / 2) * -1 - width,
        this.pointY - height / 2,
        width,
        height
      );
      c.restore();
    }
  },
};
</script>
