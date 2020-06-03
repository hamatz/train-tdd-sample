const express = require("express");
const todoController = require("../controllers/todo.controller");
const authMiddleware = require('../middleware/check-auth.mw');
const router = express.Router();

router.post("/", authMiddleware, todoController.create);
router.get("/", authMiddleware, todoController.getAll);
router.get("/:todoId", authMiddleware, todoController.getOneById);
router.put("/:todoId", authMiddleware, todoController.update);
router.delete("/:todoId", authMiddleware, todoController.delete);

module.exports = router;
