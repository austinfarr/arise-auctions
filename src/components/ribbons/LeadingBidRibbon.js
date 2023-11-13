import { Box, Typography } from "@mui/material";

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
    }}
  >
    <Typography
      sx={{
        color: "#ffb81d",
        fontSize: "16px",
        fontWeight: 600,
      }}
    >
      You&rsquo;re Winning!
    </Typography>
  </Box>
);

export default LeadingBidRibbon;
