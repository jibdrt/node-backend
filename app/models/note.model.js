
const timestampOption = {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  },
};

const mongoose = require("mongoose");
const Note = mongoose.model(
  "Note",
  new mongoose.Schema({
    title: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    },
    deadline: {
      type: Date,
      required: false
    },
    is_pinned: Boolean,
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      username: String,
      ref: "User"
    },
    color: {
      type: String,
      required: true
    },
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        username: String,
        ref: "User"
      }
    ]
  }, timestampOption)
);




module.exports = Note;

