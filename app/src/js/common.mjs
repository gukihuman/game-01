import { useCommonStore as cs } from "@/stores/CommonStore";
import { useAttackStore as as } from "@/stores/AttackStore";
import Cookies from "js-cookie";
import axios from "axios";
import { assert } from "@vue/compiler-core";

export function getFrameIndex(startGameFrame, currentGameFrame, frameAmount) {
  let startFrameOffset = startGameFrame % (60 / frameAmount);
  let roundedStartGameFrame = startGameFrame - startFrameOffset;
  let roundedGameFrame = currentGameFrame - startFrameOffset;
  let startFrame =
    Math.floor(roundedStartGameFrame / (60 / frameAmount)) % frameAmount;
  let currentFrame =
    Math.floor(roundedGameFrame / (60 / frameAmount)) % frameAmount;
  currentFrame -= startFrame;
  if (currentFrame < 0) {
    currentFrame += frameAmount;
  }
  return currentFrame;
}

export function generateCoordinates() {
  const steps = [];
  const stepsIds = [];

  // not pixels but steps
  const widthSteps = 1280;
  const heightSteps = 720;
  for (let i = 0; i < 17; i++) {
    stepsIds.push({ idX: i, idY: 0 });
  }
  for (let i = 1; i < 10; i++) {
    stepsIds.push({ idX: 0, idY: i });
  }
  for (let i = 0; i < 26; i++) {
    const lineSteps = [];
    const startX = (stepsIds[i].idX * widthSteps) / 16;
    const startY = (stepsIds[i].idY * heightSteps) / 9;
    const width = widthSteps - startX;
    const height = heightSteps - startY;
    const diagonalSteps = Math.floor(Math.sqrt(width ** 2 + height ** 2));
    for (let j = 0; j < diagonalSteps - as().villageRadius; j++) {
      let x = Math.floor(startX + (width / diagonalSteps) * j);
      let y = Math.floor(startY + (height / diagonalSteps) * j);
      lineSteps.push({ x: x, y: y });
    }
    steps.push(lineSteps);
  }
  for (let i = 0; i < 25; i++) {
    const lineSteps = [];
    for (let j = 0; j < steps[i].length; j++) {
      lineSteps.push({
        x: steps[i][j].x,
        y: 2 * heightSteps - steps[i][j].y,
      });
    }
    steps.push(lineSteps);
  }
  for (let i = 0; i < 51; i++) {
    if (i != 16 && i != 42) {
      const lineSteps = [];
      for (let j = 0; j < steps[i].length; j++) {
        lineSteps.push({
          x: 2 * widthSteps - steps[i][j].x,
          y: steps[i][j].y,
        });
      }
      steps.push(lineSteps);
    }
  }

  console.log(steps);
  return steps;
}

export function showLocalStorageSize() {
  console.log("Local Storage:");
  var _lsTotal = 0,
    _xLen,
    _x;
  for (_x in localStorage) {
    if (!localStorage.hasOwnProperty(_x)) {
      continue;
    }
    _xLen = (localStorage[_x].length + _x.length) * 2;
    _lsTotal += _xLen;
    console.log(_x.substr(0, 50) + " = " + (_xLen / 1024).toFixed(2) + " KB");
  }
  console.log("Total = " + (_lsTotal / 1024).toFixed(2) + " KB");
}

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
