import { NextFunction, Request, RequestHandler, Response } from "express";
import jwt from "jsonwebtoken";
import { createResponse } from "./createResponse";

export interface AuthenticatedRequest<
  Params = Record<string, unknown>,
  ResBody = unknown,
  ReqBody = unknown,
  ReqQuery = qs.ParsedQs
> extends Request<Params, ResBody, ReqBody, ReqQuery> {
  user?: { id: string };
}

const JWT_SECRET = process.env.JWT_SECRET as string;

/**
 * Generates authentication token.
 * @param userId - The id of the user.
 * @returns An authentication token.
 */
export const generateToken = (userId: string): string => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "7d" });
};

/**
 * Verifies an authentication token.
 * @param token - The authentication token.
 * @returns The decoded user id.
 * @throws Will throw an error if the token is invalid or expired.
 */
export const verifyToken = (token: string) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded as { userId: string };
  } catch (error) {
    throw error;
  }
};

export const verifyAuthTokenExpress = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const token = req.headers.authorization?.split(" ")[1]; // Bearer <token>

  if (!token) {
    res.status(401).json({ message: "No token provided." });
    return; // Stop further execution
  }

  try {
    const decodedToken = verifyToken(token);
    req.user = { id: decodedToken.userId };

    if (!req.user) {
      res.status(500).json({ message: "Internal Server Error" });
      return; // Stop further execution
    }

    next(); // Pass control to the next middleware
  } catch (error) {
    if ((error as Error).name === "TokenExpiredError") {
      res.status(401).json({ message: "Token expired" });
    } else {
      res.status(401).json({ message: "Invalid token" });
    }
    return; // Stop further execution
  }
};
