import { useCommonStore } from "@/stores/CommonStore";

export function getTriangle(pointX, pointY) {
  const legH = useCommonStore().centerPoint.x - pointX;
  const legV = useCommonStore().centerPoint.y - pointY;
  return { legH, legV, hypo: Math.floor(Math.sqrt(legH ** 2 + legV ** 2)) };
}
