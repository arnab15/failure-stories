const slugify = require("slugify");
const { customHttpError } = require("../../helpers/customError");
const { logger } = require("../../logger");

const { Tag } = require("../../models/tag");

exports.getTags = async (req, res, next) => {
	try {
		const tags = await Tag.find();
		res.send(tags);
	} catch (error) {
		logger.error(error);
		customHttpError(res, next, 500, "Internal Server Error");
	}
};

exports.addNewTag = async (req, res, next) => {
	try {
		const { emoji, title } = req.body;
		if (!emoji && !title) return customHttpError(res, next, 400, "Emoji and title is required");
		const tagSlug = slugify(title, "-");
		const newTag = new Tag({
			emoji,
			title,
			slug: tagSlug,
		});
		await newTag.save();
		res.status(201).send({ message: "new tag added Successfully" });
	} catch (error) {
		logger.error(error);
		customHttpError(res, next, 500, "Internal Server Error");
	}
};

exports.editTag = async (req, res, next) => {
	const { tagId } = req.params;
	if (!tagId) return customHttpError(res, next, 400, "tag id is required");
	try {
		const { emoji, title } = req.body;
		if (!emoji && !title) return customHttpError(res, next, 400, "Emoji and title and slug is required");
		const tagSlug = slugify(title, "-");
		const foundTag = await Tag.findById(tagId);
		if (!foundTag) return customHttpError(res, next, 404, "Tag not found");
		foundTag.emoji = emoji;
		foundTag.title = title;
		foundTag.slug = tagSlug;
		await foundTag.save();
		res.status(202).send({ message: "Tag updated Successfully" });
	} catch (error) {
		logger.error(error);
		customHttpError(res, next, 500, "Internal Server Error");
	}
};

exports.deleteTag = async (req, res, next) => {
	const { tagId } = req.params;
	if (!tagId) return customHttpError(res, next, 400, "tag id is required");
	try {
		const foundTag = await Tag.findById(tagId);
		if (!foundTag) return customHttpError(res, next, 404, "Tag not found");
		await Tag.findByIdAndDelete(tagId);
		res.status(204).send({ message: "Tag deleted successfully" });
	} catch (error) {
		logger.error(error);
		customHttpError(res, next, 500, "Internal Server Error");
	}
};
