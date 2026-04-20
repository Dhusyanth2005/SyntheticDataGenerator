const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const asyncHandler = require('express-async-handler');
const { upload, generateSyntheticData, downloadGeneration, getUserHistory, deleteGeneration } = require('../controllers/generationController');

const router = express.Router();

router.use(protect);

// POST /api/generation/generate
router.post(
  '/generate',
  upload.single('file'),
  asyncHandler(generateSyntheticData)
);

// GET /api/generation/history
router.get('/history', asyncHandler(getUserHistory));

// GET /api/generation/download/:fileName
router.get('/download/:fileName', asyncHandler(downloadGeneration));

// DELETE /api/generation/:id
router.delete('/:id', asyncHandler(deleteGeneration));

module.exports = router;