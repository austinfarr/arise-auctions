import { Box } from "@mui/material";

const SoldRibbon = () => (
  <Box
    sx={{
      position: "absolute",
      top: 190,
      left: -50,
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
    Sold to Someone Else!
  </Box>
);

export default SoldRibbon;
