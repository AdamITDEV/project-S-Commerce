const mongoose = require("mongoose");

const UserReposSchema = new mongoose.Schema(
  {
    Id_User: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    Content: String,
    Date_time: String,
    Image_content: String,
    Image_content1: String,
    Image_content2: String,
    Image_content3: String,
    Keyword_research: String,
    Price_sell: String,
    Label: String,
    Title: String,
    Total_viewer: {
      type: Number,
      default: 0,
      min: 0,
    },
    Total_like: {
      type: Number,
      default: 0,
      min: 0,
    },
    status: {
      type: Boolean,
      default: true,
    },
    Tags_Article1: String,
    Tags_Article2: String,
    Tags_Article3: String,
  },
  { timestamps: true }
);

// Trong model UserRepos, có thể chỉ định rõ collection name
module.exports = mongoose.model("User_repos", UserReposSchema, "user_repos");
