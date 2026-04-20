const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
dotenv.config();

const app = express();
const prisma = new PrismaClient();
app.use(cors({
  origin: [
    'http://localhost:3000',      // React development server (Vite)
    'http://localhost:5173',      // Common Vite default port
    'http://127.0.0.1:5173',
    'http://127.0.0.1:3000'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,              // Allow cookies if needed later
}));
app.use(express.json());

const authRoutes       = require('./routes/authRoutes');
const generationRoutes = require('./routes/generationRoutes'); // ← your generation router

app.use('/api/auth', authRoutes);
app.use('/api/generation', generationRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});