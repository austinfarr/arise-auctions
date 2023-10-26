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
import LoggedInView from "./login/LoggedInView";
import SignUpForm from "./login/SignUpForm";
import OTPVerificationForm from "./login/OTPVerificationForm";
import LoginForm from "./login/LoginForm";

const DrawerMenu = ({ loggedIn }) => {
  const { isDrawerOpen, closeDrawer } = useDrawer();
  const { user, login, verifyOtp, logout } = useAuth();

  const [fullName, setFullName] = useState("");
  const [isFullNameSubmitted, setIsFullNameSubmitted] = useState(false);

  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const [isSigningUp, setIsSigningUp] = useState(false);
  const [isSignUpVerificationInitiated, setIsSignUpVerificationInitiated] =
    useState(false);

  const [otp, setOtp] = useState("");
  const [verificationError, setVerificationError] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerificationInitiated, setIsVerificationInitiated] = useState(false);

  const handleSignUp = async (phone, fullName) => {
    try {
      // Adjust the implementation based on how your sign-up function works
      // You might need to temporarily store the full name until the OTP is verified
      // await supabase.auth.signUp({ phone });
      const { user, error } = await supabase.auth.signInWithOtp({
        phone: phone,
      });
      console.log("user", user);
      console.log("error", error);
      setIsSignUpVerificationInitiated(true);
    } catch (error) {
      setError("Failed to initiate sign up: " + error.message);
    }
  };

  const handleFullNameSubmit = async (e) => {
    e.preventDefault();
    setIsFullNameSubmitted(true);
    handleSignUp(phoneNumber, fullName);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoggingIn(true);

    try {
      // Check if user already exists
      const { data: user, error: userError } = await supabase
        .from("user_profiles")
        .select("id, phone")
        .eq("phone", phoneNumber)
        .single();

      console.log("user", user);
      console.log("userError", userError);

      if (user) {
        // User exists, initiate login
        console.log("User exists, initiating login...");
        await login(phoneNumber);
        setIsVerificationInitiated(true);
      } else {
        // User does not exist, initiate sign up
        console.log("User does not exist, initiating sign up...");
        setIsLoggingIn(false);
        setIsSigningUp(true);
        setIsFullNameSubmitted(false); // Reset to allow full name input
      }
    } catch (error) {
      setError("Failed to initiate login: " + error.message);
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
            <LoggedInView user={user} onLogout={handleLogout} />
          ) : isSigningUp && !isFullNameSubmitted ? (
            <SignUpForm
              fullName={fullName}
              onFullNameChange={(e) => setFullName(e.target.value)}
              onSubmit={handleFullNameSubmit}
            />
          ) : isVerificationInitiated ? (
            <OTPVerificationForm
              otp={otp}
              onOtpChange={(e) => setOtp(e.target.value)}
              onSubmit={handleOTPVerification}
              error={verificationError}
            />
          ) : (
            <LoginForm
              phoneNumber={phoneNumber}
              onPhoneNumberChange={(e) => setPhoneNumber(e.target.value)}
              onSubmit={handleLogin}
              error={error}
            />
          )}
        </List>
      </Box>
    </Drawer>
  );
};

export default DrawerMenu;
