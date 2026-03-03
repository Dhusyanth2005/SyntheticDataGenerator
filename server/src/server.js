const express = require('express');
const dotenv = require('dotenv');
const { PrismaClient } = require('@prisma/client');

dotenv.config();

const app = express();
const prisma = new PrismaClient();

app.use(express.json());

const authRoutes       = require('./routes/authRoutes');
const generationRoutes = require('./routes/generationRoutes'); // ← your generation router

app.use('/api/auth', authRoutes);
app.use('/api/generation', generationRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});