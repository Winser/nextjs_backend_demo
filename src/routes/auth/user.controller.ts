import { Router } from "express";

const userController = Router();

userController.get("/users", (req, res) => {
  res.send("users route");
})

export default userController;