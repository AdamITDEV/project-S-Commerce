const express = require("express");
const router = express.Router();
const recommendationController = require("../controllers/recommendationController");
const authMiddleware = require("../middlewares/authMiddleware");

router.get(
  "/",
  authMiddleware.protect,
  recommendationController.getRecommendations
);
router.get("/tags", recommendationController.getPopularTags);

module.exports = router;
