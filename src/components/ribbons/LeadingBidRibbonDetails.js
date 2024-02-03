import { Box, Typography } from "@mui/material";

const LeadingBidRibbonDetails = () => (
  <Box
    sx={{
      position: "absolute",
      top: "87%",
      left: 0,
      backgroundColor: "#ffeeca",
      padding: "8px 15px",
      color: "#ffb81d",
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

export default LeadingBidRibbonDetails;
