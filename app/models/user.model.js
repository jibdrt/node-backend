
const Note = require ("../models/note.model");
const mongoose = require("mongoose");
const User = mongoose.model(
    "User",
    new mongoose.Schema({
        username: String,
        email: String,
        password: String,
        roles: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Role"
            }
        ],
        notes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Note"
            }
        ]
    }),
);



module.exports = User;

