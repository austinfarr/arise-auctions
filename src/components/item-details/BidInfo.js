import { Box, Typography } from "@mui/material";

function BidInfo({ item }) {
  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center", // This ensures vertical centering
          justifyContent: "space-between",
          paddingY: 1, // Removes vertical padding
        }}
      >
        <Box sx={{ marginX: 2 }}>
          <Typography variant="h6" component="div" sx={{ fontWeight: "bold" }}>
            {item.title}
          </Typography>
        </Box>

        <Box textAlign="right" sx={{ marginX: 2 }}>
          <Typography sx={{ fontWeight: "bold", fontSize: 24 }}>
            ${item.current_bid.toLocaleString()}
          </Typography>
          <Typography variant="body1">Current bid</Typography>
        </Box>
      </Box>
    </>
  );
}

export default BidInfo;
