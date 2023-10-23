import React, { createRef, useMemo, useState } from "react";
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

const AuctionItem = ({
  item: { id, title, description, current_bid, buy_now_price, leading_user_id },
  onBidSubmit,
  user,
}) => {
  const router = useRouter();
  const [bid, setBid] = useState("");
  const [open, setOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const userId = getCookie("userId") || null;

  const isLeadingBidder = useMemo(
    () => leading_user_id === user && leading_user_id !== null,
    [leading_user_id, user]
  );

  const dialogPaperStyle = {
    position: "absolute",
    top: "15%",
  };

  const handleOpen = () => {
    if (!userId) {
      router.push("/login?returnUrl=" + router.pathname);
      return;
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setBid("");
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason !== "clickaway") {
      setSnackbarOpen(false);
    }
  };

  const handleSubmit = () => {
    const bidAmount = parseFloat(bid);
    if (bidAmount > current_bid) {
      onBidSubmit(id, bidAmount, userId);
      handleClose();
    } else {
      setSnackbarOpen(true);
    }
  };

  return (
    <Paper sx={{ padding: "16px", marginY: 2, marginX: 2 }}>
      <Link
        href={`/item/${id}`}
        style={{ textDecoration: "none", color: "inherit" }}
      >
        <div>
          <Typography variant="h6" gutterBottom>
            {title}
          </Typography>
          <Typography variant="body1">Description: {description}</Typography>
          <Typography variant="body2" color="textSecondary" marginY={1}>
            Current Bid: ${current_bid}
          </Typography>
          {isLeadingBidder && (
            <Typography color="primary">
              You are currently leading for this item!
            </Typography>
          )}
        </div>
      </Link>
      <Button
        variant="contained"
        color="primary"
        onClick={handleOpen}
        sx={{ color: "#fff", marginRight: 2 }}
      >
        Place Bid
      </Button>
      <Button
        variant="contained"
        color="primary"
        onClick={handleOpen}
        sx={{ color: "#fff" }}
      >
        Buy Now for ${buy_now_price}
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        sx={{
          "& .MuiPaper-root": {
            position: "absolute",
            top: "15%",
          },
        }}
        // PaperComponent={(props) => (
        //   <Paper {...props} style={dialogPaperStyle} />
        // )}
      >
        <DialogTitle>Place your bid</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter your bid amount for {title}. It should be higher than the
            current bid: <strong>${current_bid}</strong>
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
