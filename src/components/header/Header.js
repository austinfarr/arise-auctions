// components/Header.js
import {
  AppBar,
  Toolbar,
  Button,
  Box,
  Avatar,
  Badge,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";
import { Notifications, Person, Sell, ViewList } from "@mui/icons-material";
import DrawerMenu from "../DrawerMenu";
import Logo from "./Logo";
import { useDrawer } from "@/context/DrawerContext";
import { useConfigurations } from "@/context/ConfigurationsContext";
import Countdown from "react-countdown";

const Header = () => {
  const router = useRouter();
  const { logout, user, loggedIn } = useAuth();
  const { openDrawer, closeDrawer, openSideDrawer } = useDrawer();

  const configurations = useConfigurations();

  // Renderer callback with condition
  const countdownRenderer = ({ days, hours, minutes, seconds, completed }) => {
    if (completed) {
      // Render a completed state
      return (
        <Typography variant="h6" sx={{ fontWeight: 500 }}>
          Auction ended
        </Typography>
      );
    } else {
      // Render a countdown
      return (
        <Typography variant="h6" sx={{ fontWeight: 500 }}>
          {days > 1 && `${days} days left`}
          {days === 1 && `${days} day left`}
          {days === 0 &&
            hours > 1 &&
            `${hours} hours, ${minutes} minutes left!`}
          {days === 0 &&
            hours < 1 &&
            `${minutes} minutes, ${seconds} seconds left!`}
        </Typography>
      );
    }
  };

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
          <Box display="flex" alignItems="center" px={1}>
            <Logo />
          </Box>

          {configurations["auction_timer"] && (
            <Box sx={{ flexGrow: 1, textAlign: "center" }}>
              <Countdown
                date={new Date(configurations["auction_timer"])}
                renderer={countdownRenderer}
              />
            </Box>
          )}

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
