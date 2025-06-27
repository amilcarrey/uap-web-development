const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/auth");
const {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
  bulkDeleteCompleted
} = require("../controllers/task.controller");

router.use(authMiddleware);

router.post("/", createTask);
router.get("/:boardId", getTasks);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);
router.delete("/bulk/:boardId", bulkDeleteCompleted);

module.exports = router;
