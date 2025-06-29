const Session = require("../models/Session");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require('uuid');

const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createToken = async (deviceId, user) => {
  const payload = user ? {type: 'user', id: user._id} : {type: 'guest', id: uuidv4()};
  const session = new Session({
    user: user,
    deviceId: deviceId,
    token: generateToken(payload),
  });

  await session.save();
  return session.token;
};

module.exports = { createToken };
