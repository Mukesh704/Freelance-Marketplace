const userModel = require('../models/userModel');
const { generateToken } = require('../middlewares/authMiddleware');

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

module.exports = {
    registerController,
    loginController,
    logoutController,
}