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
};

module.exports = userController;
