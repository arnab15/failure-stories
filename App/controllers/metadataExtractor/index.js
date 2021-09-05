const urlMetadata = require("url-metadata");
exports.metaDataExtractController = async (req, res, next) => {
	const { url } = req.query;
	if (url) {
		try {
			const { description, image, title } = await urlMetadata(url);
			return res.send({
				success: 1,
				meta: {
					title,
					description,
					image: {
						url: image,
					},
				},
			});
		} catch (error) {}
	}
	console.log(req.query);
};
