<script>
import { useCommonStore as cs } from "@/stores/CommonStore";
import { useAttackStore as as } from "@/stores/AttackStore";
import { updateGameData } from "@/js/common";
import goblinMoveJSON from "@/assets/animation/goblin-move.json";

export default {
  inject: ["provider"],
  props: ["pointX", "pointY", "status", "prevPointX"],
  render() {
    if (!this.provider.context) return;
  },
};
</script>
