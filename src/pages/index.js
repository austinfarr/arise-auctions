import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import supabase from "../../lib/supabase";
import AuctionItem from "@/components/AuctionItem";
import { useEffect, useState } from "react";
import { Typography } from "@mui/material";

export async function getServerSideProps(context) {
  let { data: items, error } = await supabase.from("Items").select("*");

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
      // supabase.removeSubscription(subscription);
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

  const sortItemsById = (a, b) => a.id - b.id;

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
          const updated = prevItems.map((item) =>
            item.id === newRecord.id ? newRecord : item
          );
          return updated.sort(sortItemsById);
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
          {items.map((item) => (
            <AuctionItem
              key={item.id}
              item={item}
              onBidSubmit={handleBidSubmit}
            />
          ))}
        </main>
      </>
    </>
  );
}
