const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tagSchema = new Schema(
	{
		emoji: {
			type: String,
		},
		slug: {
			type: String,
		},
		title: {
			type: String,
		},
	},
	{
		timestamps: true,
	}
);

exports.Tag = mongoose.model("Tag", tagSchema);
