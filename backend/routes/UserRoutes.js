const express = require("express");
const jwt = require("jsonwebtoken");

const router = express.Router();
const secret = "asdafsfwf4kuiiuh4353lknlui9";

module.exports = (prisma) => {
  // Sign up
  router.post("/sign-up", async (req, res) => {
    try {
      const { firstname, lastname, email, password } = req.body;

      if (!firstname || !lastname || !email || !password) {
        return res.status(400).json({ msg: "Enter full details" });
      }

      const existingUser = await prisma.user.findUnique({ where: { email } });

      if (existingUser) {
        return res.status(400).json({ msg: "User already exists" });
      }

      await prisma.user.create({
        data: { firstname, lastname, email, password },
      });

      return res.status(201).json({ msg: "User signed up successfully" });
    } catch (e) {
      console.error("Signup error:", e);
      return res.status(500).json({ msg: "Something went wrong with signup", error: e.message });
    }
  });

  // Login
  router.post("/login", async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await prisma.user.findUnique({ where: { email } });

      if (!user) {
        return res.status(400).json({ msg: "Wrong email" });
      }

      if (user.password !== password) {
        return res.status(400).json({ msg: "Wrong password" });
      }

      const token = jwt.sign({ id: user.id }, secret);

      return res.status(200).json({ token });
    } catch (e) {
      console.error("Login error:", e);
      return res.status(500).json({ msg: "Something went wrong", error: e.message });
    }
  });

  // Get all users (only selected fields)
  router.get("/", async (req, res) => {
    try {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          firstname: true,
          lastname: true,
          email: true,
          password: true,
          gender: true,
          age: true,
          location: true,
          bio: true,
        },
      });

      res.status(200).json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  

  // Edit user by email
  router.put("/edit", async (req, res) => {
    try {
      const { email, firstname, lastname, password, gender, age, location, bio } = req.body;
      const parsedAge = age === '' || age === null || age === undefined ? null : parseInt(age);

      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        return res.status(404).json({ msg: "User not found" });
      }

      const updatedUser = await prisma.user.update({
        where: { email },
        data: {
          firstname,
          lastname,
          password,
          gender,
          age: parsedAge,
          location,
          bio,
        },
      });

      res.status(200).json({ msg: "User details updated successfully", updatedUser });
    } catch (e) {
      console.error("Update error:", e);
      return res.status(500).json({ msg: "Something went wrong", error: e.message });
    }
  });

  return router;
};
