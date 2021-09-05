const express = require("express");
const router = express.Router();
const { metaDataExtractController } = require("../../controllers/metadataExtractor");
router.get("/extract-metadata", metaDataExtractController);
module.exports = router;
