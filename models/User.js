const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  password: { type: String, required: true },
  balance: { type: Number, default: 0 },         // Available Cash
  investment: { type: Number, default: 0 },      // Invested Money
  riskProfile: { type: String, enum: ['Conservative', 'Moderate', 'Aggressive'], default: 'Moderate' },
  role: { type: String, enum: ['user', 'admin'], default: 'user' } 
}, {
  timestamps: true 
});

module.exports = mongoose.model('User', userSchema);