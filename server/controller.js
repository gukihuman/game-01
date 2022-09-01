const User = require("./User");

exports.register = (req, res) => {
  let user = new User(req.body);
  user
    .register()
    .then(() => {
      res.sendStatus(200);
    })
    .catch((reqErrors) => {
      res.json(reqErrors);
    });
};

exports.login = (req, res) => {
  let user = new User(req.body);
  user
    .login()
    .then((jwttoken) => {
      res.json({ jwttoken: jwttoken });
    })
    .catch((error) => {
      res.json(error);
    });
};

exports.updateGameData = (req, res) => {
  let user = new User(req.body);
  user
    .updateGameData()
    .then(() => {
      res.json("OK");
    })
    .catch((error) => {
      res.json(error);
    });
};

exports.getGameData = (req, res) => {
  let user = new User(req.body);
  user
    .getGameData()
    .then((gameData) => {
      res.json({ gameData: gameData });
    })
    .catch((error) => {
      res.json(error);
    });
};
