const express = require("express");
const router = express.Router();
const { addImage } = require("../../controllers/imageUpload");
const { imageupload } = require("../../utils/multer");
const { logger } = require("../../logger");
const { hasImageUrl } = require("../../middlewares/hasImageUrl");

router.post("/images", [hasImageUrl, imageupload.single("image")], addImage, (err, req, res, next) => {
	logger.error(error);
	next(err);
});

module.exports = router;
