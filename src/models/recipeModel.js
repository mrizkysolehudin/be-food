const db = require("../configs/db");

const selectAllRecipes = (search, sort, limit, offset) => {
	return db.query(` 
	SELECT recipe.recipe_id, recipe.title, recipe.description, category.category_name AS category, users.name as creator, recipe.image,    recipe.ingredients, recipe.video, TO_CHAR(recipe.created_at, 'DD-MM-YYYY HH24:MI:SS') AS created_at 
	FROM recipe
	JOIN category ON recipe.category_id = category.category_id
	JOIN users ON recipe.user_id = users.user_id
	WHERE recipe.title ILIKE '%${search}%' 
	ORDER BY recipe.title ${sort}
	LIMIT ${limit}
	OFFSET ${offset};
	`);
};

const insertRecipe = (data) => {
	const { title, description, image, category_id, ingredients, video, user_id } =
		data;

	return db.query(`INSERT INTO recipe (title, description, ingredients, image, video, user_id, category_id, created_at) 
	VALUES  ('${title}','${description}','${ingredients}', '${image}', '${video}', ${user_id},  ${category_id}, CURRENT_TIMESTAMP)`);
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
		video,
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
		video = $6,
		user_id = $7,
		created_at = CURRENT_TIMESTAMP
	WHERE
		recipe_id = $8
`;
	const values = [
		title,
		description,
		image,
		category_id,
		ingredients,
		video,
		user_id,
		recipe_id,
	];

	return db.query(query, values);
};

const deleteRecipe = (recipe_id) => {
	return db.query(`DELETE FROM recipe WHERE recipe_id=${recipe_id}`);
};

const countDataRecipe = () => {
	return db.query("SELECT COUNT(*) FROM recipe");
};

module.exports = {
	selectAllRecipes,
	insertRecipe,
	selectRecipe,
	updateRecipe,
	deleteRecipe,
	countDataRecipe,
};
