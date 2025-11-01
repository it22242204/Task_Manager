import React from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
} from '@mui/material';
import TaskIcon from '@mui/icons-material/Task';
import PeopleIcon from '@mui/icons-material/People';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();

  return (
    <>
      <AppBar position="static" sx={{ mb: 3 }}>
        <Container maxWidth="lg">
          <Toolbar disableGutters>
            <Typography
              variant="h6"
              component="div"
              sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}
            >
              Task Manager
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                component={RouterLink}
                to="/tasks"
                color="inherit"
                startIcon={<TaskIcon />}
                sx={{
                  backgroundColor:
                    location.pathname === '/tasks' ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                }}
              >
                Tasks
              </Button>
              <Button
                component={RouterLink}
                to="/users"
                color="inherit"
                startIcon={<PeopleIcon />}
                sx={{
                  backgroundColor:
                    location.pathname === '/users' ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                }}
              >
                Users
              </Button>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      <Container maxWidth="lg">{children}</Container>
    </>
  );
};

export default Layout;