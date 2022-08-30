const Note = require("../models/note.model");
const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");


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
        // user as note's creator
        newNote.creator = user;
        // save the note
        await newNote.save();
        // push note to notes[] in user
        user.notes.push(newNote._id);
        // save user
        await user.save();
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

exports.deleteOneNote = (req, res) => {
    Note.findByIdAndRemove({ _id: req.params.id }).exec((err, note) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }
        return res.send(`note ${note} has been deleted!`);
    })
};

/* exports.deleteOneNote = async (req, res, next) => {
    try {
        const removednote = Note.findByIdAndRemove({ _id: req.params.id });
        const inuser = User.findOneAndRemove({
             $pull: { "notes": { _id: req.params.id } }
        });
        res.status(200).send(removednote, usernote);
    } catch (err) {
        next(err);
    }
} */



