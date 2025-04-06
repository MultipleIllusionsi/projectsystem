import { useState, createContext, useContext } from 'react';
import { Outlet } from 'react-router-dom';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  IconButton
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const DrawerContext = createContext();
export const useDrawer = () => useContext(DrawerContext);

const Layout = ({ drawerWidth = 240 }) => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <DrawerContext.Provider value={{ mobileOpen, setMobileOpen }}>
      <AppBar 
        position="fixed" 
        sx={{ 
          zIndex: (theme) => theme.zIndex.drawer + 1,
          // width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` }
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Project Management
          </Typography>
          <Typography variant="subtitle1" sx={{ mr: 2 }}>
            {currentUser?.name} ({currentUser?.role})
          </Typography>
          <Button color="inherit" onClick={handleLogout}>Logout</Button>
        </Toolbar>
      </AppBar>
      <Toolbar /> {/* This adds padding below the app bar */}
      <Outlet 
        context={{ 
          mobileOpen, 
          handleDrawerToggle,
          drawerWidth 
        }} 
      />
    </DrawerContext.Provider>
  );
};

export default Layout;

// import { useState } from 'react';
// import { Outlet, useNavigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';

// import { AppBar, Toolbar, Typography, Button, IconButton } from '@mui/material';
// import MenuIcon from '@mui/icons-material/Menu';

// const Layout = () => {
//   const { currentUser, logout } = useAuth();
//   const navigate = useNavigate();
//   const [mobileOpen, setMobileOpen] = useState(false);

//   const handleLogout = () => {
//     logout();
//     navigate('/');
//   };

//   return (
//     <>
//       <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
//         <Toolbar>
//           {/* <IconButton
//             color="inherit"
//             edge="start"
//             sx={{ mr: 2 }}
//           >
//             <MenuIcon />
//           </IconButton> */}
//           <IconButton
//             color="inherit"
//             edge="start"
//             onClick={() => setMobileOpen(!mobileOpen)}
//             sx={{ mr: 2, display: { sm: 'none' } }}
//           >
//             <MenuIcon />
//           </IconButton>
//           <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
//             Project Management System
//           </Typography>
//           <Typography variant="subtitle1" sx={{ mr: 2 }}>
//             {currentUser?.name} ({currentUser?.role})
//           </Typography>
//           <Button color="inherit" onClick={handleLogout}>Logout</Button>
//         </Toolbar>
//       </AppBar>
//       <Toolbar /> {/* This adds padding below the app bar */}
//       <Outlet />
//     </>
//   );
// };

// export default Layout;