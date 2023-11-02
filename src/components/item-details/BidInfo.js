import { Box, Typography } from "@mui/material";
import Countdown from "react-countdown";

function BidInfo({ item }) {
  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center", // This ensures vertical centering
          justifyContent: "space-between",
          paddingY: 1, // Removes vertical padding
          // marginY: 2,
        }}
      >
        <Box sx={{ marginX: 2 }}>
          <Typography variant="h6" component="div" sx={{ fontWeight: "600" }}>
            {item.title}
          </Typography>
          {item.item_timer_ends && (
            <Countdown
              date={new Date(item.item_timer_ends)}
              renderer={({ days, hours, minutes, seconds, completed }) => {
                if (completed) {
                  // Auction has ended
                  return <Typography variant="h6">Auction Ended</Typography>;
                } else {
                  // Countdown is still going
                  return (
                    <Typography variant="body1" sx={{ color: "#ff7675" }}>
                      {days}:{hours}:{minutes}:{seconds} left!
                    </Typography>
                  );
                }
              }}
              onComplete={() => {
                // Do something when the auction ends
                console.log("Auction ended!");
              }}
            />
          )}
        </Box>

        <Box textAlign="right" sx={{ marginX: 2 }}>
          <Typography sx={{ fontWeight: "600", fontSize: 24 }}>
            ${item.current_bid.toLocaleString()}
          </Typography>
          <Typography variant="body2">Current bid</Typography>
        </Box>
      </Box>
    </>
  );
}

export default BidInfo;
