const { Typography, ListItem, TextField, Button } = require("@mui/material");

const SignUpForm = ({ fullName, onFullNameChange, onSubmit }) => (
  <form onSubmit={onSubmit}>
    <Typography
      variant="h5"
      align="center"
      sx={{ fontWeight: "bold", fontFamily: "sans-serif" }}
    >
      You do not have an account! Enter your full name to sign up.
    </Typography>
    <ListItem>
      <TextField
        variant="outlined"
        fullWidth
        required
        label="Full Name"
        autoFocus
        value={fullName}
        onChange={onFullNameChange}
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
        Submit
      </Button>
    </ListItem>
  </form>
);

export default SignUpForm;
