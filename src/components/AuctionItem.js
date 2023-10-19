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
} from "@mui/material";

const AuctionItem = ({ item, onBidSubmit }) => {
  const [bid, setBid] = useState("");
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setBid("");
  };

  const handleSubmit = () => {
    if (parseFloat(bid) > item.current_bid) {
      onBidSubmit(item.id, parseFloat(bid));
      handleClose();
    } else {
      alert("Your bid should be higher than the current bid!");
    }
  };

  return (
    <Paper style={{ padding: "16px", marginBottom: "20px" }}>
      <Typography variant="h6" gutterBottom>
        {item.title}
      </Typography>
      <Typography variant="body1">Description: {item.description}</Typography>
      <Typography variant="body2" color="textSecondary">
        Current Bid: ${item.current_bid}
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={handleOpen}
        sx={{ color: "#fff" }}
      >
        Place Bid
      </Button>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Place your bid</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter your bid amount for {item.title}. It should be higher than the
            current bid.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Your Bid"
            type="number"
            fullWidth
            value={bid}
            onChange={(e) => setBid(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Submit Bid
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default AuctionItem;
