const multer = require("multer");

exports.upload = multer({
  storage: multer.diskStorage({}),
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(pptx|ppt|pdf)$/)) {
      cb(new Error("please upload a pptx,ppt,pdf file"), false);
      return;
    }
    cb(undefined, true);
  },
});

exports.imageupload = multer({
  storage: multer.diskStorage({}),
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      cb(new Error("please upload a pptx,ppt,pdf file"), false);
      return;
    }
    cb(undefined, true);
  },
});
