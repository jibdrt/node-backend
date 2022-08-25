

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
    /*         _id: mongoose.Schema.Types.ObjectId, */
    title: String,
    content: String,
    deadline: Date,
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
  }, timestampOption)
);

module.exports = Note;

