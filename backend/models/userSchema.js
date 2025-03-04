const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  gender: {
    type: String,
  },
  age: {
    type: Number,
  },
  Location: {
    type: String,
  },
  bio: {
    type: String,
  },
  media: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Media" 
    }
  ]
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

module.exports = User;
