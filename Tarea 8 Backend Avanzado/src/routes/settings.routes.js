const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/auth");
const {
  getSettings,
  updateSettings
} = require("../controllers/settings.controller");

router.use(authMiddleware);

router.get("/", getSettings);
router.put("/", updateSettings);

module.exports = router;
