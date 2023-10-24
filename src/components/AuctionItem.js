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
import ItemDetails from "./ItemDetails"; // Import the new component
import Image from "next/image";
import { useRouter } from "next/router";
import LeadingBidRibbon from "./LeadingBidRibbon";

const AuctionItem = ({ item, onBidSubmit, user }) => {
  const router = useRouter();
  const { itemDetailId } = router.query;

  const [detailsOpen, setDetailsOpen] = useState(false);

  const handleItemClick = () => {
    setDetailsOpen(true);
  };

  const handleDetailsClose = () => {
    setDetailsOpen(false);
    router.push("/", undefined, { shallow: true });
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
        onClick={handleItemClick}
      >
        <Card
          sx={{ maxWidth: 500, width: "100%", position: "relative" }}
          onClick={handleItemClick}
        >
          {user && user === item.leading_user_id && <LeadingBidRibbon />}
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
        open={detailsOpen}
        onClose={handleDetailsClose}
        onBidSubmit={onBidSubmit}
        user={user}
      />
    </>
  );
};

export default AuctionItem;
