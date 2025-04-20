const express = require("express");
const router = express.Router();

module.exports = (prisma) => {

  // GET all media
  // GET all media with actual media data
router.get("/", async (req, res) => {
  try {
    const mediaWrappers = await prisma.media.findMany({
      include: {
        user: true,
        favourites: {
          include: {
            user: true
          }
        }
      },
      orderBy: {
        updatedAt: "desc"
      }
    });

    const enrichedMedia = await Promise.all(mediaWrappers.map(async (media) => {
      let mediaDetails;

      if (media.type === "Movie") {
        mediaDetails = await prisma.movie.findUnique({ where: { id: media.mediaId } });
      } else if (media.type === "Show") {
        mediaDetails = await prisma.show.findUnique({ where: { id: media.mediaId } });
      } else if (media.type === "Novel") {
        mediaDetails = await prisma.novel.findUnique({ where: { id: media.mediaId } });
      }

      return {
        ...media,
        mediaDetails
      };
    }));
    console.log(enrichedMedia);
    res.json(enrichedMedia);
  } catch (error) {
    console.error("Error fetching media:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


router.get('/favourites/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const userId = parseInt(id);

    // Get all favourites for user, include the media wrapper
    const favs = await prisma.userFavourite.findMany({
      where: { userId },
      include: {
        media: {
          include: {
            user: true,
            favourites: {
              include: { user: true }
            }
          }
        }
      }
    });

    if (!favs || favs.length === 0) {
      return res.status(404).json({ msg: "No favourites found" });
    }

    // Enrich with actual media details (Movie / Show / Novel)
    const enrichedFavourites = await Promise.all(favs.map(async (fav) => {
      const { media } = fav;

      let mediaDetails;
      if (media.type === "Movie") {
        mediaDetails = await prisma.movie.findUnique({ where: { id: media.mediaId } });
      } else if (media.type === "Show") {
        mediaDetails = await prisma.show.findUnique({ where: { id: media.mediaId } });
      } else if (media.type === "Novel") {
        mediaDetails = await prisma.novel.findUnique({ where: { id: media.mediaId } });
      }

      return {
        // ...fav,
        // media: {
        //   ...media,
         type: media.type, 
        mediaDetails
        // }
      };
    }));

    res.status(200).json(enrichedFavourites);
  } catch (error) {
    console.error("Error fetching favourites:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


  // GET media by type and name
  router.get("/:type/:name", async (req, res) => {
    const { type, name } = req.params;

    try {
      const model = {
        Movie: prisma.movie,
        Show: prisma.show,
        Novel: prisma.novel
      }[type];

      if (!model) return res.status(400).json({ msg: "Invalid media type" });

      const mediaItem = await model.findFirst({ where: { name } });
      if (!mediaItem) return res.status(404).json({ msg: "Media not found" });

      return res.json(mediaItem);
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // GET recent edits
  router.get("/edits", async (req, res) => {
    try {
      const edits = await prisma.media.findMany({
        select: {
          id: true,
          userId: true,
          type: true,
          mediaId: true,
          updatedAt: true
        },
        orderBy: {
          updatedAt: "desc"
        },
        take: 20
      });
      res.json(edits);
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // POST: Add media
  router.post("/addmedia", async (req, res) => {
    const { type, userId, name, dateStarted, totalEpisodes, watchedEpisodes, totalPages, pagesRead } = req.body;

    if (!userId || !type || !name || !dateStarted) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    try {
      const model = {
        Movie: prisma.movie,
        Show: prisma.show,
        Novel: prisma.novel
      }[type];

      if (!model) return res.status(400).json({ msg: "Invalid media type" });

      const existing = await model.findFirst({ where: { name } });
      if (existing) {
        const alreadyTracked = await prisma.media.findFirst({
          where: { userId, type, mediaId: existing.id }
        });
        if (alreadyTracked) return res.status(400).json({ msg: "Media already tracked" });
      }

      let created;
      if (type === "Movie") {
        created = await prisma.movie.create({
          data: { name, episode: 1, dateStarted: new Date(dateStarted) }
        });
      } else if (type === "Show") {
        if (!totalEpisodes) return res.status(400).json({ error: "Total episodes required" });
        created = await prisma.show.create({
          data: {
            name,
            totalEpisodes,
            watchedEpisodes: watchedEpisodes || 0,
            dateStarted: new Date(dateStarted)
          }
        });
      } else if (type === "Novel") {
        if (!totalPages) return res.status(400).json({ error: "Total pages required" });
        created = await prisma.novel.create({
          data: {
            name,
            totalPages,
            pagesRead: pagesRead || 0,
            dateStarted: new Date(dateStarted)
          }
        });
      }

      const mediaWrapper = await prisma.media.create({
        data: {
          userId,
          type,
          mediaId: created.id
        }
      });

      res.status(201).json({ message: "Media added successfully", media: mediaWrapper });

    } catch (error) {
      console.error("Error adding media:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // PUT: Edit media
  router.put("/editmedia", async (req, res) => {
    const { type, name, ...updates } = req.body;
  
    try {
      const modelMap = {
        Movie: prisma.movie,
        Show: prisma.show,
        Novel: prisma.novel,
      };
      const model = modelMap[type];
      if (!model) return res.status(400).json({ msg: "Invalid media type" });

      
  
      // Define allowed fields per model
      const allowedFields = {
        Movie: ['name', 'releaseDate', 'synopsis', 'director'],
        Show: ['name', 'releaseDate', 'synopsis', 'creator', 'totalEpisodes', 'watchedEpisodes'],
        Novel: ['name', 'releaseDate', 'synopsis', 'author', 'totalPages', 'pagesRead'],
      }[type];
  
      const updateData = {};
      for (let key of allowedFields) {
        if (updates[key] !== undefined) {
          // Convert empty strings to null for nullable fields
          updateData[key] = updates[key] === '' ? null : updates[key];
        }
      }
  
      if (updateData.releaseDate) {
        updateData.releaseDate = new Date(updateData.releaseDate);
      }
  
      const existing = await model.findFirst({
        where: { name }
      });
      
      const updated = await model.update({
        where: { id: existing.id },
        data: updateData
      });
  
      // Update edits counter in media table
      await prisma.media.updateMany({
        where: { type, mediaId: updated.id },
        data: { edits: { increment: 1 } },
      });
  
      res.json({ msg: "Media updated successfully" });
  
    } catch (error) {
      console.error("Error editing media:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
  

  // PUT: Favourite/unfavourite
  router.put("/favourite", async (req, res) => {
    const { type, name, userId } = req.body;

    try {
      const model = {
        Movie: prisma.movie,
        Show: prisma.show,
        Novel: prisma.novel
      }[type];

      if (!model) return res.status(400).json({ msg: "Invalid media type" });

      const mediaItem = await model.findFirst({ where: { name } });
      if (!mediaItem) return res.status(404).json({ msg: `${type} not found` });

      const media = await prisma.media.findFirst({
        where: { type, mediaId: mediaItem.id }
      });

      if (!media) return res.status(404).json({ msg: "Media wrapper not found" });

      const fav = await prisma.userFavourite.findUnique({
        where: {
          userId_mediaId: {
            userId,
            mediaId: media.id
          }
        }
      });

      if (fav) {
        await prisma.userFavourite.delete({
          where: {
            userId_mediaId: {
              userId,
              mediaId: media.id
            }
          }
        });

        await prisma.media.update({
          where: { id: media.id },
          data: { favourite: false }
        });

        return res.json({ msg: "Unfavourited" });
      } else {
        const favCount = await prisma.userFavourite.count({ where: { userId } });
        if (favCount >= 10) return res.status(400).json({ msg: "Max 10 favourites allowed" });

        await prisma.userFavourite.create({
          data: { userId, mediaId: media.id }
        });

        await prisma.media.update({
          where: { id: media.id },
          data: { favourite: true }
        });

        return res.json({ msg: "Favourited" });
      }

    } catch (error) {
      console.error("Error updating favourite:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  

  return router;
};
