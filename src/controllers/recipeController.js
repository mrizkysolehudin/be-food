const recipeModel = require("../models/recipeModel.js");

const recipeController = {
	getAllRecipes: (req, res) => {
		let search = req.query.search || "";
		let sort = req.query.sort || "ASC";
		let limit = req.query.limit || 10;

		recipeModel
			.selectAllRecipes(search, sort, limit)
			.then((result) => {
				res.status(200).json({ data: result.rows });
			})
			.catch((error) => {
				res.status(500).json({ error: error.message });
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

			res.status(201).json({ data });
		} catch (error) {
			res.status(500).json({ error: error.message });
		}
	},

	getRecipe: async (req, res) => {
		const recipe_id = req.params.id;

		recipeModel
			.selectRecipe(recipe_id)
			.then((result) => {
				let { rowCount } = result;
				if (!rowCount) {
					return res.status(404).json({ message: "Recipe id is not found" });
				}

				res.status(200).json({ data: result.rows });
			})
			.catch((err) => {
				res.status(500).json(err);
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
				return res.status(404).json({ message: "Recipe id is not found" });
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

			res.status(200).json({ data: data });
		} catch (error) {
			res.status(500).json({ error: error.message });
		}
	},

	deleteRecipe: async (req, res) => {
		try {
			const recipe_id = req.params.id;

			const { rowCount } = await recipeModel.selectRecipe(recipe_id);
			if (!rowCount) {
				return res.status(404).json({ message: "Recipe id is not found" });
			}

			recipeModel
				.deleteRecipe(recipe_id)
				.then(() => {
					res.status(200).json({ message: "Recipe deleted" });
				})
				.catch((err) => {
					res.status(500).json(err);
				});
		} catch (error) {
			console.log(error);
		}
	},
};

module.exports = recipeController;
