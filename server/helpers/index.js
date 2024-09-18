const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const SECRET_KEY = process.env.JWT_SECRET || "secret";

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, username: user.username, name: user.name },
    SECRET_KEY
  );
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, SECRET_KEY);
  } catch (err) {
    throw new Error("Invalid token");
  }
};

const hashPassword = async (password) => {
  const saltRounds = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, saltRounds);
};

const comparePassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};

module.exports = { generateToken, verifyToken, hashPassword, comparePassword };
