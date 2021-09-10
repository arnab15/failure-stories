const sgMail = require("@sendgrid/mail");
const jwt = require("jsonwebtoken");
const { logger } = require("../logger");
const apiKey = process.env.SENDGRID_API_KEY;
sgMail.setApiKey(apiKey);

exports.sendAccountConfirmationMail = async (email, userId) => {
	const tokenSecret = process.env.FORGOT_PASSWORD_TOKEN_SECRET;
	const token = jwt.sign({ userId }, tokenSecret, { expiresIn: "15m" });
	const url = `${process.env.FRONTEND_URL}/confirm-account/${token}`;
	const message = {
		to: email,
		from: {
			name: "Your failed story",
			email: "arnabsahoo10@gmail.com",
		},
		subject: "Confirm your email for failure signup",
		text: "thanks for signup with failure click link to verify your account ",
		html: `<div>
    <h1>thanks for signup with failure click link to verify your account </h1>
    <p>Your verification link will be valid for 30 min</p>
    <p>${url}<p>
    <a href="${url}">Verify Now</a>
    </div>`,
	};

	try {
		await sgMail.send(message);
	} catch (error) {
		logger.error(error);
	}
};

exports.sendPasswordResetMail = async (email, url) => {
	const message = {
		to: email,
		from: {
			name: "Your failed story",
			email: "arnabsahoo10@gmail.com",
		},
		subject: "Reset Your Password",
		text: "Please click below  link to reset your password",
		html: `<div>
    <h1>Please click below  link to reset your password</h1>
    <p>Link will be only valid for once and it will be only valid for 5 minutes</p>
    <p>${url}<p>
    <a href="${url}">Reset Password Now</a>
    </div>`,
	};

	try {
		await sgMail.send(message);
	} catch (error) {
		logger.error(error);
	}
};
