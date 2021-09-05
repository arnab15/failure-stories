const httpError = require("http-errors");
const { customHttpError } = require("../../helpers/customError");
const { logger } = require("../../logger");
const { Story } = require("../../models/story");
const { User } = require("../../models/user");
const { validateObjectId } = require("../../validators/validateObjectId");

// exports.getStory = async (req, res, next) => {
// 	try {
// 		const { storyId } = req.params;
// 		if (!storyId) return customHttpError(res, next, 400, "Story Id is required");
// 		const story = await Story.findById(storyId);
// 		if (!story) return customHttpError(res, next, 404, "Story not found");
// 		return res.send(story);
// 	} catch (error) {
// 		logger.error(error);
// 		next(httpError.InternalServerError());
// 	}
// };

exports.getAllStories = async (req, res, next) => {
	try {
		const stories = await Story.find({ published: true }).populate("author", "-password -email");
		return res.send(stories);
	} catch (error) {
		logger.error(error);
		res.status(500);
		next(httpError.InternalServerError());
	}
};
exports.getStoyById = async (req, res, next) => {
	const { storyId } = req.params;
	try {
		await validateObjectId({ storyId });
	} catch (error) {
		return customHttpError(res, next, 400, "Invalid story id");
	}
	try {
		const { storyId } = req.params;
		const story = await Story.findById(storyId).populate("author", "-password -email");
		if (!story) return customHttpError(res, next, 404, "No story Found");
		return res.send(story);
	} catch (error) {
		logger.error(error);
		res.status(500);
		next(httpError.InternalServerError());
	}
};

exports.createStory = async (req, res, next) => {
	try {
		const userId = req.user.aud;
		const user = await User.findById(userId);
		if (!user) return customHttpError(res, next, 404, "User Not found");
		const { story } = req.body;
		if (!story) return customHttpError(res, next, 400, "Story is required");
		const newStory = new Story({
			story: JSON.stringify(story),
			author: user._id,
		});
		const savedStory = await newStory.save();
		console.log(savedStory);
		return res.send(savedStory);
	} catch (error) {
		logger.error(error);
		res.status(500);
		next(httpError.InternalServerError());
	}
	console.log("user", req.user);

	res.send(req.body);
};

exports.updateStory = async (req, res, next) => {
	try {
		await validateObjectId("storyId", req.params);
	} catch (error) {
		return customHttpError(res, next, 400, "Invalid Story Id");
	}
	try {
		const { storyId } = req.params;
		const userId = req.user.aud;
		const user = await User.findById(userId);
		if (!user) return customHttpError(res, next, 404, "User Not found");
		const { story: incommingStory, published } = req.body;
		console.log("req,body", req.body);

		// if (!req.body.story || !req.body.published) return customHttpError(res, next, 400, "Story or published is required");
		const story = await Story.findById(storyId);
		if (!story) return customHttpError(res, next, 404, "Story Not found");
		if (incommingStory) {
			story.story = JSON.stringify(incommingStory);
		}
		if (published) {
			story.published = published;
		}
		await story.save();
		return res.status(202).send();
	} catch (error) {
		logger.error(error);
		res.status(500);
		next(httpError.InternalServerError());
	}
};

exports.getcurrentUserStories = async (req, res, next) => {
	try {
		const { published } = req.query;
		const userId = req.user.aud;
		const user = await User.findById(userId);
		if (!user) return customHttpError(res, next, 404, "User Not found");
		if (published) {
			const stories = await Story.find({ author: userId, published });
			return res.send(stories);
		}
		const stories = await Story.find({ author: userId, published: false });
		return res.send(stories);
	} catch (error) {
		logger.error(error);
		res.status(500);
		next(httpError.InternalServerError());
	}
};

exports.deleteStory = async (req, res, next) => {
	const { storyId } = req.params;
	try {
		await validateObjectId("storyId", { storyId });
	} catch (error) {
		return customHttpError(res, next, 400, "Invalid Story Id");
	}
	try {
		const userId = req.user.aud;
		const user = await User.findById(userId);
		if (!user) return customHttpError(res, next, 404, "User Not found");
		await Story.findByIdAndDelete(storyId);
		return res.status(202).send()
	} catch (error) {
		logger.error(error);
		res.status(500);
		next(httpError.InternalServerError());
	}
};
