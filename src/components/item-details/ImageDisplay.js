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
  const renderImageDots = () => {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "8px",
        }}
      >
        {imageUrls.map((_, index) => (
          <IconButton
            key={index}
            size="small"
            onClick={() => setCurrentImageIndex(index)}
            sx={{
              width: currentImageIndex === index ? 12 : 10,
              height: currentImageIndex === index ? 12 : 10,
              margin: "0 4px",
              backgroundColor:
                currentImageIndex === index ? "primary.main" : "#e0e0e0",
              borderRadius: "50%",
              padding: 0,
              "&:hover": {
                backgroundColor:
                  currentImageIndex === index ? "primary.main" : "#aeaeae",
              },
            }}
          />
        ))}
      </Box>
    );
  };

  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  // Minimum distance (in pixels) to be considered as swipe
  const minSwipeDistance = 50;

  // Called when the user starts touching the screen
  const onTouchStart = (e) => {
    setTouchEnd(null); // Reset touch end to null on new touch start
    setTouchStart(e.targetTouches[0].clientX);
  };

  // Called when the user moves their finger on the screen
  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  // Called when the user lifts their finger off the screen
  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isSwipe = Math.abs(distance) > minSwipeDistance;

    if (isSwipe) {
      // Swipe left (next image)
      if (distance > 0) {
        nextImage();
      }
      // Swipe right (previous image)
      else {
        prevImage();
      }
    }
  };

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageUrls, setImageUrls] = useState([]);

  const { loggedIn } = useAuth();

  useEffect(() => {
    if (item && item.image && item.image.images) {
      setImageUrls(item.image.images);
      console.log("item.image.images", item.image.images);
    }
  }, [item]);

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
      <Box sx={{ px: 2 }}>
        <Box
          sx={{
            position: "relative",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: "5%",
            overflow: "hidden",
            height: "250px",
            width: "100%",
            //   width: 400,
            margin: "0 auto",
          }}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {item.image && (
            <>
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
                user.id !== item.leading_user_id && <SoldRibbon />}
              {loggedIn &&
                user.id === item.leading_user_id &&
                item.status !== "sold" && <LeadingBidRibbon />}
            </>
          )}
        </Box>
        {renderImageDots()}
      </Box>
    </>
  );
}

export default ImageDisplay;
