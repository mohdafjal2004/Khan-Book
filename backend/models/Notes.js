const mongoose = require("mongoose");
const { Schema } = mongoose;

const NotesSchema = new Schema({
  //associating notes with particular user by linking User.js model using refs => so that one user cannot view another user notes
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },

  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
    // unique: true,
  },
  tag: {
    type: String,
    default: "General",
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("notes", NotesSchema);
