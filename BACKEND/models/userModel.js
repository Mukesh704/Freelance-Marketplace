const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
    },
    role: {
        type: String,
        enum: ['freelancer', 'client', 'admin'],
        default: 'client',
    },
    profile: {
        type: mongoose.Schema.Types.ObjectId,
        ref: Profile,
    },
    reviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review',
    }],
    rating: {
        type: Number,
        default: 0,
    },
    walletBalance: {
        type: Number,
        default: 0,
    }
},
{timestamps: true});

module.exports = mongoose.model('User', userSchema);