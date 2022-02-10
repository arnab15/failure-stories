let nodeEnv = process.env.NODE_ENV;
if (!nodeEnv || nodeEnv === "development") {
	console.log("NODE_ENV=", nodeEnv);
	require("dotenv").config();
}
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const { logger } = require("./logger");
const apiRouter = require("./routes");
require("./connectors/dbConnector")();
require("./connectors/redisConnector");
const app = express();
const PORT = process.env.PORT || 5000;
exports.nodeApp = () => {
	if (nodeEnv !== "production") {
		const morgan = require("morgan");
		app.use(morgan("common"));
	}
	app.use(
		cors({
			origin: [
				"http://localhost:3000",
				"http://localhost:3001",
				"http://192.168.100:3001",
				"https://failure-stories-frontend-sand.vercel.app",
			],
			credentials: true,
		})
	);
	app.use(express.json());
	app.use(cookieParser());
	app.use("/api/v1", apiRouter);

	app.use((req, res, next) => {
		res.send({
			error: {
				status: 404,
				message: "Invalid route",
			},
		});
	});

	app.use((err, req, res, next) => {
		res.send({
			error: {
				status: err.status || 500,
				message: err.message,
			},
		});
	});
	app.listen(PORT, () => {
		logger.info(`server is running on port ${PORT} ✅`);
	});
};
