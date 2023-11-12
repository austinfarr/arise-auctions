import Header from "@/components/header/Header";
import { Box, Typography } from "@mui/material";
import supabase from "../../lib/supabase";
import { useState } from "react";
import PurchasedItem from "@/components/purchases/PurchasedItem";
import { useAuth } from "@/context/AuthContext";
import { getCookie } from "cookies-next";
import { useConfigurations } from "@/context/ConfigurationsContext";

function parseCookies(cookieHeader) {
  const list = {};
  if (cookieHeader) {
    cookieHeader.split(";").forEach((cookie) => {
      const parts = cookie.split("=");
      list[parts.shift().trim()] = decodeURI(parts.join("="));
    });
  }
  return list;
}

export async function getServerSideProps(context) {
  // const { user } = useAuth();

  const { req } = context;
  const cookies = req.headers.cookie;

  // Parse the cookies using a server-side compatible method
  const userId = parseCookies(cookies)?.userId;

  // const userId = getCookie("userId");
  console.log("userId", userId);
  // Fetch purchases for the logged-in user
  let { data: purchases, error: purchaseError } = await supabase
    .from("Purchases")
    .select("item_id, purchase_price")
    .eq("user_id", userId);

  if (purchaseError) {
    console.error("Error fetching purchases:", purchaseError);
    return { props: { items: [] } }; // Return empty array on error
  }

  // Fetch item details for each purchased item
  const purchasedItems = await Promise.all(
    purchases.map(async (purchase) => {
      const { data: itemData, error: itemError } = await supabase
        .from("Items")
        .select("*")
        .eq("id", purchase.item_id)
        .single(); // Assuming each item_id corresponds to a single item

      if (itemError) {
        console.error(`Error fetching item ${purchase.item_id}:`, itemError);
        return null;
      }

      // Combine purchase details with item details
      return {
        ...itemData,
        purchase_price: purchase.purchase_price,
      };
    })
  );

  // Filter out any null results from failed item fetches
  const filteredPurchasedItems = purchasedItems.filter((item) => item !== null);
  console.log("filteredPurchasedItems", filteredPurchasedItems);

  return {
    props: {
      purchasedItems: filteredPurchasedItems,
    },
  };
}

export default function PurchasedPage({ purchasedItems: initialItems }) {
  const [items, setItems] = useState(initialItems);

  return (
    <>
      <Header />
      <Box
        sx={{
          // flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "end",
          px: 2,
          py: 2,
        }}
      >
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
          Your Purchases
        </Typography>
      </Box>
      {items?.length > 0 &&
        items.map((item) => <PurchasedItem item={item} key={item.title} />)}
    </>
  );
}
