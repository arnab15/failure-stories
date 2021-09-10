// const sgMail = require("@sendgrid/mail");
// const apiKey = "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";
// sgMail.setApiKey(apiKey);

// const message = {
// 	to: "arnabsahoo07@gmail.com",
// 	from: {
// 		name: "Your failed story",
// 		email: "arnabsahoo10@gmail.com",
// 	},
// 	subject: "Confirm your email for failure signup",
// 	text: "thanks for signup with failure click link to verify your account ",
// 	html: `<div>
//     <h1>thanks for signup with failure click link to verify your account </h1>
//     <p>Your verification link will be valid for 30 min</p>
//     <a href="http://localhost:3000/login">Verify Now</a>
//     </div>`,
// };

// (async () => {
// 	try {
// 		const resp = await sgMail.send(message);
// 		console.log("response", resp);
// 	} catch (error) {
// 		console.error(error);

// 		if (error.response) {
// 			console.error(error.response.body);
// 		}
// 	}
// })();

const { uniqueNamesGenerator, names, NumberDictionary, adjectives } = require("unique-names-generator");
const numberDictionary = NumberDictionary.generate({ min: 100, max: 10000 });
const config = {
	dictionaries: [["arnab"], adjectives, numberDictionary],
	separator: "",
};

const characterName = uniqueNamesGenerator(config); // Winona
console.log("name--", characterName);
