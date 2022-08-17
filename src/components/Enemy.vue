<script>
import { useEnemiesStore } from "@/stores/EnemiesStore";

export default {
  inject: ["provider"],
  props: ["pointX", "pointY", "radius"],
  data() {
    return {};
  },
  render() {
    if (!this.provider.context) return;

    const c = this.provider.context;

    c.beginPath();
    c.arc(
      this.pointX,
      this.pointY,
      useEnemiesStore().enemyRadius,
      0,
      Math.PI * 2,
      false
    );
    c.fillStyle = "#6a040f";
    c.fill();
  },
};
</script>
