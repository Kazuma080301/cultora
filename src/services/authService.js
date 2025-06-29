const User = require("../models/User");
const { createToken } = require('../services/sessionService')

const register = async (pendingUser, deviceId) => {
  const user = new User({
    name: pendingUser.name,
    email: pendingUser.email,
    password: pendingUser.password
  });

  await user.save();

  return createToken(deviceId, user)
};

module.exports = { register };
