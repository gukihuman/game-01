const usersCollection = require("./db").db().collection("users");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

let User = function (data) {
  this.data = data;
  this.errors = [];
};

User.prototype.cleanUp = function () {
  if (typeof this.data.username != "string") {
    this.data.username = "";
  }
  if (typeof this.data.email != "string") {
    this.data.email = "";
  }
  if (typeof this.data.password != "string") {
    this.data.password = "";
  }

  // get rid of any bogus properties
  this.data = {
    username: this.data.username.trim().toLowerCase(),
    email: this.data.email.trim().toLowerCase(),
    password: this.data.password,
  };
};

User.prototype.validate = function () {
  if (this.data.username == "") {
    this.errors.push("You must provide a username");
  }
  if (
    this.data.username != "" &&
    !validator.isAlphanumeric(this.data.username)
  ) {
    this.errors.push("Username can only contain letters and numbers");
  }
  if (!validator.isEmail(this.data.email)) {
    this.errors.push("You must provide a valid email address");
  }
  if (this.data.password == "") {
    this.errors.push("You must provide a password");
  }
  if (this.data.password.length > 0 && this.data.password.length < 8) {
    this.errors.push("Password must be at least 8 characters");
  }
  if (this.data.password.length > 50) {
    this.errors.push("Password cannot exceed 50 characters");
  }
  if (this.data.username.length > 0 && this.data.username.length < 3) {
    this.errors.push("Username must be at least 3 characters");
  }
  if (this.data.username.length > 30) {
    this.errors.push("Username cannot exceed 30 characters");
  }
};

User.prototype.isFree = function () {
  return new Promise(async (resolve, reject) => {
    let usernameExists = await usersCollection.findOne({
      username: this.data.username,
    });
    if (usernameExists) {
      this.errors.push("That username is already taken");
    }
    if (!usernameExists) {
      let emailExists = await usersCollection.findOne({
        email: this.data.email,
      });
      if (emailExists) {
        this.errors.push("That email is already taken");
      }
    }
    resolve();
  });
};

User.prototype.register = function () {
  return new Promise(async (resolve, reject) => {
    // Step #1: Validate user data
    this.cleanUp();
    this.validate();
    await this.isFree();

    // Step #2: Only if there is no validation errors
    // then save the user data into a database
    if (!this.errors.length) {
      // hash user password
      let salt = bcrypt.genSaltSync(10);
      this.data.password = bcrypt.hashSync(this.data.password, salt);

      await usersCollection.insertOne(this.data);
      resolve();
    } else {
      reject(this.errors);
    }
  });
};

User.prototype.login = function () {
  return new Promise((resolve, reject) => {
    this.cleanUp();
    usersCollection
      .findOne({ username: this.data.username })
      .then((attemptedUser) => {
        if (
          attemptedUser &&
          bcrypt.compareSync(this.data.password, attemptedUser.password)
        ) {
          const jwttoken = jwt.sign(
            { _id: attemptedUser._id.toString() },
            process.env.JWTSECRET,
            {}
          );
          usersCollection
            .updateOne(
              { _id: attemptedUser._id },
              { $set: { jwttoken: jwttoken } }
            )
            .then(() => {
              resolve(jwttoken);
            });
        } else {
          reject("Invalid username / password");
        }
      })
      .catch(() => {
        reject("Please try again later");
      });
  });
};

User.prototype.updateGameData = function () {
  return new Promise((resolve, reject) => {
    usersCollection
      .findOne({ username: this.data.username })
      .then((attemptedUser) => {
        if (
          attemptedUser &&
          this.data.jwttoken &&
          this.data.jwttoken == attemptedUser.jwttoken
        ) {
          usersCollection
            .updateOne(
              { _id: attemptedUser._id },
              { $set: { gameData: this.data.gameData } }
            )
            .then(() => {
              resolve();
            });
        } else {
          reject("Invalid jwttoken");
        }
      })
      .catch(() => {
        reject("Please try again later");
      });
  });
};

User.prototype.getGameData = function () {
  return new Promise((resolve, reject) => {
    usersCollection
      .findOne({ username: this.data.username })
      .then((attemptedUser) => {
        if (
          attemptedUser &&
          this.data.jwttoken &&
          this.data.jwttoken == attemptedUser.jwttoken
        ) {
          resolve(attemptedUser.gameData);
        } else {
          reject("Invalid jwttoken");
        }
      })
      .catch(() => {
        reject("Please try again later");
      });
  });
};

module.exports = User;
