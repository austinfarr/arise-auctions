const {
  ListItem,
  ListItemText,
  TextField,
  Button,
  Alert,
  Typography,
  Box,
} = require("@mui/material");

const OTPVerificationForm = ({ otp, onOtpChange, onSubmit, error }) => (
  <form onSubmit={onSubmit}>
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
      {error && (
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
          {error}
        </Alert>
      )}
    </Box>
  </form>
);

export default OTPVerificationForm;
