const Note = require("../models/note.model");
const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");

/* exports.postnotes = (req, res) => {
    const newnote = new Note({
        id: req.body._id,
        title: req.body.title,
        content: req.body.content,
        deadline: req.body.deadline
    });
    newnote.save(err => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }
        return res.send(newnote);
    })
}; */

exports.newNote = async (req, res) => {
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



