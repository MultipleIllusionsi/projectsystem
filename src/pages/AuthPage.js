import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Container, 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Paper, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Avatar,
  Grid,
  // Link
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

const AuthPage = () => {
  const [role, setRole] = useState('performer');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, you would verify credentials with a backend
    const user = {
      id: '1',
      username,
      role,
      name: role === 'supervisor' ? 'Project Supervisor' : 'Task Performer'
    };
    login(user);
    navigate('/main');
  };

  const demoLogin = (demoRole) => {
    const demoUsers = {
      supervisor: { id: '1', username: 'supervisor@demo.com', role: 'supervisor', name: 'Project Supervisor' },
      performer: { id: '2', username: 'performer@demo.com', role: 'performer', name: 'Task Performer' }
    };
    login(demoUsers[demoRole]);
    // navigate('/main');

    const lastPath = localStorage.getItem('lastPath') || '/main';
    navigate(lastPath);
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} sx={{ mt: 8, p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
          <FormControl fullWidth margin="normal">
            <InputLabel>Role</InputLabel>
            <Select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              label="Role"
            >
              <MenuItem value="performer">Performer</MenuItem>
              <MenuItem value="supervisor">Supervisor</MenuItem>
            </Select>
          </FormControl>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
          <Grid container justifyContent="space-between">
            <Grid item>
              <Button onClick={() => demoLogin('performer')} color="primary">
                Demo Performer
              </Button>
            </Grid>
            <Grid item>
              <Button onClick={() => demoLogin('supervisor')} color="primary">
                Demo Supervisor
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default AuthPage;