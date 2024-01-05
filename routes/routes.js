import express from "express";
const router = express.Router();
import { getHome, postHome } from "../controllers/homeController.js";

router.use(express.static("public"));
router.use(express.json());

router.get("/home", getHome);
router.post("/home", postHome);

export default router;
