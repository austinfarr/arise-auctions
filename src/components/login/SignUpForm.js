const {
  Typography,
  ListItem,
  TextField,
  Button,
  Box,
  ListItemText,
} = require("@mui/material");

const SignUpForm = ({ fullName, onFullNameChange, onSubmit, onGoBack }) => {
  const handleGoBack = () => {
    onGoBack(); // Call the passed callback function to reset the login form
  };

  return (
    <>
      <Box sx={{ mt: 3 }}>
        <ListItem>
          <ListItemText
            primary={
              <Typography
                variant="h5"
                align="center"
                sx={{ fontWeight: 600, letterSpacing: -1 }}
              >
                Please set up your account!
              </Typography>
            }
            secondary={
              <Typography variant="body1" align="center" sx={{ mt: 1 }}>
                Fill in your first and last name below.
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
            label="Full Name"
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
            onClick={onSubmit}
            sx={{
              color: "#fff",
              margin: "0 auto",
              height: 50,
              width: 140,
              borderRadius: 0.5,
            }}
          >
            Submit
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
    </>
  );
};

export default SignUpForm;
