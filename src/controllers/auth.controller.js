const bcrypt = require("bcryptjs");
const sendEmail = require("../services/emailService");
const { generateOtp, verifyOtp } = require("../services/otpService");
const { register } = require("../services/authService");
const { createToken } = require("../services/sessionService");
const User = require("../models/User");
const PendingUser = require("../models/PendingUser");

const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res
        .status(400)
        .json({ message: "User already exists, try signin instead" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let pendingUser = await PendingUser.findOne({ email });
    if (pendingUser) {
      pendingUser.password = hashedPassword;
      pendingUser.save();
    } else {
      pendingUser = new PendingUser({
        name,
        email,
        password: hashedPassword,
      });
      await pendingUser.save();
    }

    const otp = await generateOtp(pendingUser, "signup");

    // Send email
    setImmediate(async () => {
      try {
        await sendEmail(
          pendingUser.email,
          "Otp for Signup",
          `<p>Your Otp for signup is ${otp}. Otp will expire in 5 minutes.</p>`
        );
        console.log(`📩 Otp sent to ${pendingUser.email}`);
      } catch (error) {
        console.error("❌ Failed to send otp:", error);
      }
    });

    res.json({ message: "Please Verify OTP sent to email" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const verifySignup = async (req, res) => {
  try {
    console.log(req.body)
    const { email, otp, deviceId } = req.body;

    const pendingUser = await PendingUser.findOne({ email });
    if (await verifyOtp(pendingUser, "signup", otp)) {
      token = await register(pendingUser, deviceId);
      return res.json({ messge: "Signing In", token: token });
    } else {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const signin = async (req, res) => {
  try {
    const { email, password, deviceId } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    token = await createToken(deviceId, user);
    res.json({
      message: "Login successful",
      token: token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const guestLogin = async (req, res) => {
  const { deviceId } = req.body;
  token = await createToken(deviceId);
  res.json({
    message: "Signing In",
    token: token,
  });
};

module.exports = {
  signup,
  verifySignup,
  signin,
  guestLogin,
};
