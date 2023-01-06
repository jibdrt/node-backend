const db = require("../models");
const ROLES = db.ROLES;
const User = db.user;



checkFreeCredentials = (req, res, next) => {

  // Username checking
  User.findOne({
      username: req.body.username
  }).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    if (user) {
      res.status(400).send({ message: "username already used" });
      return;
    }

    // Email checking
    User.findOne({
      email: req.body.email
    }).exec((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
      if (user) {
        res.status(400).send({ message: "email already used" });
        return;
      }
      next();
    });
  });
};

checkRoleValidity = (req, res, next) => {
  if (req.body.roles) {
    for (let i = 0; i < req.body.roles.length; i++) {
      if (!ROLES.includes(req.body.roles[i])) {
        res.status(400).send({
          message: `Role ${req.body.roles[i]} doesn't exist`
        });
        return;
      }
    }
  }
  next();
};

const verifySignUp = {
  checkFreeCredentials,
  checkRoleValidity
};
module.exports = verifySignUp;