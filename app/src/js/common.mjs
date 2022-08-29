import { useCommonStore } from "@/stores/CommonStore";
import Cookies from "js-cookie";

export function getTriangle(pointX, pointY) {
  const legH = useCommonStore().centerPoint.x - pointX;
  const legV = useCommonStore().centerPoint.y - pointY;
  return { legH, legV, hypo: Math.floor(Math.sqrt(legH ** 2 + legV ** 2)) };
}

export function updateCookie(cookie, options) {
  const value = Cookies.get(cookie);
  if (value) {
    if (!options || !options.expires) {
      options = { expires: 7 };
    }
    Cookies.set(cookie, value, options);
  }
}

export function updateWindowSize(store) {
  store.window.width = window.innerWidth;
  store.window.height = window.innerHeight;
}
