import { Box, Typography } from "@mui/material";

const SoldRibbon = () => (
  <Box
    sx={{
      position: "absolute",
      top: 120,
      left: -30,
      backgroundColor: "red",
      padding: "8px 85px",
      color: "#fff",
      transform: "rotate(-45deg)",
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

export default SoldRibbon;
