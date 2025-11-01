import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  Chip,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { User, Task } from '../types';

interface UserDetailProps {
  open: boolean;
  onClose: () => void;
  user: User & {
    tasks: Task[];
    createdTasks: Task[];
  };
}

const UserDetail: React.FC<UserDetailProps> = ({ open, onClose, user }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">{user.name}'s Profile</Typography>
          <IconButton aria-label="close" onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 4 }}>
          <Typography variant="subtitle1" color="text.secondary">
            Email
          </Typography>
          <Typography variant="body1">{user.email}</Typography>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Assigned Tasks
          </Typography>
          <List>
            {user.tasks.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                No tasks assigned
              </Typography>
            ) : (
              user.tasks.map((task) => (
                <ListItem key={task.id} sx={{ px: 0 }}>
                  <ListItemText
                    primary={task.title}
                    secondary={task.description}
                  />
                  <Chip
                    label={task.completed ? 'Completed' : 'In Progress'}
                    color={task.completed ? 'success' : 'warning'}
                    size="small"
                  />
                </ListItem>
              ))
            )}
          </List>
        </Box>

        <Box>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Created Tasks
          </Typography>
          <List>
            {user.createdTasks.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                No tasks created
              </Typography>
            ) : (
              user.createdTasks.map((task) => (
                <ListItem key={task.id} sx={{ px: 0 }}>
                  <ListItemText
                    primary={task.title}
                    secondary={task.description}
                  />
                  <Chip
                    label={task.completed ? 'Completed' : 'In Progress'}
                    color={task.completed ? 'success' : 'warning'}
                    size="small"
                  />
                </ListItem>
              ))
            )}
          </List>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default UserDetail;