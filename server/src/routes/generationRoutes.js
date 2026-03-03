const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const asyncHandler = require('express-async-handler');
const { upload, generateSyntheticData, downloadGeneration } = require('../controllers/generationController');

const router = express.Router();

router.use(protect);

// POST /api/generation/generate
router.post(
  '/generate',
  upload.single('file'),
  asyncHandler(generateSyntheticData)
);

// GET /api/generation/download/:fileName
router.get('/download/:fileName', asyncHandler(downloadGeneration));

// You can add more endpoints later, e.g.:
// router.get('/history', asyncHandler(getUserGenerations));
// router.get('/:id', asyncHandler(getGenerationById));

module.exports = router;