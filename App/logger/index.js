const buildDevLogger = require("./dev-Logger");
const buildProdLogger = require("./prod-Logger");

let logger = null;
if (process.env.NODE_ENV !== "production") {
  logger = buildDevLogger();
} else {
  logger = buildProdLogger();
}

exports.logger = logger;
