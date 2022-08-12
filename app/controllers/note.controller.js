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
    Note.find({ _id: req.params.id }).exec((err, note) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }
        return res.send(note);
    })
};