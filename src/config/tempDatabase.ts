import { Task } from '../util/types';

// In-memory store
export let tasks: Task[] = [
  {
    id: 'b38e05de-ff0e-453a-801b-1f5f2bb4bf6f',
    title: 'Test 1',
    description: 'Test Description',
    completed: false,
    createdAt: '2025-07-02T01:12:41.417Z' as unknown as Date
  },
  {
    id: '5248a5c0-057b-44a6-b5c4-7c2790362d26',
    title: 'Test 2',
    description: 'Test Description',
    completed: true,
    createdAt: '2025-07-02T01:12:42.088Z' as unknown as Date
  },
  {
    id: 'f5a33b0f-19bf-4e8d-a4c8-826d120d69e7',
    title: 'Test 3',
    description: 'Test Description',
    completed: false,
    createdAt: '2025-07-02T01:12:42.753Z' as unknown as Date
  },
  {
    id: 'e1039a63-8215-47db-bf64-cb77297aebaa',
    title: 'Test 4',
    description: 'Test Description',
    completed: false,
    createdAt: '2025-07-02T01:12:43.408Z' as unknown as Date
  },
  {
    id: 'cd4601c8-02c9-4c98-a9da-75f9ffd6d67b',
    title: 'Test 5',
    description: 'Test Description',
    completed: true,
    createdAt: '2025-07-02T01:12:44.077Z' as unknown as Date
  }
];
