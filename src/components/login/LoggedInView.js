import { Button, ListItem, ListItemText, Typography } from "@mui/material";

const LoggedInView = ({ user, onLogout }) => (
  <>
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
        variant="outlined"
        color="primary"
        onClick={onLogout}
        sx={{ margin: "0 auto" }}
      >
        Log Out
      </Button>
    </ListItem>
  </>
);

export default LoggedInView;
