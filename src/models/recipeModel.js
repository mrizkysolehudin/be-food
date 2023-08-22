const db = require("../configs/db");

const selectAllRecipes = () => {
	return db.query(`SELECT * FROM recipe`);
};

const insertRecipe = (data) => {
	const { title, description, image, category_id, ingredients, user_id } = data;

	return db.query(`INSERT INTO recipe (title, description, ingredients, image, user_id, category_id, created_at) 
	VALUES  ('${title}','${description}','${ingredients}', '${image}', ${user_id},  ${category_id}, CURRENT_TIMESTAMP)`);
};

const selectRecipe = (recipe_id) => {
	return db.query(`SELECT * FROM recipe WHERE recipe_id=${recipe_id}`);
};

const updateRecipe = (data) => {
	const {
		recipe_id,
		title,
		description,
		image,
		category_id,
		ingredients,
		user_id,
	} = data;

	const query = `
	UPDATE recipe
	SET
		title = $1,
		description = $2,
		image = $3,
		category_id = $4,
		ingredients = $5,
		user_id = $6,
		created_at = CURRENT_TIMESTAMP
	WHERE
		recipe_id = $7
`;
	const values = [
		title,
		description,
		image,
		category_id,
		ingredients,
		user_id,
		recipe_id,
	];

	return db.query(query, values);
};

const deleteRecipe = (recipe_id) => {
	return db.query(`DELETE FROM recipe WHERE recipe_id=${recipe_id}`);
};

module.exports = {
	selectAllRecipes,
	insertRecipe,
	selectRecipe,
	updateRecipe,
	deleteRecipe,
};
