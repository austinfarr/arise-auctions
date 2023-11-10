import React, { useEffect } from "react"; // Make sure React is imported
import {
  ListItem,
  ListItemText,
  TextField,
  Button,
  Snackbar, // Import Snackbar
  Alert, // Keep the Alert for content inside the Snackbar
  Typography,
  Box,
} from "@mui/material"; // Import components from MUI

const OTPVerificationForm = ({
  otp,
  onOtpChange,
  onSubmit,
  error,
  onGoBack,
}) => {
  console.log("Trying to log in");
  console.log("Error", error);

  // State to control the visibility of the Snackbar
  const [openSnackbar, setOpenSnackbar] = React.useState(false);

  // Open the Snackbar when there is an error
  useEffect(() => {
    if (error) {
      setOpenSnackbar(true);
    }
  }, [error]);

  // Function to close the Snackbar
  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  const handleGoBack = () => {
    onGoBack(); // Call the passed callback function to reset the login form
  };

  return (
    <>
      <Box sx={{ mt: 3 }}>
        <ListItem>
          <ListItemText
            primary={
              <Typography variant="h6" align="center">
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
            onChange={onOtpChange}
            sx={{ marginBottom: "1em" }}
          />
        </ListItem>
        <ListItem>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            onClick={onSubmit}
            sx={{
              color: "#fff",
              margin: "0 auto",
              height: 50,
              width: 140,
              borderRadius: 0.5,
            }}
          >
            Verify Code
          </Button>
        </ListItem>
        <ListItem>
          <Button
            variant="text"
            color="primary"
            onClick={handleGoBack}
            // onClick={onClose}
            sx={{ margin: "0 auto" }}
          >
            Go back
          </Button>
        </ListItem>
      </Box>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          // variant="filled"
          severity="error"
          sx={{
            width: "100%",
            "&.MuiPaper-root": {
              boxShadow: "none !important", // Remove shadow
              borderRadius: "4px !important", // Set desired border-radius
              backgroundColor: "#d32f2f !important", // Ensure the background color is applied
              color: "#fff !important", // Ensure the text color is applied
            },
            "& .MuiAlert-icon": {
              color: "#fff",
            },
          }}
        >
          The code you entered is incorrect. Please try again or tap her to go
          back.
        </Alert>
      </Snackbar>
    </>
  );
};

export default OTPVerificationForm;
