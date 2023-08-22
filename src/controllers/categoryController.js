const categoryModel = require("../models/categoryModel.js");

const categoryController = {
	getAllCategory: (req, res) => {
		categoryModel
			.selectAllCategories()
			.then((result) => {
				res.json({ data: result.rows });
			})
			.catch((error) => {
				res.json({ error: error.message });
			});
	},

	createCategory: async (req, res) => {
		const { category_name } = req.body;

		const data = {
			category_name,
		};

		await categoryModel
			.insertCategory(data)
			.then(() => {
				res.json({ data: data });
			})
			.catch((err) => {
				res.json(err);
			});
	},

	getCategory: async (req, res) => {
		const category_id = req.params.id;
		categoryModel
			.selectCategory(category_id)
			.then((result) => {
				res.json({ data: result.rows });
			})
			.catch((err) => {
				res.json(err);
			});
	},

	updateCategory: async (req, res) => {
		try {
			const category_id = req.params.id;
			const { category_name } = req.body;

			const { rowCount } = await categoryModel.selectCategory(category_id);
			if (!rowCount) {
				return res.json({ message: "Category id is not found" });
			}

			const data = {
				category_id,
				category_name,
			};

			categoryModel
				.updateCategory(data)
				.then(() => {
					res.json({ data: data });
				})
				.catch((err) => {
					res.json(err);
				});
		} catch (error) {
			console.log(error);
		}
	},

	deleteCategory: async (req, res) => {
		try {
			const category_id = req.params.id;

			const { rowCount } = await categoryModel.selectCategory(category_id);
			if (!rowCount) {
				return res.json({ message: "Category id is not found" });
			}

			categoryModel
				.deleteCategory(category_id)
				.then(() => {
					res.json({ message: "Category deleted" });
				})
				.catch((err) => {
					res.json(err);
				});
		} catch (error) {
			console.log(error);
		}
	},
};

module.exports = categoryController;
