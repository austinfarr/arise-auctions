import { useAuth } from "@/context/AuthContext";
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  Button,
  Typography,
  Box,
  TextField,
  Alert,
} from "@mui/material";
import { useState } from "react";
import supabase from "../../lib/supabase";
import { useDrawer } from "@/context/DrawerContext";

const DrawerMenu = ({ loggedIn }) => {
  const { isDrawerOpen, closeDrawer } = useDrawer();
  const { user, login, verifyOtp, logout } = useAuth();

  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const [otp, setOtp] = useState("");
  const [verificationError, setVerificationError] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerificationInitiated, setIsVerificationInitiated] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoggingIn(true);
    try {
      await login(phoneNumber);
      // You might need to adjust this part depending on your login flow
      setIsLoggingIn(false);
      setIsVerificationInitiated(true);
    } catch (error) {
      setError(error.message);
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    logout();
    setIsVerificationInitiated(false);
  };

  const handleOTPVerification = async (e) => {
    e.preventDefault();
    setVerificationError(null);
    setIsVerifying(true);
    try {
      console.log("phoneNumber", phoneNumber);
      console.log("otp", otp);
      await verifyOtp(phoneNumber, otp);

      setIsVerifying(false);
      setPhoneNumber("");
      setOtp("");
      //   onClose(); // Close the drawer after verification
    } catch (error) {
      setVerificationError(error.message);
      setIsVerifying(false);
    }
  };

  return (
    <Drawer
      anchor="bottom"
      open={isDrawerOpen}
      onClose={closeDrawer}
      sx={{
        height: "60%",
        display: "flex",
        flexDirection: "column",
        "& .MuiPaper-root": {
          borderTopLeftRadius: 32,
          borderTopRightRadius: 32,
          height: "60%",
          background: "#fff",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100%", // Take up all available space in the drawer
        }}
      >
        <List sx={{ width: "100%" }}>
          {loggedIn && user ? (
            <>
              <ListItem>
                <ListItemText
                  primary={
                    <Typography variant="body1" align="center">
                      You are logged in as
                    </Typography>
                  }
                  secondary={
                    <Typography
                      variant="h4"
                      align="center"
                      sx={{ fontWeight: "bold", fontFamily: "sans-serif" }}
                    >
                      {user.full_name}
                    </Typography>
                  }
                />
              </ListItem>
              <ListItem>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={handleLogout}
                  sx={{ margin: "0 auto" }}
                >
                  Log Out
                </Button>
              </ListItem>
            </>
          ) : isVerificationInitiated ? (
            // OTP Verification Form
            <form onSubmit={handleOTPVerification}>
              <ListItem>
                <ListItemText
                  primary={
                    <Typography variant="body2" align="center">
                      Verify Your One-Time-Passcode
                    </Typography>
                  }
                />
              </ListItem>
              <ListItem>
                <TextField
                  variant="outlined"
                  fullWidth
                  required
                  autoFocus
                  label="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  sx={{ marginBottom: "1em" }}
                />
              </ListItem>
              <ListItem>
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  disabled={isVerifying}
                  sx={{ color: "#fff", margin: "0 auto" }}
                >
                  Verify Code
                </Button>
              </ListItem>
              {verificationError && (
                <Alert
                  severity="error"
                  variant="contained"
                  sx={{
                    backgroundColor: "#d32f2f",
                    color: "#fff",
                    width: "100%",
                    marginTop: "1em",
                  }}
                >
                  {verificationError}
                </Alert>
              )}
            </form>
          ) : (
            <form onSubmit={handleLogin}>
              <ListItem>
                <ListItemText
                  primary={
                    <Typography variant="body2" align="center">
                      Login to Your Account
                    </Typography>
                  }
                />
              </ListItem>
              <ListItem>
                <TextField
                  variant="outlined"
                  fullWidth
                  required
                  label="Phone Number"
                  autoFocus
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  sx={{ marginBottom: "1em" }}
                />
              </ListItem>
              <ListItem>
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  disabled={isLoggingIn}
                  sx={{ color: "#fff", margin: "0 auto" }}
                >
                  Get Verification Code
                </Button>
              </ListItem>
              {error && (
                <ListItem>
                  <Alert
                    severity="error"
                    variant="contained"
                    sx={{
                      backgroundColor: "#d32f2f",
                      color: "#fff",
                      width: "100%",
                    }}
                  >
                    {error}
                  </Alert>
                </ListItem>
              )}
            </form>
          )}
        </List>
      </Box>
    </Drawer>
  );
};

export default DrawerMenu;
