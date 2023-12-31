import { Box, Button, InputAdornment, TextField } from "@mui/material";

function BidForm({
  bidAmount,
  handleBidAmountChange,
  handleSubmit,
  isBidValid,
  itemStatus,
  isExpired,
}) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        mt: 2,
        px: 2,
      }}
    >
      <TextField
        //   label="Enter your bid"
        variant="outlined"
        type="number"
        value={bidAmount}
        onChange={handleBidAmountChange}
        sx={{ flexGrow: 1, height: 56 }} // Set the height to match the default button height
        InputProps={{
          style: {
            height: "100%",
            backgroundColor: "rgb(239, 245, 249)",
            borderRadius: "12px 0 0 12px",
          },
          startAdornment: <InputAdornment position="start">$</InputAdornment>, // Ensure the inner input is the same height as the TextField
        }}
      />
      <Button
        variant="contained"
        sx={{
          backgroundColor: "#ff8e44",
          color: "#fff",
          height: 56, // Ensure the button has the same height as the TextField
          fontWeight: 600,
          borderRadius: "0 12px 12px 0",
          lineHeight: 1,
          whiteSpace: "nowrap", // Prevents the text from wrapping
          paddingX: { xs: 2.5, sm: 2 }, // Adjust horizontal padding based on screen size
          fontSize: { xs: "0.9rem", sm: "1rem" }, // Adjust font size based on screen size
        }}
        disabled={!isBidValid(bidAmount) || itemStatus === "sold" || isExpired}
        onClick={handleSubmit}
      >
        Bid Now
      </Button>
    </Box>
  );
}

export default BidForm;
