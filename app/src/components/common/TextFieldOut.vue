<script>
import sprite from "@/assets/stories/common/text-field-out.json";
import { useCommonStore } from "@/stores/CommonStore";

export default {
  inject: ["provider"],
  props: ["time"],
  render() {
    if (!this.provider.context) return;

    const c = this.provider.context;
    const image = new Image();

    image.src = require("@/assets/stories/common/text-field-out.webp");

    const width = sprite.frames[0].sourceSize.w;
    const height = sprite.frames[0].sourceSize.h;
    const showWidth = (width * useCommonStore().gameWindow.width) / 1920;
    const showHeight = (height * useCommonStore().gameWindow.height) / 1080;
    console.log(showWidth, showHeight);

    if (this.time < 16) {
      c.drawImage(
        image,
        sprite.frames[this.time].frame.x,
        sprite.frames[this.time].frame.y,
        width,
        height,
        (useCommonStore().gameWindow.width - showWidth) / 2,
        useCommonStore().gameWindow.height - showHeight,
        showWidth,
        showHeight
      );
    }
  },
};
</script>
