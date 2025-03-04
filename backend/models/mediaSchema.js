const mongoose = require("mongoose");

const mediaSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  type: { type: String, enum: ["Movie", "Show", "Novel"], required: true },
  
  mediaId: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: "type" }
});

const Media = mongoose.model("Media", mediaSchema);

// Movie Schema
const movieSchema = new mongoose.Schema({
  name: { type: String, required: true },
  episode: { type: Number, default: 1 },
  dateStarted: { type: Date, required: true }
});
const Movie = mongoose.model("Movie", movieSchema);

// Show Schema
const showSchema = new mongoose.Schema({
  name: { type: String, required: true },
  totalEpisodes: { type: Number, required: true },
  watchedEpisodes: { type: Number, default: 0 },
  dateStarted: { type: Date, required: true }
});
const Show = mongoose.model("Show", showSchema);

// Novel Schema
const novelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  totalPages: { type: Number, required: true },
  pagesRead: { type: Number, default: 0 },
  dateStarted: { type: Date, required: true }
});
const Novel = mongoose.model("Novel", novelSchema);

module.exports = { Media, Movie, Show, Novel };
