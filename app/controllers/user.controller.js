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


/* exports.getOneUser = (req, res) => {
  User.find({ _id: req.params.id }).exec((err, user) => {
      if (err) {
          res.status(500).send({ message: err });
          return;
      }
      return res.send(user);
  })
}; */


exports.deleteOneUser = (req, res) => {
  User.findByIdAndRemove({_id: req.params.id }).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    return res.send(`user ${user} has been deleted`);
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