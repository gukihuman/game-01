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
    if (useCharacterStore().status === "idle") {
      c.fillStyle = "#a3b18a";
    } else if (useCharacterStore().status === "move") {
      c.fillStyle = "#e9c46a";
    } else {
      c.fillStyle = "#e76f51";
    }
    c.fill();
  },
};
</script>
