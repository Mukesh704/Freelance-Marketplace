const express = require('express');
const router = express.Router();

const { registerController, loginController, logoutController, forgotPasswordController, verifyOtpController, resetPasswordController } = require('../controllers/authController');

router.post('/register', registerController);
router.post('/login', loginController);
router.get('/logout', logoutController);
router.post('/forgot-password', forgotPasswordController);
router.post('/verify-otp', verifyOtpController);
router.post('/reset-password', resetPasswordController);

module.exports = router;