import { useCommonStore as cs } from "@/stores/CommonStore";
import Cookies from "js-cookie";
import axios from "axios";

export function debounce(callback, delay) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => callback(...args), delay);
  };
}

export function getTriangle(pointX, pointY) {
  const legH = cs().centerPoint.x - pointX;
  const legV = cs().centerPoint.y - pointY;
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

export function getGameData() {
  function cleanUp(fetchedData, defaultData) {
    let cleanedData = {};
    Object.keys(defaultData).forEach((key) => {
      if (fetchedData[key]) {
        if (typeof fetchedData[key] == "object") {
          fetchedData[key] = cleanUp(fetchedData[key], defaultData[key]);
        }
        cleanedData[key] = fetchedData[key];
      } else {
        cleanedData[key] = defaultData[key];
      }
    });
    console.log("Get uncleaned data:");
    console.log(fetchedData);
    console.log("Data is cleaned:");
    console.log(cleanedData);
    return cleanedData;
  }

  return new Promise(async (resolve, reject) => {
    let res = await axios.post("/api/getGameData", {
      username: Cookies.get("username"),
      jwttoken: Cookies.get("jwttoken"),
    });
    if (res.data.gameData) {
      cs().gameData = cleanUp(res.data.gameData, cs().gameData);
      console.log("Updated with cleaned data.");
      console.log(cs().gameData);
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
      gameData: cs().gameData,
    });
    if (res.data == "OK") {
      console.log("gameData is pushed to the server successfully!");
      console.log(cs().gameData);
    } else {
      alert(res.data);
      Cookies.remove("jwttoken");
      Cookies.remove("username");
    }
    resolve();
  });
}
