// src/controllers/generationController.js

const multer = require('multer');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs').promises;
const { PrismaClient } = require('@prisma/client');
const FormData = require('form-data');

const prisma = new PrismaClient();

// Create output directories if they don't exist
const UPLOADS_TEMP_DIR = 'uploads/temp';
const UPLOADS_OUTPUT_DIR = 'uploads/output';

async function ensureDirectories() {
  try {
    await fs.mkdir(UPLOADS_TEMP_DIR, { recursive: true });
    await fs.mkdir(UPLOADS_OUTPUT_DIR, { recursive: true });
  } catch (error) {
    console.error('Failed to create directories:', error);
  }
}

ensureDirectories();

// Multer setup – temporary disk storage for uploaded CSV
const upload = multer({
  dest: UPLOADS_TEMP_DIR,
  limits: { fileSize: 50 * 1024 * 1024 },   // 50 MB limit
  fileFilter: (req, file, cb) => {
    if (path.extname(file.originalname).toLowerCase() !== '.csv') {
      return cb(new Error('Only CSV files are allowed'));
    }
    cb(null, true);
  }
});

async function generateSyntheticData(req, res) {
  if (!req.file) {
    return res.status(400).json({ 
      success: false, 
      message: 'CSV file is required (field name: "file")' 
    });
  }

  const requestedRows = parseInt(req.body.rows) || 5000;
  if (requestedRows < 100 || requestedRows > 100000) {
    await fs.unlink(req.file.path).catch(() => {});
    return res.status(400).json({ 
      success: false, 
      message: 'Number of rows must be between 100 and 100,000' 
    });
  }

  const userId = req.user.userId;

  try {
    // ─── 1. Forward file + requested rows to ML microservice ───
    const formData = new FormData();

    // Read file as Buffer and append with filename
    const fileBuffer = await fs.readFile(req.file.path);
    formData.append('file', fileBuffer, {
      filename: req.file.originalname,
      contentType: 'text/csv'
    });

    formData.append('samples', requestedRows.toString());

    const mlResponse = await axios.post(
      process.env.ML_SERVICE_URL || 'http://localhost:8000/generate',
      formData,
      {
        headers: { ...formData.getHeaders() },
        timeout: 300000 // 5 minutes timeout
      }
    );

    const data = mlResponse.data;

    // Validate required response fields
    if (!data.synthetic_csv_content) {
      throw new Error('ML service did not return synthetic CSV content');
    }

    const syntheticContent = data.synthetic_csv_content;
    const qualityScore = data.quality_score ?? null;
    const actualRowsGenerated = data.rows_generated ?? requestedRows;
    const fileSize = Buffer.byteLength(syntheticContent, 'utf8');

    // ─── 2. Save synthetic CSV to local disk ───
    const outputFileName = `synthetic_${actualRowsGenerated}_${Date.now()}_${uuidv4().substring(0, 8)}.csv`;
    const outputFilePath = path.join(UPLOADS_OUTPUT_DIR, outputFileName);
    
    await fs.writeFile(outputFilePath, syntheticContent);

    // ─── 3. Clean up temporary uploaded file ───
    await fs.unlink(req.file.path).catch(() => {});

    // ─── 4. Save generation metadata to database ───
    const generation = await prisma.generation.create({
      data: {
        user_id: userId,
        original_file_name: req.file.originalname,
        rows_generated: actualRowsGenerated,
        quality_score: qualityScore,
        drive_link: `/api/generation/download/${outputFileName}`, // Local file download link
        generated_file_size: fileSize
      }
    });

    // ─── 5. Success response ───
    return res.status(201).json({
      success: true,
      message: 'Synthetic dataset generated successfully',
      generationId: generation.id,
      downloadLink: `/api/generation/download/${outputFileName}`,
      qualityScore: generation.quality_score,
      rowsGenerated: generation.rows_generated,
      createdAt: generation.created_at
    });
  } catch (error) {
    // Cleanup uploaded file on error
    if (req.file?.path) {
      await fs.unlink(req.file.path).catch(() => {});
    }

    console.error('Generation error:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to generate synthetic dataset',
      error: error.message
    });
  }
}

async function downloadGeneration(req, res) {
  const { fileName } = req.params;
  
  try {
    // Validate fileName to prevent directory traversal attacks
    if (fileName.includes('..') || fileName.includes('/') || fileName.includes('\\')) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid file name' 
      });
    }

    const filePath = path.join(UPLOADS_OUTPUT_DIR, fileName);
    
    // Check if file exists
    try {
      await fs.access(filePath);
    } catch (error) {
      return res.status(404).json({ 
        success: false, 
        message: 'File not found' 
      });
    }

    // Send file as attachment
    res.download(filePath, fileName);
  } catch (error) {
    console.error('Download error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to download file',
      error: error.message
    });
  }
}

module.exports = {
  upload,
  generateSyntheticData,
  downloadGeneration
};
