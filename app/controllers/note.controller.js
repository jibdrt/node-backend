const Note = require("../models/note.model");
const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const { default: mongoose } = require("mongoose");


exports.newNote = async (req, res, next) => {
    try {
        const newNote = new Note(req.body);
        // get user
        const token = req.headers["x-access-token"];
        const decoded = jwt.verify(token, config.secret, (err, decoded) => {
            if (err) {
                return res.status(401).send({ message: "Unauthorized" });
            }
            req.userId = decoded.id;
            return req.userId;
        });
        const user = await User.findById({ _id: decoded });
        const participants = newNote.participants;
/*         const concerned = await User.find({
            _id: participants
        }); */
        // user as note's creator
        newNote.creator = user;

        const concerned = await User.updateMany(
            { _id: participants }, 
            { $addToSet: { involvement: newNote._id } }
          );
        console.log(concerned);
        // save the note
        await newNote.save();
/*         // make all participants involved in this new Note
        // push the note id in their involvement array
        concerned.involvement.push(newNote._id); */
        // push note to postedNotes[] in user
        user.postedNotes.push(newNote._id);
        // save user
        await user.save();
/*         await data.save(); */
        res.status(201).json(newNote);
    } catch (err) {
        next(err);
    }
}


exports.getAllNotes = (req, res) => {
    Note.find({}).exec((err, notes) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }
        return res.send(notes);
    })
};

exports.getOneNote = (req, res) => {
    Note.find({ _id: req.params.id }).exec((err, note) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }
        return res.send(note/* .map(n => ({
            "titre": n.title,
            "contenu": n.content,
            "deadline": n.deadline,
            "par": n.creator,
            "le": n.created_at,
            "maj": n.updated_at
          })) */);
    })
};

exports.updateOneNote = (req, res) => {
    const updatedNote = new Note({
        _id: req.params.id,
        ...req.body
    })
    const newNoteData = updatedNote;
    Note.findByIdAndUpdate({ _id: req.params.id }, updatedNote).exec((err) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }
        return res.send(`note has been updated with ${newNoteData}`);
    })
};

/* exports.deleteOneNote = (req, res) => {
    Note.findByIdAndRemove({ _id: req.params.id }).exec((err, note) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }
        return res.send(`note ${note} has been deleted!`);
    })
}; */

exports.deleteOneNote = async (req, res, next) => {
    try {
        const targetedForDelete = await Note.findByIdAndRemove({ _id: req.params.id });
        return ({ targetedForDelete: targetedForDelete })
    } catch (err) {
        next(err);
    }
}

/* delete: function(req, res) {
    return Project.findById(req.params.id, function(err, project){
          return project.remove(function(err){
              if(!err) {
                  Assignment.update({_id: {$in: project.assingments}}, 
                       {$pull: {project: project._id}}, 
                            function (err, numberAffected) {
                             console.log(numberAffected);
                       } else {
                         console.log(err);                                      
                     }
                   });
             });
         });
 } */



