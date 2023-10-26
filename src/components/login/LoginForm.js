const {
  ListItem,
  ListItemText,
  Typography,
  TextField,
  Button,
  Alert,
} = require("@mui/material");

const LoginForm = ({ phoneNumber, onPhoneNumberChange, onSubmit, error }) => (
  <form onSubmit={onSubmit}>
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
        onChange={onPhoneNumberChange}
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
        Get Verification Code
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
        }}
      >
        {error}
      </Alert>
    )}
  </form>
);

export default LoginForm;
