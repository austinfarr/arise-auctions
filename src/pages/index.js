import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import supabase from "../../lib/supabase";
import AuctionItem from "@/components/AuctionItem";
import { useEffect, useState } from "react";
import {
  Box,
  Grid,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import Link from "next/link";
import Header from "@/components/Header";
import { Search } from "@mui/icons-material";

export async function getServerSideProps(context) {
  let { data: items, error } = await supabase.from("Items").select("*");
  const sortItemsById = (a, b) => a.id - b.id;
  items.sort(sortItemsById);

  if (error) {
    console.error("Error fetching items:", error);
    return { props: { items: [] } }; // Return empty array on error
  }

  return {
    props: {
      initialItems: items,
    },
  };
}

export default function Home({ initialItems }) {
  const [items, setItems] = useState(initialItems);

  const [searchQuery, setSearchQuery] = useState("");

  const sortItemsById = (a, b) => a.id - b.id;

  useEffect(() => {
    const subscription = supabase
      .channel("table_db_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "Items",
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
    let { data: updatedItems, error } = await supabase
      .from("Items")
      .select("*");

    if (error) {
      console.error("Error fetching updated items:", error);
    } else {
      updatedItems.sort(sortItemsById); // Sort items by id
      setItems(updatedItems);
    }
  };

  const handleBidSubmit = async (itemId, bidAmount) => {
    const { data, error } = await supabase
      .from("Items")
      .update({
        current_bid: bidAmount,
        // You might also want to update a `last_bidder` or similar field
      })
      .eq("id", itemId);

    if (error) {
      console.error("Error placing bid:", error);
    } else {
      // Optimistically update the UI or refetch the items
      const updatedItems = items.map((item) =>
        item.id === itemId ? { ...item, current_bid: bidAmount } : item
      );
      setItems(updatedItems);
    }
  };

  const handleDataChange = (eventType, newRecord, oldRecord) => {
    switch (eventType) {
      case "INSERT":
        setItems((prevItems) => {
          const updated = [...prevItems, newRecord];
          return updated.sort(sortItemsById);
        });
        break;
      case "UPDATE":
        setItems((prevItems) => {
          const itemIndex = prevItems.findIndex(
            (item) => item.id === newRecord.id
          );
          if (itemIndex !== -1) {
            prevItems[itemIndex] = newRecord;
          }
          return [...prevItems]; // This creates a new array instance, ensuring reactivity
        });
        break;
      case "DELETE":
        setItems((prevItems) =>
          prevItems.filter((item) => item.id !== oldRecord.id)
        );
        break;
      default:
        fetchUpdatedItems(); // fallback to fetching all data in case of unexpected event types
        break;
    }
  };

  return (
    <>
      <>
        <Head>
          <title>Arise Auctions</title>
          <meta
            name="description"
            content="Browse and bid on exclusive items"
          />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main>
          <Header />
          <Typography
            variant="h3"
            align="center"
            gutterBottom
            color={"primary"}
            sx={{
              marginTop: "5vh",
              fontWeight: "bold",

              // background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
              // WebkitBackgroundClip: "text",
              // WebkitTextFillColor: "transparent",
              textShadow: "1px 1px 2px rgba(0, 0, 0, 0.1)",
            }}
          >
            Browse Items
          </Typography>

          <Grid
            container
            justifyContent="center"
            spacing={2}
            sx={{ marginBottom: "2rem" }}
          >
            <Grid item xs={10} sm={8} md={6}>
              <TextField
                fullWidth
                variant="outlined"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for items..."
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>

          {items
            .filter((item) =>
              item.title.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .map((filteredItem) => (
              <AuctionItem
                key={filteredItem.id}
                item={filteredItem}
                onBidSubmit={handleBidSubmit}
              />
            ))}
        </main>
      </>
    </>
  );
}
