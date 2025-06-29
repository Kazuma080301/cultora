const express = require('express');
const { signup, verifySignup } = require('../controllers/auth.controller');

const router = express.Router();

router.post('/signup', signup);
router.post('/otp/verify', verifySignup);

module.exports = router;