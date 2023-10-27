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
  const router = useRouter();
  const { user, loggedIn } = useAuth();
  const { itemDetailId } = router.query;

  const [detailsOpen, setDetailsOpen] = useState(false);

  const handleItemClick = () => {
    setDetailsOpen(true);
  };

  const handleDetailsClose = () => {
    setDetailsOpen(false);
    router.push("/", undefined, { shallow: true });
  };

  const [itemDetailsOpen, setItemDetailsOpen] = useState(false);
  const [buyNowDetailsOpen, setBuyNowDetailsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const handleOpenItemDetails = (item) => {
    setSelectedItem(item);
    setItemDetailsOpen(true);
  };

  const handleCloseItemDetails = () => {
    setItemDetailsOpen(false);
    router.push("/", undefined, { shallow: true });
  };

  const handleOpenBuyNowDetails = () => {
    setItemDetailsOpen(false); // Close ItemDetails Drawer
    setBuyNowDetailsOpen(true); // Open BuyNowDetails Drawer
  };

  const handleCloseBuyNowDetails = () => {
    setBuyNowDetailsOpen(false);
    setItemDetailsOpen(true);
  };

  useEffect(() => {
    console.log("itemDetailId", itemDetailId);
    console.log("item.id", item.id);
    if (itemDetailId && itemDetailId === item.id.toString()) {
      setDetailsOpen(true);
    }
  }, [itemDetailId, item.id]);

  return (
    <>
      <Box
        sx={{
          // padding: "16px",
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
          sx={{ maxWidth: 500, width: "100%", position: "relative" }}
          onClick={handleOpenItemDetails}
        >
          {loggedIn &&
            item.status === "sold" &&
            user.id === item.leading_user_id && <YouWonRibbon />}
          {loggedIn &&
            item.status === "sold" &&
            user.id !== item.leading_user_id && <SoldRibbon />}
          {loggedIn &&
            user.id === item.leading_user_id &&
            item.status !== "sold" && <LeadingBidRibbon />}
          <CardMedia
            component="img"
            sx={{ height: 240 }}
            image={item.image}
            // title="green iguana"
          />
          <CardContent
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center", // This ensures vertical centering
              justifyContent: "space-between",
              backgroundColor: "#ff8e44",
              paddingY: 1, // Removes vertical padding
              "&:last-child": { paddingBottom: 0 }, // Removes default bottom padding from MUI
            }}
          >
            <Box>
              <Typography
                variant="h6"
                component="div"
                sx={{ color: "white", fontWeight: "bold" }}
              >
                {item.title}
              </Typography>
            </Box>
            <Box textAlign="right">
              <Typography
                sx={{ color: "white", fontWeight: "bold", fontSize: 24 }}
              >
                ${item.current_bid.toLocaleString()}
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
