const { uniqueNamesGenerator, NumberDictionary, adjectives } = require("unique-names-generator");

exports.generateUsername = (name) => {
	const numberDictionary = NumberDictionary.generate({ min: 100, max: 10000 });
	const config = {
		dictionaries: [["arnab"], adjectives, numberDictionary],
		separator: "",
	};

	const username = uniqueNamesGenerator(config); // Winona
	return username;
};
