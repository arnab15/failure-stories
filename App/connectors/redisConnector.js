const redis = require("redis");
const { promisify } = require("util");
const { logger } = require("../logger");
const client = redis.createClient({
	host: process.env.REDIS_HOST,
	port: process.env.REDIS_PORT,
	password: process.env.REDIS_PASSWORD,
});
exports.redisClient = client;
client.on("connect", () => {
	logger.info(`redis client is connected on http://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`);
});
client.on("ready", () => {
	logger.info(`redis client is ready on http://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`);
});
client.on("error", () => {
	logger.error("redis client error");
});

client.on("end", () => {
	logger.error("redis client disconnected");
});

process.on("SIGINT", () => {
	client.quit();
});

exports.getDataAsync = promisify(client.get).bind(client);
exports.setDataAsync = promisify(client.set).bind(client);
exports.delDataAsync = promisify(client.del).bind(client);
