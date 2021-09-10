const Joi = require("joi");
const validateComment = (comment) => {
	const schema = Joi.object({
		comment: Joi.string().trim().required(),
		storyId: Joi.objectId("Invalid story id").required(),
		// commentedBy: Joi.objectId("Invalid user id").required(),
	});
	return schema.validateAsync(comment);
};

const validateReply = (reply) => {
	const schema = Joi.object({
		reply: Joi.string().trim().required(),
		commentId: Joi.objectId("Invalid comment id").required(),
	});
	return schema.validateAsync(reply);
};

exports.validateComment = validateComment;
exports.validateReply = validateReply;
