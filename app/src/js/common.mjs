import { useCommonStore } from "@/stores/CommonStore";
import Cookies from "js-cookie";
import axios from "axios";

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

export function getGameData() {
  return new Promise(async (resolve, reject) => {
    let res = await axios.post("/api/getGameData", {
      username: Cookies.get("username"),
      jwttoken: Cookies.get("jwttoken"),
    });
    if (res.data.gameData) {
      useCommonStore().gameData = res.data.gameData;
    } else {
      alert(res.data);
      Cookies.remove("jwttoken");
      Cookies.remove("username");
    }
    resolve();
  });
}

export function updateGameData() {
  return new Promise(async (resolve, reject) => {
    let res = await axios.post("/api/updateGameData", {
      username: Cookies.get("username"),
      jwttoken: Cookies.get("jwttoken"),
      gameData: useCommonStore().gameData,
    });
    if (res.data != "OK") {
      alert(res.data);
      Cookies.remove("jwttoken");
      Cookies.remove("username");
    }
    resolve();
  });
}
