import { Box } from "@mui/material";

const LeadingBidRibbon = () => (
  <Box
    sx={{
      position: "absolute",
      top: 130,
      left: -30,
      backgroundColor: "#ffeeca",
      padding: "8px 50px",
      color: "#ffb81d",
      transform: "rotate(-45deg)",
      transformOrigin: "0 0",
      fontSize: "16px",
      fontWeight: "bold",
      fontFamily: "Montserrat, sans-serif",
    }}
  >
    You&rsquo;re Winning!
  </Box>
);

export default LeadingBidRibbon;
