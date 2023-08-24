const recipeModel = require("../models/recipeModel.js");

const recipeController = {
	getAllRecipes: (req, res) => {
		let search = req.query.search || "";
		let sort = req.query.sort || "ASC";

		recipeModel
			.selectAllRecipes(search, sort)
			.then((result) => {
				res.json({ data: result.rows });
			})
			.catch((error) => {
				res.json({ error: error.message });
			});
	},

	createRecipe: async (req, res) => {
		try {
			const {
				title,
				description,
				image,
				category_id,
				ingredients,
				video,
				user_id,
			} = req.body;

			const data = {
				title,
				description,
				image,
				category_id,
				ingredients,
				video,
				user_id,
			};

			await recipeModel.insertRecipe(data);

			res.json({ data });
		} catch (error) {
			res.json({ error: error.message });
		}
	},

	getRecipe: async (req, res) => {
		const recipe_id = req.params.id;

		recipeModel
			.selectRecipe(recipe_id)
			.then((result) => {
				res.json({ data: result.rows });
			})
			.catch((err) => {
				res.json(err);
			});
	},

	updateRecipe: async (req, res) => {
		try {
			const recipe_id = req.params.id;
			const {
				title,
				description,
				image,
				category_id,
				ingredients,
				video,
				user_id,
			} = req.body;

			const { rowCount } = await recipeModel.selectRecipe(recipe_id);
			if (!rowCount) {
				return res.json({ message: "Recipe id is not found" });
			}

			const data = {
				recipe_id,
				title,
				description,
				image,
				category_id,
				video,
				ingredients,
				user_id,
			};

			await recipeModel.updateRecipe(data);

			res.json({ data: data });
		} catch (error) {
			res.json({ error: error.message });
		}
	},

	deleteRecipe: async (req, res) => {
		try {
			const recipe_id = req.params.id;

			const { rowCount } = await recipeModel.selectRecipe(recipe_id);
			if (!rowCount) {
				return res.json({ message: "Recipe id is not found" });
			}

			recipeModel
				.deleteRecipe(recipe_id)
				.then(() => {
					res.json({ message: "Recipe deleted" });
				})
				.catch((err) => {
					res.json(err);
				});
		} catch (error) {
			console.log(error);
		}
	},
};

module.exports = recipeController;
