import { useAuction } from "@/context/AuctionContext";
import { useAuth } from "@/context/AuthContext";
import { useDrawer } from "@/context/DrawerContext";
import { Drawer, Box, Typography, Button } from "@mui/material";
import React from "react";

const BuyNowDetailsDrawer = ({ item, open, onClose }) => {
  const { user } = useAuth();
  const { openDrawer, showSnackbar } = useDrawer();
  const { handleBuyNowSubmit } = useAuction();

  const handleBuyNow = () => {
    const buyNowPrice = item.buy_now_price;

    if (!user) {
      // showSnackbar("Please login to buy!", "error");
      openDrawer();
      return;
    } else {
      handleBuyNowSubmit(item.id, user.id, item.buy_now_price);
    }
  };

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
          // margin: "0 auto",
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
          {item.status === "sold"
            ? `You purchased for $${item.buy_now_price.toLocaleString()}!`
            : `Buy Now ${item.buy_now_price.toLocaleString()}`}
        </Typography>
        <Button
          variant="contained"
          disabled={item.status === "sold"}
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
          onClick={handleBuyNow}
        >
          Buy Now
        </Button>
        <Typography
          paragraph
          align="center"
          paddingTop={4}
          sx={{ maxWidth: "80%" }}
        >
          {item.status !== "sold" &&
            "We will run your card for the amount above at the end of the auction."}
        </Typography>

        <Button variant="text" color="primary" onClick={onClose} sx={{ mt: 2 }}>
          {item.status === "sold" ? "Go back" : "Wait I don't Want to!"}
        </Button>
      </Box>
    </Drawer>
  );
};

export default BuyNowDetailsDrawer;
