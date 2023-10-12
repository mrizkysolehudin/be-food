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

			let imageUrl = "";
			if (req.files.image) {
				const uploadImageToCloudinary = await cloudinary.uploader.upload(
					req.files?.image?.[0].path,
					{
						folder: "mama_recipe/recipe",
						resource_type: "image",
					},
				);
				if (!uploadImageToCloudinary) {
					return responseError(res, 400, "upload image failed");
				}
				imageUrl = uploadImageToCloudinary?.secure_url ?? "";
			}

			let videoUrl = "";
			if (req.files.video) {
				const uploadVideoToCloudinary = await cloudinary.uploader.upload(
					req.files?.video?.[0].path,
					{
						folder: "mama_recipe/recipe/video",
						resource_type: "video",
					},
				);
				if (!uploadVideoToCloudinary) {
					return responseError(res, 400, "upload video failed");
				}
				videoUrl = uploadVideoToCloudinary?.secure_url ?? "";
			}

			const data = {
				title,
				description: description ?? "",
				image: imageUrl,
				category_id: category_id ?? null,
				ingredients,
				video: videoUrl ?? video,
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

			let imageUrl = "";
			if (req.file) {
				const uploadToCloudinary = await cloudinary.uploader.upload(
					req?.file?.path,
					{
						folder: "mama_recipe/recipe",
					},
				);

				if (!uploadToCloudinary) {
					return responseError(res, 400, "upload image failed");
				}
				imageUrl = uploadToCloudinary?.secure_url ?? "";
			}

			const { title, description, category_id, ingredients, video, user_id } =
				req.body;

			const { rowCount, rows } = await recipeModel.selectRecipe(recipe_id);
			if (!rowCount) {
				return responseError(res, 404, "Recipe id is not found");
			}

			const currentRecipe = rows[0];

			const data = {
				recipe_id,
				title: title ?? currentRecipe?.title,
				description: description ?? currentRecipe?.description,
				image: imageUrl ?? currentRecipe?.image,
				category_id: category_id ?? currentRecipe?.category_id,
				video: video ?? currentRecipe?.video,
				ingredients: ingredients ?? currentRecipe?.ingredients,
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
