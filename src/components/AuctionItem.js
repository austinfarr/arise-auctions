import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Paper,
  Typography,
} from "@mui/material";
import ItemDetails from "./item-details/ItemDetails"; // Import the new component
import Image from "next/image";
import { useRouter } from "next/router";
import LeadingBidRibbon from "./ribbons/LeadingBidRibbon";
import { useAuth } from "@/context/AuthContext";
import BuyNowDetailsDrawer from "./BuyNowDetailsDrawer";
import SoldRibbon from "./ribbons/SoldRibbon";
import YouWonRibbon from "./ribbons/YouWonRibbon";

const AuctionItem = ({ item, onBidSubmit }) => {
  const { user, loggedIn } = useAuth();

  const [detailsOpen, setDetailsOpen] = useState(false);

  const router = useRouter();
  const { id } = router.query;

  const [itemDetailsOpen, setItemDetailsOpen] = useState(false);

  const handleOpenItemDetails = () => {
    setItemDetailsOpen(true);
    // If you want to manipulate the URL without navigation
    router.replace(`/?id=${item.id}`, undefined, { shallow: true });
  };

  const handleCloseItemDetails = () => {
    setItemDetailsOpen(false);
    // Reset the URL
    router.replace("/", undefined, { shallow: true });
  };

  useEffect(() => {
    // Open the details drawer if the itemDetailId matches the item's ID
    if (id && id === item.id.toString()) {
      handleOpenItemDetails();
    }
  }, [id, item.id]);

  const handleItemClick = () => {
    setDetailsOpen(true);
  };

  const handleDetailsClose = () => {
    setDetailsOpen(false);
    router.push("/", undefined, { shallow: true });
  };

  const [buyNowDetailsOpen, setBuyNowDetailsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const handleOpenBuyNowDetails = () => {
    setItemDetailsOpen(false); // Close ItemDetails Drawer
    setBuyNowDetailsOpen(true); // Open BuyNowDetails Drawer
  };

  const handleCloseBuyNowDetails = () => {
    setBuyNowDetailsOpen(false);
  };

  useEffect(() => {
    console.log("itemDetailId", id);
    console.log("item.id", item.id);
    if (id && id === item.id.toString()) {
      setDetailsOpen(true);
    }
  }, [id, item.id]);

  return (
    <>
      <Box
        sx={{
          marginY: 2,
          marginX: 2,
          cursor: "pointer",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
        onClick={handleOpenItemDetails}
      >
        <Card
          sx={{
            maxWidth: 400,
            width: "100%",
            position: "relative",
            borderRadius: 1,
          }}
          elevation={0}
          onClick={handleOpenItemDetails}
        >
          {loggedIn &&
            (item.status === "sold" || item.status === "auction ended") &&
            user.id === item.leading_user_id && <YouWonRibbon />}
          {loggedIn &&
            (item.status === "sold" || item.status === "auction ended") &&
            user.id !== item.leading_user_id && <SoldRibbon />}
          {loggedIn &&
            user.id === item.leading_user_id &&
            item.status !== "sold" &&
            item.status !== "auction ended" && <LeadingBidRibbon />}

          <CardMedia
            component="img"
            sx={{ height: 240 }}
            image={item.image?.images[0]}
          />
          <CardContent
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center", // This ensures vertical centering
              justifyContent: "space-between",
              backgroundColor: "#ff8e44",
              paddingY: 1, // Removes vertical padding
              "&:last-child": { paddingBottom: 1 }, // Removes default bottom padding from MUI
            }}
          >
            <Box>
              <Typography
                variant="h6"
                component="div"
                sx={{ color: "white", fontWeight: 600, pr: 1 }}
              >
                {item.title}
              </Typography>
            </Box>
            <Box textAlign="right">
              <Typography sx={{ color: "white", fontSize: 24 }} variant="h2">
                {item.current_bid
                  ? `$${item.current_bid.toLocaleString()}`
                  : "$0"}
              </Typography>
              <Typography sx={{ color: "white" }}>Current bid</Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>

      <ItemDetails
        item={item}
        open={itemDetailsOpen}
        onClose={handleCloseItemDetails}
        onBidSubmit={onBidSubmit}
        onBuyNowClick={handleOpenBuyNowDetails}
      />

      <BuyNowDetailsDrawer
        item={item}
        open={buyNowDetailsOpen}
        onClose={handleCloseBuyNowDetails}
      />
    </>
  );
};

export default AuctionItem;
