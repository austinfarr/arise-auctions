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
import { ArrowForward, Close, Person } from "@mui/icons-material";
import { useRouter } from "next/router";
import Link from "next/link";

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
          display: "flex",
          flexDirection: "column",
          backgroundColor: "grey.200", // Gray background color
          // bgcolor: "background.default", // Existing background color
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
            backgroundColor: "background.default", // Existing background color
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
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "end",
            px: 2,
            py: 4,
            backgroundColor: "background.default", // Existing background color
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
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "end",
            px: 2,

            backgroundColor: "grey.200", // Gray background color
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center", // Align items in the center vertically
              py: 3,
              cursor: "pointer",
              "&:hover": {
                color: "primary.main",
              },
              "&:hover svg": {
                // Change color of the icon on hover
                color: "primary.main",
              },
            }}
            onClick={handleBrowse}
          >
            <Typography
              sx={{
                fontWeight: 600,
                mr: 1, // Margin right to add space between text and icon
              }}
            >
              BROWSE
            </Typography>
            <ArrowForward />
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center", // Align items in the center vertically
              py: 3,
              cursor: "pointer",
              "&:hover": {
                color: "primary.main",
              },
              "&:hover svg": {
                // Change color of the icon on hover
                color: "primary.main",
              },
            }}
            onClick={handlePurchased}
          >
            <Typography
              sx={{
                fontWeight: 600,
                mr: 1, // Margin right to add space between text and icon
              }}
            >
              PURCHASED
            </Typography>
            <ArrowForward />
          </Box>

          <Button
            variant="contained"
            color="primary"
            type="submit"
            sx={{
              color: "#fff",
              //   margin: "0 auto",
              height: 50,
              width: 160,
              borderRadius: 0.5,
              mt: 4,
            }}
          >
            DONATE
          </Button>

          <Link
            href="https://www.ariseafrica.org/what-we-do"
            replace={false}
            style={{ textDecoration: "none" }}
          >
            <Typography
              // onClick={handleBrowse}
              sx={{
                mt: 4,
                pt: 2,
                fontWeight: 600,
                cursor: "pointer",
                textDecoration: "none", // Remove underline
                "&:hover": { color: "primary.main" },
              }}
            >
              LEARN ABOUT ARISE AFRICA
            </Typography>
          </Link>
          <Link
            href="https://www.ariseafrica.org/what-we-do"
            replace={false}
            style={{ textDecoration: "none" }}
          >
            <Typography
              // onClick={handleBrowse}
              sx={{
                pt: 1,
                fontWeight: 600,
                cursor: "pointer",
                "&:hover": { color: "primary.main" },
              }}
            >
              VIEW EVENT SPONSORS
            </Typography>
          </Link>
        </Box>
      </Box>
    </>
  );
};

export default SideDrawer;
