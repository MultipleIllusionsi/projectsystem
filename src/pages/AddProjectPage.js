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
  Avatar,
  CircularProgress
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddBusinessIcon from '@mui/icons-material/AddBusiness';

const AddProjectPage = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    creationDate: new Date().toISOString().split('T')[0],
    launchDate: '',
    supervisor: currentUser?.name || ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Generate a unique ID for the new project
    const newProjectId = Date.now().toString();

    const newProject = {
      id: newProjectId,
      ...formData
    };

    // Get existing projects from localStorage
    const existingProjects = JSON.parse(localStorage.getItem('projects')) || [];
    const updatedProjects = [...existingProjects, newProject];

    // Save back to localStorage
    localStorage.setItem('projects', JSON.stringify(updatedProjects));

    // Simulate API call delay
    setTimeout(() => {
      setIsSubmitting(false);
      navigate('/projects');
    }, 1000);
  };

  if (currentUser?.role !== 'supervisor') {
    return (
      <Container maxWidth="md">
        <Paper elevation={3} sx={{ p: 4, mt: 4, textAlign: 'center' }}>
          <Typography variant="h5" color="error" gutterBottom>
            Access Denied
          </Typography>
          <Typography variant="body1">
            Only supervisors can add new projects.
          </Typography>
          <Button 
            variant="contained" 
            sx={{ mt: 3 }}
            onClick={() => navigate('/projects')}
          >
            Back to Projects
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Button
        startIcon={<ArrowBackIcon />}
        sx={{ mt: 3 }}
        onClick={() => navigate('/projects')}
      >
        Back to Projects
      </Button>
      <Paper elevation={3} sx={{ p: 4, mt: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
            <AddBusinessIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Add New Project
          </Typography>
        </Box>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            name="title"
            label="Project Title"
            value={formData.title}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="description"
            label="Description"
            multiline
            rows={4}
            value={formData.description}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="supervisor"
            label="Supervisor"
            value={formData.supervisor}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="launchDate"
            label="Launch Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={formData.launchDate}
            onChange={handleChange}
          />
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              type="submit"
              variant="contained"
              disabled={isSubmitting}
              startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
            >
              {isSubmitting ? 'Adding Project...' : 'Add Project'}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default AddProjectPage;