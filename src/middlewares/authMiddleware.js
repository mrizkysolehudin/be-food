const jwt = require("jsonwebtoken");
const { responseError } = require("../helpers/response");

const isLoginAuth = async (req, res, next) => {
	try {
		let token;

		if (req.headers.authorization) {
			token = req.headers.authorization.split(" ")[1];

			if (token) {
				let decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
				req.payload = decoded;

				next();
			} else {
				throw new Error("Not authorized token expired. Please login again...");
			}
		} else {
			throw new Error("There is no token attached to the header.");
		}
	} catch (error) {
		return responseError(res, 500, error.message);
	}
};

const adminRoleAuth = (req, res, next) => {
	if (req?.payload?.user?.role === 0) {
		return next();
	} else {
		res.json({
			message: "Halaman ini diakses oleh role admin.",
		});
	}
};

const userRoleAuth = (req, res, next) => {
	if (req?.payload?.user?.role === 1) {
		return next();
	} else {
		res.json({
			message: "Halaman ini diakses oleh role user.",
		});
	}
};

module.exports = {
	isLoginAuth,
	userRoleAuth,
	adminRoleAuth,
};
