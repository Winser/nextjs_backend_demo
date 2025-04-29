import { NextFunction, Router } from "express";
import { createUser, login } from "./auth.service";
import HttpException from "../../models/http-exception.model";

const authController = Router();

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user:
 *                 type: object
 *                 properties:
 *                   username:
 *                     type: string
 *                   email:
 *                     type: string
 *                   password:
 *                     type: string
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:  
 *                   type: object 
 *                   properties:
 *                     username:  
 *                       type: string 
 *                     email:  
 *                       type: string 
 *                 token:  
 *                   type: string 
 *       400:
 *         description: Bad request
 */
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

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Login a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user:
 *                 type: object
 *                 properties:
 *                   email:
 *                     type: string
 *                   password:
 *                     type: string
 *     responses:
 *       200:
 *         description: JWT token
 */
authController.post("/login", async (req, res, next) => {
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