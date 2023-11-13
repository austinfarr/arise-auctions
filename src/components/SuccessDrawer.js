import { Drawer, Box, Typography, Button } from "@mui/material";
import { usePurchase } from "@/context/PurchaseContext";
import Link from "next/link";
import { useRouter } from "next/router";
import Image from "next/image";
import { useDrawer } from "@/context/DrawerContext";
import Confetti from "react-confetti";
import { useEffect, useState } from "react";
const SuccessDrawer = () => {
  const { purchaseSuccess, boughtItem, hideSuccessMessage } = usePurchase();

  const router = useRouter();

  const [confettiActive, setConfettiActive] = useState(false);

  useEffect(() => {
    // Activate the confetti when purchaseSuccess becomes true
    if (purchaseSuccess) {
      setConfettiActive(true);
    }
  }, [purchaseSuccess]);

  const handleGoToPurchases = () => {
    hideSuccessMessage();
    router.push("/purchased");
  };

  console.log("boughtItem", boughtItem);

  return (
    <>
      <Drawer
        anchor="bottom"
        open={purchaseSuccess}
        onClose={() => {
          hideSuccessMessage();
          setConfettiActive(false); // Stop the confetti when drawer closes
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
        {confettiActive && <Confetti />}
        <Box
          p={3}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100%", // Take up all available space in the drawer
          }}
        >
          <Box
            sx={{
              position: "relative",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: "5%",
              overflow: "hidden",
              height: "150px",
              width: "200px",
              //   width: 400,
              margin: "0 auto",
              mb: 3,
            }}
          >
            <Image
              src={boughtItem?.image?.images[0]}
              // width={200}
              // height={200}
              alt="item image"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              style={{ objectFit: "cover" }}
            />
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 600, fontSize: 28 }}>
            Purchase Successful!
          </Typography>
          <Typography>{`You purchased ${
            boughtItem?.title
          } for $${boughtItem?.buy_now_price.toLocaleString()}.`}</Typography>

          <Typography
            onClick={handleGoToPurchases}
            sx={{
              textDecoration: "underline",
              textDecorationThickness: "1px", // Adjust thickness of the underline
              textUnderlineOffset: "4px",
              cursor: "pointer",
              color: "#13294B",
              mb: 5,
            }}
          >
            View your purchases here.
          </Typography>

          <Button
            onClick={hideSuccessMessage}
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

export default SuccessDrawer;
