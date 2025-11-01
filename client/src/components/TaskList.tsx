import React from 'react';
import {
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Checkbox,
  Paper,
  Typography,
  Box,
  Chip,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Task } from '../types';

interface TaskListProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (taskId: number) => void;
  onToggleComplete: (taskId: number) => void;
}

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onEdit,
  onDelete,
  onToggleComplete,
}) => {
  return (
    <Paper elevation={2} sx={{ mt: 2, p: 2 }}>
      <List>
        {tasks.length === 0 ? (
          <Typography variant="body1" color="textSecondary" align="center">
            No tasks found
          </Typography>
        ) : (
          tasks.map((task) => (
            <ListItem
              key={task.id}
              sx={{
                mb: 1,
                borderRadius: 1,
                bgcolor: 'background.paper',
                '&:hover': { bgcolor: 'action.hover' },
              }}
            >
              <Checkbox
                checked={task.completed}
                onChange={() => onToggleComplete(task.id)}
                color="primary"
              />
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography
                      variant="body1"
                      sx={{
                        textDecoration: task.completed ? 'line-through' : 'none',
                      }}
                    >
                      {task.title}
                    </Typography>
                    <Chip
                      label={task.completed ? 'Completed' : 'In Progress'}
                      size="small"
                      color={task.completed ? 'success' : 'warning'}
                      sx={{ ml: 1 }}
                    />
                  </Box>
                }
                secondary={task.description}
              />
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  aria-label="edit"
                  onClick={() => onEdit(task)}
                  sx={{ mr: 1 }}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => onDelete(task.id)}
                >
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))
        )}
      </List>
    </Paper>
  );
};

export default TaskList;