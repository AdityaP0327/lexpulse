const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    businessName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    industry: { type: String, enum: ['manufacturing', 'service', 'trading'], required: true },
    msmeType: { type: String, enum: ['micro', 'small', 'medium'], required: true },
    role: { type: String, enum: ['individual', 'sme', 'corporate'], default: 'sme' },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', userSchema);
