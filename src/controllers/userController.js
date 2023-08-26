const userModel = require("../models/userModel.js");

const userController = {
	getAllUsers: (req, res) => {
		let search = req.query.search || "";

		userModel
			.selectAllusers(search)
			.then((result) => {
				res.status(200).json({ data: result.rows });
			})
			.catch((error) => {
				res.status(500).json({ error: error.message });
			});
	},

	createUser: async (req, res) => {
		const { name, email, phone, password } = req.body;

		const data = {
			name,
			email,
			phone,
			password,
		};

		await userModel
			.insertUser(data)
			.then(() => {
				res.status(201).json({ data: data });
			})
			.catch((err) => {
				res.status(500).json(err);
			});
	},

	getUser: async (req, res) => {
		const user_id = req.params.id;
		userModel
			.selectUser(user_id)
			.then((result) => {
				let { rowCount } = result;
				if (!rowCount) {
					return res.status(404).json({ message: "User id is not found" });
				}

				res.status(200).json({ data: result.rows });
			})
			.catch((err) => {
				res.status(500).json(err);
			});
	},

	updateUser: async (req, res) => {
		try {
			const user_id = req.params.id;
			const { name, email, phone, password } = req.body;

			const { rowCount } = await userModel.selectUser(user_id);
			if (!rowCount) {
				return res.status(404).json({ message: "user id is not found" });
			}

			const data = {
				user_id,
				name,
				email,
				phone,
				password,
			};

			userModel
				.updateUser(data)
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

	deleteUser: async (req, res) => {
		try {
			const user_id = req.params.id;

			const { rowCount } = await userModel.selectUser(user_id);
			if (!rowCount) {
				return res.status(404).json({ message: "user id is not found" });
			}

			userModel
				.deleteUser(user_id)
				.then(() => {
					res.status(200).json({ message: "User deleted" });
				})
				.catch((err) => {
					res.status(500).json(err);
				});
		} catch (error) {
			console.log(error);
		}
	},
};

module.exports = userController;
