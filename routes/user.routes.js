const express = require("express");

const UserController = require("../controllers/user.controller");

const router = express.Router();

router.post("/signup", UserController.create);

router.post("/login", UserController.userLogin);

module.exports = router;