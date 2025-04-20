// index.js
const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
const { PrismaClient } = require("@prisma/client");
const UserRoutes = require("./routes/UserRoutes");
const MediaRoutes = require("./routes/MediaRoutes");
const PostRoutes = require("./routes/PostRoutes");

dotenv.config();
const prisma = new PrismaClient();

const port = 3000;
app.use(cors());
app.use(express.json());
app.use("/user", UserRoutes(prisma));
app.use("/media", MediaRoutes(prisma));
app.use("/post",PostRoutes(prisma))

app.listen(port, () => {
  console.log("Server running on port", port);
});
