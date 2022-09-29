
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
                name: String,
                ref: "Role"
            }
        ],
        postedNotes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Note"
            }
        ],
        involvement: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Note"
            }
        ]
    }),
);



module.exports = User;
