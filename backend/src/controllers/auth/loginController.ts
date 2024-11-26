import { checkUserWithUsername } from "@/services/authServices";
import { createResponse } from "@/utils/createResponse";
import { verifyPassword } from "@/utils/passwordUtils";
import { generateToken } from "@/utils/tokenUtils";
import { Request, Response } from "express";

interface I_Request {
  username: string;
  password: string;
}

export const loginController = async (
  req: Request<{}, {}, I_Request>,
  res: Response
) => {
  const { username, password } = req.body;

  try {
    //Fetch project details
    const userExists = await checkUserWithUsername(username);

    if (!userExists?.data) {
      res.status(404).send(createResponse(false, "User does not exists."));
      return;
    }

    const passwordVerified = await verifyPassword(
      password,
      userExists.data.password
    );

    if (passwordVerified) {
      const token = generateToken(userExists?.data?.id);

      res
        .status(200)
        .json(createResponse(true, "Projects retrieved successfully", token));

      return;
    } else {
      res.status(401).send(createResponse(false, "Invalid password.", null));
    }
  } catch (error) {
    res.status(500).send(
      createResponse(false, "An unexpected error occurred.", null, {
        message: (error as Error).message,
      })
    );
  }
};
