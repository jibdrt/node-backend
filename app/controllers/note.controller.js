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
        const participants = newNote.participants;

        // user as note's creator
        newNote.creator = user;


        // make all participants involved in this new Note
        // push the note id in their involvement array

        const concerned = await User.updateMany(
            { _id: participants },
            { $addToSet: { involvement: newNote._id } }
        );
        console.log(concerned);

        // save the note
        await newNote.save();

        // push note to postedNotes[] in user
        user.postedNotes.push(newNote._id);

        // save user
        await user.save();

        res.status(201).json(newNote);
    } catch (err) {
        next(err);
    }
}


exports.getAllNotes = async (req, res, next) => {
    try {
        const notes = await Note.find({})

            // return username for creator and participants
            .populate([
                {
                    path: "creator",
                    select: { _id: 0, username: 1 }
                },
                {
                    path: "participants",
                    select: { _id: 0, username: 1 }
                }
            ])
        return res.send(notes);
    }
    catch (err) {
        next(err)
    }
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


exports.deleteOneNote = async (req, res, next) => {
    try {
        const targetedForDelete = await Note.findByIdAndRemove({ _id: req.params.id });
        return ({ targetedForDelete: targetedForDelete })
    } catch (err) {
        next(err);
    }
}





