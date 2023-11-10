import Head from "next/head";
import supabase from "../../lib/supabase";
import AuctionItem from "@/components/AuctionItem";
import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Chip,
  Grid,
  InputAdornment,
  Stack,
  TextField,
} from "@mui/material";
import Header from "@/components/header/Header";
import { Search } from "@mui/icons-material";
import { useAuth } from "@/context/AuthContext";
import { useDrawer } from "@/context/DrawerContext";
import { AuctionProvider, useAuction } from "@/context/AuctionContext";
import SearchBar from "@/components/home/SearchBar";
import CategoriesFilter from "@/components/home/CategoriesFilter";
import LoginToViewBids from "@/components/home/LoginToViewBids";
import AuctionItemsList from "@/components/home/AuctionItemsList";

export async function getServerSideProps(context) {
  let { data: items, error } = await supabase.from("Items").select("*");

  // Ensure that 'items' is an array before calling sort
  if (Array.isArray(items)) {
    const sortItemsById = (a, b) => a.id - b.id;
    items.sort(sortItemsById);
  } else {
    // Log an error and return an empty array if items is not an array
    console.error("Items is not an array:", items);
    items = [];
  }

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
            const newItems = [...prevItems];
            const index = newItems.findIndex(
              (item) => sortItemsById(item, newRecord) > 0
            );
            if (index === -1) {
              newItems.push(newRecord);
            } else {
              newItems.splice(index, 0, newRecord);
            }
            return newItems;

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
  }, []);

  const handleChipClick = (filter) => () => {
    setActiveFilter(filter);
    if (filter === "all" || filter === "myBids") {
      setSelectedCategory("");
    } else {
      setSelectedCategory(filter);
    }
  };

  const sortedItems = useMemo(() => {
    return [...items].sort(sortItemsById);
  }, [items]);

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
                <SearchBar
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                />
              </Grid>
              <Grid item xs={12}>
                {/* Make sure to set the item prop correctly */}
                <CategoriesFilter
                  categories={categories}
                  activeFilter={activeFilter}
                  onFilterChange={setActiveFilter}
                />
              </Grid>
            </Grid>
            {activeFilter === "myBids" && !loggedIn ? (
              <LoginToViewBids onLoginClick={() => openDrawer()} />
            ) : (
              <AuctionItemsList
                items={items}
                searchQuery={searchQuery}
                activeFilter={activeFilter}
                userBids={userBids}
                user={user}
              />
            )}
          </main>
        </>
      </AuctionProvider>
    </>
  );
}
