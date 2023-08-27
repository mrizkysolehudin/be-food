const categoryModel = require("../models/categoryModel.js");
const { responseError, response } = require("../helpers/response.js");

const categoryController = {
	getAllCategories: (req, res) => {
		categoryModel
			.selectAllCategories()
			.then((result) => {
				return response(res, result.rows, 200, "get categories success");
			})
			.catch((error) => {
				return responseError(res, 500, error.message);
			});
	},

	createCategory: async (req, res) => {
		const { category_name } = req.body;

		const data = {
			category_name,
		};

		if (!category_name) {
			return responseError(res, 400, "please, input category name");
		}

		await categoryModel
			.insertCategory(data)
			.then(() => {
				return response(res, data, 201, "create category success");
			})
			.catch((error) => {
				return responseError(res, 500, error.message);
			});
	},

	getCategory: async (req, res) => {
		const category_id = req.params.id;
		categoryModel
			.selectCategory(category_id)
			.then((result) => {
				let { rowCount } = result;

				if (!rowCount) {
					return responseError(res, 404, "Category id is not found");
				}

				return response(res, result.rows, 200, "get category success");
			})
			.catch((error) => {
				return responseError(res, 500, error.message);
			});
	},

	updateCategory: async (req, res) => {
		try {
			const category_id = req.params.id;
			const { category_name } = req.body;

			const { rowCount } = await categoryModel.selectCategory(category_id);
			if (!rowCount) {
				return responseError(res, 404, "Category id is not found");
			}

			const data = {
				category_id,
				category_name,
			};

			if (!category_name) {
				return responseError(res, 400, "please, input category name");
			}

			categoryModel
				.updateCategory(data)
				.then(() => {
					return response(res, data, 200, "update category success");
				})
				.catch((error) => {
					return responseError(res, 500, error.message);
				});
		} catch (error) {
			return responseError(res, 500, error.message);
		}
	},

	deleteCategory: async (req, res) => {
		try {
			const category_id = req.params.id;

			const { rowCount } = await categoryModel.selectCategory(category_id);
			if (!rowCount) {
				return responseError(res, 400, "Category id is not found");
			}

			categoryModel
				.deleteCategory(category_id)
				.then(() => {
					return response(res, null, 200, "delete category success");
				})
				.catch((error) => {
					return responseError(res, 500, error.message);
				});
		} catch (error) {
			return responseError(res, 500, error.message);
		}
	},
};

module.exports = categoryController;
