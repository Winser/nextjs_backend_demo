import { Router } from "express";
import auth from "../../middleware/auth";
import prisma from "../../prisma/prisma";

const userController = Router();

userController.get("/users", auth.required, async (req, res) => {
  const allUsers = await prisma.user.findMany({
    select: {
      id: true,
      username: true,
      email: true
    }
  });

  res.status(200).json(allUsers);
})

export default userController;