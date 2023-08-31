const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController.js");
const {
	adminRoleAuth,
	isLoginAuth,
} = require("../middlewares/authMiddleware.js");

router
	.get("/", categoryController.getAllCategories)
	.post("/", isLoginAuth, adminRoleAuth, categoryController.createCategory)
	.get("/:id", categoryController.getCategory)
	.put("/:id", isLoginAuth, adminRoleAuth, categoryController.updateCategory)
	.delete("/:id", isLoginAuth, adminRoleAuth, categoryController.deleteCategory);

module.exports = router;
