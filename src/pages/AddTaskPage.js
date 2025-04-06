import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
  Grid,
  Avatar,
  CircularProgress
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddTaskIcon from '@mui/icons-material/AddTask';

import { TASK_STATUS } from '../constants';

const AddTaskPage = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [projects, setProjects] = useState([]);
  
  const [formData, setFormData] = useState({
    projectId: location.state?.selectedProject || '',
    title: '',
    scheduledTime: '',
    performer: '',
    priority: 'medium',
    status: 'assigned'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const storedProjects = JSON.parse(localStorage.getItem('projects')) || [];
    setProjects(storedProjects);

    // If no project selected but projects exist, use the first one
    if (!formData.projectId && storedProjects.length > 0) {
      setFormData(prev => ({
        ...prev,
        projectId: storedProjects[0].id
      }));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.projectId) {
      alert('Please select a project');
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(true);

    const newTask = {
      id: Date.now().toString(),
      projectId: formData.projectId, // Ensure this uses the selected project
      title: formData.title,
      scheduledTime: parseInt(formData.scheduledTime),
      elapsedTime: 0,
      performer: formData.performer,
      priority: formData.priority,
      status: formData.status,
      isArchived: false
    };

    const existingTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    localStorage.setItem('tasks', JSON.stringify([...existingTasks, newTask]));

    // Simulate API call delay
    setTimeout(() => {
      navigate('/main', { state: { selectedProject: formData.projectId } });
      setIsSubmitting(false);
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
            Only supervisors can add new tasks.
          </Typography>
          <Button 
            variant="contained" 
            sx={{ mt: 3 }}
            onClick={() => navigate('/main')}
          >
            Back to Main Page
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
        onClick={() => navigate('/main')}
      >
        Back to Projects
      </Button>
      <Paper elevation={3} sx={{ p: 4, mt: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
            <AddTaskIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Add New Task
          </Typography>
        </Box>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Project</InputLabel>
                <Select
                  name="projectId"
                  value={formData.projectId}
                  onChange={handleChange}
                  label="Project"
                  required
                >
                  {projects.map((project) => (
                    <MenuItem key={project.id} value={project.id}>
                      {project.title}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="title"
                label="Task Title"
                fullWidth
                value={formData.title}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="scheduledTime"
                label="Scheduled Time (hours)"
                type="number"
                fullWidth
                value={formData.scheduledTime}
                onChange={handleChange}
                required
                inputProps={{ min: 1 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="performer"
                label="Performer Name"
                fullWidth
                value={formData.performer}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  label="Priority"
                  required
                >
                  <MenuItem value="low">Low</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  label="Status"
                  required
                >
                  <MenuItem value={TASK_STATUS.ASSIGNED}>Assigned</MenuItem>
                  <MenuItem value={TASK_STATUS.COMPLETED}>Completed</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              type="submit"
              variant="contained"
              disabled={isSubmitting}
              startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
            >
              {isSubmitting ? 'Adding Task...' : 'Add Task'}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default AddTaskPage;