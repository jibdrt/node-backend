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



        const newNotePushed = await Note.findById(newNote._id)

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


        res.status(201).json(newNotePushed);
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

exports.getOneNote = async (req, res) => {
    try {
        const thisNote = await Note.find({ _id: req.params.id })

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


        res.status(200).json(thisNote);
    } catch (err) {
        res.status(500).send({ message: err });
        return;
    }
};

exports.updateOneNote = async (req, res) => {

    try {
        const updatedNote = new Note({
            _id: req.params.id,
            ...req.body
        }, { $set: req.body });

        const newNoteData = updatedNote;

        Note.findByIdAndUpdate({ _id: req.params.id }, updatedNote).exec((err) => {
            if (err) {
                res.status(500).send({ message: err });
                return;
            }
            return res.send(`note has been updated with ${newNoteData}`);
        })
    } catch (err) {

        res.status(500).send({ message: err });
    }
};


exports.deleteOneNote = async (req, res, next) => {
    try {

        const noteId = req.params.id;

        const targetedForDelete = await Note.findByIdAndRemove({ _id: noteId });

        const targetedInvolvement = await User.findOneAndUpdate(
            { involvement: noteId },
            { $unset: { involvement: '' }}
        );

        const targetedPostedNote = await User.findOneAndUpdate(
            { postedNotes: noteId },
            { $unset: { postedNotes: '' }}
        );

        res.send(`note ${targetedForDelete.id} has been deleted and his ${targetedInvolvement.id}, ${targetedPostedNote.id} too`);
    } catch (err) {
        next(err);
    }
}





