
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
    title: String,
    content: String,
    deadline: Date,
    is_pinned: Boolean,
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
  }, timestampOption)
);




module.exports = Note;

