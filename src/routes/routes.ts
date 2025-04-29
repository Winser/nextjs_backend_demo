import { Router } from "express";
import authConteoller from "./auth/auth.controller";
import userController from "./user/user.controller";
import swaggerController from "./swagger";

const router = Router()
    .use(authConteoller)
    .use(userController)
    .use(swaggerController)

export default router;