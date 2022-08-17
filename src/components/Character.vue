<script>
import { useCharacterStore } from "@/stores/CharacterStore";

export default {
  inject: ["provider"],
  render() {
    if (!this.provider.context) return;

    const c = this.provider.context;

    c.beginPath();
    c.arc(
      useCharacterStore().pointX,
      useCharacterStore().pointY,
      useCharacterStore().characterRadius,
      0,
      Math.PI * 2,
      false
    );
    c.fillStyle = "#a2d2ff";
    c.fill();
  },
};
</script>
