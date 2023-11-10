/**
 * DrawerMenu Component:
 * This component is responsible for handling the user authentication flow including login, signup, and OTP verification.
 * It utilizes a Drawer from Material-UI to present a sliding panel from the bottom of the screen.
 *
 * The authentication flow is as follows:
 * 1. If the user is not logged in, the login form is displayed. The user enters their phone number.
 * 2. The system checks if the user exists. If they do, an OTP is sent, and the OTP verification screen is displayed.
 * 3. If the user does not exist, they are prompted to enter their full name, then an OTP is sent, and the OTP verification screen is displayed.
 * 4. The user enters the OTP, and if correct, they are logged in.
 * 5. If the user is already logged in, a welcome message and logout button are displayed.
 *
 * State Variables:
 * - phoneNumber: Stores the user's phone number.
 * - fullName: Stores the user's full name (only required for new users).
 * - otp: Stores the OTP entered by the user.
 * - newUser: Boolean indicating whether the user is new or existing.
 * - error: Stores any error messages related to initiating login.
 * - verificationError: Stores any error messages related to OTP verification.
 * - triggerOTPScreen: Boolean indicating whether to show the OTP verification screen.
 * - triggerFullNameScreen: Boolean indicating whether to show the full name input screen (for new users).
 *
 * The component utilizes context to manage global state and functions related to authentication and drawer state.
 *
 * Functions:
 * - handleSignUp: Initiates the signup process.
 * - handleLogin: Initiates the login process. It checks if the user exists and sends an OTP accordingly.
 * - handleLogout: Logs the user out and resets all state variables.
 * - handleOTPVerification: Handles OTP verification and logs the user in if OTP is correct.
 *
 * The component returns a Drawer that conditionally renders different forms and messages based on the user's authentication state and the current step in the authentication flow.
 */

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
import { useEffect, useState } from "react";
import supabase from "../../lib/supabase";
import { useDrawer } from "@/context/DrawerContext";
import LoggedInView from "./login/LoggedInView";
import SignUpForm from "./login/SignUpForm";
import OTPVerificationForm from "./login/OTPVerificationForm";
import LoginForm from "./login/LoginForm";
import { Login } from "@mui/icons-material";
import SideDrawer from "./SideDrawer";
import Header from "./header/Header";

const DrawerMenu = () => {
  const {
    isDrawerOpen,
    closeDrawer,
    isSideDrawerOpen,
    setIsSideDrawerOpen,
    closeSideDrawer,
  } = useDrawer();
  const {
    user,
    login,
    verifyOtpExistingUser,
    verifyOtpNewUser,
    logout,
    loggedIn,
    signUp,
  } = useAuth();

  const [phoneNumber, setPhoneNumber] = useState("");
  const [fullName, setFullName] = useState("");

  const [otp, setOtp] = useState("");

  const [newUser, setNewUser] = useState(false);

  const [error, setError] = useState(null);

  const [verificationError, setVerificationError] = useState(null);

  //this will be true and cue the OTP screen for both existing and new users
  const [triggerOTPScreen, setTriggerOTPScreen] = useState(false);
  const [triggerFullNameScreen, setTriggerFullNameScreen] = useState(false);

  const handleOpenSideDrawer = () => {
    setIsSideDrawerOpen(true);
  };

  const handleCloseSideDrawer = () => {
    setIsSideDrawerOpen(false);
  };

  // useEffect(() => {
  //   if (loggedIn) {
  //     handleOpenSideDrawer();
  //   } else {
  //     handleCloseSideDrawer();
  //   }
  // }, [loggedIn]);

  const resetLoginForm = () => {
    // Reset to initial state
    setPhoneNumber("");
    setOtp("");
    setFullName("");
    setVerificationError(null);
    setTriggerOTPScreen(false);
    setTriggerFullNameScreen(false);
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    setTriggerFullNameScreen(false);
    setTriggerOTPScreen(true);

    console.log("Trying to sign up ", phoneNumber);
    console.log("full name", fullName);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Check if user already exists
      const { data: user, error: userError } = await supabase
        .from("user_profiles")
        .select("phone")
        .eq("phone", `1${phoneNumber}`)
        .single();

      console.log("user", user);
      console.log("userError", userError);

      //Whether they exist of not, we want to send them an OTP to verify
      await login(phoneNumber);

      if (user) {
        setNewUser(false);
        // User exists, initiate login without entering full name
        console.log("User exists, initiating login...");
        setTriggerOTPScreen(true);
      } else {
        setNewUser(true);
        // User does not exist, initiate sign up
        console.log("User does not exist, initiating sign up...");
        setTriggerFullNameScreen(true);
      }
    } catch (error) {
      setError("Failed to initiate login: " + error.message);
    }
  };

  const handleLogout = async () => {
    closeSideDrawer();
    logout();

    //reset all states to default
    setPhoneNumber("");
    setOtp("");
    setFullName("");
    setVerificationError(null);
    setTriggerOTPScreen(false);
    setTriggerFullNameScreen(false);
  };

  const handleOTPVerification = async (e) => {
    e.preventDefault();
    setVerificationError(null);

    try {
      if (newUser) {
        await verifyOtpNewUser(phoneNumber, fullName, otp);
      } else {
        await verifyOtpExistingUser(phoneNumber, otp);
      }

      setPhoneNumber("");
      setOtp("");
      setFullName("");
      closeDrawer(); // Close the drawer after verification
    } catch (error) {
      console.log("error", error);
      setVerificationError("Your code is invalid or has expired!");
    }
  };

  return (
    <>
      <Drawer
        anchor="bottom"
        open={isDrawerOpen}
        onClose={closeDrawer}
        sx={{
          height: "60%",
          display: "flex",
          flexDirection: "column",
          "& .MuiPaper-root": {
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
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
            justifyContent: "flex-start",
            height: "100%", // Take up all available space in the drawer
          }}
        >
          <List sx={{ width: "100%" }}>
            {/* {loggedIn && user && (
              <LoggedInView user={user} onLogout={handleLogout} />
            )} */}

            {/* show if the user is not logged in and no other screen has been triggered */}
            {!loggedIn && !triggerOTPScreen && !triggerFullNameScreen && (
              <LoginForm
                phoneNumber={phoneNumber}
                onPhoneNumberChange={(e) => setPhoneNumber(e.target.value)}
                onSubmit={handleLogin}
                error={error}
              />
            )}

            {/* show if the user is not logged in and the full name screen has been triggered */}
            {triggerOTPScreen && !loggedIn && (
              <OTPVerificationForm
                otp={otp}
                onOtpChange={(e) => setOtp(e.target.value)}
                onSubmit={handleOTPVerification}
                error={verificationError}
                onGoBack={resetLoginForm}
              />
            )}

            {/* show if the user is not logged in and the full name screen has been triggered */}
            {triggerFullNameScreen && (
              <SignUpForm
                fullName={fullName}
                onFullNameChange={(e) => setFullName(e.target.value)}
                onSubmit={handleSignUp}
                onGoBack={resetLoginForm}
              />
            )}
          </List>
        </Box>
      </Drawer>
      {/* <Header /> */}
      <Drawer
        variant="temporary" // or "persistent"
        anchor="right" // Open from the right side
        open={isSideDrawerOpen}
        onClose={handleCloseSideDrawer}
      >
        <SideDrawer
          onClose={handleCloseSideDrawer}
          user={user}
          onLogout={handleLogout}
        />
      </Drawer>
    </>
  );
};

export default DrawerMenu;
