import { Router } from 'express';
import {
  getAllTasks,
  createTask,
  getTaskById,
  updateTask,
  deleteTask,
  getCompletedTasks,
  getIncompleteTasks,
} from '../controllers/taskController';
import { validateTask } from '../middleware/validationMiddleware';

const taskRouter = Router();

taskRouter.route('/').get(getAllTasks).post(validateTask, createTask);
taskRouter.route('/completed').get(getCompletedTasks);
taskRouter.route('/incomplete').get(getIncompleteTasks);
taskRouter.route('/:id').get(getTaskById).patch(updateTask).delete(deleteTask);

export default taskRouter;
