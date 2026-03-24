require('dotenv').config({ override: true });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Routes
const documentsRouter = require('./routes/documents');
const dashboardRouter = require('./routes/dashboard');
const authRouter = require('./routes/auth');
const tasksRouter = require('./routes/tasks');

app.use('/api/documents', documentsRouter);
app.use('/api/health-score', dashboardRouter);
app.use('/api/auth', authRouter);
app.use('/api/tasks', tasksRouter);

// MongoDB Connection
const connectDB = async () => {
    mongoose.set('bufferCommands', false);
    try {
        await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000 });
        console.log('MongoDB connected to actual database');
    } catch (err) {
        console.error('MongoDB connection failed. Error:', err.message);
    }
};
connectDB();

// Basic health check route
app.get('/', (req, res) => {
    res.send('LexPulse API is running');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
