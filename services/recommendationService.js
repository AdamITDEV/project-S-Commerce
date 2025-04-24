const User = require("../models/User");
const Article = require("../models/Article");
const Tag = require("../models/Tag");

// Get recommended articles based on user tags
exports.getRecommendedArticles = async (userId, ignoreUserTags = false) => {
  try {
    let query = { status: true };
    let sort = { totalViews: -1, totalLikes: -1, createdAt: -1 };

    if (!ignoreUserTags && userId) {
      const user = await User.findById(userId);
      if (user) {
        const userTags = [
          user.user_tags1,
          user.user_tags2,
          user.user_tags3,
        ].filter(Boolean);

        if (userTags.length > 0) {
          query.tags = { $in: userTags };
          // Boost articles with more matching tags
          sort = {
            $sort: {
              $add: [
                { $size: { $setIntersection: ["$tags", userTags] } },
                { $multiply: [0.5, "$totalLikes"] },
                { $multiply: [0.3, "$totalViews"] },
              ],
            },
          };
        }
      }
    }

    const articles = await Article.find(query)
      .populate("author", "name image")
      .sort(sort)
      .limit(20);

    return articles;
  } catch (error) {
    console.error("Error in getRecommendedArticles:", error);
    throw error;
  }
};

// Get popular tags
exports.getPopularTags = async (limit = 10) => {
  try {
    const tags = await Tag.find().sort({ popularity: -1 }).limit(limit);
    return tags;
  } catch (error) {
    console.error("Error in getPopularTags:", error);
    throw error;
  }
};

// Update tag popularity when an article is viewed
exports.updateTagPopularity = async (tags) => {
  try {
    const updatePromises = tags.map((tagName) =>
      Tag.updateOne(
        { name: tagName },
        { $inc: { popularity: 1 } },
        { upsert: true }
      )
    );
    await Promise.all(updatePromises);
  } catch (error) {
    console.error("Error in updateTagPopularity:", error);
    throw error;
  }
};
