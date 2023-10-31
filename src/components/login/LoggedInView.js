import { Box, Button, ListItem, ListItemText, Typography } from "@mui/material";

const LoggedInView = ({ user, onLogout }) => (
  <Box sx={{ mt: 5 }}>
    <ListItem>
      <ListItemText
        primary={
          <Typography variant="body1" align="center">
            You are logged in as
          </Typography>
        }
        secondary={
          <Typography
            variant="h4"
            align="center"
            sx={{ fontWeight: "bold", fontFamily: "sans-serif" }}
          >
            {user.full_name}
          </Typography>
        }
      />
    </ListItem>
    <ListItem>
      <Button
        variant="text"
        color="primary"
        onClick={onLogout}
        sx={{
          margin: "0 auto",
          textDecoration: "underline",
          textDecorationThickness: "2px", // Adjust thickness of the underline
          textUnderlineOffset: "4px",
        }}
      >
        Log Out
      </Button>
    </ListItem>
  </Box>
);

export default LoggedInView;
