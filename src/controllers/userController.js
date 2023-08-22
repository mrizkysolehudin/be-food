const userModel = require("../models/userModel.js");

const userController = {
	getAllUsers: (req, res) => {
		userModel
			.selectAllusers()
			.then((result) => {
				res.json({ data: result.rows });
			})
			.catch((error) => {
				res.json({ error: error.message });
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
				res.json({ data: data });
			})
			.catch((err) => {
				res.json(err);
			});
	},

	getUser: async (req, res) => {
		const user_id = req.params.id;
		userModel
			.selectUser(user_id)
			.then((result) => {
				res.json({ data: result.rows });
			})
			.catch((err) => {
				res.json(err);
			});
	},

	updateUser: async (req, res) => {
		try {
			const user_id = req.params.id;
			const { name, email, phone, password } = req.body;

			const { rowCount } = await userModel.selectUser(user_id);
			if (!rowCount) {
				return res.json({ message: "user id is not found" });
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
					res.json({ data: data });
				})
				.catch((err) => {
					res.json(err);
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
				return res.json({ message: "user id is not found" });
			}

			userModel
				.deleteUser(user_id)
				.then(() => {
					res.json({ message: "User deleted" });
				})
				.catch((err) => {
					res.json(err);
				});
		} catch (error) {
			console.log(error);
		}
	},
};

module.exports = userController;
