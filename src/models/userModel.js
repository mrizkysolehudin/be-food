const db = require("../configs/db.js");

const selectAllusers = (search, sort, limit, offset) => {
	return db.query(`
	SELECT * FROM users 
	WHERE users.name LIKE '%${search}%'
	ORDER BY users.name ${sort}
	LIMIT ${limit}
	OFFSET ${offset}; 
	`);
};

const selectUser = (user_id) => {
	return db.query(`SELECT * FROM users WHERE user_id=${user_id}`);
};

const insertUser = (data) => {
	const { name, email, phone, password, confirmPassword, photo } = data;

	return db.query(
		`INSERT INTO users (name,email,phone,password,confirmPassword,photo) VALUES( '${name}', '${email}', '${phone}', '${password}', '${confirmPassword}', '${photo}')`,
	);
};

const updateUser = (data) => {
	const { user_id, name, email, phone, password, confirmPassword, photo } = data;
	return db.query(
		`UPDATE users SET name='${name}', email='${email}', phone='${phone}', password='${password}', confirmPassword='${confirmPassword}', photo='${photo}'  WHERE user_id=${user_id}`,
	);
};

const deleteUser = (user_id) => {
	return db.query(`DELETE FROM users WHERE user_id=${user_id}`);
};

const findEmail = (email) => {
	return db.query(`SELECT * FROM users WHERE email='${email}'`);
};

module.exports = {
	selectAllusers,
	selectUser,
	insertUser,
	updateUser,
	deleteUser,
	findEmail,
};
