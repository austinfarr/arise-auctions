import { Box } from "@mui/material";

const YouLostRibbon = () => (
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
      fontFamily: "Montserrat, sans-serif",
    }}
  >
    You Lost!
  </Box>
);

export default YouLostRibbon;