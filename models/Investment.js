const mongoose = require('mongoose');

const investmentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  roi: { type: String, required: true }, // e.g., "5-7% Annually"
  riskLevel: { type: String, enum: ['Low', 'Medium', 'High'], required: true }
}, {
  timestamps: true 
});

module.exports = mongoose.model('Investment', investmentSchema);