const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

const comparePasswords = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

module.exports = {
  generateToken,
  verifyToken,
  hashPassword,
  comparePasswords,
};
