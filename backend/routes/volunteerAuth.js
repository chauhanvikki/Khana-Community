// backend/routes/volunteerAuth.js
import express from "express";
const router = express.Router();

router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    // Save volunteer to DB here...
    res.status(201).json({ message: "Volunteer account created" });
  } catch (error) {
    res.status(500).json({ message: "Error creating volunteer account" });
  }
});

export default router;
