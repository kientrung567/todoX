import express from 'express'
import { getAllTasks, createNewTask, updateTask, deleteTask } from '../controllers/tasksControllers.js';

const router = express.Router();

router.get("/", getAllTasks);
router.post("/", createNewTask);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);

export default router;