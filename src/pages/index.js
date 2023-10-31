import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import supabase from "../../lib/supabase";
import AuctionItem from "@/components/AuctionItem";
import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Chip,
  FormControl,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Link from "next/link";
import Header from "@/components/header/Header";
import { Search } from "@mui/icons-material";
import { deleteCookie, getCookie, useCookies } from "cookies-next";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/router";
import { useDrawer } from "@/context/DrawerContext";
import { AuctionProvider, useAuction } from "@/context/AuctionContext";

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
  const { openDrawer } = useDrawer();

  const [items, setItems] = useState(initialItems);

  const [searchQuery, setSearchQuery] = useState("");

  // const [userBids, setUserBids] = useState([]);
  const { userBids, setUserBids, handleBidSubmit } = useAuction();

  const [activeFilter, setActiveFilter] = useState("all");

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  const sortItemsById = (a, b) => a.id - b.id;

  useEffect(() => {
    if (user) {
      console.log("in index");
      console.log("user", user);
      console.log("user.id", user.id);
      const fetchUserBids = async () => {
        const { data: userBids, error } = await supabase
          .from("Bids")
          .select("item_id")
          .eq("user_id", user.id);

        if (error) {
          console.error("Error fetching user bids:", error);
        } else {
          setUserBids(userBids.map((bid) => bid.item_id));
        }
      };

      fetchUserBids();
      console.log("userBids", userBids);
    }
  }, [user]);

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
            console.warn(
              "Unexpected event type in handleDataChange:",
              eventType
            );
            return prevItems;
        }
      });
    };

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
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
  }, [categories]);

  const handleChipClick = (filter) => () => {
    setActiveFilter(filter);
    if (filter === "all" || filter === "myBids") {
      setSelectedCategory("");
    } else {
      setSelectedCategory(filter);
    }
  };

  function capitalizeFirstLetter(string) {
    if (!string) return "";
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  return (
    <>
      <AuctionProvider items={items} setItems={setItems}>
        <>
          <Head>
            <title>Arise Auctions</title>
            <meta
              name="description"
              content="Browse and bid on exclusive items"
            />
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1"
            />
            <link rel="icon" href="/favicon.ico" />
          </Head>

          <main style={{ backgroundColor: "#f5f5f5" }}>
            <Header />

            <Grid
              container
              justifyContent="center"
              spacing={2}
              sx={{
                marginBottom: "2rem",
                marginTop: 0.1,
                bgcolor: "#f5f5f5",
              }}
            >
              <Grid item xs={10} sm={8} md={6}>
                <TextField
                  fullWidth
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      height: "100%",
                      borderRadius: 0.5,
                      backgroundColor: "rgb(239, 245, 249)",
                      border: "none",
                      "& fieldset": {
                        border: "none", // Remove border
                      },
                      "&:hover fieldset": {
                        border: "none", // Remove border on hover
                      },
                      "&.Mui-focused fieldset": {
                        border: "none", // Remove border when focused
                      },
                    },
                  }}
                  variant="outlined"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  // placeholder="Search for items..."
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search />
                      </InputAdornment>
                    ),
                    style: { backgroundColor: "#e8e8e8" },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                {/* Make sure to set the item prop correctly */}
                <Box
                  sx={{
                    overflowX: "auto",
                    marginX: 2,
                    scrollbarWidth: "none",
                    "&::-webkit-scrollbar": { display: "none" },
                  }}
                >
                  <Stack
                    direction="row"
                    spacing={1}
                    sx={{ minWidth: "max-content" }}
                  >
                    {[
                      { label: "All", value: "all" },
                      { label: "Your Bids", value: "myBids" },
                      { label: "Sold", value: "sold" },
                      ...categories.map((category) => ({
                        label: capitalizeFirstLetter(category),
                        value: category,
                      })),
                    ].map((chip) => (
                      <Chip
                        key={chip.value}
                        label={chip.label}
                        onClick={handleChipClick(chip.value)}
                        sx={{
                          color: "gray",
                          bgcolor:
                            activeFilter === chip.value
                              ? "#ffeeca"
                              : "secondary.main",
                          "&:hover": {
                            bgcolor:
                              activeFilter === chip.value
                                ? "#ffeeca"
                                : "lighten(secondary.main, 0.2)",
                            // color: "white",
                          },
                        }}
                      />
                    ))}
                  </Stack>
                </Box>
              </Grid>
            </Grid>
            {activeFilter === "myBids" && !loggedIn ? (
              <Grid container justifyContent="center">
                <Grid item>
                  {/* <Link href="/login" passHref> */}
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      openDrawer();
                    }}
                    sx={{ color: "#fff" }}
                  >
                    Login to View Your Bids
                  </Button>
                  {/* </Link> */}
                </Grid>
              </Grid>
            ) : (
              items
                .filter((item) => {
                  // Filtering based on active filter
                  if (activeFilter === "sold") {
                    return item.status === "sold";
                  } else if (activeFilter === "myBids") {
                    return (
                      userBids.includes(item.id) &&
                      (item.status !== "sold" ||
                        (item.status === "sold" &&
                          item.leading_user_id === user.id))
                    );
                  } else if (activeFilter === "all") {
                    return item.status !== "sold";
                  } else {
                    return (
                      item.status !== "sold" &&
                      (item.categories || []).includes(selectedCategory)
                    );
                  }
                })
                .filter((item) => {
                  const matchesQuery = item.title
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase());
                  return matchesQuery;
                })
                .map((filteredItem) => (
                  <AuctionItem
                    key={filteredItem.id}
                    item={filteredItem}
                    user={user}
                    onBidSubmit={handleBidSubmit}
                  />
                ))
            )}
          </main>
        </>
      </AuctionProvider>
    </>
  );
}
