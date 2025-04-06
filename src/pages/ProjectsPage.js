import React, { useState, useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  CardActions, 
  Button, 
  Grid, 
  Paper,
  Avatar,
  Divider,
  CircularProgress
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import BusinessIcon from '@mui/icons-material/Business';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const ProjectsPage = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedProjects = JSON.parse(localStorage.getItem('projects')) || [];
    const storedTasks = JSON.parse(localStorage.getItem('tasks')) || [];

    setProjects(storedProjects);
    setTasks(storedTasks);
    setLoading(false);
  }, []);
  
  const getActiveTaskCount = () => {
    return tasks.filter(task => !task.isArchived).length;
  };
  
  const getCompletedTaskPercentage = () => {
    const totalTasks = tasks.length;
    if (totalTasks === 0) return 0;
    const completedTasks = tasks.filter(task => task.status === 'completed').length;
    return Math.round((completedTasks / totalTasks) * 100);
  };
  
  const getTaskCount = (projectId) => {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    return tasks.filter(task => task.projectId === projectId).length;
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }
  
  if (!projects.length) {
    return (
      <Paper sx={{ p: 4, mt: 4, textAlign: 'center' }}>
        <Typography variant="h6" gutterBottom>
          No Projects Found
        </Typography>
        {currentUser?.role === 'supervisor' && (
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            onClick={() => navigate('/add-project')}
            sx={{ mt: 2 }}
          >
            Create Your First Project
          </Button>
        )}
      </Paper>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">All Projects</Typography>
        {currentUser?.role === 'supervisor' && (
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
            <Button 
              variant="contained" 
              startIcon={<AddIcon />}
              onClick={() => navigate('/add-project')}
            >
              New Project
            </Button>
          </Box>
        )}
      </Box>
      
      {!loading && (
        <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
          <Paper sx={{ p: 2, flex: 1, minWidth: 200 }}>
            <Typography variant="subtitle1" gutterBottom>
              Total Projects
            </Typography>
            <Typography variant="h4">{projects.length}</Typography>
          </Paper>
          
          <Paper sx={{ p: 2, flex: 1, minWidth: 200 }}>
            <Typography variant="subtitle1" gutterBottom>
              Active Tasks
            </Typography>
            <Typography variant="h4">{getActiveTaskCount()}</Typography>
          </Paper>
          
          <Paper sx={{ p: 2, flex: 1, minWidth: 200 }}>
            <Typography variant="subtitle1" gutterBottom>
              Completion Rate
            </Typography>
            <Typography variant="h4">{getCompletedTaskPercentage()}%</Typography>
          </Paper>
        </Box>
      )}

      <Grid container spacing={3}>

        {projects.map((project) => (
          <Grid item xs={12} sm={6} md={4} key={project.id}>
            <Card
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'scale(1.02)',
                  boxShadow: 3
                }
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                    <BusinessIcon />
                  </Avatar>
                  <Typography variant="h6" component="h3">
                    {project.title}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {project.description}
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">
                    <strong>Tasks:</strong> {getTaskCount(project.id)}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Launch:</strong> {new Date(project.launchDate).toLocaleDateString()}
                  </Typography>
                </Box>
              </CardContent>
              <CardActions>
                <Button 
                  size="small" 
                  // endIcon={<ArrowForwardIcon />}
                  onClick={() => navigate('/main', { state: { selectedProject: project.id } })}
                >
                  View Tasks
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ProjectsPage;