const User = require("../models/user.model");
const Note = require("../models/note.model");
const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const { findByIdAndUpdate } = require("../models/note.model");


exports.userList = async (req, res, next) => {
  const projection = {
    password: false
  };
  try {
    const users = await User.find({}, projection).populate({
      path: "roles",
      select: { _id: 0, name: 1 }
    })
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


exports.editProfil = async (req, res, next) => {
  try {

    const token = req.headers['x-access-token'];

    const decoded = jwt.verify(token, config.secret, (err, decoded) => {
      if (err) {
        return res.status(401).send({ message: "Unauthorized!" });
      }
      req.userId = decoded.id;
      return req.userId;
    });

    const updatedUser = new User({
      _id: decoded,
      ...req.body
    }, { $set: req.body }); // update only filled fields

    const newUserData = updatedUser;

    User.findByIdAndUpdate({ _id: decoded }, updatedUser).exec((err) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      return res.send(`user has been updated with ${newUserData}`);
    })
    
  } catch (err) {
    next(err);
  }
}


exports.userBoard = async (req, res, next) => {
  try {
    const user = await User.find({ _id: req.userId }).populate({
      path: "roles",
      select: { _id: 0, name: 1 }
    })
    /*     const usernotes = await Note.find({ creator: user }); */
    return res.send({ user: user });
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

