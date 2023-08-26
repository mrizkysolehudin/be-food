const response = (res, result, status, message, pagination) => {
	const responseData = {};

	responseData.statusCode = status;
	responseData.data = result;
	responseData.message = message || null;
	responseData.pagination = pagination || {};

	res.status(status).json(responseData);
};

module.exports = { response };
