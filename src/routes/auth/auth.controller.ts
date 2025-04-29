import { NextFunction, Router } from "express";
import { createUser, login } from "./auth.service";
import HttpException from "../../models/http-exception.model";
import { body, validationResult } from "express-validator";

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
authController.post("/register",
  body("user.username").isLength({ min: 3 }),
  body("user.email").isEmail(),
  body("user.password").isLength({ min: 8 }),
  async (req, res, next: NextFunction) => {

    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new HttpException(400, { errors: errors.array() });
      }

      const user = await createUser({ ...req.body.user });
      res.status(201).json({
        user: user.user,
        token: user.token,
      });
    } catch (error) {
      next(error);
    }
  }
)

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
authController.post("/login",
  body("user.username").if(body("user.email").not().exists()).exists(),
  body("user.email").if(body("user.username").not().exists()).exists(),
  body("user.password").exists(),
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new HttpException(400, { errors: errors.array() });
      }
      
      const user = await login({ ...req.body.user });
      res.status(200).json(user);
    } catch (error) {
      next(error)
    }
  }
)


export default authController;