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
import { useAuth } from "@/context/AuthContext";

export default function VerificationPage() {
  const { verifyOtp } = useAuth();
  const [otp, setOtp] = useState("");
  const [error, setError] = useState(null); // For storing error messages
  const router = useRouter();

  const handleOTPVerification = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await verifyOtp(router.query.phone, otp);
      router.push("/"); // Navigate to dashboard or home
    } catch (error) {
      setError(error.message);
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
