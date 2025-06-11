import { Router } from "express";
import { UserController } from "../modules/user/user.controller";
import { UserService } from "../modules/user/user.service";
import { UserRepository } from "../modules/user/user.repository";
import { authenticateToken } from "../middleware/auth.middleware";
import {
  validateUserRegistration,
  validateUserLogin,
  validateUserUpdate,
  validateRequest,
} from "../middleware/validation.middleware";

const router = Router();
const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const userController = new UserController(userService);

// Public routes
router.post(
  "/register",
  validateUserRegistration,
  validateRequest,
  userController.registerUser.bind(userController)
);
router.post(
  "/login",
  validateUserLogin,
  validateRequest,
  userController.loginUser.bind(userController)
);

// Protected routes
router.get(
  "/profile",
  authenticateToken,
  userController.getCurrentUser.bind(userController)
);
router.get(
  "/:id",
  authenticateToken,
  userController.getUserById.bind(userController)
);
router.put(
  "/:id",
  authenticateToken,
  validateUserUpdate,
  validateRequest,
  userController.updateUser.bind(userController)
);
router.delete(
  "/:id",
  authenticateToken,
  userController.deleteUser.bind(userController)
);

export default router;
