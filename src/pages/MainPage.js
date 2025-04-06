import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useOutletContext } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

import { 
  Box, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemText, 
  Divider, 
  Typography,
  Chip,
  Card,
  CardContent,
  CardActions,
  Button,
  Stack,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem, 
  ListItemIcon, 
} from '@mui/material';
import {
  ArrowUpward as HighPriorityIcon,
  ArrowForward as MediumPriorityIcon,
  ArrowDownward as LowPriorityIcon,
  PlayCircleFilled as InProgressIcon,
  AssignmentTurnedIn as CompletedIcon,
  Assignment as AssignedIcon
} from '@mui/icons-material';
import ArchiveIcon from '@mui/icons-material/Archive';
import AddIcon from '@mui/icons-material/Add';
import FolderIcon from '@mui/icons-material/Folder';
import ViewListIcon from '@mui/icons-material/ViewList';

import ResponsiveDrawer from '../components/ResponsiveDrawer';

import { TASK_STATUS } from '../constants';

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

const listItemStyles = {
  '& .MuiListItemIcon-root': {
    minWidth: '36px'
  },
  '&.Mui-selected': {
    backgroundColor: 'rgba(25, 118, 210, 0.08)',
    '&:hover': {
      backgroundColor: 'rgba(25, 118, 210, 0.12)'
    }
  }
};

// Initialize data if not exists
const initializeData = () => {
  if (!localStorage.getItem('projects')) {
    const projects = [
      {
        id: '1',
        title: 'Website Redesign',
        description: 'Complete redesign of company website',
        creationDate: '2023-01-15',
        launchDate: '2023-06-30',
        supervisor: 'John Doe'
      },
      {
        id: '2',
        title: 'Mobile App Development',
        description: 'Build new mobile application for iOS and Android',
        creationDate: '2023-02-10',
        launchDate: '2023-08-15',
        supervisor: 'Jane Smith'
      },
      {
        id: '3',
        title: 'Marketing Campaign',
        description: 'Summer marketing campaign preparation',
        creationDate: '2023-03-05',
        launchDate: '2023-05-20',
        supervisor: 'Mike Johnson'
      },
      {
        id: '4',
        title: 'Database Migration',
        description: 'Migrate legacy database to new system',
        creationDate: '2023-01-30',
        launchDate: '2023-04-30',
        supervisor: 'Sarah Williams'
      },
      {
        id: '5',
        title: 'Employee Training',
        description: 'New software training for all employees',
        creationDate: '2023-02-20',
        launchDate: '2023-03-30',
        supervisor: 'David Brown'
      }
    ];
    localStorage.setItem('projects', JSON.stringify(projects));
  }

  if (!localStorage.getItem('tasks')) {
    const tasks = [
      // Project 1 tasks
      {
        id: '101',
        projectId: '1',
        title: 'Design Homepage',
        scheduledTime: 20,
        elapsedTime: 15,
        performer: 'Alice',
        priority: 'high',
        status: 'in progress',
        isArchived: false
      },
      {
        id: '102',
        projectId: '1',
        title: 'Create Style Guide',
        scheduledTime: 15,
        elapsedTime: 10,
        performer: 'Bob',
        priority: 'medium',
        status: 'completed',
        isArchived: false
      },
      {
        id: '103',
        projectId: '1',
        title: 'Implement Mobile Layout',
        scheduledTime: 25,
        elapsedTime: 5,
        performer: 'Charlie',
        priority: 'high',
        status: 'assigned',
        isArchived: false
      },
      {
        id: '104',
        projectId: '1',
        title: 'SEO Optimization',
        scheduledTime: 10,
        elapsedTime: 10,
        performer: 'Alice',
        priority: 'low',
        status: 'in progress',
        isArchived: true
      },
      // Project 2 tasks
      {
        id: '201',
        projectId: '2',
        title: 'Design App Wireframes',
        scheduledTime: 30,
        elapsedTime: 20,
        performer: 'Bob',
        priority: 'high',
        status: 'in progress',
        isArchived: false
      },
      {
        id: '202',
        projectId: '2',
        title: 'Set Up Backend API',
        scheduledTime: 40,
        elapsedTime: 25,
        performer: 'Charlie',
        priority: 'high',
        status: 'in progress',
        isArchived: false
      },
      {
        id: '203',
        projectId: '2',
        title: 'Implement User Authentication',
        scheduledTime: 15,
        elapsedTime: 15,
        performer: 'Alice',
        priority: 'medium',
        status: 'completed',
        isArchived: false
      },
      {
        id: '204',
        projectId: '2',
        title: 'Legacy Code Review',
        scheduledTime: 20,
        elapsedTime: 20,
        performer: 'Bob',
        priority: 'low',
        status: 'in progress',
        isArchived: true
      },
      // Project 3 tasks
      {
        id: '301',
        projectId: '3',
        title: 'Create Campaign Strategy',
        scheduledTime: 15,
        elapsedTime: 10,
        performer: 'Alice',
        priority: 'high',
        status: 'in progress',
        isArchived: false
      },
      {
        id: '302',
        projectId: '3',
        title: 'Design Marketing Materials',
        scheduledTime: 20,
        elapsedTime: 5,
        performer: 'Charlie',
        priority: 'medium',
        status: 'assigned',
        isArchived: false
      },
      // Project 4 tasks
      {
        id: '401',
        projectId: '4',
        title: 'Backup Existing Database',
        scheduledTime: 10,
        elapsedTime: 10,
        performer: 'Bob',
        priority: 'high',
        status: 'completed',
        isArchived: false
      },
      {
        id: '402',
        projectId: '4',
        title: 'Migrate User Data',
        scheduledTime: 30,
        elapsedTime: 20,
        performer: 'Alice',
        priority: 'high',
        status: 'in progress',
        isArchived: false
      },
      // Project 5 tasks
      {
        id: '501',
        projectId: '5',
        title: 'Prepare Training Materials',
        scheduledTime: 20,
        elapsedTime: 15,
        performer: 'Charlie',
        priority: 'medium',
        status: 'in progress',
        isArchived: false
      },
      {
        id: '502',
        projectId: '5',
        title: 'Schedule Training Sessions',
        scheduledTime: 10,
        elapsedTime: 5,
        performer: 'Bob',
        priority: 'low',
        status: 'completed',
        isArchived: false
      }
    ];
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }
};

const MainPage = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const { drawerWidth } = useOutletContext();
  const [selectedProject, setSelectedProject] = useState('1');
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);

  const [unarchiveDialogOpen, setUnarchiveDialogOpen] = useState(false);
  const [taskToUnarchive, setTaskToUnarchive] = useState(null);

  const [statusFilter, setStatusFilter] = useState(
    localStorage.getItem('taskStatusFilter') || 'all'
  );

  const location = useLocation();

  useEffect(() => {
    initializeData();
    const storedProjects = JSON.parse(localStorage.getItem('projects')) || [];
    const storedTasks = JSON.parse(localStorage.getItem('tasks')) || [];

    // Check for project in navigation state first
    const navProject = location.state?.selectedProject;
      
    // Then check localStorage for last selected
    const lastProject = localStorage.getItem('lastSelectedProject');
    
    // Default to first project if none set
    const initialProject = navProject || lastProject || (storedProjects.length > 0 ? storedProjects[0].id : null);
                         
    setProjects(storedProjects);
    setTasks(storedTasks);

    if (initialProject) {
      setSelectedProject(initialProject);
      localStorage.setItem('lastSelectedProject', initialProject);
    }


    const savedFilter = localStorage.getItem('taskStatusFilter');
    if (savedFilter) {
      setStatusFilter(savedFilter);
    }

    if (location.state?.selectedProject) {
      setSelectedProject(location.state.selectedProject);
    }
  }, [location.state]);

  const handleProjectSelect = (projectId) => {
    setSelectedProject(projectId);
    localStorage.setItem('lastSelectedProject', projectId);
  };

  const handleTaskClick = (taskId) => {
    navigate(`/task/${taskId}`);
  };

  const handleAddTask = () => {
    navigate('/add-task', { 
      state: { selectedProject: selectedProjectData.id } 
    });
  };

  const handleStatusChange = (taskId, newStatus) => {
    const updatedTasks = tasks.map(task => 
      task.id === taskId ? { ...task, status: newStatus } : task
    );
    setTasks(updatedTasks);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
  };

  const handleFilterChange = (value) => {
    const newFilter = value === 'all' ? 'all' : value;
    setStatusFilter(newFilter);
    localStorage.setItem('taskStatusFilter', newFilter);
  };

  const handleResetFilter = () => {
    handleFilterChange('all'); // Use the same handler to ensure consistency
  };

  const handleUnarchiveTask = (taskId, confirmed = false) => {
    if (!confirmed) {
      setTaskToUnarchive(taskId);
      setUnarchiveDialogOpen(true);
      return;
    }
  
    const updatedTasks = tasks.map(task => 
      task.id === taskId ? { ...task, isArchived: false } : task
    );
    setTasks(updatedTasks);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    setUnarchiveDialogOpen(false);
  };

  const filteredTasks = tasks.filter(task => 
    task.projectId === selectedProject && 
    !task.isArchived &&
    (statusFilter === 'all' || task.status === statusFilter)
  );

  const archivedTasks = tasks.filter(task => 
    task.projectId === selectedProject && 
    task.isArchived &&
    (statusFilter === 'all' || task.status === statusFilter)
  );

  const selectedProjectData = projects.find(project => project.id === selectedProject);

  const drawer = (
    <div>
          {/* <Toolbar />  */}
          <Box sx={{ overflow: 'auto' }}>
            <List>
              {/* "All Projects" list item */}
              <ListItem disablePadding>
                <ListItemButton 
                  sx={listItemStyles}
                  selected={location.pathname === '/projects'}
                  onClick={() => navigate('/projects')}
                >
                  <ListItemIcon>
                    <FolderIcon color={location.pathname === '/projects' ? 'primary' : 'inherit'} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="All Projects" 
                    primaryTypographyProps={{
                      fontWeight: location.pathname === '/projects' ? 'medium' : 'normal'
                    }}
                  />
                </ListItemButton>
              </ListItem>
              
              <Divider sx={{ my: 1 }} />
              
              {/* Current project section header */}
              <Typography 
                variant="subtitle2" 
                sx={{ 
                  px: 2, 
                  py: 1,
                  color: 'text.secondary',
                  fontWeight: 'medium'
                }}
              >
                CURRENT PROJECT
              </Typography>
              
              {/* Project list */}
              {projects.map((project) => (
                <ListItem key={project.id} disablePadding>
                  <ListItemButton 
                    selected={selectedProject === project.id}
                    sx={listItemStyles}
                    // selected={selectedProject === project.id && location.pathname === '/main'}
                    onClick={() => {
                      handleProjectSelect(project.id);
                      navigate('/main');
                    }}
                  >
                    <ListItemIcon>
                      <ViewListIcon 
                        color={
                          selectedProject === project.id && location.pathname === '/main' 
                            ? 'primary' 
                            : 'inherit'
                        } 
                      />
                    </ListItemIcon>
                    <ListItemText 
                      primary={project.title} 
                      primaryTypographyProps={{
                        fontWeight: selectedProject === project.id && location.pathname === '/main' 
                          ? 'medium' 
                          : 'normal'
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Box>
    </div>
  );

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
          onClick={() => handleUnarchiveTask(taskToUnarchive, true)} 
          color="primary"
          autoFocus
        >
          Unarchive
        </Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <ResponsiveDrawer drawerWidth={drawerWidth}>
          {drawer}
        </ResponsiveDrawer>
      </Box>
      <Box
        component="main"
        // sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          mt: '64px' // Account for app bar height
        }}
      >
        {/* <Toolbar /> */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', mb: 6 }}>
            <Typography variant="h5" gutterBottom>
              {selectedProjectData?.title}
            </Typography>
            
            {currentUser?.role === 'supervisor' && (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Button 
                  variant="contained" 
                  startIcon={<AddIcon />}
                  onClick={handleAddTask}
                >
                  Add Task
                </Button>
              </Box>
            )}
            {/* <Typography variant="subtitle1" gutterBottom>
              {selectedProjectData?.description}
            </Typography> */}
          </Box>
          
            
        </Box>
        

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, mt: 8 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>

            <Typography variant="h6" sx={{ mr:2 }}>
              {statusFilter === 'all' 
                ? 'All Active Tasks' 
                : `${statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)} Tasks`} 
              ({filteredTasks.length})
            </Typography>
              
              <FormControl sx={{ minWidth: 120, mr: 2 }} size="small">
                <InputLabel>Status Filter</InputLabel>
                <Select
                  value={statusFilter}
                  onChange={(e) => handleFilterChange(e.target.value)}
                  label="Status Filter"
                >
                  <MenuItem value="all">All Statuses</MenuItem>
                  <MenuItem value={TASK_STATUS.ASSIGNED}>Assigned</MenuItem>
                  <MenuItem value={TASK_STATUS.IN_PROGRESS}>In Progress</MenuItem>
                  <MenuItem value={TASK_STATUS.COMPLETED}>Completed</MenuItem>
                </Select>
              </FormControl>

              {statusFilter !== 'all' && (
                <Button 
                  size="small"
                  onClick={handleResetFilter}
                  sx={{ ml: 1 }}
                >
                  Reset
                </Button>
              )}
            </Box>
  
          {/* <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {currentUser?.role === 'supervisor' && (
              <Button 
                variant="contained" 
                startIcon={<AddIcon />}
                onClick={handleAddTask}
              >
                Add Task
              </Button>
            )}
          </Box> */}
        </Box>

        <Grid container spacing={2}>
          {filteredTasks.map((task) => (
            <Grid item xs={12} sm={6} md={3} key={task.id}>
              <Card
                sx={{ 
                  width: '100%',
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  // minHeight: 200, // Set minimum height
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 6
                  }
                }}
                onClick={() => handleTaskClick(task.id)}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h6" component="h3">
                    {task.title}
                  </Typography>

                  <Stack direction="row" spacing={1} sx={{ mb: 1, alignItems: 'center' }}>
                    <Box sx={{
                      display: 'flex',
                      alignItems: 'center',
                      color: priorityStyles[task.priority].color,
                      fontSize: '0.75rem',
                      border: `1px solid ${priorityStyles[task.priority].color}`,
                      borderRadius: '12px',
                      padding: '0 8px',
                      height: '24px'
                    }}>
                      {priorityStyles[task.priority].icon}
                      <Typography variant="caption" sx={{ ml: 0.5, textTransform: 'capitalize' }}>
                        {task.priority}
                      </Typography>
                    </Box>

                    <Chip
                      size="small"
                      icon={statusStyles[task.status].icon}
                      label={task.status}
                      sx={{
                        bgcolor: statusStyles[task.status].bgcolor,
                        color: statusStyles[task.status].color,
                        textTransform: 'capitalize',
                        '& .MuiChip-icon': {
                          color: statusStyles[task.status].color,
                          ml: '4px'
                        }
                      }}
                    />
                  </Stack>
                  
                  <Typography variant="body2" color="text.secondary">
                    Performer: {task.performer}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Time: {task.elapsedTime}h / {task.scheduledTime}h
                  </Typography>
                </CardContent>
                <CardActions>
                  {currentUser?.role === 'performer' && (
                    <Stack direction="row" spacing={1}>
                      <Button 
                        size="small" 
                        variant="outlined"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStatusChange(task.id, TASK_STATUS.IN_PROGRESS);
                        }}
                        disabled={task.status === TASK_STATUS.IN_PROGRESS}
                      >
                        Start
                      </Button>
                      <Button 
                        size="small" 
                        variant="outlined"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStatusChange(task.id, TASK_STATUS.COMPLETED);
                        }}
                        disabled={task.status === TASK_STATUS.COMPLETED}
                      >
                        Complete
                      </Button>
                    </Stack>
                  )}
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        {archivedTasks.length > 0 && (
              <>
                <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
                  Archived Tasks ({archivedTasks.length})
                </Typography>
                <Grid container spacing={2}>
                  {archivedTasks.map((task) => (
                    <Grid item xs={12} sm={6} md={4} key={task.id}>
                      <Card sx={{ 
                        height: '100%', 
                        opacity: 0.7,
                        border: '1px dashed',
                        borderColor: 'text.secondary',
                        '&:hover': {
                          opacity: 1,
                          borderStyle: 'solid'
                        }
                      }}>
                        <CardContent>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <ArchiveIcon color="action" sx={{ mr: 1 }} />
                            <Typography variant="h6" component="h3">
                              {task.title}
                            </Typography>
                          </Box>
                          <Typography variant="body2" color="text.secondary">
                            Performer: {task.performer}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Status: {task.status}
                          </Typography>
                        </CardContent>
                        <CardActions>
                          {currentUser?.role === 'supervisor' && (
                            // <Button
                            //   size="small"
                            //   variant="outlined"
                            //   onClick={(e) => {
                            //     e.stopPropagation();
                            //     handleUnarchiveTask(task.id);
                            //     handleUnarchiveClick(task.id);
                            //   }}
                            // >
                            //   Unarchive
                            // </Button>
                            <Button
                              size="small"
                              variant="outlined"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleUnarchiveTask(task.id);
                              }}
                            >
                              Unarchive
                            </Button>
                          )}
                        </CardActions>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </>
            )}
      </Box>
      {UnarchiveConfirmationDialog}
    </Box>
  );
};

export default MainPage;