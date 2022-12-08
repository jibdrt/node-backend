


const mongoose = require ("mongoose");
const Picture = mongoose.model(
    "Picture",
    new mongoose.Schema({
        name: {
            type: String,
            required: true,
            max: 10000
        },
        description: {
            type: String,
            required: false,
        },
        posted_at: {
            type: Date,
            default: Date.now
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    })
);

module.exports = Picture;
