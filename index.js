const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const userRoute = require("./src/routes/userRoute.js");
const categoryRoute = require("./src/routes/categoryRoute.js");

const PORT = 5000;
const app = express();

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

// routes
app.use("/users", userRoute);
app.use("/category", categoryRoute);

app.listen(PORT, () => {
	console.log(`Server berjalan di PORT: ${PORT}`);
});
