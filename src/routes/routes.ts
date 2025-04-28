import { Router } from "express";
import authConteoller from "./auth/auth.controller";
import userController from "./auth/user.controller";

const router = Router()
    .use(authConteoller)
    .use(userController)

export default router;