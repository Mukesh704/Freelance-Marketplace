const userModel = require('../models/userModel');
const { generateToken } = require('../middlewares/authMiddleware');
const nodemailer = require('nodemailer');
const { randomInt, createHash } = require('node:crypto');

async function registerController(req, res) {
    try {
        const {name, email, password} = req.body;

        if(!name || !email || !password) {
            return res.status(400).json({
                success: false,
                error: 'These fields are required',
            })
        }

        const check = await userModel.findOne({email: email});

        if(check) {
            return res.status(400).json({
                success: false,
                error: 'User already exosts, Please login!',
            })
        }

        const user = await userModel.create({name, email, password});

        const payload = {
            id: user.id,
            email: user.email,
            role: user.role
        }

        const token = generateToken(payload);
        res.cookie('token', token);

        res.status(201).json({
            success: true,
            response: user,
            message: 'User registered successfully',
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            error: 'Internal Server Error'
        })
    }
}

async function loginController(req, res) {
    try {
        const {email, password} = req.body;

        if(!email || !password) {
            return res.status(400).json({
                success: false,
                error: 'These fields are required',
            })
        }

        const user = await userModel.findOne({email: email});

        if(!user) {
            return res.status(401).json({
                success: false,
                error: 'incorrect email or password',
            })
        }

        const checkPass = await user.comparePassword(password);

        if(!checkPass) {
            return res.status(401).json({
                success: false,
                error: 'incorrect email or password',
            })
        }

        const payload = {
            id: user.id,
            email: user.email,
            role: user.role
        }

        const token = generateToken(payload);
        res.cookie('token', token);

        res.status(200).json({
            success: true,
            message: 'User logged in successfully',
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            error: 'Internal Server Error',
        })
    }
}

function logoutController(req, res) {
    try {
        res.clearCookie('token');
        res.status(200).json({
            success: true,
            message: 'User logged out successfully',
        })
    } catch (err) {
        res.status(500).json({
            success: false,
            error: 'Internal Server Error',
        })
    }
}

// ================= Forgot Password Controller with send OTP ==================
function hashOtp(otp, userId) {
  return createHash('sha256').update(otp + userId).digest('hex');
}

async function forgotPasswordController(req, res) {
    try {
        const {email} = req.body;

        if(!email) {
            return res.status(400).json({
                success: false,
                error: 'Email is required',
            })
        }

        const user = await userModel.findOne({email: email});

        if(!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found',
            })
        }

        const otp = randomInt(100000, 999999).toString();
        const otpHash = hashOtp(otp, user._id);

        user.otp = otpHash;
        user.otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
        await user.save();

        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.SMTP_EMAIL,
                pass: process.env.SMTP_PASSWORD,
            },
        });

        const mailOptions = {
            from: `"Support" <${process.env.SMTP_EMAIL}>`,
            to: user.email,
            subject: 'Your OTP for Password Reset',
            html: `<p>Your OTP for password reset is <b>${otp}</b>. It is valid for 10 minutes.</p>`,
        }

        await transporter.sendMail(mailOptions);

        res.status(200).json({
            success: true,
            message: 'OTP sent to your email address'
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            error: 'Internal Server Error',
        })
    }
}

async function verifyOtpController(req, res) {
    try {
        const {email, otp} = req.body;
        const user = await userModel.findOne({email: email});

        if(!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        if(!user.otp || !user.otpExpires) {
            return res.status(400).json({
                success: false,
                message: 'No OTP found, please request a new one',
            });
        }

        if(user.otpExpires < Date.now()) {
            user.otp = undefined;
            user.otpExpires = undefined;
            await user.save();
            return res.atatus(400).json({
                success: false,
                message: 'OPT Expired, please request a new one',
            });
        }

        const otpHash = hashOtp(otp, user._id);

        if(otpHash !== user.otp) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP",
            });
        }

        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();

        res.status(200).json({
            success: true,
            message: 'OTP verified successfully, you can now reset your password',
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            error: 'Internal Server Error',
        })
    }
}

module.exports = {
    registerController,
    loginController,
    logoutController,
    forgotPasswordController,
    verifyOtpController,
}