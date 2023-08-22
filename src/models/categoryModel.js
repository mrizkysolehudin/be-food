const db = require("../configs/db.js");

const selectAllCategories = () => {
	return db.query("SELECT * FROM category");
};

const selectCategory = (category_id) => {
	return db.query(`SELECT * FROM category WHERE category_id=${category_id}`);
};

const insertCategory = (data) => {
	const { category_name } = data;
	return db.query(
		`INSERT INTO category (category_name) VALUES( '${category_name}')`,
	);
};

const updateCategory = (data) => {
	const { category_id, category_name } = data;
	return db.query(
		`UPDATE category SET category_name='${category_name}'  WHERE category_id=${category_id}`,
	);
};

const deleteCategory = (category_id) => {
	return db.query(`DELETE FROM category WHERE category_id=${category_id}`);
};

module.exports = {
	selectAllCategories,
	selectCategory,
	insertCategory,
	updateCategory,
	deleteCategory,
};
