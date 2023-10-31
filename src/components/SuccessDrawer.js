import { Drawer, Box, Typography, Button } from "@mui/material";
import { usePurchase } from "@/context/PurchaseContext";
const SuccessDrawer = () => {
  const { purchaseSuccess, boughtItem, hideSuccessMessage } = usePurchase();

  return (
    <Drawer
      anchor="bottom"
      open={purchaseSuccess}
      onClose={hideSuccessMessage}
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
          justifyContent: "center",
          height: "100%", // Take up all available space in the drawer
        }}
      >
        <Typography variant="h4">Purchase Successful!</Typography>
        <Typography>{`You have successfully bought ${
          boughtItem?.title
        } for $${boughtItem?.buy_now_price.toLocaleString()}`}</Typography>
        <br />
        <Typography>View all of your bought items in the Sold tab!</Typography>
        <Button onClick={hideSuccessMessage}>Close</Button>
      </Box>
    </Drawer>
  );
};

export default SuccessDrawer;
