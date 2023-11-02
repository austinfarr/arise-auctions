import { useAuth } from "@/context/AuthContext";
import { Box, Button, IconButton } from "@mui/material";
import Image from "next/image";
import YouWonRibbon from "../ribbons/YouWonRibbon";
import SoldRibbon from "../ribbons/SoldRibbon";
import LeadingBidRibbon from "../ribbons/LeadingBidRibbon";
import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import { ArrowBackIosNew, ArrowForwardIos } from "@mui/icons-material";

function ImageDisplay({ item, user }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageUrls, setImageUrls] = useState([]);

  useEffect(() => {
    if (item && item.image && item.image.images) {
      setImageUrls(item.image.images);
      console.log("item.image.images", item.image.images);
    }
  }, [item]);

  const { loggedIn } = useAuth();

  const [userHasBid, setUserHasBid] = useState(false);

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % imageUrls.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? imageUrls.length - 1 : prevIndex - 1
    );
  };

  return (
    <>
      {/* {imageUrls.length > 1 && (
        <>
          <Button onClick={prevImage}>Previous</Button>
          <Button onClick={nextImage}>Next</Button>
        </>
      )} */}
      <Box
        sx={{
          position: "relative",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: "5%",
          overflow: "hidden",
          height: "250px",
          width: "325px",
          //   width: 400,
          margin: "0 auto",
        }}
      >
        {imageUrls.length > 1 && (
          <>
            <IconButton
              onClick={prevImage}
              sx={{
                position: "absolute",
                left: 16,
                zIndex: 1,
                backgroundColor: "rgba(255, 255, 255, 0.7)", // semi-transparent white
                ":hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.9)",
                },
              }}
              disabled={currentImageIndex === 0}
            >
              <ArrowBackIosNew />
            </IconButton>
            <IconButton
              onClick={nextImage}
              sx={{
                position: "absolute",
                right: 16,
                zIndex: 1,
                backgroundColor: "rgba(255, 255, 255, 0.7)", // semi-transparent white
                ":hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.9)",
                },
              }}
              disabled={currentImageIndex === imageUrls.length - 1}
            >
              <ArrowForwardIos />
            </IconButton>
          </>
        )}
        {item.image && (
          <>
            {/* <IconButton onClick={prevImage} disabled={currentImageIndex === 0}>
              <ArrowBackIosNew />
            </IconButton> */}
            {imageUrls.length > 0 && (
              <Image
                src={imageUrls[currentImageIndex]}
                alt={item.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                style={{ objectFit: "cover" }}
              />
            )}
            {loggedIn &&
              item.status === "sold" &&
              user.id === item.leading_user_id && <YouWonRibbon />}
            {loggedIn &&
              item.status === "sold" &&
              !userHasBid &&
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
