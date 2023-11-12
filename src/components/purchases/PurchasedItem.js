import { PlayArrow, SkipNext, SkipPrevious } from "@mui/icons-material";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import Image from "next/image";

function PurchasedItem({ item }) {
  return (
    <Card
      elevation={0}
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <CardContent sx={{ flex: "1 0 auto" }}>
        <Typography component="div" variant="h5">
          {item.title}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" component="div">
          Purchased for ${item.purchase_price.toLocaleString()}
        </Typography>
      </CardContent>
      <Box sx={{ display: "flex", alignItems: "center", p: 1 }}>
        <CardMedia
          component="img"
          sx={{
            width: 130, // Set fixed width here
            height: 100,
            borderRadius: "5%", // Adjust the border radius as needed
          }}
          image={item.image?.images[0]}
          alt={item.title}
        />
      </Box>
    </Card>
  );
}

export default PurchasedItem;
