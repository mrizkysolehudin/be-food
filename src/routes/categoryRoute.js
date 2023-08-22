const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController.js");

router
	.get("/", categoryController.getAllCategory)
	.post("/", categoryController.createCategory)
	.get("/:id", categoryController.getCategory)
	.put("/:id", categoryController.updateCategory)
	.delete("/:id", categoryController.deleteCategory);

module.exports = router;
