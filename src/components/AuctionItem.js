import React, { useState } from "react";
import {
  Paper,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
  Alert,
  InputAdornment,
} from "@mui/material";
import { useRouter } from "next/router";
import Link from "next/link";
import { getCookie } from "cookies-next";

const AuctionItem = ({ item, onBidSubmit, user }) => {
  const router = useRouter();
  const [bid, setBid] = useState("");
  const [open, setOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const userId = getCookie("userId") || null; // Retrieve the current user's ID from the cookie
  // const isLeadingBidder = item.leading_user_id === userId;
  const isLeadingBidder =
    item.leading_user_id === user && item.leading_user_id !== null;

  const handleOpen = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!userId) {
      router.push("/login");
      return;
    }

    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setBid("");
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  const handleSubmit = () => {
    if (parseFloat(bid) > item.current_bid) {
      onBidSubmit(item.id, parseFloat(bid), getCookie("userId"));
      handleClose();
    } else {
      // Open the snackbar instead of the default alert
      setSnackbarOpen(true);
    }
  };

  return (
    <Paper sx={{ padding: "16px", marginY: 2, marginX: 2 }}>
      <Link
        href={`/item/${item.id}`}
        style={{ textDecoration: "none", color: "inherit" }}
      >
        <Typography variant="h6" gutterBottom>
          {item.title}
        </Typography>
        <Typography variant="body1">Description: {item.description}</Typography>
        <Typography variant="body2" color="textSecondary" marginY={1}>
          Current Bid: ${item.current_bid}
        </Typography>
        {isLeadingBidder && (
          <Typography color="primary">
            You are currently leading for this item!
          </Typography>
        )}
      </Link>
      <Button
        variant="contained"
        color="primary"
        onClick={(e) => handleOpen(e)}
        sx={{ color: "#fff", marginRight: 2 }}
      >
        Place Bid
      </Button>
      <Button
        variant="contained"
        color="primary"
        onClick={(e) => handleOpen(e)}
        sx={{ color: "#fff" }}
      >
        Buy Now for ${item.buy_now_price}
      </Button>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Place your bid</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter your bid amount for {item.title}. It should be higher than the
            current bid: <strong>${item.current_bid}</strong>
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Your Bid"
            type="number"
            fullWidth
            value={bid}
            onChange={(e) => setBid(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">$</InputAdornment>
              ),
              inputProps: {
                min: 0,
              },
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClose}
            color="primary"
            variant="contained"
            sx={{ color: "#fff" }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            color="primary"
            variant="contained"
            sx={{ color: "#fff" }}
          >
            Submit Bid
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for displaying message */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={5000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          variant="filled"
          severity="error"
          sx={{ width: "100%" }}
        >
          Your bid should be higher than the current bid!
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default AuctionItem;
