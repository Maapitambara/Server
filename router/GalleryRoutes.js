const express = require("express");
const router = express.Router();
import Gallery from "../models/Gallery";

router.post("/", async (req, res) => {
  try {
    const { imageUrl } = req.body;
    const newImage = new Gallery({ imageUrl });
    await newImage.save();
    res.status(200).json({ message: "Image URL saved successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to save image URL" });
  }
});

module.exports = router;
