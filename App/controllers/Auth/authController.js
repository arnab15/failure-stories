const createError = require("http-errors");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");

const { delDataAsync } = require("../../connectors/redisConnector");
const { hashPasword, comparePasword } = require("../../helpers/hashPassword");
const { signAccessToken, signRefreshToken, verifyRefreshToken } = require("../../helpers/jwtHelper");
const { logger } = require("../../logger");
const { User } = require("../../models/user");
const { sendAccountConfirmationMail, sendPasswordResetMail } = require("../../services/emailService");
const { generateUsername } = require("../../utils/generateUsername");
const { validateSignup, validateLogin } = require("../../validators/Auth/authValidator");
const { customHttpError } = require("../../helpers/customError");

let cookieConfig = {
	maxAge: 1000 * 60 * 15, // would expire after 15 minutes
	httpOnly: true,
	sameSite: "none",
	secure: process.env.NODE_ENV !== "production" ? false : true,
};

exports.signUpController = async (req, res, next) => {
	try {
		await validateSignup(req.body);
	} catch (error) {
		res.status(400).send(createError.BadRequest(error.details[0].message));
		return;
	}

	try {
		const { name, email, password } = req.body;
		const userExist = await User.findOne({ email });
		if (userExist) {
			return res.status(400).send(createError.Conflict(`${email} is already been registered`));
		}

		const hashedPassword = await hashPasword(password);
		const username = generateUsername(name);

		const user = new User({
			name,
			email,
			password: hashedPassword,
			username,
			profilePic: `https://avatars.dicebear.com/api/avataaars/${name}.svg`,
		});

		const savedUser = await user.save();
		await sendAccountConfirmationMail(savedUser.email, savedUser.id);

		const accessToken = await signAccessToken({
			userId: savedUser.id,
			payload: {
				userId: savedUser.id,
				name: savedUser.name,
				username: savedUser.username,
				profilePic: savedUser.profilePic,
			},
		});
		const refreshToken = await signRefreshToken({
			userId: savedUser.id,
			userId: savedUser.id,
			payload: {
				userId: savedUser.id,
				name: savedUser.name,
				username: savedUser.username,
				profilePic: savedUser.profilePic,
			},
		});

		res.cookie("_refToken", refreshToken, cookieConfig);
		return res.status(201).send({ accessToken: accessToken });
		// res.send({
		// 	accessToken,
		// 	refreshToken,
		// });
	} catch (error) {
		logger.error(error);
		next(createError.InternalServerError());
	}
};

exports.loginController = async (req, res, next) => {
	try {
		await validateLogin(req.body);
	} catch (error) {
		res.status(400).send(createError.BadRequest(error.details[0].message));
		return;
	}
	try {
		const { email, password } = req.body;
		const userExist = await User.findOne({ email });
		if (!userExist) {
			return res.status(404).send(createError.NotFound());
		}
		const isPasswordMatched = await comparePasword(password, userExist.password);
		if (!isPasswordMatched) return res.status(401).send(createError.Unauthorized());

		const accessToken = await signAccessToken({
			userId: userExist.id,
			payload: {
				userId: userExist.id,
				name: userExist.name,
				username: userExist.username,
				profilePic: userExist.profilePic,
			},
		});
		const refreshToken = await signRefreshToken({
			userId: userExist.id,
			userId: userExist.id,
			payload: {
				userId: userExist.id,
				name: userExist.name,
				username: userExist.username,
				profilePic: userExist.profilePic,
			},
		});
		res.cookie("_refToken", refreshToken, cookieConfig);
		return res.send({ accessToken: accessToken });

		// res.send({
		// 	accessToken,
		// 	refreshToken,
		// });
	} catch (error) {
		logger.error(error);
		res.status(500);
		next(createError.InternalServerError());
	}
};

exports.refreshTokenController = async (req, res, next) => {
	try {
		const refreshToken = req.cookies._refToken;
		if (!refreshToken) return res.status(400).send(createError.BadRequest());
		const payload = await verifyRefreshToken(refreshToken);
		console.log("payload", payload);
		const { userId, name, username, profilePic } = payload;
		if (payload.userId) {
			const accessToken = await signAccessToken({
				userId: payload.userId,
				payload: {
					userId,
					name,
					username,
					profilePic,
				},
			});
			const refToken = await signRefreshToken({
				userId: payload.userId,
				payload: {
					userId,
					name,
					username,
					profilePic,
				},
			});
			res.cookie("_refToken", refToken, cookieConfig);
			return res.send({ accessToken: accessToken });
		}
	} catch (error) {
		if (error.message === "Unauthorized") return res.status(401).send(createError.Unauthorized("Invalid Token"));
		logger.error(error);
		res.status(500);
		next(createError.InternalServerError());
	}
};

exports.logoutController = async (req, res, next) => {
	try {
		const refreshToken = req.cookies._refToken;
		if (!refreshToken) return res.status(400).send(createError.BadRequest("No token found"));
		const payload = await verifyRefreshToken(refreshToken);
		if (!payload.userId) return res.status(400).send(createError.BadRequest());
		await delDataAsync(payload.userId);
		res.clearCookie("_refToken");
		return res.sendStatus(204);
	} catch (error) {
		if (error.message === "Unauthorized") return res.status(401).send(createError.Unauthorized("Invalid Token"));
		logger.error(error);
		next(createError.InternalServerError());
	}
};

//TODO impose validation
exports.forgotPassword = async (req, res, next) => {
	try {
		const { email } = req.body;
		if (!email) return res.status(400).send(createError.BadRequest("No email provided"));
		const isEmailExist = await User.findOne({ email });
		if (!isEmailExist) return res.status(404).send(createError.NotFound("No user exist with this email"));
		const secret = process.env.FORGOT_PASSWORD_TOKEN_SECRET + isEmailExist.password;
		const token = jwt.sign({ id: isEmailExist.id }, secret, { expiresIn: "15m" });
		const url = `${process.env.FRONTEND_URL}/${isEmailExist.id}/${token}`;
		// console.log("url", url);
		await sendPasswordResetMail(email, url);
		return res.status(204).send();
	} catch (error) {
		logger.error(error);
		next(createError.InternalServerError());
	}
};

//TODO impose validation

exports.verifyForgotPasswordCredentials = async (req, res, next) => {
	try {
		const { id, token } = req.params;
		if (!id && !token) return res.status(400).send(createError.BadRequest());
		const user = await User.findById(id);
		if (!user) return res.status(400).send(createError.BadRequest("No user exists"));
		try {
			const secret = process.env.FORGOT_PASSWORD_TOKEN_SECRET + user.password;
			const payload = jwt.verify(token, secret);
			return res.status(200).send({
				verified: true,
			});
		} catch (error) {
			logger.error(error);
			return res.status(400).send(createError.BadRequest("Invalid token"));
		}
	} catch (error) {
		logger.error(error);
		res.status(500);
		next(createError.InternalServerError());
	}
};

//TODO impose validation
exports.resetPassword = async (req, res, next) => {
	try {
		const { id, token } = req.params;
		const { password } = req.body;
		if (!id && !token && !password) return res.status(400).send(createError.BadRequest());
		const user = await User.findById(id);
		if (!user) return res.status(400).send(createError.BadRequest("No user exists"));

		try {
			const secret = process.env.FORGOT_PASSWORD_TOKEN_SECRET + user.password;
			const payload = jwt.verify(token, secret);
		} catch (error) {
			logger.error(error);
			return res.status(400).send(createError.BadRequest("Invalid token"));
		}

		const hashedPassword = await hashPasword(password);
		user.password = hashedPassword;
		await user.save();
		return res.status(202).send();
	} catch (error) {
		logger.error(error);
		res.status(500);
		next(createError.InternalServerError());
	}
};

//Todo impose validation
exports.confirmAccountCreation = async (req, res, next) => {
	const { confirmToken } = req.params;
	if (!confirmToken) return res.status(400).send(createError.BadRequest("No token provided"));
	try {
		const decodedToken = jwt.decode(confirmToken);
		if (!decodedToken.userId) return res.status(400).send(createError.BadRequest());
		const user = await User.findById(decodedToken.userId);
		if (!user) return res.status(404).send(createError.BadRequest("No user find"));
		if (user.accountVerified) return res.status(409).send(createError.BadRequest("Account already verified"));

		const tokenSecret = process.env.FORGOT_PASSWORD_TOKEN_SECRET;
		jwt.verify(confirmToken, tokenSecret, async (error, payload) => {
			if (error) {
				const message = error.name === "JsonWebTokenError" ? "Token Invalid" : error.message;
				return res.status(405).send(createError.Unauthorized(message));
			}
			user.accountVerified = true;
			await user.save();
			return res.send({ verified: true });
		});
	} catch (error) {
		logger.error(error);
		res.status(500);
		next(createError.InternalServerError());
	}
};

exports.googleLogin = async (req, res, next) => {
	const bearerHeader = req.headers["x-auth-google"];
	if (bearerHeader) {
		const bearer = bearerHeader.split(" ");
		const bearerToken = bearer[1];
		const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRETE);
		try {
			const { payload } = await googleClient.verifyIdToken({
				idToken: bearerToken,
				audience: process.env.GOOGLE_CLIENT_ID,
			});
			const { sub: googleUserId, email, email_verified, picture, name } = payload;
			if (email_verified) {
				try {
					let user = await User.findOne({ email });
					if (!user) {
						const hashedPassword = await hashPasword(bearerToken);
						const username = generateUsername(name);

						const user = new User({
							name,
							email,
							password: hashedPassword,
							username,
							accountVerified: email_verified,
							googleId: googleUserId,
							profilePic: picture,
						});
						const savedUser = await user.save();
						const accessToken = await signAccessToken({
							userId: savedUser.id,
							payload: {
								userId: savedUser.id,
								name: savedUser.name,
								username: savedUser.username,
								profilePic: savedUser.profilePic,
							},
						});
						const refreshToken = await signRefreshToken({
							userId: savedUser.id,
							userId: savedUser.id,
							payload: {
								userId: savedUser.id,
								name: savedUser.name,
								username: savedUser.username,
								profilePic: savedUser.profilePic,
							},
						});

						res.cookie("_refToken", refreshToken, cookieConfig);
						return res.status(201).send({ accessToken: accessToken });
					} else {
						const accessToken = await signAccessToken({
							userId: user.id,
							payload: {
								userId: user.id,
								name: user.name,
								username: user.username,
								profilePic: user.profilePic,
							},
						});
						const refreshToken = await signRefreshToken({
							userId: user.id,
							payload: {
								userId: user.id,
								name: user.name,
								username: user.username,
								profilePic: user.profilePic,
							},
						});

						res.cookie("_refToken", refreshToken, cookieConfig);
						return res.status(200).send({ accessToken: accessToken });
					}
				} catch (error) {
					logger.error(error);
					return customHttpError(res, next, 500, "Internal Server error");
				}
			} else {
				return customHttpError(res, next, 403, "Please verify your google account");
			}
		} catch (error) {
			logger.error(error);
			return customHttpError(res, next, 403, "Something Went wrong");
		}
	} else {
		return customHttpError(res, next, 403, "Invalid Token Details");
	}
};
