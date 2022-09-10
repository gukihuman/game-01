<script>
import sprite from "@/assets/stories/common/text-field-in.json";
import { useCommonStore as cs } from "@/stores/CommonStore";

export default {
  inject: ["provider"],
  props: ["drawFrames", "frameStep"],
  render() {
    if (!this.provider.context) return;

    const image = new Image();
    image.src = require("@/assets/stories/common/text-field-in.webp");

    const originWidth = sprite.frames[0].sourceSize.w;
    const originHeight = sprite.frames[0].sourceSize.h;

    const width = originWidth * cs().gameWindowRatio;
    const height = originHeight * cs().gameWindowRatio;

    if (this.drawFrames[this.frameStep] == cs().gameFrame) {
      this.$emit("nextFrameStep");

      this.provider.context.drawImage(
        image,
        sprite.frames[this.frameStep].frame.x,
        sprite.frames[this.frameStep].frame.y,
        originWidth,
        originHeight,
        (cs().gameWindow.w - width) / 2,
        cs().gameWindow.h - height,
        width,
        height
      );
    }
  },
};
</script>
