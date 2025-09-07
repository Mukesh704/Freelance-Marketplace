const mongoose = require('mongoose');

const walletSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    unique: true,
    required: true,
  },
  balance: {
    type: Number,
    default: 0,
  },
  escrow: {
    type: Number,
    default: 0, // locked funds (client’s deposited money until released)
  },
  currency: {
    type: String,
    default: 'USD',
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('Wallet', walletSchema);