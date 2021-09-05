const { logger } = require("../../logger");
const { uploadImage } = require("../../utils/cloudinary");

exports.addImage = async (req, res, next) => {
	console.log(req.body);
	try {
		const { asset_id, public_id, secure_url, url, original_filename } = await uploadImage(req.file.path, "images");
		logger.debug("file---", req.file);
		console.log(url);
		res.send({
			success: 1,
			file: {
				url,
			},
		});
	} catch (error) {
		logger.error(error);
		next(error);
	}
};
