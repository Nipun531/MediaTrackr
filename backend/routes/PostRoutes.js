const express = require("express");
const router = express.Router();

module.exports = (prisma) => {
  router.post("/create", async (req, res) => {
    const { userId, category, title, body } = req.body;

    if (!userId || !category || !title || !body) {
      return res.status(400).json({ error: "Incomplete details" });
    }

    try {
      const post = await prisma.post.create({
        data: {
          title,
          body,
          category,
          user: {
            connect: { id: userId }
          }
        }
      });

      res.status(200).json({ msg: "Post created successfully", post });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Something went wrong creating the post" });
    }
  });

  router.get("/", async (req, res) => {
    try {
      const posts = await prisma.post.findMany({
        select: {
          id: true,
          title: true,
          category: true,
          body: true,
          userId: true,
        },
      });
  
      res.status(200).json(posts);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Something went wrong getting the posts" });
    }
  });
  

  return router;
};
