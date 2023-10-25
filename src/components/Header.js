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
  Badge,
  Chip,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useRouter } from "next/router";
import Image from "next/image"; // Importing the Image component
import { use, useEffect, useState } from "react";
import supabase from "../../lib/supabase";
import Link from "next/link";
import { deleteCookie, getCookie } from "cookies-next";
import { useAuth } from "@/context/AuthContext";
import {
  Login,
  Logout,
  Notifications,
  Person,
  Sell,
  ViewList,
} from "@mui/icons-material";
import { deepOrange } from "@mui/material/colors";
import NotificationItem from "./NotificationItem";
import NotificationMenu from "./NotificationMenu";
import UserMenu from "./UserMenu";
import DrawerMenu from "./DrawerMenu";
import Logo from "./Logo";
import { useDrawer } from "@/context/DrawerContext";

const Header = () => {
  const router = useRouter();
  const { loggedIn, logout, user } = useAuth();
  const { openDrawer, closeDrawer } = useDrawer();

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const [drawerOpen, setDrawerOpen] = useState(false);

  const [notifications, setNotifications] = useState([]);
  const [notificationMenuAnchorEl, setNotificationMenuAnchorEl] =
    useState(null);
  const isNotificationMenuOpen = Boolean(notificationMenuAnchorEl);

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

  const handleLogout = () => {
    logout();
  };

  const handleUserMenuOpen = () => {
    openDrawer();
  };

  return (
    <AppBar position="sticky" color="secondary">
      <Toolbar>
        <Box display="flex" alignItems="center" sx={{ flexGrow: 1 }}>
          <Logo />
        </Box>
        {/* 
        <NotificationMenu
          notifications={notifications}
          anchorEl={notificationMenuAnchorEl}
          isOpen={isNotificationMenuOpen}
          onClose={handleNotificationMenuClose}
          onOpen={handleNotificationMenuOpen}
          onNotificationClick={handleNotificationClick}
        /> */}

        {/* <UserMenu
          loggedIn={loggedIn}
          anchorEl={avatarMenuAnchorEl}
          isOpen={isAvatarMenuOpen}
          onOpen={handleAvatarClick}
          onClose={handleAvatarMenuClose}
          onLogout={handleLogout}
          onLogin={handleLogin}
        /> */}

        <Button onClick={handleUserMenuOpen}>
          <Avatar sx={{ bgcolor: deepOrange[300] }}>
            {user ? user.full_name.charAt(0) : <Person />}
          </Avatar>
        </Button>

        <DrawerMenu
          onClose={toggleDrawer(false)}
          loggedIn={loggedIn}
          onLogout={handleLogout}
        />
      </Toolbar>
    </AppBar>
  );
};

export default Header;

// const handleNotificationMenuOpen = (event) => {
//   setNotificationMenuAnchorEl(event.currentTarget);
//   console.log("notifications", notifications);
// };

// const handleNotificationMenuClose = () => {
//   setNotificationMenuAnchorEl(null);
// };

// const handleNotificationClick = async (notification) => {
//   // handleNotificationMenuClose();

//   // Update the state immediately for a responsive UI
//   setNotifications((prev) =>
//     prev.map((n) => (n.id === notification.id ? { ...n, read: true } : n))
//   );
//   console.log(notifications.map((n) => n));

//   // Send the update to Supabase
//   try {
//     console.log("notification.id", notification.id);
//     const { error } = await supabase
//       .from("Notifications")
//       .update({ read: true })
//       .match({ id: notification.id });

//     if (error) throw error;
//   } catch (error) {
//     console.error("Error marking notification as read", error);
//   }
// };

// useEffect(() => {
//   const fetchNotifications = async () => {
//     try {
//       // Assuming you have a 'user_id' field in your Notifications table
//       const user_id = user;
//       console.log("user_id", user_id);
//       if (!user_id) return;

//       const { data: notifications, error } = await supabase
//         .from("Notifications")
//         .select("*")
//         .eq("user_id", user_id);

//       if (error) throw error;

//       setNotifications(notifications);
//     } catch (error) {
//       console.error("Error fetching notifications", error);
//     }
//   };

//   fetchNotifications();

//   const notificationSubscription = supabase
//     .channel("table_db_changes")
//     .on(
//       "postgres_changes",
//       {
//         event: "*",
//         schema: "public",
//         table: "Notifications",
//       },
//       (payload) => {
//         const eventType = payload.eventType;
//         const newRecord = payload.new;
//         const oldRecord = payload.old;
//         console.log("eventType", eventType);
//         console.log("newRecord", newRecord);
//         console.log("oldRecord", oldRecord);
//         setNotifications((prevNotifications) => {
//           // Check if the notification is already in the state
//           const alreadyExists = prevNotifications.some(
//             (n) => n.id === newRecord.id
//           );
//           if (!alreadyExists) {
//             return [newRecord, ...prevNotifications];
//           }
//           return prevNotifications;
//         });

//         // handleDataChange(eventType, newRecord, oldRecord);
//       }
//     )
//     .subscribe();

//   // Cleanup the subscription when the component unmounts
//   return () => {
//     notificationSubscription.unsubscribe();
//   };
// }, []);
