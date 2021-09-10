const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
	{
		name: {
			type: String,
			required: true,
			maxLength: 100,
			trim: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
			trim: true,
		},
		password: {
			type: String,
			required: true,
		},
		accountVerified: {
			type: Boolean,
			default: false,
		},
		username: {
			type: String,
			unique: true,
			trim: true,
		},
	},
	{
		timestamps: true,
	}
);

const User = mongoose.model("User", userSchema);
exports.User = User;
