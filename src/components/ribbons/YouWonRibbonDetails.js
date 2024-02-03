import { Box, Typography } from "@mui/material";

const YouWonRibbonDetails = () => (
  <Box
    sx={{
      position: "absolute",
      top: "87%",
      left: 0,
      backgroundColor: "#ffb81d",
      padding: "8px 15px",
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

export default YouWonRibbonDetails;
