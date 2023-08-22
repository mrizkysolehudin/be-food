-- Active: 1692428075479@@localhost@5432@db_food_recipe

CREATE TABLE users (
  user_id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  password VARCHAR(255) NOT NULL
);


CREATE TABLE category (
  category_id SERIAL PRIMARY KEY,
  category_name VARCHAR(100) NOT NULL
);

CREATE TABLE recipe (
  recipe_id SERIAL PRIMARY KEY,
  food_name VARCHAR(100) NOT NULL,
  title VARCHAR(100) NOT NULL,
  description TEXT,
  image VARCHAR(255),
  category_id INT,
  popularity INT,
  ingredients TEXT[],
  steps TEXT[],
  video_steps TEXT[],
  user_id INT NOT NULL,
  created_at TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES Category(category_id),
  FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

