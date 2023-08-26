const db = require("../configs/db.js");

const selectAllusers = (search) => {
	return db.query(`SELECT * FROM users WHERE users.name LIKE '%${search}%'`);
};

const selectUser = (user_id) => {
	return db.query(`SELECT * FROM users WHERE user_id=${user_id}`);
};

const insertUser = (data) => {
	const { name, email, phone, password } = data;

	return db.query(
		`INSERT INTO users (name,email,phone,password) VALUES( '${name}', '${email}', '${phone}', '${password}')`,
	);
};

const updateUser = (data) => {
	const { user_id, name, email, phone, password } = data;
	return db.query(
		`UPDATE users SET name='${name}', email='${email}', phone='${phone}', password='${password}'  WHERE user_id=${user_id}`,
	);
};

const deleteUser = (user_id) => {
	return db.query(`DELETE FROM users WHERE user_id=${user_id}`);
};

module.exports = {
	selectAllusers,
	selectUser,
	insertUser,
	updateUser,
	deleteUser,
};
