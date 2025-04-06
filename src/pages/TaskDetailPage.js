import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Container, 
  Box, 
  Typography, 
  Paper, 
  Button, 
  Chip, 
  Divider, 
  Avatar,
  LinearProgress,
  Stack,
  IconButton, 
  CircularProgress, 
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import ArchiveIcon from '@mui/icons-material/Archive';

import {
  ArrowUpward as HighPriorityIcon,
  ArrowForward as MediumPriorityIcon,
  ArrowDownward as LowPriorityIcon,
  PlayCircleFilled as InProgressIcon,
  AssignmentTurnedIn as CompletedIcon,
  Assignment as AssignedIcon
} from '@mui/icons-material';

import { TASK_STATUS, TASK_PRIORITY } from '../constants';

const priorityStyles = {
  high: {
    color: '#d32f2f',
    icon: <HighPriorityIcon fontSize="small" sx={{ transform: 'scale(1.1)' }} />
  },
  medium: {
    color: '#ed6c02',
    icon: <MediumPriorityIcon fontSize="small" />
  },
  low: {
    color: '#2e7d32',
    icon: <LowPriorityIcon fontSize="small" />
  }
};

const statusStyles = {
  assigned: {
    bgcolor: '#fff3e0',
    color: '#ef6c00',
    icon: <AssignedIcon fontSize="small" />
  },
  'in progress': {
    bgcolor: '#e3f2fd',
    color: '#1976d2',
    icon: <InProgressIcon fontSize="small" />
  },
  completed: {
    bgcolor: '#e8f5e9',
    color: '#388e3c',
    icon: <CompletedIcon fontSize="small" />
  }
};

const TaskDetailPage = () => {
  const { taskId } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [task, setTask] = useState(null);
  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [unarchiveDialogOpen, setUnarchiveDialogOpen] = useState(false);

  const { mobileOpen, handleDrawerToggle } = useOutletContext();

  useEffect(() => {
    const fetchData = () => {
      const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
      const foundTask = tasks.find(t => t.id === taskId);
      
      if (foundTask) {
        setTask(foundTask);
        const projects = JSON.parse(localStorage.getItem('projects')) || [];
        const foundProject = projects.find(p => p.id === foundTask.projectId);
        setProject(foundProject);
      }
      
      setIsLoading(false);
    };

    fetchData();
  }, [taskId]);

  const handleStatusChange = (newStatus) => {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const updatedTasks = tasks.map(t => 
      t.id === taskId ? { ...t, status: newStatus } : t
    );
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    setTask(prev => ({ ...prev, status: newStatus }));
  };

  const handleArchiveTask = () => {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const updatedTasks = tasks.map(t => 
      t.id === taskId ? { ...t, isArchived: true } : t
    );
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    navigate('/main');
  };

  const handleUnarchiveTask = (confirmed = false) => {
    if (!confirmed) {
      setUnarchiveDialogOpen(true);
      return;
    }
  
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const updatedTasks = tasks.map(t => 
      t.id === taskId ? { ...t, isArchived: false } : t
    );
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    setUnarchiveDialogOpen(false);
    navigate('/main');
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case TASK_STATUS.IN_PROGRESS: return 'primary';
      case TASK_STATUS.COMPLETED: return 'success';
      case TASK_STATUS.ASSIGNED: return 'warning';
      default: return 'default';
    }
  };

  const UnarchiveConfirmationDialog = (
    <Dialog
      open={unarchiveDialogOpen}
      onClose={() => setUnarchiveDialogOpen(false)}
    >
      <DialogTitle>Confirm Unarchive</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to return this task to active status?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setUnarchiveDialogOpen(false)}>Cancel</Button>
        <Button 
          onClick={() => handleUnarchiveTask(true)} 
          color="primary"
          autoFocus
        >
          Unarchive
        </Button>
      </DialogActions>
    </Dialog>
  );

  if (isLoading) {
    return (
      <Container maxWidth="md">
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (!task) {
    return (
      <Container maxWidth="md">
        <Paper elevation={3} sx={{ p: 4, mt: 4, textAlign: 'center' }}>
          <Typography variant="h5" gutterBottom>
            Task Not Found
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            The requested task could not be found.
          </Typography>
          <Button variant="contained" onClick={() => navigate('/main')}>
            Back to Projects
          </Button>
        </Paper>
      </Container>
    );
  }

  const progress = Math.min(100, (task.elapsedTime / task.scheduledTime) * 100);

  return (
    <Container maxWidth="md">
      <Box sx={{ display: 'flex', alignItems: 'center', mt: 3 }}>
        <IconButton onClick={() => navigate('/main')} sx={{ mr: 1 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h6">Back to Projects</Typography>
      </Box>
      
      <Paper elevation={3} sx={{ p: 4, mt: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography component="h1" variant="h4">
            {task.title}
          </Typography>
          {/* <Stack direction="row" spacing={1}>
            <Chip 
              label={task.priority} 
              color={getPriorityColor(task.priority)} 
            />
            <Chip 
              label={task.status} 
              color={getStatusColor(task.status)} 
            />
          </Stack> */}

          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <Chip
              icon={priorityStyles[task.priority].icon}
              label={task.priority}
              variant="outlined"
              sx={{
                color: priorityStyles[task.priority].color,
                borderColor: priorityStyles[task.priority].color,
                '& .MuiChip-icon': { color: priorityStyles[task.priority].color }
              }}
            />
            <Chip
              icon={statusStyles[task.status].icon}
              label={task.status}
              sx={{
                bgcolor: statusStyles[task.status].bgcolor,
                color: statusStyles[task.status].color,
                '& .MuiChip-icon': { color: statusStyles[task.status].color }
              }}
            />
          </Box>
        </Box>
        
        <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 1 }}>
          Project: {project?.title || 'Unknown Project'}
        </Typography>
        
        <Divider sx={{ my: 3 }} />
        
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>Task Details</Typography>
            <Typography variant="body1" paragraph>
              <strong>Performer:</strong> {task.performer}
            </Typography>
            <Typography variant="body1" paragraph>
              <strong>Scheduled Time:</strong> {task.scheduledTime} hours
            </Typography>
            <Typography variant="body1" paragraph>
              <strong>Elapsed Time:</strong> {task.elapsedTime} hours
            </Typography>
            
            <Box sx={{ mt: 3 }}>
              <Typography variant="body1">
                <strong>Progress:</strong> {Math.round(progress)}%
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={progress} 
                sx={{ height: 10, borderRadius: 5, mt: 1 }}
              />
            </Box>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>Project Information</Typography>
            {project ? (
              <>
                <Typography variant="body1" paragraph>
                  <strong>Description:</strong> {project.description}
                </Typography>
                <Typography variant="body1" paragraph>
                  <strong>Supervisor:</strong> {project.supervisor}
                </Typography>
                <Typography variant="body1" paragraph>
                  <strong>Created:</strong> {new Date(project.creationDate).toLocaleDateString()}
                </Typography>
                <Typography variant="body1" paragraph>
                  <strong>Launch Date:</strong> {new Date(project.launchDate).toLocaleDateString()}
                </Typography>
              </>
            ) : (
              <Typography variant="body1" color="text.secondary">
                No project information available
              </Typography>
            )}
          </Grid>
        </Grid>
        
        <Divider sx={{ my: 3 }} />
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          {currentUser?.role === 'performer' && (
            <Stack direction="row" spacing={2}>
              <Button 
                variant="contained" 
                onClick={() => handleStatusChange(TASK_STATUS.IN_PROGRESS)}
                disabled={task.status === TASK_STATUS.IN_PROGRESS}
              >
                Start Task
              </Button>
              <Button 
                variant="contained" 
                color="success"
                onClick={() => handleStatusChange(TASK_STATUS.COMPLETED)}
                disabled={task.status === TASK_STATUS.COMPLETED}
              >
                Mark as Completed
              </Button>
            </Stack>
          )}
          
          {currentUser?.role === 'supervisor' && (
            <Stack direction="row" spacing={2}>
              <Button 
                variant="outlined" 
                startIcon={<EditIcon />}
                onClick={() => navigate(`/task/${taskId}/edit`)}
              >
                Edit Task
              </Button>
              {task.isArchived ? (
                <Button 
                  variant="outlined" 
                  color="success"
                  startIcon={<ArchiveIcon />}
                  onClick={() => handleUnarchiveTask()}
                >
                  Unarchive Task
                </Button>
              ) : (
                <Button 
                  variant="outlined" 
                  color="error"
                  startIcon={<ArchiveIcon />}
                  onClick={handleArchiveTask}
                >
                  Archive Task
                </Button>
              )}
            </Stack>
          )}
        </Box>
      </Paper>
      {UnarchiveConfirmationDialog}
    </Container>
  );
};

export default TaskDetailPage;