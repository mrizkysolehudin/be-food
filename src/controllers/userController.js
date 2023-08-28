const userModel = require("../models/userModel.js");
const { response, responseError } = require("../helpers/response.js");
const bcrypt = require("bcryptjs");
const { generateToken, generateRefreshToken } = require("../helpers/jwt.js");

const userController = {
	getAllUsers: (req, res) => {
		let search = req.query.search || "";
		let sort = req.query.sort || "ASC";
		let limit = req.query.limit || 10;
		let offset = req.query.offset || 0;

		userModel
			.selectAllusers(search, sort, limit, offset)
			.then((result) => {
				return response(res, result.rows, 200, "get users success");
			})
			.catch((error) => {
				return responseError(res, 500, error.message);
			});
	},

	getUser: async (req, res) => {
		const user_id = req.params.id;
		userModel
			.selectUser(user_id)
			.then((result) => {
				let { rowCount } = result;
				if (!rowCount) {
					return responseError(res, 404, "User id is not found");
				}
				return response(res, result.rows, 200, "get user success");
			})
			.catch((error) => {
				return responseError(res, 500, error.message);
			});
	},

	updateUser: async (req, res) => {
		try {
			const user_id = req.params.id;
			const { name, email, phone, role } = req.body;
			const photo = req.file.filename;

			const { rowCount } = await userModel.selectUser(user_id);
			if (!rowCount) {
				return responseError(res, 404, "User id is not found");
			}

			const data = {
				user_id,
				name,
				email,
				phone,
				photo,
				role: role ?? 1,
			};

			userModel
				.updateUser(data)
				.then(() => {
					return response(res, data, 200, "update user success");
				})
				.catch((error) => {
					return responseError(res, 500, error.message);
				});
		} catch (error) {
			return responseError(res, 500, error.message);
		}
	},

	deleteUser: async (req, res) => {
		try {
			const user_id = req.params.id;

			const { rowCount } = await userModel.selectUser(user_id);
			if (!rowCount) {
				return responseError(res, 404, "User id is not found");
			}

			userModel
				.deleteUser(user_id)
				.then(() => {
					return response(res, null, 200, "delete user success");
				})
				.catch((error) => {
					return responseError(res, 500, error.message);
				});
		} catch (error) {
			return responseError(res, 500, error.message);
		}
	},

	registerUser: async (req, res) => {
		try {
			const { name, email, phone, password, confirmPassword, photo, role } =
				req.body;
			const passwordHash = bcrypt.hashSync(password);
			const confirmPasswordHash = bcrypt.hashSync(confirmPassword);

			const { rowCount } = await userModel.findEmail(email);
			if (rowCount) {
				return responseError(res, 400, "Email already taken.");
			}

			const data = {
				name,
				email,
				phone,
				password: passwordHash,
				confirmPassword: confirmPasswordHash,
				photo,
				role: role ?? 1,
			};

			await userModel.insertUser(data);
			return response(res, data, 201, "create user success");
		} catch (error) {
			return responseError(res, 500, error.message);
		}
	},

	loginUser: async (req, res) => {
		const { email, password } = req.body;

		userModel
			.findEmail(email)
			.then((result) => {
				const [user] = result.rows;

				if (!user) {
					return responseError(res, 404, "Email not found");
				}

				const checkPassword = bcrypt.compareSync(password, user.password);
				if (!checkPassword) {
					return responseError(res, 400, "Incorrect password");
				}

				delete user.password;
				delete user.confirmpassword;

				const payload = {
					user,
				};
				user.token = generateToken(payload);
				user.refreshToken = generateRefreshToken(payload);

				return response(res, user, 200, "login success");
			})
			.catch((error) => {
				return responseError(res, 500, error.message);
			});
	},
};

module.exports = userController;
