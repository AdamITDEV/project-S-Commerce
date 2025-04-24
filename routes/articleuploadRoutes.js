const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const UserRepos = require("../models/User_repos");
const User = require("../models/User");
const mammoth = require("mammoth");

// Middleware to check if user is authenticated
const requireLogin = (req, res, next) => {
  if (!req.session.user) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized - Please login first",
    });
  }
  next();
};

// Upload new article from DOCX file

// Upload new article from DOCX file
router.post("/uploadArticle", requireLogin, async (req, res) => {
  try {
    if (!req.files || !req.files.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const file = req.files.file;

    // Process DOCX file
    const result = await mammoth.extractRawText({ buffer: file.data });
    const paragraphs = result.value.split("\n").filter((p) => p.trim() !== "");

    const title = paragraphs[0] || "Untitled Document";
    const content = paragraphs.slice(1).join("\n");

    const userId = new mongoose.Types.ObjectId(req.session.user._id);
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Lấy tags từ session user
    const tag1 = user.user_tags1 || "";
    const tag2 = user.user_tags2 || "";
    const tag3 = user.user_tags3 || "";

    // Create new article
    const newArticle = new UserRepos({
      Id_User: user._id,
      Title: title,
      Content: content,
      Date_time: new Date().toISOString(),
      Total_viewer: 0,
      Total_like: 0,
      status: true,
      Tags_Article1: tag1,
      Tags_Article2: tag2,
      Tags_Article3: tag3,
      Image_content: "",
      Image_content1: "",
      Image_content2: "",
      Image_content3: "",
      Keyword_research: "",
      Price_sell: "",
      Label: "document",
    });

    const savedArticle = await newArticle.save();

    res.status(201).json({
      success: true,
      message: "Article uploaded successfully",
      repo: savedArticle,
    });
  } catch (error) {
    console.error("Error uploading article:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
});

// Update article
router.post("/updateArticle", requireLogin, async (req, res) => {
  try {
    const {
      articleId,
      title,
      content,
      keywordResearch,
      priceSell,
      Image_content,
      Image_content1,
      Image_content2,
      Image_content3,
    } = req.body;

    if (!articleId) {
      return res.status(400).json({
        success: false,
        message: "Article ID is required",
      });
    }

    // Build update object with only provided fields
    const updateFields = {};
    if (title !== undefined) updateFields.Title = title;
    if (content !== undefined) updateFields.Content = content;
    if (keywordResearch !== undefined)
      updateFields.Keyword_research = keywordResearch;
    if (priceSell !== undefined) updateFields.Price_sell = priceSell;
    if (Image_content !== undefined) updateFields.Image_content = Image_content;
    if (Image_content1 !== undefined)
      updateFields.Image_content1 = Image_content1;
    if (Image_content2 !== undefined)
      updateFields.Image_content2 = Image_content2;
    if (Image_content3 !== undefined)
      updateFields.Image_content3 = Image_content3;

    const updatedRepo = await UserRepos.findByIdAndUpdate(
      articleId,
      updateFields,
      { new: true }
    );

    if (!updatedRepo) {
      return res.status(404).json({
        success: false,
        message: "Article not found",
      });
    }

    res.json({
      success: true,
      message: "Article updated successfully",
      repo: updatedRepo,
    });
  } catch (error) {
    console.error("Error updating article:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
});

// Delete the most recent article
router.delete("/deleteArticle", requireLogin, async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.session.user._id);

    // Find and delete the most recent article for this user
    const deletedArticle = await UserRepos.findOneAndDelete(
      { Id_User: userId },
      { sort: { createdAt: -1 } }
    );

    if (!deletedArticle) {
      return res.status(404).json({
        success: false,
        message: "No articles found to delete",
      });
    }

    res.json({
      success: true,
      message: "Latest article deleted successfully",
      repo: deletedArticle,
    });
  } catch (error) {
    console.error("Error deleting article:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
});

// Update article tags
router.post("/updateTags", requireLogin, async (req, res) => {
  try {
    const { articleId, tags = [] } = req.body;

    if (!articleId) {
      return res.status(400).json({
        success: false,
        message: "Article ID is required",
      });
    }

    const updateFields = {
      Tags_Article1: tags[0] || "",
      Tags_Article2: tags[1] || "",
      Tags_Article3: tags[2] || "",
    };

    const updatedRepo = await UserRepos.findByIdAndUpdate(
      articleId,
      updateFields,
      { new: true }
    );

    if (!updatedRepo) {
      return res.status(404).json({
        success: false,
        message: "Article not found",
      });
    }

    res.json({
      success: true,
      message: "Tags updated successfully",
      repo: updatedRepo,
    });
  } catch (error) {
    console.error("Error updating tags:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
});

module.exports = router;
