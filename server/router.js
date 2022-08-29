const express = require("express");
const router = express.Router();
const controller = require("./controller");

router.post("/api/register", controller.register);
router.post("/api/login", controller.login);
router.post("/api/getGameData", controller.getGameData);
router.post("/api/updateGameData", controller.updateGameData);

module.exports = router;
