import supabase from "../../lib/supabase";
import { useState } from "react";
import { useRouter } from "next/router";

// Material-UI imports
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  Alert,
} from "@mui/material";

export default function VerificationPage() {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState(null); // For storing error messages
  const router = useRouter();

  const handleOTPVerification = async (e) => {
    e.preventDefault();
    setError(null); // Reset error state before attempting verification

    const { data, error: apiError } = await supabase.auth.verifyOtp({
      // const response = await supabase.auth.verifyOtp({
      phone: router.query.phone,
      token: otp,
      type: "sms",
    });

    // Inside handleOTPVerification function
    if (apiError) {
      console.error("OTP Verification error:", apiError.message);
      setError(apiError.message); // Update error state with the API error message
      // ... your existing error logic
    } else {
      const userId = data.user.id;
      console.log("userId:", userId);

      // Store JWT token in an httpOnly cookie
      await fetch("/api/setCookie", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      // Navigate the user to the dashboard or home page
      router.push("/");
    }
  };

  return (
    <>
      <Typography
        variant="h3"
        align="center"
        gutterBottom
        color={"primary"}
        sx={{
          marginTop: "5vh",
          fontWeight: "bold",

          // background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
          // WebkitBackgroundClip: "text",
          // WebkitTextFillColor: "transparent",
          textShadow: "1px 1px 2px rgba(0, 0, 0, 0.1)",
        }}
      >
        Arise Auctions!
      </Typography>
      <Container
        component={Paper}
        maxWidth="sm"
        style={{ marginTop: "5vh", padding: "5%" }}
        elevation={3}
      >
        <Typography variant="h5" align="center" gutterBottom>
          Passcode Verification
        </Typography>
        {error && (
          <Alert
            severity="error"
            variant="contained"
            sx={{
              marginTop: "1em",
              backgroundColor: "#d32f2f", // Adjust to your preferred shade of red
              color: "#fff", // Making the text color white for contrast
            }}
          >
            {error}
          </Alert>
        )}
        <form onSubmit={handleOTPVerification}>
          <Box my={2}>
            <TextField
              variant="outlined"
              fullWidth
              type="text"
              label="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
          </Box>
          <Box my={2} display="flex" justifyContent="center">
            <Button
              variant="contained"
              color="primary"
              sx={{ color: "#fff" }}
              type="submit"
            >
              Verify Code
            </Button>
          </Box>
        </form>
      </Container>
    </>
  );
}
