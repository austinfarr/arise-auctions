import React, { useState } from "react";
import {
  Drawer,
  Typography,
  Button,
  IconButton,
  Box,
  TextField,
  Snackbar,
  Alert,
  InputAdornment,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Image from "next/image";
import { getCookie } from "cookies-next";
import { useAuth } from "@/context/AuthContext";
import LeadingBidRibbon from "./ribbons/LeadingBidRibbon";
import { useDrawer } from "@/context/DrawerContext";
import BuyNowDetailsDrawer from "./BuyNowDetailsDrawer";
import { useAuction } from "@/context/AuctionContext";
import YouWonRibbon from "./ribbons/YouWonRibbon";
import SoldRibbon from "./ribbons/SoldRibbon";

function ItemDetails({ item, open, onClose, onBuyNowClick }) {
  const [bidAmount, setBidAmount] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "error",
  });

  const { user, loggedIn } = useAuth();
  const { openDrawer } = useDrawer();
  const { items, handleBidSubmit, handleBuyNowSubmit } = useAuction();

  const [buyNowDrawerOpen, setBuyNowDrawerOpen] = useState(false);

  const handleBuyNowClick = () => {
    setBuyNowDrawerOpen(true);
  };

  const handleBuyNowDrawerClose = () => {
    setBuyNowDrawerOpen(false);
  };

  const handleBidAmountChange = (event) => {
    setBidAmount(event.target.value);
  };

  const showSnackbar = (message, severity = "error") => {
    setSnackbar({ open: true, message, severity });
  };

  const isBidValid = (bid) => {
    const numericBid = parseFloat(bid);
    if (isNaN(numericBid) || numericBid <= item.current_bid) {
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    const bidAmountNumber = parseFloat(bidAmount);

    if (!user) {
      showSnackbar("Please login to place a bid!", "error");
      openDrawer();
      return;
    }
    if (isBidValid(bidAmountNumber)) {
      submitBid(bidAmountNumber);
    } else {
      showSnackbar(
        "Your bid should be a number and higher than the current bid!",
        "error"
      );
    }
  };

  const submitBid = async (bidAmount) => {
    try {
      console.log("Submitting bid:", bidAmount, item.id, user.id);
      await handleBidSubmit(item.id, bidAmount, user.id);
      setBidAmount("");
      showSnackbar("Bid placed successfully!", "success");
    } catch (error) {
      console.error("Bid submission failed:", error);
      showSnackbar("Failed to place bid. Please try again later.", "error");
    }
  };

  return (
    <>
      <Drawer
        anchor="bottom"
        open={open}
        onClose={onClose}
        sx={{
          height: "70%",
          display: "flex",
          flexDirection: "column",
          "& .MuiPaper-root": {
            // Targeting the Paper component inside Drawer
            borderTopLeftRadius: 32, // Adjust as needed
            borderTopRightRadius: 32, // Adjust as needed
            height: "75%",
            background: "#fff",
          },
        }}
      >
        <Box style={{ padding: 10 }}>
          <IconButton
            onClick={onClose}
            style={{ marginLeft: "auto", display: "block" }}
          >
            <CloseIcon />
          </IconButton>
          <Box
            sx={{
              position: "relative",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: "5%",
              overflow: "hidden",
              height: "80%",
              width: "90%",
              //   width: 400,
              margin: "0 auto",
            }}
          >
            {item.image && (
              <>
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  style={{ objectFit: "cover" }}
                />
                {loggedIn &&
                  item.status === "sold" &&
                  user.id === item.leading_user_id && <YouWonRibbon />}
                {loggedIn &&
                  item.status === "sold" &&
                  user.id !== item.leading_user_id && <SoldRibbon />}
                {loggedIn &&
                  user.id === item.leading_user_id &&
                  item.status !== "sold" && <LeadingBidRibbon />}
              </>
            )}
          </Box>

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
              <Typography
                variant="h6"
                component="div"
                sx={{ fontWeight: "bold" }}
              >
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

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              mt: 2,
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
                },
                startAdornment: (
                  <InputAdornment position="start">$</InputAdornment>
                ), // Ensure the inner input is the same height as the TextField
              }}
            />
            <Button
              variant="contained"
              sx={{
                // ml: 2,
                backgroundColor: "#ff8e44",
                color: "#fff",
                height: 56, // Ensure the button has the same height as the TextField
              }}
              disabled={!isBidValid(bidAmount) || item.status === "sold"}
              onClick={handleSubmit}
            >
              Place Bid
            </Button>
          </Box>

          <Button
            variant="contained"
            // color="primary"
            onClick={() => {
              if (onBuyNowClick) {
                onBuyNowClick();
              }
            }}
            disabled={
              item.status === "sold" && user?.id !== item.leading_user_id
            }
            sx={{
              color: "#fff",
              width: "100%",
              marginTop: 2,
              borderRadius: 100,
              backgroundColor: "#ffb81d",
            }}
          >
            Buy Now for ${item.buy_now_price}
          </Button>
          <BuyNowDetailsDrawer
            item={item}
            open={buyNowDrawerOpen}
            onClose={handleBuyNowDrawerClose}
          />

          <Typography variant="body1" paragraph sx={{ marginY: 3 }}>
            {item.description}
          </Typography>
        </Box>
      </Drawer>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          variant="filled"
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}

export default ItemDetails;
