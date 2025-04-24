const { verifyToken } = require("../config/auth");

exports.protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    const decoded = verifyToken(token);
    req.user = { id: decoded.id };
    next();
  } catch (error) {
    res.status(401).json({ message: "Not authorized, token failed" });
  }
};

// authMiddleware.js
module.exports = {
  ensureAuthenticated: (req, res, next) => {
    if (req.session.user) {
      return next();
    }
    res.status(401).json({ message: "Unauthorized" });
  },

  ensureUserActive: async (req, res, next) => {
    try {
      if (!req.session.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const user = await User.findById(req.session.user._id);
      if (!user || !user.status) {
        return res.status(403).json({ message: "User account is inactive" });
      }

      next();
    } catch (error) {
      console.error("Auth middleware error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
};
