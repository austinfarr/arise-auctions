import { Box, Typography } from "@mui/material";

const SoldRibbonDetails = () => (
  <Box
    sx={{
      position: "absolute",
      top: "87%",
      left: 0,
      backgroundColor: "red",
      padding: "8px 15px",
      color: "#fff",
      transformOrigin: "0 0",
      fontSize: "16px",
      fontWeight: "bold",
    }}
  >
    <Typography
      sx={{
        color: "#fff",
        fontSize: "16px",
        fontWeight: 600,
      }}
    >
      Sold!
    </Typography>
  </Box>
);

export default SoldRibbonDetails;
