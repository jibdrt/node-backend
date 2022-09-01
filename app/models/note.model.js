
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
      required: true
    },
    is_pinned: Boolean,
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    color: {
      type: String,
      required: true
    }
  }, timestampOption)
);




module.exports = Note;

