const Note = require("../models/note.model");

exports.postnotes = (req, res) => {
    const newnote = new Note({
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

exports.deleteOneNote = (req, res) => {
    Note.findByIdAndRemove({ _id: req.params.id }).exec((err, note) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }
        return res.send(`note ${note} has been deleted`);
    })
};