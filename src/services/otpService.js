const crypto = require("crypto");
const Otp = require("../models/Otp");

const generateOtp = async (user, purpose) => {
  const otp = new Otp({
    entityType: user.constructor.modelName,
    entityId: user._id,
    code: crypto.randomInt(0, Math.pow(10, 6)).toString().padStart(6, "0"),
    purpose,
    expiresAt: new Date(Date.now() + 5 * 60 * 1000),
  });

  await otp.save();
  return otp.code;
};

const verifyOtp = async (user, purpose, code) => {
  const otp = await Otp.findOne({
    entityType: user.constructor.modelName,
    entityId: user._id,
    code,
    purpose,
    expiresAt: { $gt: new Date() }
  });

  return otp != null
};

module.exports = { generateOtp, verifyOtp };
