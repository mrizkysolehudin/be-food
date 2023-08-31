const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController.js");
const { uploadPhotoProfile } = require("../middlewares/uploadImage.js");
const hitById = require("../helpers/hitByRedis.js");

router
	.get("/", userController.getAllUsers)
	.post("/register", userController.registerUser)
	.post("/login", userController.loginUser)
	.get("/:id", userController.getUser)
	.put("/:id", uploadPhotoProfile, userController.updateUser)
	.delete("/:id", userController.deleteUser)
	.delete("/photo/:id", userController.deleteProfilePhoto)
	.get("/getFromRedis/:id", hitById, userController.getById);

module.exports = router;
