import { body } from "express-validator";

export const createTaskValidator = [
  body("title").notEmpty().withMessage("Title is required"),
];
