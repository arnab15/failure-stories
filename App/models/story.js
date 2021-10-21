const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const storySchema = new Schema(
	{
		story: {
			type: String,
			required: true,
			trim: true,
		},
		learning: {
			type: String,
			trim: true,
		},
		author: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		published: {
			type: Boolean,
			default: false,
		},
		bookmarkedBy: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
			},
		],
		tags: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Tag",
			},
		],
		postAnonomusly: {
			type: Boolean,
			default: false,
		},
	},
	{
		timestamps: true,
	}
);

exports.Story = mongoose.model("Story", storySchema);
