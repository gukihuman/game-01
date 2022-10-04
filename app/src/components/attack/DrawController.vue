<script>
import { useCommonStore as cs } from "@/stores/CommonStore";
import { getFrameIndex } from "@/js/common";
import goblinMoveJson from "@/assets/attack/goblin/move.json";
import goblinHideJson from "@/assets/attack/goblin/hide.json";
import goblinInJson from "@/assets/attack/goblin/in.json";
import goblinOutJson from "@/assets/attack/goblin/out.json";
import aliceMoveJson from "@/assets/attack/alice/move.json";
import aliceGoblinBjJson from "@/assets/attack/alice/goblin.json";
import aliceGoblinFinalJson from "@/assets/attack/alice/goblin-final.json";
import aliceIdleJson from "@/assets/attack/alice/idle.json";

export default {
  inject: ["provider"],
  props: [
    "startGameFrame",
    "type",
    "name",
    "pointX",
    "pointY",
    "status",
    "direction",
    "prevPointX",
  ],
  data() {
    return {
      goblin: {
        ratio: 0.5,
        move: goblinMoveJson,
        in: goblinInJson,
        out: goblinOutJson,
        hide: goblinHideJson,
      },
      alice: {
        ratio: 0.5,
        idle: aliceIdleJson,
        move: aliceMoveJson,
        goblin: aliceGoblinBjJson,
        "goblin-final": aliceGoblinFinalJson,
      },
    };
  },
  render() {
    if (!this.provider.context) return;

    const c = this.provider.context;

    const image = new Image();
    image.src = require(`@/assets/attack/${this.name}/${this.status}.webp`);

    let json = this[this.name][this.status].frames;
    let currentFrame = getFrameIndex(
      this.startGameFrame,
      cs().gameFrame,
      json.length
    );
    let width =
      json[currentFrame].sourceSize.w *
      this[this.name].ratio *
      cs().gameWindowRatio2k;
    let height =
      json[currentFrame].sourceSize.h *
      this[this.name].ratio *
      cs().gameWindowRatio2k;

    if (this.direction == "left") {
      c.drawImage(
        image,
        json[currentFrame].frame.x,
        json[currentFrame].frame.y,
        json[currentFrame].sourceSize.w,
        json[currentFrame].sourceSize.h,
        this.pointX * cs().gameWindowRatio2k - width / 2,
        this.pointY * cs().gameWindowRatio2k - height / 2,
        width,
        height
      );
    } else {
      c.save();
      c.scale(-1, 1);
      c.drawImage(
        image,
        json[currentFrame].frame.x,
        json[currentFrame].frame.y,
        json[currentFrame].sourceSize.w,
        json[currentFrame].sourceSize.h,
        (this.pointX * cs().gameWindowRatio2k - width / 2) * -1 - width,
        this.pointY * cs().gameWindowRatio2k - height / 2,
        width,
        height
      );
      c.restore();
    }
  },
};
</script>
