<script>
import { useEnemiesStore } from "@/stores/EnemiesStore";

export default {
  inject: ["provider"],
  props: ["pointX", "pointY", "status"],
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
    if (this.status === "fight") {
      c.fillStyle = "#6a040f";
    } else {
      c.fillStyle = "#d90429";
    }
    c.fill();
  },
};
</script>
