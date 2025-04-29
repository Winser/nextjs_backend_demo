import { NextFunction, Router } from "express";
import { createUser, login } from "./auth.service";
import HttpException from "../../models/http-exception.model";

const authController = Router();

authController.post("/register", async (req, res, next: NextFunction) => {
  try {
    if (!req.body?.user) {
      throw new HttpException(400, { errors: { user: ["can't be blank"] } });
    }
    const user = await createUser({ ...req.body.user });
    res.status(201).json({
      user: user.user,
      token: user.token,
    });
  } catch (error) {
    next(error);
  }
})

authController.get("/login", async (req, res, next) => {
  try {
    if (!req.body?.user) {
      throw new HttpException(400, { errors: { user: ["can't be blank"] } });
    }
    const user = await login({ ...req.body.user });
    res.status(200).json(user);
  } catch (error) {
    next(error)
  }
})


export default authController;