// src/components/TaskForm.tsx
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Alert,
} from '@mui/material';
import { Task, TaskFormData, User } from '../types';

interface TaskFormProps {
  open: boolean;
  onClose: () => void;
  /** onSubmit now receives the *backend-ready* payload */
  onSubmit: (taskData: {
    title: string;
    description: string;
    assigneeId?: number | null;
  }) => Promise<void>;
  task?: Task;
  users: User[];
}

const TaskForm: React.FC<TaskFormProps> = ({
  open,
  onClose,
  onSubmit,
  task,
  users,
}) => {
  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    userId: number | null;   // <-- UI field (what the Select uses)
  }>({
    title: '',
    description: '',
    userId: null,
  });

  const [errors, setErrors] = useState({
    title: '',
    userId: '',
  });

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title ?? '',
        description: task.description ?? '',
        userId: (task as any).userId ?? null,
      });
    } else {
      setFormData({ title: '', description: '', userId: null });
    }
    setErrors({ title: '', userId: '' });
  }, [task, open]);

  const validate = () => {
    const newErr = { title: '', userId: '' };
    let ok = true;

    if (!formData.title.trim()) {
      newErr.title = 'Title is required';
      ok = false;
    }

    setErrors(newErr);
    return ok;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return; // stop if client validation fails

    try {
      // Map UI → backend field names
      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        assigneeId: formData.userId ?? null, // <-- backend expects `assigneeId`
      };

      // Call the parent (TasksPage) – it will add `creatorId` etc.
      await onSubmit(payload);

      // If we get here → success → close dialog
      onClose();
    } catch (err: any) {
      const backendMsg =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        err?.message ||
        'Unknown error';

      console.error('TaskForm → API error:', {
        status: err?.response?.status,
        statusText: err?.response?.statusText,
        data: err?.response?.data,
        message: err?.message,
      });

      // Show the error inside the dialog (optional)
      setErrors((prev) => ({
        ...prev,
        title: backendMsg, // reuse title error slot for simplicity
      }));
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{task ? 'Edit Task' : 'Create New Task'}</DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Title */}
            <TextField
              label="Title"
              fullWidth
              required
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              error={!!errors.title}
              helperText={errors.title}
            />

            {/* Description */}
            <TextField
              label="Description"
              fullWidth
              multiline
              rows={4}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />

            {/* Assignee */}
            <FormControl fullWidth>
              <InputLabel>Assign To</InputLabel>
              <Select
                value={formData.userId ?? ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    userId: e.target.value as number | null,
                  })
                }
                label="Assign To"
              >
                <MenuItem value="">
                  <em>Unassigned</em>
                </MenuItem>
                {users.map((user) => (
                  <MenuItem key={user.id} value={user.id}>
                    {user.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Show backend error as an Alert (optional) */}
            {errors.title && !errors.title.includes('required') && (
              <Alert severity="error" sx={{ mt: 1 }}>
                {errors.title}
              </Alert>
            )}
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            {task ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default TaskForm;