import { Router } from "express";

const authController = Router();

authController.post("/register", (req, res) => {
  res.send("register route");
})

authController.get("/login", (req, res) => {
  res.send("login route");
})


export default authController;