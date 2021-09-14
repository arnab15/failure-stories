const express = require("express");
const {
	getUserProfile,
	upadteName,
	updateBio,
	getBookmarkedStoriesOfUser,
} = require("../../controllers/profile/profileControllers");
const { isAuthenticated } = require("../../middlewares/isAuthenticated");
const router = express.Router();

router.get("/profile", isAuthenticated, getUserProfile);
router.post("/profile/update-name", isAuthenticated, upadteName);
router.post("/profile/update-bio", isAuthenticated, updateBio);
router.get("/profile/bookmarked-stories", isAuthenticated, getBookmarkedStoriesOfUser);

module.exports = router;
