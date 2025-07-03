import { Router } from 'express';
import TaskController from '../controllers/taskController';
import { validateTask } from '../middleware/validationMiddleware';

const taskRouter = Router();
const {
  getAll,
  createTask,
  getCompleted,
  getIncomplete,
  getById,
  updateTask,
  deleteTask
} = TaskController.generateAllMethods();

taskRouter.route('/').get(getAll).post(validateTask, createTask);
taskRouter.route('/completed').get(getCompleted);
taskRouter.route('/incomplete').get(getIncomplete);
taskRouter.route('/:id').get(getById).patch(updateTask).delete(deleteTask);

export default taskRouter;
