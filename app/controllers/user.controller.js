const User = require("../models/user.model");
const Note = require("../models/note.model");
const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");



exports.userList = async (req, res, next) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
},



  exports.deleteOneUser = async (req, res, next) => {
    try {
      const userId = req.params.id;
      const creator = userId;
      await Note.deleteMany({ creator });
      const user = await User.findByIdAndRemove({ _id: userId });
      return res.send(`'USER ${user} AND HIS NOTES HAS BEEN DELETED'`);
    } catch (err) {
      next(err);
    }
  }


exports.userBoard = async (req, res, next) => {
  try {
    const user = await User.find({ _id: req.userId });
    return res.send(user);
  } catch (err) {
    next(err);
  }
};


exports.adminBoard = async (req, res, next) => {
  try {
    const users = await User.find({});
    return res.status(200).send(users);
  } catch (err) {
    next(err);
  }
}

exports.userDetail = async (req, res, next) => {
  try {
    const token = req.headers['x-access-token'];
    const decoded = jwt.verify(token, config.secret, (err, decoded) => {
      if (err) {
        return res.status(401).send({ message: "Unauthorized!" });
      }
      req.userId = decoded.id;
      return req.userId;
    });
    const user = await User.find({ _id: decoded });
    return res.send(user);
  } catch (err) {
    next(err);
  }
}

