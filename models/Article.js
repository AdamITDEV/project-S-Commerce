const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    imageContent: String,
    images: [String],
    keywordResearch: String,
    price: {
      type: Number,
      default: 0,
    },
    label: String,
    totalViews: {
      type: Number,
      default: 0,
    },
    totalLikes: {
      type: Number,
      default: 0,
    },
    status: {
      type: Boolean,
      default: true,
    },
    tags: [String],
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Article", articleSchema);
