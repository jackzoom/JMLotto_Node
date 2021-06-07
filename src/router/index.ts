import express from "express";
const router = express.Router();
import User from "./user";

router.use("/user", User);

export default router;
