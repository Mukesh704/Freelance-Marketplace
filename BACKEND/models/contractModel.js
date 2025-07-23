const mongoose = require('mongoose');

const contractSchema = new mongoose.Schema({
    jobId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
        required: true,
    },
    freelancerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    clientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    proposalId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Proposal',
        required: true,
    },
    status: {
        type: String,
        enum: ["active", "submitted", "completed", "cancelled"],
        default: "active",
    },
    messages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message'
    }],
    submissionFiles: [{
        type: String,
    }],
    paymentReleased: {
        type: Boolean,
        default: false,
    },
},
{timestamps: true})

module.exports = mongoose.model('Contract', contractSchema);