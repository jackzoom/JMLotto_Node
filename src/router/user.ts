import express from "express";
import { getUser } from "../controllers/user";
const router = express.Router();

router.get("/getUser", getUser);

export default router;
