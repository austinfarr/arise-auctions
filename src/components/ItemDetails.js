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

function ItemDetails({ item, open, onClose, onBidSubmit }) {
  const [bidAmount, setBidAmount] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "error",
  });

  const { user } = useAuth();

  const handleBidAmountChange = (event) => {
    setBidAmount(event.target.value);
  };

  //   const handlePlaceBid = () => {
  //     if (bidAmount && !isNaN(bidAmount)) {
  //       onBidSubmit(item.id, parseFloat(bidAmount), user);
  //       setBidAmount("");
  //     }
  //   };

  const showSnackbar = (message, severity = "error") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
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
      await onBidSubmit(item.id, bidAmount, user);
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
              borderRadius: "10%",
              overflow: "hidden",
              height: "90%",
              width: "80%",
              //   width: 400,
              margin: "0 auto",
            }}
          >
            {item.image && (
              <Image
                src={item.image}
                alt={item.title}
                layout="fill"
                objectFit="cover"
              />
            )}
            {/* <Typography
            sx={{
              position: "absolute",
              top: "50%", // Adjusted from 10% to 50%
              left: "50%",
              transform: "translate(-100%, -100%) rotate(-45deg)",
              fontSize: "2rem",
              fontWeight: "bold",
              color: "white",
              textShadow: "2px 2px 4px rgba(0, 0, 0, 0.8)",
              backgroundColor: "yellow", // Optional: adds a semi-transparent background for better readability
              padding: "0.5rem", // Optional: adds some space around the text
            }}
          >
            You Won!
          </Typography> */}
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
            <Box>
              <Typography
                variant="h6"
                component="div"
                sx={{ fontWeight: "bold" }}
              >
                {item.title}
              </Typography>
            </Box>

            <Box textAlign="right">
              <Typography sx={{ fontWeight: "bold", fontSize: 24 }}>
                ${item.current_bid}
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
              onClick={handleSubmit}
            >
              Place Bid
            </Button>
          </Box>

          <Button
            variant="contained"
            color="primary"
            onClick={() => onBidSubmit(item.id, item.buy_now_price, user)} // Buy Now
            sx={{
              color: "#fff",
              width: "100%",
              marginTop: 2,
              borderRadius: 100,
            }}
          >
            Buy Now for ${item.buy_now_price}
          </Button>

          <Typography variant="body1" paragraph sx={{ marginTop: 3 }}>
            Description: {item.description}
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
