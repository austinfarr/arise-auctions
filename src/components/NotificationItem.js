import { Box, Chip, MenuItem, Typography } from "@mui/material";

const NotificationItem = ({ notification, onClick }) => {
  return (
    <MenuItem onClick={() => onClick(notification)}>
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <Typography variant="body2">{notification.message}</Typography>
        {!notification.read && (
          <Chip label="New" size="small" color="primary" />
        )}
      </Box>
    </MenuItem>
  );
};

export default NotificationItem;
