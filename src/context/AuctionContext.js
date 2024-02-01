import React, { createContext, useContext, useState } from "react";
import supabase from "../../lib/supabase";

const AuctionContext = createContext();

export const useAuction = () => {
  return useContext(AuctionContext);
};

export const AuctionProvider = ({ children, items, setItems }) => {
  //   const [items, setItems] = useState([]);
  const [userBids, setUserBids] = useState([]);

  const handleBidSubmit = async (itemId, bidAmount, userId) => {
    console.log("itemId", itemId);
    console.log("bidAmount", bidAmount);
    console.log("userId", userId);

    const { data: bidData, error: bidError } = await supabase
      .from("Bids")
      .insert([
        {
          item_id: itemId,
          user_id: userId,
          bid_amount: bidAmount,
          type: "bid",
        },
      ]);

    if (bidError) {
      console.error("Error logging bid:", bidError);
      return;
    }

    const { data: itemData, error: itemError } = await supabase
      .from("Items")
      .update({
        leading_user_id: userId,
        current_bid: bidAmount,
        // You might also want to update a `last_bidder` or similar field
      })
      .eq("id", itemId);

    if (itemError) {
      console.error("Error placing bid:", error);
    } else {
      // Optimistically update the UI or refetch the items
      const updatedItems = items.map((item) =>
        item.id === itemId ? { ...item, current_bid: bidAmount } : item
      );
      setItems(updatedItems);
    }

    setUserBids((prevUserBids) => {
      const newUserBids = new Set(prevUserBids);
      newUserBids.add(itemId);
      return Array.from(newUserBids);
    });

    // setUserBids((prevUserBids) => [...prevUserBids, itemId]);
    console.log("userBids", userBids);
  };

  const handleBuyNowSubmit = async (itemId, userId, buyNowPrice) => {
    // Implement the logic for "Buy Now" here
    // Update the item's status, set the buyer's ID, etc.
    const { data: bidData, error: bidError } = await supabase
      .from("Bids")
      .insert([
        {
          item_id: itemId,
          user_id: userId,
          bid_amount: buyNowPrice,
          type: "buy_now",
        },
      ]);

    if (bidError) {
      console.error("Error logging purchase:", bidError);
      return;
    }

    const { data: itemData, error: itemError } = await supabase
      .from("Items")
      .update({
        leading_user_id: userId,
        current_bid: buyNowPrice,
        status: "sold",
        winner_user_id: userId,
        final_purchase_price: buyNowPrice,
        type: "buy_now",
        // You might also want to update a `last_bidder` or similar field
      })
      .eq("id", itemId);

    if (itemError) {
      console.error("Error placing bid:", error);
    } else {
      // Optimistically update the UI or refetch the items
      const updatedItems = items.map((item) =>
        item.id === itemId ? { ...item, current_bid: buyNowPrice } : item
      );
      setItems(updatedItems);
    }

    setUserBids((prevUserBids) => [...prevUserBids, itemId]);

    const { data: purchaseData, error: purchaseError } = await supabase
      .from("Purchases")
      .insert([
        {
          item_id: itemId,
          user_id: userId,
          purchase_price: buyNowPrice,
          purchase_type: "buy_now",
        },
      ]);

    if (purchaseError) {
      console.error("Error logging purchase:", purchaseError);
      return;
    }
  };

  const handlePurchaseSubmit = async (itemId, userId, purchasePrice) => {
    // Implement the logic for "Buy Now" here
    // Update the item's status, set the buyer's ID, etc.
    const { data: bidData, error: bidError } = await supabase
      .from("Bids")
      .insert([
        {
          item_id: itemId,
          user_id: userId,
          bid_amount: purchasePrice,
          type: "purchase",
        },
      ]);

    if (bidError) {
      console.error("Error logging purchase:", bidError);
      return;
    }

    const { data: purchaseData, error: purchaseError } = await supabase
      .from("Purchases")
      .insert([
        {
          item_id: itemId,
          user_id: userId,
          purchase_price: purchasePrice,
          purchase_type: "purchase",
          // quantity: quantity,
        },
      ]);

    if (purchaseError) {
      console.error("Error logging purchase:", purchaseError);
      return;
    }
  };

  const value = {
    items,
    userBids,
    setUserBids,
    handleBidSubmit,
    handleBuyNowSubmit,
    handlePurchaseSubmit,
    // ... any other state or functions you want to provide
  };

  return (
    <AuctionContext.Provider value={value}>{children}</AuctionContext.Provider>
  );
};
