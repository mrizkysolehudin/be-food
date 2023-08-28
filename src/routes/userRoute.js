const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController.js");
const { uploadPhotoProfile } = require("../middlewares/uploadImage.js");

router
	.get("/", userController.getAllUsers)
	.post("/register", userController.registerUser)
	.post("/login", userController.loginUser)
	.get("/:id", userController.getUser)
	.put("/:id", uploadPhotoProfile, userController.updateUser)
	.delete("/:id", userController.deleteUser);

module.exports = router;
