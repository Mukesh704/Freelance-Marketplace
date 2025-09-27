const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
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
        ref: 'Profile',
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
    },
    otp: String,
    otpExpires: Date,
},
{timestamps: true});

userSchema.pre("save", async function(next) {
    const user = this;
    if(!user.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(user.password, salt);
        user.password = hashedPass;
        next();
    } catch (err) {
        return next(err);
    }
});

userSchema.methods.comparePassword = async function(userPassword) {
    try {
        return await bcrypt.compare(userPassword, this.password)
    } catch (err) {
        throw err;
    }
}

module.exports = mongoose.model('User', userSchema);