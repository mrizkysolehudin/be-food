const express = require("express");
const router = express.Router();
const recipeController = require("../controllers/recipeController.js");
const { uploadImageRecipe } = require("../middlewares/uploadImage.js");

router
	.get("/", recipeController.getAllRecipes)
	.post("/", uploadImageRecipe, recipeController.createRecipe)
	.get("/:id", recipeController.getRecipe)
	.put("/:id", uploadImageRecipe, recipeController.updateRecipe)
	.delete("/:id", recipeController.deleteRecipe);

module.exports = router;
