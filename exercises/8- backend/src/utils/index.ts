import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { JwtPayload } from "../types";

export class AuthUtils {
  static async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  }

  static async comparePassword(
    password: string,
    hash: string
  ): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }

  static generateToken(payload: JwtPayload): string {
    const secret = process.env.JWT_SECRET;
    const expiresIn = process.env.JWT_EXPIRES_IN || "7d";

    if (!secret) {
      throw new Error("JWT_SECRET not configured");
    }

    return jwt.sign(payload, secret, { expiresIn } as jwt.SignOptions);
  }

  static verifyToken(token: string): JwtPayload {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new Error("JWT_SECRET not configured");
    }

    return jwt.verify(token, secret) as JwtPayload;
  }
}

export class PaginationUtils {
  static calculatePagination(page: number, limit: number, totalItems: number) {
    const currentPage = Math.max(1, page);
    const itemsPerPage = Math.min(Math.max(1, limit), 100); // Cap at 100 items per page
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const hasNextPage = currentPage < totalPages;
    const hasPrevPage = currentPage > 1;
    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    return {
      currentPage,
      totalPages,
      totalItems,
      itemsPerPage,
      hasNextPage,
      hasPrevPage,
      startItem,
      endItem,
      offset: (currentPage - 1) * itemsPerPage,
    };
  }
}

export class ValidationUtils {
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static isValidUUID(uuid: string): boolean {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  }

  static sanitizeString(str: string): string {
    return str.trim().replace(/\s+/g, " ");
  }
}
