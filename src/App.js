import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import AuthPage from './pages/AuthPage';
import MainPage from './pages/MainPage';
import AddTaskPage from './pages/AddTaskPage';
import TaskDetailPage from './pages/TaskDetailPage';
import ProjectsPage from './pages/ProjectsPage';
import AddProjectPage from './pages/AddProjectPage';
import EditTaskPage from './pages/EditTaskPage';
import { AuthProvider, useAuth } from './context/AuthContext';

import Layout from './components/Layout';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#3f51b5',
    },
    secondary: {
      main: '#f50057',
    },
  },
});

const RouteTracker = () => {
  const location = useLocation();
  const { currentUser } = useAuth();

  useEffect(() => {
    if (currentUser && location.pathname !== '/') {
      localStorage.setItem('lastPath', location.pathname);
    }
  }, [location, currentUser]);

  return null;
};

const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !currentUser) {
      navigate('/');
    }
  }, [currentUser, loading, navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return currentUser ? children : null;
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <RouteTracker />
          <Routes>
            <Route path="/" element={<AuthPage />} />
            <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
              <Route path="/main" element={<MainPage />} />
              <Route path="/add-task" element={<AddTaskPage />} />
              <Route path="/task/:taskId" element={<TaskDetailPage />} />
              <Route path="/task/:taskId/edit" element={<EditTaskPage />} />
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/add-project" element={<AddProjectPage />} />
            </Route>
          </Routes>
          {/* <Routes>
            <Route path="/" element={<AuthPage />} />
            <Route path="/main" element={
              <ProtectedRoute>
                <MainPage />
              </ProtectedRoute>
            } />
            <Route path="/add-task" element={
              <ProtectedRoute>
                <AddTaskPage />
              </ProtectedRoute>
            } />
            <Route path="/task/:taskId" element={
              <ProtectedRoute>
                <TaskDetailPage />
              </ProtectedRoute>
            } />
            <Route path="/task/:taskId/edit" element={
              <ProtectedRoute>
                <EditTaskPage />
              </ProtectedRoute>
            } />
            <Route path="/projects" element={
              <ProtectedRoute>
                <ProjectsPage />
              </ProtectedRoute>
            } />
            <Route path="/add-project" element={
              <ProtectedRoute>
                <AddProjectPage />
              </ProtectedRoute>
            } />
          </Routes> */}
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;

// import React from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import { ThemeProvider, createTheme } from '@mui/material/styles';
// import CssBaseline from '@mui/material/CssBaseline';

// import AuthPage from './pages/AuthPage';
// import MainPage from './pages/MainPage';
// import AddTaskPage from './pages/AddTaskPage';
// import TaskDetailPage from './pages/TaskDetailPage';
// import ProjectsPage from './pages/ProjectsPage';
// import AddProjectPage from './pages/AddProjectPage';
// import EditTaskPage from './pages/EditTaskPage';

// import { AuthProvider, useAuth } from './context/AuthContext';

// const theme = createTheme({
//   palette: {
//     mode: 'light',
//     primary: {
//       main: '#3f51b5',
//     },
//     secondary: {
//       main: '#f50057',
//     },
//   },
// });

// function App() {
//   return (
//     <ThemeProvider theme={theme}>
//       <CssBaseline />
//       <AuthProvider>
//         <Router>
//           <Routes>
//             <Route path="/" element={<AuthPage />} />
//             <Route path="/main" element={<ProtectedRoute><MainPage /></ProtectedRoute>} />
//             <Route path="/add-task" element={<ProtectedRoute><AddTaskPage /></ProtectedRoute>} />
//             <Route path="/task/:taskId" element={<ProtectedRoute><TaskDetailPage /></ProtectedRoute>} />
//             <Route path="/projects" element={<ProtectedRoute><ProjectsPage /></ProtectedRoute>} />
//             <Route path="/add-project" element={<ProtectedRoute><AddProjectPage /></ProtectedRoute>} />
//             <Route path="/task/:taskId/edit" element={<ProtectedRoute><EditTaskPage /></ProtectedRoute>} />
//           </Routes>
//         </Router>
//       </AuthProvider>
//     </ThemeProvider>
//   );
// }

// function ProtectedRoute({ children }) {
//   const { currentUser } = useAuth();
//   return currentUser ? children : <Navigate to="/" replace />;
// }

// export default App;