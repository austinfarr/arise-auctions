import { Box } from "@mui/material";

const YouWonRibbon = () => (
  <Box
    sx={{
      position: "absolute",
      top: 130,
      left: -30,
      backgroundColor: "#ffb81d",
      padding: "8px 80px",
      color: "#fff",
      transform: "rotate(-45deg)",
      transformOrigin: "0 0",
      fontSize: "16px",
      fontWeight: "bold",
      fontFamily: "Montserrat, sans-serif",
    }}
  >
    You Won!
  </Box>
);

export default YouWonRibbon;
