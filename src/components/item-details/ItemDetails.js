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
import LeadingBidRibbon from "../ribbons/LeadingBidRibbon";
import { useDrawer } from "@/context/DrawerContext";
import BuyNowDetailsDrawer from "../BuyNowDetailsDrawer";
import { useAuction } from "@/context/AuctionContext";
import YouWonRibbon from "../ribbons/YouWonRibbon";
import SoldRibbon from "../ribbons/SoldRibbon";
import ImageDisplay from "./ImageDisplay";
import BidInfo from "./BidInfo";
import BidForm from "./BidForm";
import BuyNowButton from "./BuyNowButton";

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

          <ImageDisplay item={item} user={user} />

          <BidInfo item={item} />

          <BidForm
            bidAmount={bidAmount}
            handleSubmit={handleSubmit}
            itemStatus={item.status}
            isBidValid={isBidValid}
            handleBidAmountChange={handleBidAmountChange}
          />

          <BuyNowButton item={item} onBuyNowClick={onBuyNowClick} user={user} />

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
