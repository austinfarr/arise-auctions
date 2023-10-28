import { Button } from "@mui/material";

function BuyNowButton({ item, user, onBuyNowClick }) {
  return (
    <>
      <Button
        variant="contained"
        // color="primary"
        onClick={() => {
          if (onBuyNowClick) {
            onBuyNowClick();
          }
        }}
        disabled={item.status === "sold" && user?.id !== item.leading_user_id}
        sx={{
          color: "#fff",
          width: "100%",
          marginTop: 2,
          borderRadius: 100,
          backgroundColor: "#ffb81d",
        }}
      >
        {item.status === "sold" && item.leading_user_id === user?.id
          ? `You purchased for $${item.final_purchase_price}!`
          : `Buy Now for $${item.buy_now_price}`}
      </Button>
    </>
  );
}

export default BuyNowButton;
