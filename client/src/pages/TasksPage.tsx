import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Button,
  Box,
  Alert,
  CircularProgress,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import TaskList from '../components/TaskList';
import TaskForm from '../components/TaskForm';
import { Task, User, TaskFormData } from '../types';
import { TaskService, UserService } from '../services/api';
import { UpdateTaskData } from '../types';

const TasksPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | undefined>();
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  const fetchTasks = async () => {
    try {
      const tasksData = await TaskService.getAllTasks();
      setTasks(tasksData || []);
      setError(null);
    } catch (err) {
      setError('Failed to fetch tasks. Please try again later.');
      setTasks([]);
    }
  };

  const fetchUsers = async () => {
    try {
      const usersData = await UserService.getAllUsers();
      setUsers(usersData);
    } catch (err) {
      setError('Failed to fetch users. Some features may be limited.');
    }
  };

  useEffect(() => {
    const initialize = async () => {
      setLoading(true);
      await Promise.all([fetchTasks(), fetchUsers()]);
      setLoading(false);
    };
    initialize();
  }, []);

  const handleCreateTask = async (taskData: {
  title: string;
  description: string;
  assigneeId?: number | null;
}) => {
  try {
    const payload = {
      title: taskData.title,
      description: taskData.description,
      assigneeId: taskData.assigneeId ?? null,
      creatorId: 3,  
      dueDate: null,
    };

    console.log('Sending payload:', payload); // ← Should show creatorId: 1

    await TaskService.createTask(payload);
    await fetchTasks();
    setIsFormOpen(false);
    setError(null);
  } catch (err: any) {
    const msg = err.response?.data?.error || 'Failed to create task';
    setError(msg);
    console.error('Create task failed:', err.response?.data);
  }
};

  const handleUpdateTask = async (taskData: TaskFormData) => {
    if (!selectedTask) return;
    try {
      await TaskService.updateTask(selectedTask.id, taskData);
      await fetchTasks();
      setIsFormOpen(false);
      setSelectedTask(undefined);
      setError(null);
    } catch (err) {
      setError('Failed to update task. Please try again.');
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    try {
      await TaskService.deleteTask(taskId);
      await fetchTasks();
      setError(null);
    } catch (err) {
      setError('Failed to delete task. Please try again.');
    }
  };

  const handleToggleComplete = async (taskId: number) => {
  const task = tasks.find(t => t.id === taskId);
  if (!task) return;

  try {
    await TaskService.updateTask(taskId, {
      completed: !task.completed, // ← Now allowed
    } as UpdateTaskData);
    await fetchTasks();
  } catch (err: any) {
    setError(err.response?.data?.error || 'Failed to update');
  }
};

  const handleEdit = (task: Task) => {
    setSelectedTask(task);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setSelectedTask(undefined);
  };

  const filteredTasks = tasks?.filter((task) => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  }) || [];

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Typography variant="h4" component="h1">
          Task Manager
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => setIsFormOpen(true)}
        >
          Add Task
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ mb: 2 }}>
        <ToggleButtonGroup
          value={filter}
          exclusive
          onChange={(_, newFilter) => newFilter && setFilter(newFilter)}
          aria-label="task filter"
        >
          <ToggleButton value="all">All</ToggleButton>
          <ToggleButton value="active">Active</ToggleButton>
          <ToggleButton value="completed">Completed</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <TaskList
        tasks={filteredTasks}
        onEdit={handleEdit}
        onDelete={handleDeleteTask}
        onToggleComplete={handleToggleComplete}
      />

      <TaskForm
        open={isFormOpen}
        onClose={handleCloseForm}
        onSubmit={selectedTask ? handleUpdateTask : handleCreateTask}
        task={selectedTask}
        users={users}
      />
    </Container>
  );
};

export default TasksPage;