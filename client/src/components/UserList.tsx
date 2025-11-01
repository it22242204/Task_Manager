import React from 'react';
import {
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Paper,
  Typography,
  Box,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonIcon from '@mui/icons-material/Person';
import { User } from '../types';

interface UserListProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (userId: number) => void;
  onSelect: (user: User) => void;
}

const UserList: React.FC<UserListProps> = ({
  users,
  onEdit,
  onDelete,
  onSelect,
}) => {
  return (
    <Paper elevation={2} sx={{ mt: 2, p: 2 }}>
      <List>
        {users.length === 0 ? (
          <Typography variant="body1" color="textSecondary" align="center">
            No users found
          </Typography>
        ) : (
          users.map((user) => (
            <ListItem
              key={user.id}
              sx={{
                mb: 1,
                borderRadius: 1,
                bgcolor: 'background.paper',
                '&:hover': { bgcolor: 'action.hover' },
                cursor: 'pointer',
              }}
              onClick={() => onSelect(user)}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                <PersonIcon color="primary" />
              </Box>
              <ListItemText
                primary={user.name}
                secondary={user.email}
              />
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  aria-label="edit"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(user);
                  }}
                  sx={{ mr: 1 }}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(user.id);
                  }}
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

export default UserList;