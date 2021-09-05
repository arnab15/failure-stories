var express = require("express");
const apiRouter = express.Router();
const imageUploadRouter = require("./imageUpload");
const metaDataExtractRouter = require("./urlMetadataExtractor");
const authRouter = require("./Auth/authRouter");
const storiesRouter = require("./stories/storiesRouter");
apiRouter.use("/", imageUploadRouter);
apiRouter.use("/", metaDataExtractRouter);
apiRouter.use("/", authRouter);
apiRouter.use("/", storiesRouter);

module.exports = apiRouter;
