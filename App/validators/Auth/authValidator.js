const Joi = require("joi");
const validateSignup = (user) => {
	const schema = Joi.object({
		name: Joi.string().trim().min(3).required(),
		email: Joi.string().lowercase().trim().email().required(),
		password: Joi.string().trim().min(6).required(),
		confirmPassword: Joi.ref("password"),
	});
	return schema.validateAsync(user);
};

const validateLogin = (user) => {
	const schema = Joi.object({
		email: Joi.string().lowercase().email().trim().required(),
		password: Joi.string().min(6).required(),
	});
	return schema.validateAsync(user);
};

const validateChangePassword = (data) => {
	const schema = Joi.object({
		password: Joi.string().trim().min(6).required(),
		confirmPassword: Joi.string().trim().min(6).required(),
	});
	return schema.validate(data);
};
exports.validateLogin = validateLogin;
exports.validateSignup = validateSignup;
exports.validateChangePassword = validateChangePassword;
