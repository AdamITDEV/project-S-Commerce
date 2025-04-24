const recommendationService = require("../services/recommendationService");

// Get recommended articles for user
exports.getRecommendations = async (req, res) => {
  try {
    const userId = req.user?.id;
    const ignoreUserTags = req.query.ignoreUserTags === "true";

    const recommendedItems = await recommendationService.getRecommendedArticles(
      userId,
      ignoreUserTags
    );

    res.json({ recommendedItems });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get popular tags
exports.getPopularTags = async (req, res) => {
  try {
    const tags = await recommendationService.getPopularTags();
    res.json({ tags });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
