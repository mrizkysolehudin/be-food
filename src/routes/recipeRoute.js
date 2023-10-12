const express = require("express");
const router = express.Router();
const recipeController = require("../controllers/recipeController.js");
const {
	isLoginAuth,
	userRoleAuth,
} = require("../middlewares/authMiddleware.js");
const {
	uploadImageAndVideoRecipe,
} = require("../middlewares/uploadImageAndVideo.js");

router
	.get("/", recipeController.getAllRecipes)
	.post(
		"/",
		isLoginAuth,
		userRoleAuth,
		uploadImageAndVideoRecipe,
		recipeController.createRecipe,
	)
	.get("/:id", recipeController.getRecipe)
	.put(
		"/:id",
		isLoginAuth,
		uploadImageAndVideoRecipe,
		recipeController.updateRecipe,
	)
	.delete("/:id", isLoginAuth, recipeController.deleteRecipe)
	.get("/user-recipes/:user_id", recipeController.getRecipesUserByUserId);

module.exports = router;
