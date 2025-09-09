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

        res.status(201).json({
            success: true,
            response: user,
            token: token
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            error: 'Internal Server Error'
        })
    }
}

module.exports = {
    registerController,
}