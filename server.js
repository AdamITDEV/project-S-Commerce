// server.js (Express app)

const express = require("express");
const session = require("express-session");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
const UserRepos = require("./models/User_repos");
const User = require("./models/User");

const fileUpload = require("express-fileupload");

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(
  session({
    secret: "HcvSqiqy/92QuiG9uNtlufLdG+2sXkUi4ga9mqz9Hpo=",
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false,
      httpOnly: true,
      sameSite: "lax",
    },
  })
);

app.use(express.json());

mongoose
  .connect(
    "mongodb+srv://ngmthong04:weJfiz3EDWAebYk2@project-c.9fzhe.mongodb.net/mbitdev01",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use(
  session({
    secret: "HcvSqiqy/92QuiG9uNtlufLdG+2sXkUi4ga9mqz9Hpo=",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // set to true if using https
  })
);

const normalizeIds = (req, res, next) => {
  if (req.body.user && req.body.user.id) {
    req.body.user._id = req.body.user.id;
    delete req.body.user.id;
  }
  next();
};

// Sửa lại endpoint save-session để chuẩn hóa dữ liệu
app.post("/save-session", normalizeIds, (req, res) => {
  const { user, user_repos } = req.body;

  req.session.user = user;
  req.session.user_repos = user_repos;

  res.json({ success: true, message: "Session saved!" });
});

app.get("/session", (req, res) => {
  res.json({
    user: req.session.user,
    user_repos: req.session.user_repos,
  });
});

// server.js
app.post("/logout", (req, res) => {
  // Xóa session trên server
  req.session.destroy((err) => {
    if (err) {
      console.error("Session destroy error:", err);
      return res.status(500).json({ message: "Logout failed" });
    }

    // Xóa cookie session
    res.clearCookie("connect.sid", {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production", // true nếu dùng HTTPS
    });

    // Gửi response thành công
    res.json({
      success: true,
      message: "Logged out successfully",
    });
  });
});

const requireLogin = (req, res, next) => {
  if (!req.session.user) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized - Please login first",
    });
  }
  next();
};

app.get("/api/user/repos", requireLogin, async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.session.user._id);

    // Lấy thông tin user để kiểm tra thêm nếu cần
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Lấy danh sách repos của user
    const repos = await UserRepos.find({ Id_User: userId })
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        image: user.image,
      },
      repos: repos,
      count: repos.length,
    });
  } catch (error) {
    console.error("Error fetching user repos:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
});

// API lấy tất cả user_repos của người dùng đã đăng nhập (qua userId)
app.get("/api/user/repos/:userId", requireLogin, async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.params.userId);

    // Kiểm tra nếu userId không khớp với user đang đăng nhập
    if (userId.toString() !== req.session.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access to user repositories",
      });
    }

    // Lấy tất cả repos của user
    const repos = await UserRepos.find({ Id_User: userId })
      .sort({ createdAt: -1 })
      .lean();

    if (!repos || repos.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No repositories found for this user",
      });
    }

    res.json({
      success: true,
      count: repos.length,
      repos: repos,
    });
  } catch (error) {
    console.error("Error fetching user repos:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
});

app.use(
  fileUpload({
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    abortOnLimit: true,
  })
);

// Other middleware and configurations...

// Add routes
const articleuploadRoutes = require("./routes/articleuploadRoutes");
app.use("/api/Article", articleuploadRoutes);

app.listen(3001, () => {
  console.log("Server running on http://localhost:3001");
});
