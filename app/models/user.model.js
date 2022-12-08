
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
        postedFiles: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "File"
            }
        ],
        involvement: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Note"
            }
        ],
        picture: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Picture"
            }
        ]
    }),
);



module.exports = User;
