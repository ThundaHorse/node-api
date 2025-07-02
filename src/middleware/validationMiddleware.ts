import { Request, Response, NextFunction } from 'express';

export const validateTask = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { title, description } = req.body;

  if (
    !title ||
    typeof title !== 'string' ||
    !description ||
    typeof description !== 'string'
  ) {
    res.status(400).json({
      message: 'Title and description are required and must be strings.',
    });
  }

  next();
};
