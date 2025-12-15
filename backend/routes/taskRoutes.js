import express from "express";
import protect from "../middleware/authMiddleware.js";
import { createTask, getTasks } from "../controllers/taskController.js";
import { createTaskValidator } from "../validators/taskValidator.js";
import { deleteTask } from "../controllers/taskController.js";
import { toggleTask } from "../controllers/taskController.js";

const router = express.Router();

router.get("/", protect, getTasks);
router.post("/", protect, createTaskValidator, createTask);
router.delete("/:id", protect, deleteTask);
router.patch("/:id", protect, toggleTask);

export default router;
