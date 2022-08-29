const User = require("./User");

exports.register = (req, res) => {
  let user = new User(req.body);
  user.register();
  if (user.errors.length > 0) {
    res.json(user.errors);
  } else {
    res.sendStatus(200);
  }
};

exports.login = (req, res) => {
  let user = new User(req.body);
  user
    .login()
    .then((jwttoken) => {
      res.json(jwttoken);
    })
    .catch((error) => {
      res.json(error);
    });
};
