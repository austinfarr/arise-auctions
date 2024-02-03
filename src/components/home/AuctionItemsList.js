import React from "react";
import { Button, Grid, Typography } from "@mui/material";
import AuctionItem from "../AuctionItem";
import { useDrawer } from "@/context/DrawerContext";

const AuctionItemsList = ({
  items,
  activeFilter,
  searchQuery,
  user,
  userBids,
  onBidSubmit,
}) => {
  const searchQueryLower = searchQuery.toLowerCase();
  const filteredItems = items
    .filter((item) => {
      // Filtering based on active filter
      if (activeFilter === "sold") {
        return item.status === "sold" || item.status === "auction ended";
      } else if (activeFilter === "live") {
        return item.live_auction_only;
      } else if (activeFilter === "myBids") {
        return (
          userBids.includes(item.id) &&
          (item.status !== "sold" ||
            (item.status === "sold" && item.leading_user_id === user?.id))
        );
      } else if (activeFilter === "all") {
        return (
          item.status !== "sold" &&
          !item.live_auction_only &&
          item.status !== "auction ended"
        );
      } else {
        return (
          item.status !== "sold" &&
          (item.categories || []).includes(activeFilter)
        );
      }
    })
    .filter((item) => {
      // Filtering based on search query
      const matchesTitle = item.title.toLowerCase().includes(searchQueryLower);
      const matchesCategory = item.categories
        ? item.categories.some((category) =>
            category.toLowerCase().includes(searchQueryLower)
          )
        : false;
      return matchesTitle || matchesCategory;
    });

  if (filteredItems.length < 1) {
    return (
      <Grid container justifyContent="center">
        <Typography>No items left in this category!</Typography>
      </Grid>
    );
  }

  return (
    <div>
      <Grid
        container
        spacing={{ xs: 0, sm: 2, md: 2, lg: 2 }}
        sx={{ mt: 0, pt: 0 }}
      >
        {filteredItems.map((filteredItem) => (
          <Grid
            key={filteredItem.id}
            item
            xs={12}
            sm={6}
            md={4}
            lg={4}
            sx={{ mt: 0, pt: 0 }}
          >
            <AuctionItem
              key={filteredItem.id}
              item={filteredItem}
              user={user}
              onBidSubmit={onBidSubmit}
            />
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default AuctionItemsList;
