import bcrypt from "bcryptjs";

/**
 * Verifies a user's password.
 * @param inputPassword - The password provided by the user.
 * @param storedPassword - The hashed password stored in the database.
 * @returns A boolean indicating whether the password matches.
 */
export const verifyPassword = async (
  inputPassword: string,
  storedPassword: string
): Promise<boolean> => {
  return await bcrypt.compare(inputPassword, storedPassword);
};

/**
 * Hashes the user's password.
 * @param password - The plain text password to hash.
 * @returns The hashed password.
 */
export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, 10);
};
