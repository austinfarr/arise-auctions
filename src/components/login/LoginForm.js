const {
  ListItem,
  ListItemText,
  Typography,
  TextField,
  Button,
  Alert,
  Box,
} = require("@mui/material");

const LoginForm = ({ phoneNumber, onPhoneNumberChange, onSubmit, error }) => (
  <form onSubmit={onSubmit}>
    <Box sx={{ mt: 3 }}>
      <ListItem>
        <ListItemText
          primary={
            <Typography
              variant="h5"
              align="center"
              sx={{ fontWeight: 600, letterSpacing: -1 }}
            >
              You&apos;re not signed in!
            </Typography>
          }
          secondary={
            <Typography variant="body1" align="center" sx={{ mt: 1 }}>
              No problem, enter your phone number below and get to bidding!
            </Typography>
          }
        />
      </ListItem>
      {/* <ListItem> */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          mt: 2,
          mx: 2,
        }}
      >
        <TextField
          variant="filled"
          fullWidth
          required
          label="Phone Number"
          autoFocus
          value={phoneNumber}
          onChange={onPhoneNumberChange}
          sx={{
            flexGrow: 1,
            height: 56,
          }}
          InputProps={{
            style: {
              height: "100%",
              backgroundColor: "rgb(239, 245, 249)",
              borderRadius: "8px 0 0 8px",
            },
          }}
        />
        <Button
          variant="contained"
          color="primary"
          type="submit"
          sx={{
            color: "#fff",
            // margin: "0 auto",
            backgroundColor: "#ff8e44",
            color: "#fff",
            height: 56,
            width: 120,
            borderRadius: "0 8px 8px 0",
          }}
        >
          Sign in
        </Button>
      </Box>
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
    </Box>
  </form>
);

export default LoginForm;
