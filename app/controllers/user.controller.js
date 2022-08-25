const User = require("../models/user.model");
/* const Role = require("../models/role.model");
 */
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

/* ---old deleteUser controller--- */

/*   exports.deleteOneUser = (req, res) => {
    User.findByIdAndRemove({ _id: req.params.id }).exec((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
      return res.send(`user ${user} has been deleted`);
    })
  }; */


exports.deleteOneUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndRemove({_id: req.params.id});
    res.status(200).send(`user ${user} has been deleted`);
  } catch (err) {
    next(err);
  }
}

/* ---old userBoard controller--- */

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

exports.userBoard = async (req, res, next) => {
  try {
    const userLoged = req.userId;
    const user = await User.find({ _id: userLoged });
    res.status(200).send(user);
  } catch (err) {
    next(err);
  }
}

/* ---old adminBoard controller--- */

/* exports.adminBoard = (req, res) => {
  User.find({}).exec((err, users) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    res.status(200).send(users);
  })
}; */

exports.adminBoard = async (req, res, next) => {
  try {
    const users = await User.find({});
    res.status(200).send(users);
  } catch (err) {
    next(err);
  }
}


exports.newUserNote = async (req, res) => {
  // Create new note
  const newNote = new Note(req.body);
  // Get user
  const token = req.headers["x-access-token"];
  const decoded = jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "Unauthorized!" });
    }
    req.userId = decoded.id;
    return req.userId;
  });
  const user = await User.findById({ _id: decoded });
  console.log('userId', decoded);
  console.log('noteInfos', newNote)
  // Asign user as note's creator
  newNote.creator = user;
  // Save the note
  await newNote.save();
  // Add note to the user's array 'notes'
  user.notes.push(newNote);
  // Save the user
  await user.save();
  res.status(201).json(newNote);
}
