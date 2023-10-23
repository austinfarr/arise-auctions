import Head from "next/head";
import { useEffect, useState } from "react";
import supabase from "../../lib/supabase";
import AuctionItem from "@/components/AuctionItem";
import Header from "@/components/Header";
import { Typography, Grid, CircularProgress } from "@mui/material";

export async function getServerSideProps(context) {
  const cookies = context.req.cookies;
  const token = cookies["userId"]; // Adjust this to your actual cookie name
  console.log("token", token);

  let user = null;

  if (token) {
    // Verify the token and fetch user data
    // This is a simplified example. You might need to adjust it according to your backend logic.
    //
    user = token;
  }

  return {
    props: {
      initialUser: user,
    },
  };
}

export default function MyBids({ initialUser }) {
  const [items, setItems] = useState([]);
  const [user, setUser] = useState(initialUser);
  const [loading, setLoading] = useState(true);

  console.log("user", user);

  const [loggedIn, setLoggedIn] = useState(Boolean(user));

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
          console.log("items", items);

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
  };

  return (
    <div>
      <Head>
        <title>My Bids</title>
        <meta name="description" content="View your bidding history" />
      </Head>

      <Header user={user} hasLogoutOption={false} />

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
