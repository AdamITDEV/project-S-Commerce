const express = require("express");
const router = express.Router();
const User = require("../models/User");

// Lấy tất cả users
router.get("/", async (req, res) => {
  try {
    const users = await User.find().select("-password"); // ẩn mật khẩu
    res.status(200).json(users);
  } catch (err) {
    console.error("Error fetching users:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
