const express = require('express');
const router = express.Router();
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const Video = require('../models/Video');
const dotenv = require('dotenv');

dotenv.config();

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Multer + Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'videos',
    resource_type: 'video',
    format: 'mp4',
  },
});

const upload = multer({ storage });

// POST /api/upload
router.post('/', upload.single('video'), async (req, res) => {
  try {
    const videoUrl = req.file.path;
    const title = req.body.title;

    const newVideo = new Video({ url: videoUrl, title });
    await newVideo.save();

    res.status(201).json(newVideo);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Upload failed' });
  }
});


router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const deletedVideo = await Video.findByIdAndDelete(id);

    if (!deletedVideo) {
      return res.status(404).json({ message: 'Video not found' });
    }

    res.status(200).json({ message: 'Video deleted successfully', deletedVideo });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Delete failed' });
  }
});

router.get('/', async (req, res) => {
  try {
    const videos = await Video.find().sort({ createdAt: -1 }); // newest first
    res.json(videos);
  } catch (err) {
    console.error('Error fetching videos:', err);
    res.status(500).json({ message: 'Failed to fetch videos' });
  }
});

module.exports = router;
