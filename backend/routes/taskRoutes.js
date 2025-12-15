import express from "express";
import protect from "../middleware/authMiddleware.js";
import { createTask, getTasks } from "../controllers/taskController.js";
import { createTaskValidator } from "../validators/taskValidator.js";

const router = express.Router();

router.get("/", protect, getTasks);
router.post("/", protect, createTaskValidator, createTask);

export default router;
