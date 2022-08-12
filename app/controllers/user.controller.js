const User = require("../models/user.model");

exports.allAccess = (req, res) => {
  User.find({}).exec((err, users) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    return res.send(users);
  })
};
exports.userBoard = (req, res) => {
  res.status(200).send("User Content.");
};
exports.adminBoard = (req, res) => {
  res.status(200).send("Admin Content.");
};
exports.moderatorBoard = (req, res) => {
  res.status(200).send("Moderator Content.");
};