const { customHttpError } = require("../../helpers/customError");
const { logger } = require("../../logger");
const { Story } = require("../../models/story");
const { User } = require("../../models/user");

exports.getUserProfile = async (req, res, next) => {
	try {
		const { aud } = req.user;
		console.log("userid", req.user);
		const user = await User.findById(aud).select("-password -accountVerified -googleId");
		if (!user) return customHttpError(res, next, 400, "User not exists");
		console.log("user", user);
		return res.send(user);
	} catch (error) {
		logger.error(error);
		return customHttpError(res, next, 500, "Internal Server Error");
	}
};

exports.upadteName = async (req, res, next) => {
	try {
		const { name } = req.body;
		if (!name) return customHttpError(res, next, 400, "Name is required");
		if (typeof name !== "string") return customHttpError(res, next, 400, "Name mustbe a string");

		const { aud } = req.user;
		console.log("userid", req.user);
		const user = await User.findById(aud).select("-password -accountVerified -googleId");
		if (!user) return customHttpError(res, next, 404, "User not exists");
		user.name = name;
		await user.save();
		return res.status(204).send();
	} catch (error) {
		logger.error(error);
		return customHttpError(res, next, 500, "Internal Server Error");
	}
};

exports.updateBio = async (req, res, next) => {
	try {
		const { bio } = req.body;
		if (!bio) return customHttpError(res, next, 400, "Bio is required");
		if (typeof bio !== "string") return customHttpError(res, next, 400, "Bio mustbe a string");

		const { aud } = req.user;
		console.log("userid", req.user);
		const user = await User.findById(aud).select("name");
		if (!user) return customHttpError(res, next, 404, "User not exists");
		user.bio = bio;
		await user.save();
		return res.status(204).send();
	} catch (error) {
		logger.error(error);
		return customHttpError(res, next, 500, "Internal Server Error");
	}
};

exports.updateUsername = async (req, res, next) => {
	try {
		const { username } = req.body;
		if (!username) return customHttpError(res, next, 400, "Bio is required");
		if (typeof username !== "string") return customHttpError(res, next, 400, "Bio mustbe a string");

		const { aud } = req.user;
		console.log("userid", req.user);
		const user = await User.findById(aud).select("name");
		if (!user) return customHttpError(res, next, 404, "User not exists");
		user.username = username;
		await user.save();
		return res.status(204).send();
	} catch (error) {
		logger.error(error);
		return customHttpError(res, next, 500, "Internal Server Error");
	}
};

exports.getBookmarkedStoriesOfUser = async (req, res, next) => {
	try {
		const { aud } = req.user;
		console.log("userid", req.user);
		const user = await User.findById(aud).select("bookmarkedStories");
		if (!user) return customHttpError(res, next, 404, "User not exists");
		const stories = await Story.find({ _id: { $in: user.bookmarkedStories } })
			.populate("author", "name")
			.select("-bookmarkedBy");
		return res.send(stories);
	} catch (error) {
		logger.error(error);
		return customHttpError(res, next, 500, "Internal Server Error");
	}
};
