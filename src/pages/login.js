import { useState } from "react";
import { useRouter } from "next/router";
import supabase from "../../lib/supabase";
import {
  Button,
  TextField,
  Container,
  Typography,
  Box,
  Paper,
  Alert,
} from "@mui/material";

export default function LoginPage() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState(null); // For storing error messages
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null); // Reset error state before attempting login

    const { data, error: apiError } = await supabase.auth.signInWithOtp({
      phone: phoneNumber,
    });

    if (apiError) {
      console.error("Login error:", apiError.message);
      setError(apiError.message); // Update error state with the API error message
    } else {
      // OTP sent successfully. Navigate to verification page
      router.push({
        pathname: "/verification",
        query: { phone: phoneNumber },
      });
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
        style={{
          // marginTop: "20%",
          marginTop: "10vh",
          padding: "5%",
          // display: "flex", // <-- Add this
          // flexDirection: "column", // <-- Add this
          // justifyContent: "center", // <-- Add this
          // height: "40vh", // <-- Add this to define a height for the container
        }}
        elevation={3}
      >
        <Typography variant="h5" align="center" gutterBottom>
          Login
        </Typography>
        {error && (
          <Alert
            severity="error"
            variant="contained"
            sx={{
              marginTop: "1em",
              backgroundColor: "#d32f2f",
              color: "#fff",
            }}
          >
            {error}
          </Alert>
        )}
        <form onSubmit={handleLogin}>
          <Box my={2}>
            <TextField
              variant="outlined"
              fullWidth
              required
              label="Phone Number"
              autoFocus
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </Box>
          <Box my={2} display="flex" justifyContent="center">
            <Button
              variant="contained"
              color="primary"
              type="submit"
              sx={{ color: "#fff" }}
            >
              Get OTP
            </Button>
          </Box>
        </form>
      </Container>
    </>
  );
}
