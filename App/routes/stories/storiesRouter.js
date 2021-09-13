const express = require("express");
const {
	createStory,
	getStoyById,
	updateStory,
	getcurrentUserStories,
	getAllStories,
	deleteStory,
	bookmarkStory,
} = require("../../controllers/stories/storiesController");
const { isAuthenticated } = require("../../middlewares/isAuthenticated");
const router = express.Router();
router.get("/stories", getAllStories);
router.get("/stories/:storyId", getStoyById);
router.post("/stories", isAuthenticated, createStory);
router.post("/bookmark-story", isAuthenticated, bookmarkStory);
router.put("/stories/:storyId", isAuthenticated, updateStory);
router.delete("/stories/:storyId", isAuthenticated, deleteStory);
router.get("/authorStories", isAuthenticated, getcurrentUserStories);
module.exports = router;
