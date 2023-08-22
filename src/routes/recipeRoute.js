const express = require("express");
const router = express.Router();
const recipeController = require("../controllers/recipeController.js");

router
	.get("/", recipeController.getAllRecipes)
	.post("/", recipeController.createRecipe)
	.get("/:id", recipeController.getRecipe)
	.put("/:id", recipeController.updateRecipe)
	.delete("/:id", recipeController.deleteRecipe);

module.exports = router;
