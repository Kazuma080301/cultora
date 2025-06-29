const express = require('express');
const { signup, verifySignup, signin, guestLogin } = require('../controllers/auth.controller');

const router = express.Router();

router.post('/signup', signup);
router.post('/otp/verify', verifySignup);
router.post('/signin', signin)
router.post('/guest', guestLogin)

module.exports = router;