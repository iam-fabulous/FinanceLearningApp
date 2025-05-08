const express = require("express");
const AuthController = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/auth/login", AuthController.login);
router.post("/auth/logout", authMiddleware, AuthController.logout);

module.exports = router;
