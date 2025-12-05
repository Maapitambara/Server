// models/PujaBooking.js
import mongoose from "mongoose";

const pujaBookingSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    mobile: {
      type: String,
      required: true,
    
    },
    email: {
      type: String,
    
      match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
    },
    address: {
      type: String,
    
    },
    datetime: {
      type: Date,
 
    },
    pujaType: {
      type: String,
      required: true,
      enum: [
        "Baglamukhi Vishesh Havan",
        "Court Case Vijay Praptiya",
        "Grah Dosh Puja",
        "Rajnaitik Pujan",
        "Laxmi Prapti Puja",
        "Manichit Vivah Puja",
        "Rognashak Puja",
        "Santan Prapti Puja",
        "Sammohan Puja",
        "Shatru Stambhan Puja",
        "Shatru Vinash Puja",
        "Vashikaran Puja",
        "Uchchatan Puja",
        "Videshan Puja",
        "Vivah Badha Nivaran Puja",
    
        "Karya Siddhi Puja",
        "Vastu Shanti Puja",
        "Naukri Prapti Puja",
      ],
    },
    participants: {
      type: Number,
      default: 1,
      min: 1,
    },
    mode: {
      type: String,
      required: true,
      enum: ["Online", "In-person"],
    },
    notes: {
      type: String,
   
    },
    bookingId: {
      type: String,
      unique: true,

    },
  },
  { timestamps: true }
);

// 🔹 Auto-generate Booking ID like PUJA2025-001
pujaBookingSchema.pre("validate", async function (next) {
  if (!this.bookingId) {
    const count = await mongoose.model("PujaBooking").countDocuments();
    this.bookingId = `PUJA${new Date().getFullYear()}-${String(count + 1).padStart(3, "0")}`;
  }
  next();
});

const PujaBooking = mongoose.model("PujaBooking", pujaBookingSchema);

export default PujaBooking;
