const createHttpError = require("http-errors");

const { customHttpError } = require("../../helpers/customError");
const { validateObjectId } = require("../../validators/validateObjectId");
const { Comment, Reply } = require("../../models/comment");
const { logger } = require("../../logger");
const { validateComment, validateReply } = require("../../validators/comment/commentValidator");
const { User } = require("../../models/user");

exports.createComment = async (req, res, next) => {
	try {
		await validateComment(req.body);
	} catch (error) {
		res.status(400).send(createHttpError.BadRequest(error.details[0].message));
		return;
	}

	try {
		const { comment, storyId } = req.body;
		const userId = req.user.aud;
		const userExist = await User.findById(userId);
		if (!userExist) return customHttpError(res, next, 404, "No user find");
		const newComment = new Comment({
			comment,
			storyId,
			commentedBy: userId,
		});
		await newComment.save();
		res.send(newComment);
	} catch (error) {
		logger.error(error);
		next(createHttpError.InternalServerError());
	}
};

exports.getCommentsByStoryId = async (req, res, next) => {
	const { storyId } = req.query;
	try {
		await validateObjectId("storyId", { storyId });
	} catch (error) {
		return customHttpError(res, next, 400, "Invalid Story Id");
	}
	try {
		const comments = await Comment.find({ storyId })
			.populate("commentedBy", "name")
			.populate({
				path: "replies.repliedBy",
				select: "name",
			})
			.sort([["createdAt", -1]]);
		return res.send(comments);
	} catch (error) {
		logger.error(error);
		return next(customHttpError(res, next, 500, "Internal server error"));
	}
};

exports.deleteComment = async (req, res, next) => {
	const { commentId } = req.params;
	try {
		await validateObjectId("commentId", { commentId });
	} catch (error) {
		return customHttpError(res, next, 400, "Invalid commentId Id");
	}
	try {
		const userId = req.user.aud;
		const comment = await Comment.findById(commentId);
		if (!comment) return customHttpError(res, next, 404, "No comment find");
		const userMatched = comment.commentedBy.equals(userId);
		if (!userMatched) return customHttpError(res, next, 402, "You don't have permission to perform it");
		await comment.remove();
		return res.status(202).send();
	} catch (error) {
		logger.log(error);
		return next(createHttpError.InternalServerError());
	}
};

/**
 *
 * @param {*} req { reply, commentId } = req.body
 * @param {*} res
 * @param {*} next
 * @returns
 * it's create a reply
 */
exports.createReply = async (req, res, next) => {
	try {
		await validateReply(req.body);
	} catch (error) {
		res.status(400).send(createHttpError.BadRequest(error.details[0].message));
		return;
	}
	try {
		const { reply, commentId } = req.body;
		const userId = req.user.aud;
		const userExist = await User.findById(userId);
		if (!userExist) return customHttpError(res, next, 404, "No user find");
		const comment = await Comment.findById(commentId);
		if (!comment) return customHttpError(res, next, 404, "No comment find  with this id");
		const newReply = new Reply({
			reply,
			repliedBy: userId,
		});
		console.log("com", comment);
		comment.replies.push(newReply);
		await comment.save();
		res.send(newReply);
	} catch (error) {
		logger.error(error);
		next(createHttpError.InternalServerError());
	}
};

exports.deleteReply = async (req, res, next) => {
	const { commentId, replyId } = req.params;
	try {
		await validateObjectId("commentId", { commentId });
		await validateObjectId("replyId", { replyId });
	} catch (error) {
		return customHttpError(res, next, 400, "Invalid commentId or replyId Id");
	}
	try {
		const userId = req.user.aud;
		const comment = await Comment.findById(commentId);
		if (!comment) return customHttpError(res, next, 404, "No comment find");
		const userMatched = comment.commentedBy.equals(userId);
		if (!userMatched) return customHttpError(res, next, 402, "You don't have permission to perform it");

		const reply = comment.replies.id(replyId);
		if (!reply) return customHttpError(res, next, 404, "Reply doesnot exists");
		reply.remove();
		await comment.save();
		res.status(204).send();
	} catch (error) {
		logger.log(error);
		return next(createHttpError.InternalServerError());
	}
};
