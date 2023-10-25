import { Drawer, Box, Typography, Button } from "@mui/material";
import React from "react";

const BuyNowDetailsDrawer = ({ item, open, onClose }) => {
  return (
    <Drawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      sx={{
        height: "60%",
        display: "flex",
        flexDirection: "column",
        "& .MuiPaper-root": {
          // Targeting the Paper component inside Drawer
          borderTopLeftRadius: 32, // Adjust as needed
          borderTopRightRadius: 32, // Adjust as needed
          height: "60%",
          background: "#fff",
        },
      }}
    >
      <Box
        p={2}
        style={{
          //   width: "100%",
          //   maxWidth: 480,
          margin: "0 auto",
          paddingTop: 100,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography variant="body1" align="center">
          {item.title}
        </Typography>
        <Typography
          variant="h4"
          align="center"
          sx={{ fontWeight: "bold", fontFamily: "sans-serif" }}
        >
          Buy Now ${item.buy_now_price.toLocaleString()}
        </Typography>
        <Button
          variant="contained"
          sx={{
            bgcolor: "#ffb81d",
            color: "#fff",
            mt: 3,
            px: 10,
            py: 2,
            borderRadius: 0.5,
            boxShadow: "none", // Add this line to remove the drop shadow
            "&:hover": {
              bgcolor: "#ffc72d", // Change this to the desired hover color
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            },
          }}
        >
          Buy Now
        </Button>
        <Typography
          paragraph
          align="center"
          paddingTop={4}
          sx={{ maxWidth: "80%" }}
        >
          We will run your card for the amount above at the end of the auction.
        </Typography>

        <Button variant="text" color="primary" onClick={onClose} sx={{ mt: 2 }}>
          Wait I don&apos;t Want to!
        </Button>
      </Box>
    </Drawer>
  );
};

export default BuyNowDetailsDrawer;
