var express = require("express");
const apiRouter = express.Router();
const imageUploadRouter = require("./imageUpload");
const metaDataExtractRouter = require("./urlMetadataExtractor");
const authRouter = require("./Auth/authRouter");
const storiesRouter = require("./stories/storiesRouter");
const commentRouter = require("./comments/commentsRouter");
apiRouter.use("/", imageUploadRouter);
apiRouter.use("/", metaDataExtractRouter);
apiRouter.use("/", authRouter);
apiRouter.use("/", storiesRouter);
apiRouter.use("/", commentRouter);

module.exports = apiRouter;
