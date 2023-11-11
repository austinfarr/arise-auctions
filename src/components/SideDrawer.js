import React from "react";
import {
  Box,
  List,
  ListItem,
  ListItemText,
  Divider,
  Button,
  Typography,
  IconButton,
  Avatar,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Header from "./header/Header";
import Logo from "./header/Logo";
import { Close, Person } from "@mui/icons-material";
import { useRouter } from "next/router";

const SideDrawer = ({ onClose, user, onLogout }) => {
  const router = useRouter();

  // Define the options for the side drawer
  const options = [
    { text: "Browse", action: () => {} },
    { text: "Purchased", action: () => {} },
    { text: "Learn about Arise Africa", action: () => {} },
    { text: "View Event Sponsors", action: () => {} },
  ];

  const handleBrowse = () => {
    router.push("/");
    onClose();
  };

  const handlePurchased = () => {
    router.push("/purchased");
    onClose();
  };

  return (
    <>
      <Box
        role="presentation"
        sx={{
          width: "100vw", // Full screen width
          height: "100vh", // Full screen height
          bgcolor: "background.paper",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            py: 1,
            px: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderColor: "divider",
          }}
        >
          <Logo />
          <Button onClick={onClose}>
            <Avatar
              sx={{
                bgcolor: "transparent", // Remove the fill color
                color: "#ff8e44", // Set the icon color
                border: "1px solid #ff8e44", // Add a border with the desired color
              }}
            >
              <Close />
            </Avatar>
          </Button>
        </Box>
        <Box
          sx={{
            // flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "end",
            px: 2,
            py: 4,
          }}
        >
          <Typography variant="body1" gutterBottom>
            You are signed in as
          </Typography>
          <Typography
            variant="h4"
            align="center"
            sx={{ fontWeight: 600, letterSpacing: -1 }}
          >
            {user ? `${user.full_name}` : "Sign in"}
          </Typography>
          <Button
            variant="text"
            color="primary"
            onClick={onLogout}
            sx={{
              //   margin: "0 auto",
              textDecoration: "underline",
              textDecorationThickness: "2px", // Adjust thickness of the underline
              textUnderlineOffset: "4px",
            }}
          >
            Log Out
          </Button>

          <Typography
            onClick={handleBrowse}
            sx={{
              mt: 10,
              cursor: "pointer",
              "&:hover": { color: "primary.main" },
            }}
          >
            BROWSE
          </Typography>
          <Typography
            onClick={handlePurchased}
            sx={{
              mt: 5,
              "&:hover": { color: "primary.main", cursor: "pointer" },
            }}
          >
            PURCHASED
          </Typography>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            sx={{
              color: "#fff",
              //   margin: "0 auto",
              height: 50,
              width: 140,
              borderRadius: 0.5,
              mt: 5,
            }}
          >
            DONATE
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default SideDrawer;