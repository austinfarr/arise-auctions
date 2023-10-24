import { Badge, IconButton, Menu, MenuItem } from "@mui/material";
import { Notifications } from "@mui/icons-material";
import NotificationItem from "./NotificationItem";

const NotificationMenu = ({
  notifications,
  anchorEl,
  isOpen,
  onClose,
  onOpen,
  onNotificationClick,
}) => {
  return (
    <>
      <IconButton
        size="large"
        edge="end"
        aria-label="show new notifications"
        color="inherit"
        onClick={(e) => onOpen(e.currentTarget)}
      >
        <Badge
          badgeContent={notifications.filter((n) => !n.read).length}
          color="error"
        >
          <Notifications />
        </Badge>
      </IconButton>
      <Menu anchorEl={anchorEl} open={isOpen} onClose={onClose}>
        {notifications.length === 0 && (
          <MenuItem onClick={onClose}>No new notifications</MenuItem>
        )}
        {notifications.map((notification) => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            onClick={onNotificationClick}
          />
        ))}
      </Menu>
    </>
  );
};

export default NotificationMenu;
