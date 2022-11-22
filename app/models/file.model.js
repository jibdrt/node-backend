

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
        description: {
            type: String,
            required: false,
            min: 3,
            max: 1000
        },
        posted_at: {
            type: Date,
            default: Date.now
        }
    })
);

module.exports = File;