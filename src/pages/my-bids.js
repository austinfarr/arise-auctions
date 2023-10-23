import Head from "next/head";
import { useEffect, useState } from "react";
import supabase from "../../lib/supabase";
import AuctionItem from "@/components/AuctionItem";
import Header from "@/components/Header";
import { Typography, Grid, CircularProgress } from "@mui/material";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/router";

export default function MyBids() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, loggedIn } = useAuth();

  const router = useRouter();

  useEffect(() => {
    const fetchUserAndBids = async () => {
      if (user) {
        const { data: bids, error: bidsError } = await supabase
          .from("Bids")
          .select("item_id")
          .eq("user_id", user);

        if (bidsError) {
          console.error("Error fetching user bids:", bidsError);
        } else if (bids && bids.length > 0) {
          const itemIds = bids.map((bid) => bid.item_id);
          const { data: items, error: itemsError } = await supabase
            .from("Items")
            .select("*")
            .in("id", itemIds);

          if (itemsError) {
            console.error("Error fetching items:", itemsError);
          } else {
            setItems(items);
          }
        }
        setLoading(false);
      }
    };

    fetchUserAndBids();
  }, [user]);

  const handleBidSubmit = async (itemId, bidAmount) => {
    console.log("itemId", itemId);
    console.log("bidAmount", bidAmount);
    console.log("userId", user);

    const { data: bidData, error: bidError } = await supabase
      .from("Bids")
      .insert([
        {
          item_id: itemId,
          user_id: user,
          bid_amount: bidAmount,
        },
      ]);

    if (bidError) {
      console.error("Error logging bid:", bidError);
      return;
    }

    const { data: itemData, error: itemError } = await supabase
      .from("Items")
      .update({
        leading_user_id: user,
        current_bid: bidAmount,
      })
      .eq("id", itemId);

    if (itemError) {
      console.error("Error placing bid:", itemError);
    } else {
      // Optimistically update the UI or refetch the items
      const updatedItems = items.map((item) =>
        item.id === itemId ? { ...item, current_bid: bidAmount } : item
      );
      setItems(updatedItems);
    }
  };

  if (!loggedIn) {
    //go to login page
    router.push("/login");
  }

  return (
    <div>
      <Head>
        <title>My Bids</title>
        <meta name="description" content="View your bidding history" />
      </Head>

      <Header hasLogoutOption={false} />

      <Typography
        variant="h3"
        align="center"
        gutterBottom
        color={"primary"}
        sx={{
          marginTop: "5vh",
          fontWeight: "bold",
          textShadow: "1px 1px 2px rgba(0, 0, 0, 0.1)",
        }}
      >
        My Bids
      </Typography>

      {loading && (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <CircularProgress size={80} />
        </div>
      )}

      {!loading &&
        (items.length > 0 ? (
          items.map((item) => (
            <AuctionItem
              key={item.id}
              item={item}
              user={user}
              onBidSubmit={handleBidSubmit}
            />
          ))
        ) : (
          <Typography variant="h5" align="center" color="textSecondary">
            You haven&apos;t bid on any items yet.
          </Typography>
        ))}
    </div>
  );
}
