// components/Header.js
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  MenuItem,
  Menu,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  ListItemIcon,
  Icon,
  Avatar,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useRouter } from "next/router";
import Image from "next/image"; // Importing the Image component
import { use, useEffect, useState } from "react";
import supabase from "../../lib/supabase";
import Link from "next/link";
import { deleteCookie, getCookie } from "cookies-next";
import { useAuth } from "@/context/AuthContext";
import { Login, Logout, Sell, ViewList } from "@mui/icons-material";
import { deepOrange } from "@mui/material/colors";

const Header = ({ hasLogoutOption }) => {
  const router = useRouter();
  const { loggedIn, logout } = useAuth();

  const [avatarMenuAnchorEl, setAvatarMenuAnchorEl] = useState(null);
  const isAvatarMenuOpen = Boolean(avatarMenuAnchorEl);

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const [drawerOpen, setDrawerOpen] = useState(false);

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
    setDrawerOpen(open);
  };

  const handleAvatarClick = (event) => {
    setAvatarMenuAnchorEl(event.currentTarget);
  };

  const handleAvatarMenuClose = () => {
    setAvatarMenuAnchorEl(null);
  };

  const handleLogout = () => {
    handleAvatarMenuClose();
    logout();
  };

  const handleLogin = () => {
    handleAvatarMenuClose();
    router.push("/login");
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar
      position="sticky"
      color="secondary"
      sx={{
        width: "100%",
      }}
    >
      <Toolbar>
        <Box display="flex" alignItems="center" sx={{ flexGrow: 1 }}>
          {/* Using the Image component to load the image */}
          <Link href="/">
            <Image
              src="https://www.ariseafrica.org/wp-content/uploads/2020/04/arise-logo-color.png"
              alt="Arise Auctions Logo"
              width={45} // You can adjust these values for your design needs
              height={45}
              priority={true}

              // objectFit="contain"
            />
          </Link>
          {/* <Typography variant="h6" sx={{ marginLeft: 2, color: "white" }}>
            Arise Auctions
          </Typography> */}
        </Box>

        {/* <Icon
          size="small"
          // edge="start"
          // color="inherit"
          // aria-label="menu"
          // sx={{ mr: 2 }}
          // onClick={toggleDrawer(true)}
        > */}

        <Button
          onClick={handleAvatarClick}
          sx={{ padding: 0, minWidth: "auto", color: "inherit" }}
        >
          <Avatar sx={{ bgcolor: deepOrange[300] }}>H</Avatar>
        </Button>

        <Menu
          anchorEl={avatarMenuAnchorEl}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          open={isAvatarMenuOpen}
          onClose={handleAvatarMenuClose}
        >
          {loggedIn ? (
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          ) : (
            <MenuItem onClick={handleLogin}>Login</MenuItem>
          )}
        </Menu>
        {/* </Icon> */}

        <Drawer
          anchor="right"
          open={drawerOpen}
          onClose={toggleDrawer(false)}
          sx={{
            "& .MuiDrawer-paper": {
              width: "50%", // Adjust as needed
            },
          }}
        >
          {/* <Typography variant="h5" color="primary">
            Where to?
          </Typography> */}
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
              <ListItemButton key="Logout" onClick={logout}>
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

        {/* 
        <Button
          color="inherit"
          sx={{ color: "#fff" }}
          onClick={() => router.push("/")}
        >
          Browse
        </Button>
        <Button
          color="inherit"
          sx={{ color: "#fff" }}
          onClick={() => router.push("/my-bids")}
        >
          My Bids
        </Button> */}

        {/* {hasLogoutOption === true ? (
          loggedIn === true && (
            <Button
              color="inherit"
              sx={{ color: "#fff" }}
              onClick={logout} // Call the handleLogout function when this button is clicked
            >
              Logout
            </Button>
          )
        ) : (
          <></>
        )}
        {hasLogoutOption === true ? (
          !loggedIn && (
            <Button
              color="inherit"
              sx={{ color: "#fff" }}
              onClick={() => router.push("/login")}
            >
              Login
            </Button>
          )
        ) : (
          <></>
        )} */}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
