const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const replySchema = new Schema(
	{
		reply: {
			type: String,
			trim: true,
			required: true,
		},
		repliedBy: {
			type: Schema.Types.ObjectId,
			ref: "User",
		},
	},
	{
		timestamps: true,
	}
);

const commentSchema = new Schema(
	{
		comment: {
			type: String,
			required: true,
			trim: true,
		},
		replies: [
			{
				type: replySchema,
			},
		],
		storyId: {
			type: Schema.Types.ObjectId,
		},
		commentedBy: {
			type: Schema.Types.ObjectId,
			ref: "User",
		},
	},
	{
		timestamps: true,
	}
);

commentSchema.index({ storyId: 1 });

exports.Comment = mongoose.model("Comment", commentSchema);
exports.Reply = mongoose.model("Reply", replySchema);
