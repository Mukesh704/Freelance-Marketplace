const mongoose = require('mongoose');

const proposalSchema = new mongoose.Schema({
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
    bidAmount: {
        type: Number,
        required: true
    },
    coverLetter: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ["pending", "accepted", "rejected"],
        default: "pending",
    },
},
{timestamps: true});

module.exports = mongoose.model('Proposal', proposalSchema);