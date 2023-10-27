const {
  ListItem,
  ListItemText,
  TextField,
  Button,
  Alert,
  Typography,
} = require("@mui/material");

const OTPVerificationForm = ({ otp, onOtpChange, onSubmit, error }) => (
  <form onSubmit={onSubmit}>
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
        onChange={onOtpChange}
        sx={{ marginBottom: "1em" }}
      />
    </ListItem>
    <ListItem>
      <Button
        variant="contained"
        color="primary"
        type="submit"
        sx={{ color: "#fff", margin: "0 auto" }}
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
  </form>
);

export default OTPVerificationForm;
