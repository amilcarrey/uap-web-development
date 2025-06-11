import { Request, Response, NextFunction } from "express";
import { body, param, validationResult } from "express-validator";

export const validateRequest = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400).json({
      success: false,
      error: "Validation failed",
      details: errors.array(),
    });
    return;
  }

  next();
};

// User validation rules
export const validateUserRegistration = [
  body("username")
    .isLength({ min: 3, max: 30 })
    .withMessage("Username must be between 3 and 30 characters")
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage("Username can only contain letters, numbers, and underscores"),

  body("email")
    .isEmail()
    .withMessage("Please provide a valid email")
    .normalizeEmail(),

  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];

export const validateUserLogin = [
  body("email")
    .isEmail()
    .withMessage("Please provide a valid email")
    .normalizeEmail(),

  body("password").notEmpty().withMessage("Password is required"),
];

export const validateUserUpdate = [
  body("username")
    .optional()
    .isLength({ min: 3, max: 30 })
    .withMessage("Username must be between 3 and 30 characters")
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage("Username can only contain letters, numbers, and underscores"),

  body("email")
    .optional()
    .isEmail()
    .withMessage("Please provide a valid email")
    .normalizeEmail(),

  body("password")
    .optional()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];

// Board validation rules
export const validateBoardCreation = [
  body("name")
    .isLength({ min: 1, max: 100 })
    .withMessage("Board name must be between 1 and 100 characters")
    .trim(),

  body("description")
    .optional()
    .isLength({ max: 500 })
    .withMessage("Description cannot exceed 500 characters")
    .trim(),
];

export const validateBoardUpdate = [
  body("name")
    .optional()
    .isLength({ min: 1, max: 100 })
    .withMessage("Board name must be between 1 and 100 characters")
    .trim(),

  body("description")
    .optional()
    .isLength({ max: 500 })
    .withMessage("Description cannot exceed 500 characters")
    .trim(),
];

// Task validation rules
export const validateTaskCreation = [
  body("text")
    .isLength({ min: 1, max: 500 })
    .withMessage("Task text must be between 1 and 500 characters")
    .trim(),
];

export const validateTaskUpdate = [
  body("text")
    .optional()
    .isLength({ min: 1, max: 500 })
    .withMessage("Task text must be between 1 and 500 characters")
    .trim(),

  body("completed")
    .optional()
    .isBoolean()
    .withMessage("Completed must be a boolean value"),
];

// Board sharing validation
export const validateBoardSharing = [
  body("user_email")
    .isEmail()
    .withMessage("Please provide a valid email")
    .normalizeEmail(),

  body("permission_level")
    .isIn(["editor", "viewer"])
    .withMessage('Permission level must be either "editor" or "viewer"'),
];

// Parameter validation
export const validateIdParam = [
  param("id").isUUID().withMessage("Invalid ID format"),
];

export const validateUserIdParam = [
  param("userId").isUUID().withMessage("Invalid user ID format"),
];

export const validateBoardIdParam = [
  param("boardId").isUUID().withMessage("Invalid board ID format"),
];
