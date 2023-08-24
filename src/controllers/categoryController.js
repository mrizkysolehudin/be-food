const categoryModel = require("../models/categoryModel.js");

const categoryController = {
	getAllCategories: (req, res) => {
		categoryModel
			.selectAllCategories()
			.then((result) => {
				res.status(200).json({ data: result.rows });
			})
			.catch((error) => {
				res.status(500).json({ error: error.message });
			});
	},

	createCategory: async (req, res) => {
		const { category_name } = req.body;

		const data = {
			category_name,
		};

		if (!category_name) {
			return res.status(400).json({ message: "please, input category name" });
		}

		await categoryModel
			.insertCategory(data)
			.then(() => {
				res.status(201).json({ data: data });
			})
			.catch((err) => {
				res.status(500).json(err);
			});
	},

	getCategory: async (req, res) => {
		const category_id = req.params.id;
		categoryModel
			.selectCategory(category_id)
			.then((result) => {
				let { rowCount } = result;

				if (!rowCount) {
					return res.status(404).json({ message: "Category id is not found" });
				}

				res.status(200).json({ data: result.rows });
			})
			.catch((err) => {
				res.status(500).json(err);
			});
	},

	updateCategory: async (req, res) => {
		try {
			const category_id = req.params.id;
			const { category_name } = req.body;

			const { rowCount } = await categoryModel.selectCategory(category_id);
			if (!rowCount) {
				return res.status(404).json({ message: "Category id is not found" });
			}

			const data = {
				category_id,
				category_name,
			};

			if (!category_name) {
				return res.status(400).json({ message: "please, input category name" });
			}

			categoryModel
				.updateCategory(data)
				.then(() => {
					res.status(200).json({ data: data });
				})
				.catch((err) => {
					res.status(500).json(err);
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
				return res.status(404).json({ message: "Category id is not found" });
			}

			categoryModel
				.deleteCategory(category_id)
				.then(() => {
					res.status(200).json({ message: "Category deleted" });
				})
				.catch((err) => {
					res.status(500).json(err);
				});
		} catch (error) {
			console.log(error);
		}
	},
};

module.exports = categoryController;
