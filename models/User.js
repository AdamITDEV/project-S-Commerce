const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default: "",
    },
    publicId: {
      type: String,
      default: "",
    },
    description: String,
    follower: {
      type: Number,
      default: 0,
    },
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    viewerprofile: {
      type: Number,
      default: 0,
    },
    likedArticles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Article",
      },
    ],
    experienttags: String,
    user_tags1: String,
    user_tags2: String,
    user_tags3: String,
    status: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
