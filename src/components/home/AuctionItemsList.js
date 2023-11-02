import React from "react";
import { Grid } from "@mui/material";
import AuctionItem from "../AuctionItem";

const AuctionItemsList = ({
  items,
  activeFilter,
  searchQuery,
  user,
  userBids,
  onBidSubmit,
}) => {
  const filteredItems = items
    .filter((item) => {
      // Filtering based on active filter
      if (activeFilter === "sold") {
        return item.status === "sold";
      } else if (activeFilter === "myBids") {
        return (
          userBids.includes(item.id) &&
          (item.status !== "sold" ||
            (item.status === "sold" && item.leading_user_id === user?.id))
        );
      } else if (activeFilter === "all") {
        return item.status !== "sold";
      } else {
        return (
          item.status !== "sold" &&
          (item.categories || []).includes(activeFilter)
        );
      }
    })
    .filter((item) => {
      // Filtering based on search query
      const matchesQuery = item.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      return matchesQuery;
    });

  if (activeFilter === "myBids" && !user) {
    return (
      <Grid container justifyContent="center">
        <Grid item>
          <div>Login to View Your Bids</div>
        </Grid>
      </Grid>
    );
  }

  return (
    <div>
      {filteredItems.map((filteredItem) => (
        <AuctionItem
          key={filteredItem.id}
          item={filteredItem}
          user={user}
          onBidSubmit={onBidSubmit}
        />
      ))}
    </div>
  );
};

export default AuctionItemsList;
