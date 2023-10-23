import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import supabase from "../../lib/supabase";
import AuctionItem from "@/components/AuctionItem";
import { useEffect, useState } from "react";
import {
  Box,
  FormControl,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import Link from "next/link";
import Header from "@/components/Header";
import { Search } from "@mui/icons-material";
import { deleteCookie, getCookie, useCookies } from "cookies-next";
import { useAuth } from "@/context/AuthContext";

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
  const { loggedIn, logout, user } = useAuth();

  const [items, setItems] = useState(initialItems);

  const [searchQuery, setSearchQuery] = useState("");

  console.log("user", user);

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

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

    const fetchCategories = async () => {
      let { data: categoriesData, error: categoriesError } = await supabase
        .from("Items")
        .select("categories");

      if (categoriesError) {
        console.error("Error fetching categories:", categoriesError);
      } else {
        const allCategories = categoriesData.flatMap(
          (cat) => cat.categories || []
        );
        const uniqueCategories = [...new Set(allCategories)].filter(Boolean);
        setCategories(uniqueCategories);
      }
    };

    fetchCategories();

    return () => {
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

  const handleDataChange = (eventType, newRecord, oldRecord) => {
    setItems((prevItems) => {
      switch (eventType) {
        case "INSERT":
          return [...prevItems, newRecord].sort(sortItemsById);

        case "UPDATE":
          return prevItems
            .map((item) => (item.id === newRecord.id ? newRecord : item))
            .sort(sortItemsById);

        case "DELETE":
          return prevItems.filter((item) => item.id !== oldRecord.id);

        default:
          // It might not be the best idea to fetch all data again here,
          // as it could lead to performance issues for large datasets.
          // Instead, you might want to log an unexpected event type.
          console.warn("Unexpected event type in handleDataChange:", eventType);
          return prevItems;
      }
    });
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
          <Header hasLogoutOption={true} />
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
              {/* <FormControl variant="outlined" fullWidth sx={{ marginY: 3 }}>
                <InputLabel id="category-select-label">Category</InputLabel>
                <Select
                  labelId="category-select-label"
                  id="category-select"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  label="Category"
                >
                  <MenuItem value="">
                    <em>All</em>
                  </MenuItem>
                  {categories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl> */}
            </Grid>
          </Grid>

          {items
            .filter((item) => {
              // Check if the item's title matches the search query
              const matchesQuery = item.title
                .toLowerCase()
                .includes(searchQuery.toLowerCase());

              // Check if the item's categories include the selected category or if no category is selected
              const matchesCategory = selectedCategory
                ? (item.categories || []).includes(selectedCategory)
                : true;

              return matchesQuery && matchesCategory;
            })
            .map((filteredItem) => (
              <AuctionItem
                key={filteredItem.id}
                item={filteredItem}
                user={user}
                onBidSubmit={handleBidSubmit}
              />
            ))}
        </main>
      </>
    </>
  );
}
