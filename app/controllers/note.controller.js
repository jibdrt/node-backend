const Note = require("../models/note.model");

exports.postnotes = (req, res) => {
    const note = new Note({
        title: req.body.title,
        content: req.body.content,
        deadline: req.body.deadline
    });
    note.save(err => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }
        return res.send(note);
    })
};


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
    Note.find({ _id: "62f66d473243abad5f7e5c1d" }).exec((err, note) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }
        return res.send(note);
    })
};