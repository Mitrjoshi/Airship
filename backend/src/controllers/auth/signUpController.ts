import { checkUserForSignUp, createUser } from "@/services/authServices";
import { createResponse } from "@/utils/createResponse";
import { hashPassword } from "@/utils/passwordUtils";
import { generateToken } from "@/utils/tokenUtils";
import { Request, Response } from "express";

interface I_Request {
  username: string;
  password: string;
  email: string;
}

export const signUpController = async (
  req: Request<{}, {}, I_Request>,
  res: Response
) => {
  const { username, password, email } = req.body;

  try {
    //Fetch project details
    const userExists = await checkUserForSignUp(username, email);

    if (userExists?.data?.id) {
      res.status(400).json(createResponse(true, "User already exists", null));
      return;
    }

    const hashedPassword = await hashPassword(password);
    await createUser(username, hashedPassword, email);
    const token = generateToken(userExists?.data?.id);

    res.status(200).json(createResponse(true, "User created", token));
  } catch (error) {
    res.status(500).send(
      createResponse(false, "An unexpected error occurred.", null, {
        message: (error as Error).message,
      })
    );
  }
};
