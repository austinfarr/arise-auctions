import React, { useEffect, useState } from "react";
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
import Countdown from "react-countdown";
import { usePurchase } from "@/context/PurchaseContext";
import DOMPurify from "dompurify";

function ItemDetails({ item, open, onClose, onBuyNowClick }) {
  const [bidAmount, setBidAmount] = useState(
    item.current_bid + item.bid_increment
  );
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "error",
  });

  const { user, loggedIn, isBanned } = useAuth();

  const { openDrawer } = useDrawer();
  const { items, handleBidSubmit, handleBuyNowSubmit } = useAuction();
  const [isExpired, setIsExpired] = useState(false);

  const { showBidSuccessMessage, hideBidSuccessMessage } = usePurchase();

  const [buyNowDrawerOpen, setBuyNowDrawerOpen] = useState(false);

  let sanitizedDescription = item.description;
  if (typeof window !== "undefined") {
    sanitizedDescription = DOMPurify.sanitize(item.description);
  }

  useEffect(() => {
    // Calculate the current time
    const now = new Date().getTime();

    // Parse the item_timer_ends as a date object
    const endTime = new Date(item.item_timer_ends).getTime();

    // Determine if the current time is greater than the end time
    setIsExpired(now > endTime);
  }, [item.item_timer_ends]); // The effect runs whenever item_timer_ends changes

  //If another user increases the bid, update the default bid amount
  useEffect(() => {
    setBidAmount(item.current_bid + item.bid_increment);
  }, []);

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
    if (
      isNaN(numericBid) ||
      numericBid <= item.current_bid + item.bid_increment - 1
    ) {
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

    if (new Date().getTime() > new Date(item.item_timer_ends).getTime()) {
      showSnackbar("It is too late to bid on this item!", "error");
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
      onClose();
      showBidSuccessMessage();
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
          height: "75%",
          display: "flex",
          flexDirection: "column",
          "& .MuiPaper-root": {
            // Targeting the Paper component inside Drawer
            borderTopLeftRadius: 20, // Adjust as needed
            borderTopRightRadius: 20, // Adjust as needed
            height: "75%",
            background: "#fff",
          },
          // overflowY: "auto",
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

          {item.is_biddable && !isBanned && !item.live_auction_only && (
            <BidForm
              bidAmount={bidAmount}
              handleSubmit={handleSubmit}
              itemStatus={item.status}
              isBidValid={isBidValid}
              handleBidAmountChange={handleBidAmountChange}
              isExpired={isExpired}
            />
          )}

          {!isBanned && !item.live_auction_only && (
            <BuyNowButton
              item={item}
              onBuyNowClick={onBuyNowClick}
              user={user}
            />
          )}

          {isBanned && !item.live_auction_only && (
            <Box sx={{ bgcolor: "#ff7675", borderRadius: 5 }}>
              <Typography
                textAlign="center"
                sx={{ color: "#fff", fontSize: 14, p: 2 }}
              >
                To bid, please add a payment method using the link provided to
                you via text message
              </Typography>
            </Box>
          )}

          <BuyNowDetailsDrawer
            item={item}
            open={buyNowDrawerOpen}
            onClose={handleBuyNowDrawerClose}
          />
          <Typography
            paragraph
            sx={{ mb: 1, mt: 3, px: 2, fontSize: 14, fontWeight: "bold" }}
          >
            MARKET VALUE: {item.market_value}
          </Typography>
          <Typography
            variant="body1"
            paragraph
            sx={{ mt: 0, marginBottom: 10, px: 2 }}
          >
            <div dangerouslySetInnerHTML={{ __html: sanitizedDescription }} />
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
