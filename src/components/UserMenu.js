import { Button, Menu, MenuItem, Avatar } from "@mui/material";
import { deepOrange } from "@mui/material/colors";

const UserMenu = ({
  loggedIn,
  anchorEl,
  isOpen,
  onOpen,
  onClose,
  onLogout,
  onLogin,
}) => {
  return (
    <>
      <Button
        onClick={onOpen}
        sx={{ padding: 0, minWidth: "auto", color: "inherit" }}
      >
        <Avatar sx={{ bgcolor: deepOrange[300] }}>H</Avatar>
      </Button>
      <Menu anchorEl={anchorEl} open={isOpen} onClose={onClose}>
        {loggedIn ? (
          <MenuItem onClick={onLogout}>Logout</MenuItem>
        ) : (
          <MenuItem onClick={onLogin}>Login</MenuItem>
        )}
      </Menu>
    </>
  );
};

export default UserMenu;
