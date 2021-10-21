const express = require("express");
const { getTags, addNewTag, editTag, deleteTag } = require("../../controllers/Tag/tagController");
const router = express.Router();

router.get("/tags", getTags);
router.post("/tags", addNewTag);
router.put("/tags/:tagId", editTag);
router.delete("/tags/:tagId", deleteTag);

module.exports = router;
