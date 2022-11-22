

const mongoose = require('mongoose');

const File = mongoose.model(
    "File",
    new mongoose.Schema({
        name: {
            type: String,
            required: true,
            min: 3,
            max: 10000
        },
        posted_at: {
            type: Date,
            default: Date.now
        },
        posted_by: {
            type: mongoose.Schema.Types.ObjectId,
            username: String,
            ref: "User"
        }
    })
);

module.exports = File;