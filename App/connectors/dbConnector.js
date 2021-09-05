const mongoose = require("mongoose");
const dbURL = process.env.DB_URL;
const { logger } = require("../logger");
module.exports = () => {
	mongoose
		.connect(dbURL, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useCreateIndex: true,
		})
		.then(() => {
			logger.info(`Mongoose default connection is open to ${dbURL} ✅`);
		})
		.catch((err) => {
			logger.error("Unable to connect to data base ❌");
		});
	mongoose.connection.on("disconnected", function () {
		logger.warn("Mongoose default connection is disconnected ❗");
	});
};
