import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Button,
  Box,
  Alert,
  CircularProgress,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import UserList from '../components/UserList';
import UserForm from '../components/UserForm';
import UserDetail from '../components/UserDetail';
import { User, Task } from '../types';
import { UserService } from '../services/api';

const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | undefined>();
  const [userDetail, setUserDetail] = useState<User & { tasks: Task[]; createdTasks: Task[] }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const fetchUsers = async () => {
    try {
      const usersData = await UserService.getAllUsers();
      setUsers(usersData);
      setError(null);
    } catch (err) {
      setError('Failed to fetch users. Please try again later.');
    }
  };

  const fetchUserDetail = async (userId: number) => {
    try {
      const userData = await UserService.getUser(userId);
      setUserDetail(userData);
      setIsDetailOpen(true);
      setError(null);
    } catch (err) {
      setError('Failed to fetch user details. Please try again later.');
    }
  };

  useEffect(() => {
    const initialize = async () => {
      setLoading(true);
      await fetchUsers();
      setLoading(false);
    };
    initialize();
  }, []);

const handleCreateUser = async (userData: { name: string; email: string }) => {
  try {
    await UserService.createUser(userData);
    await fetchUsers();
    setIsFormOpen(false);
    setError(null);
  } catch (err: any) {
    const backendError = err.response?.data?.error;
    setError(backendError || 'Failed to create user');
  }
};

  const handleUpdateUser = async (userData: { name: string; email: string }) => {
    if (!selectedUser) return;
    try {
      await UserService.updateUser(selectedUser.id, userData);
      await fetchUsers();
      setIsFormOpen(false);
      setSelectedUser(undefined);
      setError(null);
    } catch (err) {
      setError('Failed to update user. Please try again.');
    }
  };

  const handleDeleteUser = async (userId: number) => {
    try {
      await UserService.deleteUser(userId);
      await fetchUsers();
      setError(null);
    } catch (err) {
      setError('Failed to delete user. Please try again.');
    }
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setIsFormOpen(true);
  };

  const handleSelect = async (user: User) => {
    await fetchUserDetail(user.id);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setSelectedUser(undefined);
  };

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
          User Management
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => setIsFormOpen(true)}
        >
          Add User
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <UserList
        users={users}
        onEdit={handleEdit}
        onDelete={handleDeleteUser}
        onSelect={handleSelect}
      />

      <UserForm
        open={isFormOpen}
        onClose={handleCloseForm}
        onSubmit={selectedUser ? handleUpdateUser : handleCreateUser}
        user={selectedUser}
      />

      {userDetail && (
        <UserDetail
          open={isDetailOpen}
          onClose={() => setIsDetailOpen(false)}
          user={userDetail}
        />
      )}
    </Container>
  );
};

export default UsersPage;