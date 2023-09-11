const userModel = require("../models/userModel.js");
const { response, responseError } = require("../helpers/response.js");
const bcrypt = require("bcryptjs");
const { generateToken, generateRefreshToken } = require("../helpers/jwt.js");
const cloudinary = require("../helpers/cloudinary.js");
const redis = require("../configs/redis.js");

const userController = {
	getAllUsers: async (req, res) => {
		let search = req.query.search || "";
		let sort = req.query.sort || "ASC";

		let page = parseInt(req.query.page) || 1;
		let limit = parseInt(req.query.limit) || 10;
		let offset = (page - 1) * limit;

		const resultCount = await userModel.countDataUsers();
		const { count } = resultCount.rows[0];

		const totalData = parseInt(count);
		const totalPage = Math.ceil(totalData / limit);
		const pagination = {
			currentPage: page,
			limit,
			totalData,
			totalPage,
		};

		userModel
			.selectAllusers(search, sort, limit, offset)
			.then((result) => {
				return response(res, result.rows, 200, "get users success", pagination);
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

			const uploadToCloudinary = await cloudinary.uploader.upload(
				req?.file?.path,
				{
					folder: "mama_recipe/users",
				},
			);
			if (!uploadToCloudinary) {
				return responseError(res, 400, "upload image failed");
			}

			const imageUrl = uploadToCloudinary.secure_url;

			const { rowCount } = await userModel.selectUser(user_id);
			if (!rowCount) {
				return responseError(res, 404, "User id is not found");
			}

			const data = {
				user_id,
				name,
				email,
				phone,
				photo: imageUrl ?? "",
				role: role ?? 1,
			};

			userModel
				.updateUser(data)
				.then(() => {
					return response(res, data, 200, "update user success");
				})
				.catch((error) => {
					return responseError(res, 500, error);
				});
		} catch (error) {
			return responseError(res, 500, error);
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

	deleteProfilePhoto: async (req, res) => {
		try {
			const user_id = req.params.id;

			const { rowCount } = await userModel.selectUser(user_id);
			if (!rowCount) {
				return responseError(res, 404, "User id is not found");
			}

			userModel
				.deletePhotoUser(user_id)
				.then(() => {
					return response(res, null, 200, "delete photo user success");
				})
				.catch((error) => {
					return responseError(res, 500, error.message);
				});
		} catch (error) {
			return responseError(res, 500, error.message);
		}
	},

	// redis
	getById: (req, res) => {
		const id = req.params.id;

		userModel
			.selectUser(id)
			.then((result) => {
				const dataRedis = redis.set(`getFromRedis/${id}`, JSON.stringify(result), {
					EX: 180,
					NX: true,
				});
				res.send({
					fromCache: false,
					data: dataRedis,
				});
			})
			.catch((error) => {
				res.json({ message: error.message });
			});
	},
};

module.exports = userController;
