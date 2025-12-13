import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import upload from "./middleware/Multer.js";
import cloudinary from "./Cloudinary.js";
import mongoose from "mongoose";
import Gallery from "./models/Gallery.js";
import uploadRoute from "./router/Upload.js";
import pujaRoute from "./router/PujaBooking.js";

dotenv.config();
const app = express();

app.use(express.json());

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.urlencoded({ extended: true }));
// Database Connection (MongoDB example)
mongoose
  .connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/mydb")
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ DB Connection Failed:", err));

// Contact Form 

// ✅ Contact Schema
const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  message: String,
  createdAt: { type: Date, default: Date.now },
});

const Contact = mongoose.model("Contact", contactSchema);

// ✅ Save Contact
app.post("/api/contact", async (req, res) => {
  try {
    const newContact = new Contact(req.body);
    await newContact.save();
    res.json({ success: true, message: "Message sent successfully!" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ✅ Get All Contacts (Admin Panel)
app.get("/api/contacts", async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ✅ Upload Single Image
app.post("/upload/image", upload.single("file"), async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "mern_uploads/images",
    });
    res.json({ url: result.secure_url, public_id: result.public_id });
  } catch (err) {
    res.status(500).json({ error: "Image upload failed", details: err.message });
  }
});

// ✅ Upload Single Video
app.post("/upload/video", upload.single("file"), async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "mern_uploads/videos",
      resource_type: "video",
    });
    res.json({ url: result.secure_url, public_id: result.public_id });
  } catch (err) {
    res.status(500).json({ error: "Video upload failed", details: err.message });
  }
});

// ✅ Upload Multiple Images


app.post("/upload/images", upload.array("files", 10), async (req, res) => {
  try {
    // Upload all files to Cloudinary
    const uploadPromises = req.files.map((file) =>
      cloudinary.uploader.upload(file.path, {
        folder: "mern_uploads/images",
      })
    );

    const results = await Promise.all(uploadPromises);

    // Save all URLs in MongoDB using the Gallery model
    const savedImages = await Promise.all(
      results.map(async (r) => {
        const newImage = new Gallery({ imageUrl: r.secure_url });
        return await newImage.save();
      })
    );

    // Respond with the stored records
    res.json(savedImages);
  } catch (err) {
    console.error("Upload failed:", err);
    res.status(500).json({
      error: "Multiple image upload failed",
      details: err.message,
    });
  }
});


app.use('/api/upload', uploadRoute);

app.use('/api/puja-booking', pujaRoute )


// Adimin login

const ADMIN_USER = {
  username: 'info.maapitambara@gmail.com',
  password: 'info.maapitambara'
};

// POST /api/admin/login
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;

  if (username === ADMIN_USER.username && password === ADMIN_USER.password) {
    return res.status(200).json({ message: 'Login successful', token: 'dummy-admin-token' });
  } else {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
});


// GET all images
app.get("/api/images", async (req, res) => {
  try {
    const images = await Gallery.find(); // Fetch all documents from the collection
    res.json(images);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch images", details: err.message });
  }
});

app.delete("/api/images/:id", async (req, res) => {
  try {
    const deletedImage = await Gallery.findByIdAndDelete(req.params.id);

    if (!deletedImage) {
      return res.status(404).json({ error: "Image not found" });
    }

    res.json({ message: "Image deleted successfully", deletedImage });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to delete image", details: err.message });
  }
});

app.listen(process.env.PORT, () =>
  console.log(`🚀 Server running on http://localhost:${process.env.PORT}`)
);



