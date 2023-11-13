import { Box, Typography } from "@mui/material";

const YouWonRibbon = () => (
  <Box
    sx={{
      position: "absolute",
      top: 130,
      left: -30,
      backgroundColor: "#ffb81d",
      padding: "8px 80px",
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
      You Won!
    </Typography>
  </Box>
);

export default YouWonRibbon;
