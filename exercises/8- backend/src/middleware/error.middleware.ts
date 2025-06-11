import { Request, Response, NextFunction } from "express";

export const errorHandler = (
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error("Unhandled error:", error);

  const isDevelopment = process.env.NODE_ENV === "development";

  res.status(500).json({
    success: false,
    error: "Internal server error",
    message: isDevelopment ? error.message : "Something went wrong",
    ...(isDevelopment && { stack: error.stack }),
  });
};
