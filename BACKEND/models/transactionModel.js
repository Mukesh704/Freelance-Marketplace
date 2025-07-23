const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    from: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    to: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    contractId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Contract',
    },
    amount: {
        type: Number,
        required: true,
        min: 0,
    },
    type: {
        type: String,
        enum: ['deposit', 'withdraw', 'release', 'refund', 'platform_fee'],
        required: true,
    },
    method: {
        type: String,
        enum: ['wallet', 'stripe', 'razorpay', 'manual'],
        default: 'wallet',
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'completed',
    },
    referenceId: {
        type: String,
    },
},
{timestamps: true});

module.exports = mongoose.model('Transaction', transactionSchema);