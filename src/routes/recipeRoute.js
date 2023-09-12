const express = require("express");
const router = express.Router();
const recipeController = require("../controllers/recipeController.js");
const { uploadImageRecipe } = require("../middlewares/uploadImage.js");
const {
	isLoginAuth,
	userRoleAuth,
} = require("../middlewares/authMiddleware.js");

router
	.get("/", recipeController.getAllRecipes)
	.post(
		"/",
		isLoginAuth,
		userRoleAuth,
		uploadImageRecipe,
		recipeController.createRecipe,
	)
	.get("/:id", recipeController.getRecipe)
	.put("/:id", isLoginAuth, uploadImageRecipe, recipeController.updateRecipe)
	.delete("/:id", isLoginAuth, recipeController.deleteRecipe)
	.get("/user-recipes/:user_id", recipeController.getRecipesUserByUserId);

module.exports = router;
