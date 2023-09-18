const express = require("express");
const cors = require("cors");
const xss = require("xss-clean");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");

const userRoute = require("./src/routes/userRoute.js");
const categoryRoute = require("./src/routes/categoryRoute.js");
const recipeRoute = require("./src/routes/recipeRoute.js");

const PORT = 5000;
const app = express();

app.use(express.static("public"));
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(xss());
app.use(cookieParser());

// routes
app.use("/users", userRoute);
app.use("/category", categoryRoute);
app.use("/recipe", recipeRoute);

app.listen(PORT, () => {
	console.log(`Server berjalan di PORT: ${PORT}`);
});
