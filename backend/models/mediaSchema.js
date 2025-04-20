const mongoose = require("mongoose");


// The refPath: "type" makes the mediaId field dynamically reference different collections based on the type value.

// For example:

// If type: "Movie", then mediaId will reference the "Movie" collection.
// If type: "Show", then mediaId will reference the "Show" collection.
// If type: "Novel", then mediaId will reference the "Novel" collection.

const mediaSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  type: { type: String, enum: ["Movie", "Show", "Novel"], required: true },
  edits: {type: Number,default: 0},
  favourite: {type: Boolean,default: false},
  mediaId: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: "type" }
},{
  timestamps: true
});

const Media = mongoose.model("Media", mediaSchema);

// Movie Schema
const movieSchema = new mongoose.Schema({
  name: { type: String, required: true },
  episode: { type: Number, default: 1 },
  dateStarted: { type: Date, required: true },
  
  releaseDate: {type: Date},
  synopsis: {type: String},
  director: {type: String},
  favourite: {type: Boolean, default: false},

},{
  timestamps: true
});
const Movie = mongoose.model("Movie", movieSchema);

// Show Schema
const showSchema = new mongoose.Schema({
  name: { type: String, required: true },
  totalEpisodes: { type: Number, required: true },
  watchedEpisodes: { type: Number, default: 0 },
  dateStarted: { type: Date, required: true },
  releaseDate: {type: Date},
  synopsis: {type: String},
  creator: {type: String},
  favourite: {type: Boolean, default: false},
},{
  timestamps: true
});
const Show = mongoose.model("Show", showSchema);

// Novel Schema
const novelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  totalPages: { type: Number, required: true },
  pagesRead: { type: Number, default: 0 },
  dateStarted: { type: Date, required: true },
  releaseDate: {type: Date},
  synopsis: {type: String},
  author: {type: String},
  favourite: {type: Boolean, default: false},
},{
  timestamps: true
});
const Novel = mongoose.model("Novel", novelSchema);

module.exports = { Media, Movie, Show, Novel };
