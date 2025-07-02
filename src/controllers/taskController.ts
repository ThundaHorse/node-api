import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { Task } from '../types';

// In-memory store
let tasks: Task[] = [
  {
    id: 'b38e05de-ff0e-453a-801b-1f5f2bb4bf6f',
    title: 'Test 1',
    description: 'Test Description',
    completed: false,
    createdAt: '2025-07-02T01:12:41.417Z' as unknown as Date,
  },
  {
    id: '5248a5c0-057b-44a6-b5c4-7c2790362d26',
    title: 'Test 2',
    description: 'Test Description',
    completed: true,
    createdAt: '2025-07-02T01:12:42.088Z' as unknown as Date,
  },
  {
    id: 'f5a33b0f-19bf-4e8d-a4c8-826d120d69e7',
    title: 'Test 3',
    description: 'Test Description',
    completed: false,
    createdAt: '2025-07-02T01:12:42.753Z' as unknown as Date,
  },
  {
    id: 'e1039a63-8215-47db-bf64-cb77297aebaa',
    title: 'Test 4',
    description: 'Test Description',
    completed: false,
    createdAt: '2025-07-02T01:12:43.408Z' as unknown as Date,
  },
  {
    id: 'cd4601c8-02c9-4c98-a9da-75f9ffd6d67b',
    title: 'Test 5',
    description: 'Test Description',
    completed: true,
    createdAt: '2025-07-02T01:12:44.077Z' as unknown as Date,
  },
];

export const getAllTasks = (req: Request, res: Response) => {
  res.status(200).json(tasks);
};

export const createTask = (req: Request, res: Response) => {
  const { title, description } = req.body;
  const newTask: Task = {
    id: uuidv4(),
    title,
    description,
    completed: false,
    createdAt: new Date(),
  };
  tasks.push(newTask);
  res.status(201).json(newTask);
};

export const getTaskById = (req: Request, res: Response) => {
  const task = tasks.find((t) => t.id === req.params.id);
  if (!task) {
    res.status(404).json({ message: 'Task not found.' });
  }
  res.status(200).json(task);
};

export const updateTask = (req: Request, res: Response) => {
  const taskIndex = tasks.findIndex((t) => t.id === req.params.id);
  if (taskIndex === -1) {
    res.status(404).json({ message: 'Task not found.' });
  }
  const updatedTask = { ...tasks[taskIndex], ...req.body };
  tasks[taskIndex] = updatedTask;
  res.status(200).json(updatedTask);
};

export const deleteTask = (req: Request, res: Response) => {
  const task = tasks.findIndex((val) => val.id === req.params.id);

  if (task === -1) {
    res.status(404).json({ message: 'Task not found.' });
  } else {
    tasks.splice(task, 1);

    res
      .status(200)
      .send({ message: `Task ${req.params.id} removed successfully` });
  }
};

export const getCompletedTasks = (req: Request, res: Response) => {
  const completedTasks = tasks.filter((t) => t.completed === true);
  res.status(200).json(completedTasks);
};

export const getIncompleteTasks = (req: Request, res: Response) => {
  const completedTasks = tasks.filter((t) => t.completed === false);
  res.status(200).json(completedTasks);
};
