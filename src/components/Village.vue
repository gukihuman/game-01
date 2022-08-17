<script>
import { useCommonStore } from "@/stores/CommonStore";
import { useVillageStore } from "@/stores/VillageStore";

export default {
  inject: ["provider"],
  render() {
    if (!this.provider.context) return;

    const c = this.provider.context;

    c.beginPath();
    c.arc(
      useCommonStore().centerPoint.x,
      useCommonStore().centerPoint.y,
      useVillageStore().villageRadius,
      0,
      Math.PI * 2,
      false
    );
    c.strokeStyle = "#457b9d";
    c.lineWidth = 5;
    c.stroke();
  },
};
</script>
