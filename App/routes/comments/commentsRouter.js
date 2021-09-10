const express = require("express");
const {
	createComment,
	getCommentsByStoryId,
	deleteComment,
	createReply,
	deleteReply,
} = require("../../controllers/comments/commentController");

const { isAuthenticated } = require("../../middlewares/isAuthenticated");
const router = express.Router();
router.post("/comments", isAuthenticated, createComment);
router.get("/comments", getCommentsByStoryId);
router.delete("/comments/:commentId", isAuthenticated, deleteComment);
router.delete("/comments/:commentId/reply/:replyId", isAuthenticated, deleteReply);
router.post("/comments/reply", isAuthenticated, createReply);

module.exports = router;
