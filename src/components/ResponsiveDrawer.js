import { Drawer, useTheme, useMediaQuery } from '@mui/material';
import { useDrawer } from './Layout';

const ResponsiveDrawer = ({ children, drawerWidth }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { mobileOpen, setMobileOpen } = useDrawer();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Drawer
      variant={isMobile ? 'temporary' : 'permanent'}
      open={isMobile ? mobileOpen : true}
      onClose={handleDrawerToggle}
      sx={{
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          top: '64px' // Account for app bar height
        },
      }}
      ModalProps={{
        keepMounted: true,
      }}
    >
      {children}
    </Drawer>
  );
};

export default ResponsiveDrawer;