const express = require("express");
const { getUserProfile, upadteName, updateBio } = require("../../controllers/profile/profileControllers");
const { isAuthenticated } = require("../../middlewares/isAuthenticated");
const router = express.Router();

router.get("/profile", isAuthenticated, getUserProfile);
router.post("/profile/update-name", isAuthenticated, upadteName);
router.post("/profile/update-bio", isAuthenticated, updateBio);

module.exports = router;
