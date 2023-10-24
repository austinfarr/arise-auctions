import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { useRouter } from "next/router";
import { Logout, Sell, ViewList, Login } from "@mui/icons-material";

const DrawerMenu = ({ isOpen, onClose, loggedIn, onLogout }) => {
  const router = useRouter();

  return (
    <Drawer anchor="right" open={isOpen} onClose={onClose}>
      <List>
        <ListItemButton
          key="Browse"
          onClick={() => {
            toggleDrawer(false)();
            router.push("/");
          }}
        >
          <ListItemIcon>
            <ViewList color="primary" />
          </ListItemIcon>
          <ListItemText primary="Browse" />
        </ListItemButton>
        <ListItemButton
          key="My Bids"
          onClick={() => {
            toggleDrawer(false)();
            router.push("/my-bids");
          }}
        >
          <ListItemIcon>
            <Sell color="primary" />
          </ListItemIcon>
          <ListItemText primary="My Bids" />
        </ListItemButton>
        {loggedIn ? (
          <ListItemButton key="Logout" onClick={onLogout}>
            <ListItemIcon>
              <Logout color="primary" />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        ) : (
          <ListItemButton key="Login" onClick={() => router.push("/login")}>
            <ListItemIcon>
              <Login color="primary" />
            </ListItemIcon>
            <ListItemText primary="Login" />
          </ListItemButton>
        )}
      </List>
    </Drawer>
  );
};

export default DrawerMenu;
