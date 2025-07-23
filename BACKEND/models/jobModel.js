const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    clientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    budget: {
        type: Number,
        required: true,
    },
    duration: {
        type: Date,
        default: () => {
            const now = new Date();
            now.setMonth(now.getMonth()+1);
            return now;
        }
    },
    skillsRequired: [{
        type: String,
    }],
    proposals: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Proposal',
    }],
    status: {
        type: String,
        enum: ["open", "in progress", "completed", "cancelled"],
        default: "open",
    },
},
{timestamps: true});

module.exports = mongoose.model('Job', jobSchema);