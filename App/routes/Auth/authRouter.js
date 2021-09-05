const express = require("express");
const router = express.Router();
const {
	signUpController,
	refreshTokenController,
	loginController,
	logoutController,
	forgotPassword,
	verifyForgotPasswordCredentials,
	resetPassword,
} = require("../../controllers/Auth/authController");
const { isAuthenticated } = require("../../middlewares/isAuthenticated");

router.post("/signup", signUpController);
router.post("/login", loginController);
router.delete("/logout", logoutController);
router.post("/refresh-token", refreshTokenController);
router.post("/forgot-password", forgotPassword);
router.post("/forgot-password/:id/:token", verifyForgotPasswordCredentials);
router.post("/reset-password/:id/:token", resetPassword);

module.exports = router;
