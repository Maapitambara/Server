import express from "express";
import Booking from "../models/PujaBooking.js";

const router = express.Router();

// POST route (to create a booking)
router.post("/", async (req, res) => {
  try {
    const booking = new Booking(req.body);
    await booking.save();
    res.status(201).json({ message: "Booking saved!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET route (to list all bookings)
router.get("/", async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;   // ✅ important for `import pujaRoute from "./router/PujaBooking.js"`
