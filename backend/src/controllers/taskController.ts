import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createTask = async (req: Request, res: Response) => {
  try {
    const { title, description, assigneeId, creatorId, dueDate } = req.body;

    console.log('Incoming payload:', { title, description, assigneeId, creatorId, dueDate });

    // Validate required fields
    if (!title || !creatorId) {
      return res.status(400).json({ error: 'Title and creatorId are required' });
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
        assigneeId: assigneeId || null,
        creatorId,
        dueDate: dueDate || null,
      },
    });

    res.status(201).json(task);
  } catch (error: any) {
    console.error('Prisma create error:', error); 
    res.status(500).json({ error: 'Error creating task' });
  }
};

export const getTasks = async (req: Request, res: Response) => {
  try {
    const tasks = await prisma.task.findMany({
      include: {
        assignee: true,
        creator: true,
      },
    });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching tasks' });
  }
};

export const getTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const task = await prisma.task.findUnique({
      where: { id: Number(id) },
      include: {
        assignee: true,
        creator: true,
      },
    });
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching task' });
  }
};

export const updateTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, completed, assigneeId, dueDate } = req.body;
    const task = await prisma.task.update({
      where: { id: Number(id) },
      data: {
        title,
        description,
        completed,
        assigneeId,
        dueDate: dueDate ? new Date(dueDate) : null,
      },
    });
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: 'Error updating task' });
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.task.delete({
      where: { id: Number(id) },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Error deleting task' });
  }
};