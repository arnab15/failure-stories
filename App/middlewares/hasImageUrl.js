const { logger } = require("../logger");

exports.hasImageUrl = (req, res, next) => {
	try {
		const { url } = req.body;
		if (url) {
			return res.send({
				success: 1,
				file: {
					url,
				},
			});
		} else {
			next();
		}
	} catch (error) {
		logger.error(error);
		next();
	}
};
