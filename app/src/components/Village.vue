<script>
import { useCommonStore } from "@/stores/CommonStore";
import { useVillageStore } from "@/stores/VillageStore";

export default {
  inject: ["provider"],
  render() {
    if (!this.provider.context) return;

    const c = this.provider.context;

    let image = new Image();

    image.src = require("@/assets/village.png");
    let offset = 35;
    c.drawImage(
      image,
      0,
      0,
      900,
      900,
      useCommonStore().centerPoint.x - useVillageStore().villageRadius - offset,
      useCommonStore().centerPoint.y - useVillageStore().villageRadius - offset,
      useVillageStore().villageRadius * 2 + offset * 2,
      useVillageStore().villageRadius * 2 + offset * 2
    );
  },
};
</script>
