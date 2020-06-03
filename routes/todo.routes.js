const express = require("express");
const todoController = require("../controllers/todo.controller");
const router = express.Router();

router.post("/", todoController.create);
router.get("/", todoController.getAll);
router.get("/:todoId", todoController.getOneById);
router.put("/:todoId", todoController.update);
router.delete("/:todoId", todoController.delete);

module.exports = router;
