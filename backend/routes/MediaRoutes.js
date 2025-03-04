const express = require('express')
const router = express.Router();
const { Media, Movie, Show, Novel } = require('../models/mediaSchema');



router.get("/", async (req, res) => {
  try {
    const media = await Media.find().populate({
      path: "mediaId",
      select: "-__v", // Exclude internal fields if necessary
    });

    res.json(media);
  } catch (error) {
    console.error("Error fetching media:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


router.get("/Show", async (req, res) => {
  try {
    const media = await Show.find();
    res.json(media);
  } catch (error) {
    console.error("Error fetching media:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/Movie", async (req, res) => {
  try {
    const media = await Movie.find();
    res.json(media);
  } catch (error) {
    console.error("Error fetching media:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/Novel", async (req, res) => {
  try {
    const media = await Novel.find();
    res.json(media);
  } catch (error) {
    console.error("Error fetching media:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});



router.post("/addmedia",async(req,res) =>{
    try {
        console.log("control reched in media comntrooler")
        console.log(req.body);
        const { type, userId, name, totalEpisodes, watchedEpisodes, totalPages, pagesRead, dateStarted } = req.body;
    
        if (!userId || !type || !name || !dateStarted) {
          return res.status(400).json({ error: "Missing required fields" });
        }
    
        let mediaItem;
    
        // Check media type and create the respective document
        if (type === "Movie") {
          mediaItem = await Movie.create({ name, episode: 1, dateStarted });
        } else if (type === "Show") {
          if (!totalEpisodes) return res.status(400).json({ error: "Total episodes required for a show" });
          mediaItem = await Show.create({ name, totalEpisodes, watchedEpisodes: watchedEpisodes || 0, dateStarted });
        } else if (type === "Novel") {
          if (!totalPages) return res.status(400).json({ error: "Total pages required for a novel" });
          mediaItem = await Novel.create({ name, totalPages, pagesRead: pagesRead || 0, dateStarted });
        } else {
          return res.status(400).json({ error: "Invalid media type" });
        }
    
        // Create a Media document to reference the new media entry
        const mediaEntry = await Media.create({
          userId,
          type,
          mediaId: mediaItem._id
        });
    
        res.status(201).json({ message: "Media added successfully", media: mediaEntry });
      } catch (error) {
        console.error("Error adding media:", error);
        res.status(500).json({ error: "Internal server error" });
      }
})

module.exports = router;