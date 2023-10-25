import { useAuth } from "@/context/AuthContext";
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  Button,
  Typography,
  Box,
} from "@mui/material";

const DrawerMenu = ({ isOpen, onClose, loggedIn, onLogout }) => {
  const { user } = useAuth();

  return (
    <Drawer
      anchor="bottom"
      open={isOpen}
      onClose={onClose}
      sx={{
        height: "60%",
        display: "flex",
        flexDirection: "column",
        "& .MuiPaper-root": {
          borderTopLeftRadius: 32,
          borderTopRightRadius: 32,
          height: "60%",
          background: "#fff",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100%", // Take up all available space in the drawer
        }}
      >
        <List sx={{ width: "100%" }}>
          {loggedIn && user ? (
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
          ) : (
            <ListItem>
              <ListItemText
                primary={
                  <Typography variant="body2" align="center">
                    You are not logged in yet
                  </Typography>
                }
              />
            </ListItem>
          )}
        </List>
      </Box>
    </Drawer>
  );
};

export default DrawerMenu;
