import React, { useEffect, useState } from "react";
import {
  Container,
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
import supabase from "../../../lib/supabase";
import Header from "@/components/header/Header";
import { getCookie } from "cookies-next";

export async function getServerSideProps(context) {
  const itemId = context.params.id;

  let { data: item, error } = await supabase
    .from("Items")
    .select("*")
    .eq("id", itemId)
    .single();

  if (error) {
    console.error("Error fetching item:", error);
    return { notFound: true };
  }

  return {
    props: {
      initialItem: item,
    },
  };
}

const ItemDetail = ({ initialItem }) => {
  const router = useRouter();
  const [bid, setBid] = useState("");
  const [open, setOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [item, setItem] = useState(initialItem);

  const [user, setUser] = useState(getCookie("userId") || null);
  const [loggedIn, setLoggedIn] = useState(Boolean(user));

  useEffect(() => {
    const subscription = supabase
      .channel("table_db_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "Items",
          filter: `id=eq.${item.id}`,
        },
        (payload) => {
          const eventType = payload.eventType;
          const newRecord = payload.new;
          const oldRecord = payload.old;

          handleDataChange(eventType, newRecord, oldRecord);
        }
      )
      .subscribe();

    return () => {
      // cleanup the subscription on component unmount
      subscription.unsubscribe();
    };
  }, []);

  const fetchUpdatedItems = async () => {
    let { data: updatedItem, error } = await supabase.from("Items").select("*");

    if (error) {
      console.error("Error fetching updated items:", error);
    } else {
      setItem(updatedItem);
    }
  };

  const handleDataChange = (eventType, newRecord, oldRecord) => {
    switch (eventType) {
      case "INSERT":
        setItem((prevItems) => {
          const updated = [...prevItems, newRecord];
          return updated;
        });
        break;
      case "UPDATE":
        setItem((prevItems) => {
          const updated = item.id === newRecord.id ? newRecord : item;

          return updated;
        });
        break;
      case "DELETE":
        setItem((prevItems) =>
          prevItems.filter((item) => item.id !== oldRecord.id)
        );
        break;
      default:
        fetchUpdatedItems(); // fallback to fetching all data in case of unexpected event types
        break;
    }
  };

  const handleOpen = () => {
    if (!getCookie("userId")) {
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

  const handleSubmit = async () => {
    if (parseFloat(bid) > item.current_bid) {
      const { data, error } = await supabase
        .from("Items")
        .update({ current_bid: parseFloat(bid) })
        .eq("id", item.id);

      if (error) {
        console.error("Error placing bid:", error);
      }

      handleClose();
    } else {
      setSnackbarOpen(true);
    }
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      setLoggedIn(false);
      deleteCookie("userId");
      setUser(null);
    } else {
      console.error("Error logging out:", error.message);
    }
  };

  return (
    <>
      <Header
        loggedIn={loggedIn}
        onLogout={handleLogout}
        setLoggedIn={setLoggedIn}
      />

      <Container>
        <Typography variant="h3" gutterBottom sx={{ marginTop: "2rem" }}>
          {item.title}
        </Typography>
        <Typography variant="h5">Description:</Typography>
        <Typography variant="body1" paragraph>
          {item.description}
        </Typography>
        <Typography variant="h5" color="textSecondary">
          Current Bid: ${item.current_bid}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleOpen}
          sx={{ marginTop: "2rem", color: "#fff" }}
        >
          Place Bid
        </Button>

        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Place your bid</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Enter your bid amount for {item.title}. It should be higher than
              the current bid: <strong>${item.current_bid}</strong>
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
      </Container>
    </>
  );
};

export default ItemDetail;
