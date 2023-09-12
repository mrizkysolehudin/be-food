const cloudinary = require("../helpers/cloudinary.js");
const { response, responseError } = require("../helpers/response.js");
const recipeModel = require("../models/recipeModel.js");
const userModel = require("../models/userModel.js");

const recipeController = {
	getAllRecipes: async (req, res) => {
		let search = req.query.search || "";
		let sort = req.query.sort || "ASC";

		let page = parseInt(req.query.page) || 1;
		let limit = parseInt(req.query.limit) || 10;
		let offset = (page - 1) * limit;

		const resultCount = await recipeModel.countDataRecipe();
		const { count } = resultCount.rows[0];

		const totalData = parseInt(count);
		const totalPage = Math.ceil(totalData / limit);
		const pagination = {
			currentPage: page,
			limit,
			totalData,
			totalPage,
		};

		recipeModel
			.selectAllRecipes(search, sort, limit, offset)
			.then((result) => {
				return response(res, result.rows, 200, "get recipes success", pagination);
			})
			.catch((error) => {
				return responseError(res, 500, error.message);
			});
	},

	createRecipe: async (req, res) => {
		try {
			const { title, description, category_id, ingredients, video, user_id } =
				req.body;

			const uploadToCloudinary = await cloudinary.uploader.upload(req.file.path, {
				folder: "mama_recipe/recipe",
			});
			if (!uploadToCloudinary) {
				return responseError(res, 400, "upload image failed");
			}

			const imageUrl = uploadToCloudinary.secure_url;

			const data = {
				title,
				description,
				image: imageUrl,
				category_id,
				ingredients,
				video,
				user_id,
			};

			await recipeModel.insertRecipe(data);

			return response(res, data, 201, "create recipe success");
		} catch (error) {
			return responseError(res, 500, error.message);
		}
	},

	getRecipe: async (req, res) => {
		const recipe_id = req.params.id;

		recipeModel
			.selectRecipe(recipe_id)
			.then((result) => {
				let { rowCount } = result;
				if (!rowCount) {
					return responseError(res, 404, "Recipe id is not found");
				}

				return response(res, result.rows, 200, "get recipe success");
			})
			.catch((error) => {
				return responseError(res, 500, error.message);
			});
	},

	updateRecipe: async (req, res) => {
		try {
			const recipe_id = req.params.id;
			const uploadToCloudinary = await cloudinary.uploader.upload(req.file.path, {
				folder: "mama_recipe/recipe",
			});
			if (!uploadToCloudinary) {
				return responseError(res, 400, "upload image failed");
			}

			const imageUrl = uploadToCloudinary.secure_url;

			const { title, description, category_id, ingredients, video, user_id } =
				req.body;

			const { rowCount } = await recipeModel.selectRecipe(recipe_id);
			if (!rowCount) {
				return responseError(res, 404, "Recipe id is not found");
			}

			const data = {
				recipe_id,
				title,
				description,
				image: imageUrl,
				category_id,
				video,
				ingredients,
				user_id,
			};

			await recipeModel.updateRecipe(data);

			return response(res, data, 200, "update recipe success");
		} catch (error) {
			return responseError(res, 500, error.message);
		}
	},

	deleteRecipe: async (req, res) => {
		try {
			const recipe_id = req.params.id;

			const { rowCount } = await recipeModel.selectRecipe(recipe_id);
			if (!rowCount) {
				return responseError(res, 404, "Recipe id is not found");
			}

			recipeModel
				.deleteRecipe(recipe_id)
				.then(() => {
					return response(res, null, 200, "delete recipe success");
				})
				.catch((error) => {
					return responseError(res, 500, error.message);
				});
		} catch (error) {
			return responseError(res, 500, error.message);
		}
	},

	getRecipesUserByUserId: async (req, res) => {
		try {
			const user_id = req.params.user_id;

			const { rowCount } = await userModel.selectUser(user_id);
			if (!rowCount) {
				return responseError(res, 404, "User id is not found");
			}

			recipeModel
				.selectRecipesUserByUserId(user_id)
				.then((result) => {
					return response(res, result.rows, 200, "get user recipes success");
				})
				.catch((error) => {
					return responseError(res, 500, error.message);
				});
		} catch (error) {
			return responseError(res, 500, error.message);
		}
	},
};

module.exports = recipeController;
