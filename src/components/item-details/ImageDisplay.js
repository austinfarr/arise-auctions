import { useAuth } from "@/context/AuthContext";
import { Box } from "@mui/material";
import Image from "next/image";
import YouWonRibbon from "../ribbons/YouWonRibbon";
import SoldRibbon from "../ribbons/SoldRibbon";
import LeadingBidRibbon from "../ribbons/LeadingBidRibbon";

function ImageDisplay({ item, user }) {
  const { loggedIn } = useAuth();

  return (
    <>
      <Box
        sx={{
          position: "relative",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: "5%",
          overflow: "hidden",
          height: "80%",
          width: "90%",
          //   width: 400,
          margin: "0 auto",
        }}
      >
        {item.image && (
          <>
            <Image
              src={item.image}
              alt={item.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              style={{ objectFit: "cover" }}
            />
            {loggedIn &&
              item.status === "sold" &&
              user.id === item.leading_user_id && <YouWonRibbon />}
            {loggedIn &&
              item.status === "sold" &&
              user.id !== item.leading_user_id && <SoldRibbon />}
            {loggedIn &&
              user.id === item.leading_user_id &&
              item.status !== "sold" && <LeadingBidRibbon />}
          </>
        )}
      </Box>
    </>
  );
}

export default ImageDisplay;
