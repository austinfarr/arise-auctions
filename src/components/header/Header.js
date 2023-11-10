// components/Header.js
import { AppBar, Toolbar, Button, Box, Avatar, Badge } from "@mui/material";
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";
import { Notifications, Person, Sell, ViewList } from "@mui/icons-material";
import DrawerMenu from "../DrawerMenu";
import Logo from "./Logo";
import { useDrawer } from "@/context/DrawerContext";

const Header = () => {
  const router = useRouter();
  const { logout, user, loggedIn } = useAuth();
  const { openDrawer, closeDrawer, openSideDrawer } = useDrawer();

  const toggleDrawer = (open) => (event) => {
    console.log("toggleDrawer", open);
    console.log("event", event);

    if (
      event &&
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
  };

  const handleLogout = () => {
    logout();
  };

  const handleUserMenuOpen = () => {
    if (loggedIn) {
      openSideDrawer();
    } else {
      openDrawer();
    }
  };

  return (
    <>
      <AppBar
        position="sticky"
        color="secondary"
        elevation={0}
        sx={{ bgcolor: "#f5f5f5", py: 1 }}
      >
        <Toolbar>
          <Box display="flex" alignItems="center" sx={{ flexGrow: 1 }}>
            <Logo />
          </Box>

          <Button onClick={handleUserMenuOpen}>
            <Avatar sx={{ bgcolor: "#ff8e44", color: "#fff" }}>
              {user && user.full_name ? user.full_name.charAt(0) : <Person />}
            </Avatar>
          </Button>
        </Toolbar>
      </AppBar>
      <DrawerMenu onClose={toggleDrawer(false)} onLogout={handleLogout} />
    </>
  );
};

export default Header;
