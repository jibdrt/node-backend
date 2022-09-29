const User = require("../models/user.model");
const Note = require("../models/note.model");
const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
var bcrypt = require("bcryptjs");

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



exports.changePassword = async (req, res, next) => {

  try {
      const { currentPassword, newPassword, confirmNewPassword } = req.body;

      const token = req.headers['x-access-token'];

      const decoded = jwt.verify(token, config.secret, (err, decoded) => {
          if (err) {
              return res.status(401).send({ message: "Unauthorized!" });
          }
          req.userId = decoded.id;
          return req.userId;
      });

      User.findOne({ _id: decoded }).then(async (user) => {


          const matchCurrent = await bcrypt.compare(currentPassword, user.password); //encrypt new password

          if (matchCurrent) {
              console.log('correspondance ok');

              //Update password for user with new password hash
              bcrypt.genSalt(10, (err, salt) =>
                  bcrypt.hash(newPassword, salt, (err, hash) => {
                      if (err) throw err;
                      user.password = hash;
                      user.save();
                  })
              );
              res.status(200).send("Mot de passe mis à jour");
          } else {
              //Password does not match
              res.send('pas de correspondance currentPassword / user.password');
          }
      });

  } catch (err) {
      //Check required fields
      if (!currentPassword || !newPassword || !confirmNewPassword) {
          res.send({ msg: "Remplissez tous les champs." });
      }

      //Check passwords match
      if (newPassword !== confirmNewPassword) {
          res.send({ msg: "La confirmation du mot de passe n'a pas fonctionné" });
      }

      //Check password length
      if (newPassword.length < 4 || confirmNewPassword.length < 4) {
          res.send({ msg: "Le mot de passe doit être constitué d'au moins 4 caractères." });
      }

      if (errors.length > 0) {
          res.send(err);
      }

      next(err);

  }
};

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

