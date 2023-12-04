import { Drawer, Box, Typography, Button } from "@mui/material";
import { usePurchase } from "@/context/PurchaseContext";
import Link from "next/link";
import { useRouter } from "next/router";
import Image from "next/image";
import { useDrawer } from "@/context/DrawerContext";
import { useEffect, useState } from "react";
const BidSuccessDrawer = () => {
  const { showBidSuccessMessage, hideBidSuccessMessage, bidSuccess } =
    usePurchase();

  const router = useRouter();

  return (
    <>
      <Drawer
        anchor="bottom"
        open={bidSuccess}
        onClose={() => {
          hideSuccessMessage();
        }}
        sx={{
          height: "60%",
          display: "flex",
          flexDirection: "column",
          "& .MuiPaper-root": {
            borderTopLeftRadius: 32,
            borderTopRightRadius: 32,
            height: "60%",
            background: "#fff",
          },
        }}
      >
        <Box
          p={3}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            pt: 12,
          }}
        >
          <Typography
            variant="h5"
            sx={{ fontWeight: 600, fontSize: 28, textAlign: "center" }}
          >
            Your Bid Was Received!
          </Typography>

          <Typography
            sx={{
              textAlign: "center",
              color: "#13294B",
              mt: 2,
              mb: 5,
              px: 4,
            }}
          >
            Hurray! View your bids to see if you are winning or losing! Good
            luck!
          </Typography>

          <Button
            onClick={hideBidSuccessMessage}
            sx={{
              //   margin: "0 auto",
              textDecoration: "underline",
              textDecorationThickness: "2px", // Adjust thickness of the underline
              textUnderlineOffset: "4px",
            }}
          >
            Close
          </Button>
        </Box>
      </Drawer>
    </>
  );
};

export default BidSuccessDrawer;
