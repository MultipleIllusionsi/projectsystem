import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Box, 
  Drawer, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemText, 
  Divider, 
  Typography, 
  Toolbar, 
  AppBar, 
  IconButton,
  Badge,
  Chip,
  Card,
  CardContent,
  CardActions,
  Button,
  Stack,
  Grid,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ArchiveIcon from '@mui/icons-material/Archive';
import AddIcon from '@mui/icons-material/Add';
// import { styled } from '@mui/material/styles';

import { TASK_STATUS, TASK_PRIORITY } from '../constants';

const drawerWidth = 240;

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
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState('1');
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);

  const [unarchiveDialogOpen, setUnarchiveDialogOpen] = useState(false);
  const [taskToUnarchive, setTaskToUnarchive] = useState(null);

  const [statusFilter, setStatusFilter] = useState(
    localStorage.getItem('taskStatusFilter') || 'all'
  );

  useEffect(() => {
    initializeData();
    const storedProjects = JSON.parse(localStorage.getItem('projects')) || [];
    const storedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    setProjects(storedProjects);
    setTasks(storedTasks);
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProjectSelect = (projectId) => {
    setSelectedProject(projectId);
  };

  const handleTaskClick = (taskId) => {
    navigate(`/task/${taskId}`);
  };

  const handleAddTask = () => {
    navigate('/add-task');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleStatusChange = (taskId, newStatus) => {
    const updatedTasks = tasks.map(task => 
      task.id === taskId ? { ...task, status: newStatus } : task
    );
    setTasks(updatedTasks);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
  };

  const handleFilterChange = (value) => {
    setStatusFilter(value);
    localStorage.setItem('taskStatusFilter', value);
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
      <Toolbar />
      <Divider />
      <List>
        {projects.map((project) => (
          <ListItem key={project.id} disablePadding>
            <ListItemButton 
              selected={selectedProject === project.id}
              onClick={() => handleProjectSelect(project.id)}
            >
              <ListItemText primary={project.title} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );

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
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {selectedProjectData?.title || 'Project Management'}
          </Typography>
          <Typography variant="subtitle1" sx={{ mr: 2 }}>
            {currentUser?.name} ({currentUser?.role})
          </Typography>
          <Button color="inherit" onClick={handleLogout}>Logout</Button>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
      >
        <Toolbar />
        <Typography variant="h5" gutterBottom>
          {selectedProjectData?.title}
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          {selectedProjectData?.description}
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, mt: 8 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="h6" sx={{ mr: 4 }}>
              {statusFilter === 'all' ? 'Active Tasks' : `${statusFilter} Tasks`} ({filteredTasks.length})
            </Typography>

            <FormControl sx={{ minWidth: 120, mr: 2 }} size="small">
                <InputLabel>Filter by Status</InputLabel>
                <Select
                  value={statusFilter}
                  onChange={(e) => handleFilterChange(e.target.value)}
                  label="Filter by Status"
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
                  onClick={() => setStatusFilter('all')}
                  sx={{ ml: 1 }}
                >
                  Clear Filter
                </Button>
              )}
            </Box>
  
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {currentUser?.role === 'supervisor' && (
              <Button 
                variant="contained" 
                startIcon={<AddIcon />}
                onClick={handleAddTask}
              >
                Add Task
              </Button>
            )}
          </Box>
        </Box>
        
        {/* <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Active Tasks ({filteredTasks.length})</Typography>
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

        <Grid container spacing={2}>
          {filteredTasks.map((task) => (
            <Grid item xs={12} sm={6} md={4} key={task.id}>
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  cursor: 'pointer',
                  '&:hover': {
                    boxShadow: 3
                  }
                }}
                onClick={() => handleTaskClick(task.id)}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h6" component="h3">
                    {task.title}
                  </Typography>
                  <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                    <Chip 
                      label={task.priority} 
                      size="small" 
                      color={getPriorityColor(task.priority)} 
                    />
                    <Chip 
                      label={task.status} 
                      size="small" 
                      color={getStatusColor(task.status)} 
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

        {/* {archivedTasks.length > 0 && (
          <>
            <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
              Archived Tasks ({archivedTasks.length})
            </Typography>
            <Grid container spacing={2}>
              {archivedTasks.map((task) => (
                <Grid item xs={12} sm={6} md={4} key={task.id}>
                  <Card sx={{ height: '100%', opacity: 0.7 }}>
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
                  </Card>
                </Grid>
              ))}
            </Grid>
          </>
        )} */}
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