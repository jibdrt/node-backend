const User = require("../models/user.model");
const Note = require("../models/note.model");
const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");

/* ---old get all users controller--- */

/* exports.allAccess = (req, res) => {
  User.find({}).exec((err, users) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    return res.send(users);
  })
}; */

exports.allAccess = async (req, res, next) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
},

  exports.deleteOneUser = async (req, res) => {
    try {
      const user = await User.findByIdAndRemove({ _id: req.params.id });
      return res.send(`user ${user} has been deleted`);
    } catch (err) {
      next(err);
    }
  }


exports.userBoard = async (req, res) => {
  try {
    const user = await User.find({ _id: req.userId });
    return res.send(user);
  } catch (err) {
    next(err);
  }
};

/* exports.userBoard = (req, res) => {
  const userLog = req.userId;
  User.find({ _id: userLog }).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    return res.send(user);
  })
}; */

exports.adminBoard = (req, res) => {
  User.find({}).exec((err, users) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    res.status(200).send(users);
  })
};
