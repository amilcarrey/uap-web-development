const express = require("express");
const router = express.Router();
const { register, login, logout } = require("../controllers/auth.controller");
const { authMiddleware } = require("../middleware/auth");

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

// Verificar autenticación
router.get("/check", authMiddleware, (req, res) => {
  res.json({ authenticated: true });
});

module.exports = router;
