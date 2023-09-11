-- Active: 1692428075479@@localhost@5432@db_food_recipe

CREATE TABLE users (
  user_id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  password VARCHAR(255) NOT NULL,
  confirmPassword VARCHAR(255) NOT NULL,
  photo VARCHAR(255)
);


CREATE TABLE category (
  category_id SERIAL PRIMARY KEY,
  category_name VARCHAR(100) NOT NULL
);

CREATE TABLE recipe (
  recipe_id SERIAL PRIMARY KEY,
  title VARCHAR NOT NULL,
  description TEXT,
  image VARCHAR,
  category_id INT,
  ingredients TEXT NOT NULL,
  video VARCHAR,
  user_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES category(category_id),
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);

ALTER TABLE recipe add video TEXT DEFAULT NULL;
ALTER TABLE users add role INT;


INSERT INTO recipe(category_id,title,description,image,ingredients,user_id) VALUES(6,'Chiken Kare','','https://res.cloudinary.com/dskltx6xi/image/upload/v1693480347/mama_recipe/recipe/u8mwpowmu9hxfa5ajfsu.png', 'Chicken, Potatoes, Carrots, Onions, Garlic, Ginger, Curry powder, Coconut milk, Chicken broth, Vegetable oil.',6);