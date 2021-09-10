const JWT = require("jsonwebtoken");
const createError = require("http-errors");
const { getDataAsync, setDataAsync, delDataAsync } = require("../connectors/redisConnector");
const { logger } = require("../logger");

exports.signAccessToken = ({ payload = {}, userId }) => {
	return new Promise((resolve, reject) => {
		const secret = process.env.ACCESS_TOKEN_SECRET;
		const options = {
			expiresIn: "30sec",
			issuer: "arnab.sahoo",
			audience: userId,
		};
		JWT.sign(payload, secret, options, (err, token) => {
			if (err) {
				logger.error(err);
				reject(createError.InternalServerError());
				return;
			}
			resolve(token);
		});
	});
};

exports.signRefreshToken = ({ payload = {}, userId }) => {
	return new Promise((resolve, reject) => {
		const secret = process.env.REFRESH_TOKEN_SECRET;
		const options = {
			expiresIn: "1y",
			issuer: "arnab.sahoo",
			audience: userId,
		};
		JWT.sign(payload, secret, options, (err, token) => {
			if (err) {
				logger.error(err);
				reject(createError.InternalServerError());
				return;
			}
			setDataAsync(userId, token, "EX", 365 * 24 * 60 * 60)
				.then(() => {
					resolve(token);
				})
				.catch((error) => {
					logger.error(error);
					reject(createError.InternalServerError());
					return;
				});
		});
	});
};

exports.verifyRefreshToken = (refreshToken) => {
	return new Promise((resolve, reject) => {
		JWT.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, payload) => {
			if (err) return reject(createError.Unauthorized());
			const userId = payload.aud;
			getDataAsync(userId)
				.then((result) => {
					if (refreshToken === result) return resolve(payload);
					reject(createError.Unauthorized());
				})
				.catch((err) => {
					logger.error(err);
					reject(createError.InternalServerError());
					return;
				});
		});
	});
};

// module.exports = {
// 	signAccessToken: (userId) => {
// 		return new Promise((resolve, reject) => {
// 			const payload = {};
// 			const secret = process.env.ACCESS_TOKEN_SECRET;
// 			const options = {
// 				expiresIn: "1h",
// 				issuer: "pickurpage.com",
// 				audience: userId,
// 			};
// 			JWT.sign(payload, secret, options, (err, token) => {
// 				if (err) {
// 					console.log(err.message);
// 					reject(createError.InternalServerError());
// 					return;
// 				}
// 				resolve(token);
// 			});
// 		});
// 	},
// 	verifyAccessToken: (req, res, next) => {
// 		if (!req.headers["authorization"]) return next(createError.Unauthorized());
// 		const authHeader = req.headers["authorization"];
// 		const bearerToken = authHeader.split(" ");
// 		const token = bearerToken[1];
// 		JWT.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
// 			if (err) {
// 				const message = err.name === "JsonWebTokenError" ? "Unauthorized" : err.message;
// 				return next(createError.Unauthorized(message));
// 			}
// 			req.payload = payload;
// 			next();
// 		});
// 	},
// 	signRefreshToken: (userId) => {
// 		return new Promise((resolve, reject) => {
// 			const payload = {};
// 			const secret = process.env.REFRESH_TOKEN_SECRET;
// 			const options = {
// 				expiresIn: "1y",
// 				issuer: "pickurpage.com",
// 				audience: userId,
// 			};
// 			JWT.sign(payload, secret, options, (err, token) => {
// 				if (err) {
// 					console.log(err.message);
// 					// reject(err)
// 					reject(createError.InternalServerError());
// 				}

// 				client.SET(userId, token, "EX", 365 * 24 * 60 * 60, (err, reply) => {
// 					if (err) {
// 						console.log(err.message);
// 						reject(createError.InternalServerError());
// 						return;
// 					}
// 					resolve(token);
// 				});
// 			});
// 		});
// 	},
// 	verifyRefreshToken: (refreshToken) => {
// 		return new Promise((resolve, reject) => {
// 			JWT.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, payload) => {
// 				if (err) return reject(createError.Unauthorized());
// 				const userId = payload.aud;
// 				client.GET(userId, (err, result) => {
// 					if (err) {
// 						console.log(err.message);
// 						reject(createError.InternalServerError());
// 						return;
// 					}
// 					if (refreshToken === result) return resolve(userId);
// 					reject(createError.Unauthorized());
// 				});
// 			});
// 		});
// 	},
// };
