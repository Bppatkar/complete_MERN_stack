import express from "express";
import { login, register } from "../controller/user.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";

const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(isAuthenticated, login);

export default router;
