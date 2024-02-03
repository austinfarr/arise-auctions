import { useAuth } from "@/context/AuthContext";
import { Box, Button, IconButton } from "@mui/material";
import Image from "next/image";
import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import { ArrowBackIosNew, ArrowForwardIos } from "@mui/icons-material";
import LeadingBidRibbonDetails from "../ribbons/LeadingBidRibbonDetails";
import SoldRibbonDetails from "../ribbons/SoldRibbonDetails";
import YouWonRibbonDetails from "../ribbons/YouWonRibbonDetails";

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
              width: currentImageIndex === index ? 10 : 10,
              height: currentImageIndex === index ? 10 : 10,
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

      // if (item && item.image && Array.isArray(item.image.images)) {
      //   // Map over the nested arrays to extract the first element (URL) from each
      //   const urls = item.image.images.map((imageArray) => imageArray[0]);
      //   setImageUrls(urls);
      //   console.log("Updated item.image.images", urls);
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
            width: "100%", // Use the full width of the parent
            height: "300px", // This element will have a height of 0
            // paddingTop: "56.25%", // This creates a 16:9 aspect ratio box
            position: "relative",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: "5%",
            overflow: "hidden",
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
                  style={{ objectFit: "contain" }}
                />
              )}
              {loggedIn &&
                (item.status === "sold" || item.status === "auction ended") &&
                user.id === item.leading_user_id && <YouWonRibbonDetails />}
              {loggedIn &&
                (item.status === "sold" || item.status === "auction ended") &&
                user.id !== item.leading_user_id && <SoldRibbonDetails />}
              {loggedIn &&
                user.id === item.leading_user_id &&
                item.status !== "sold" &&
                item.status !== "auction ended" && <LeadingBidRibbonDetails />}
            </>
          )}
        </Box>
        {imageUrls.length > 1 && renderImageDots()}
      </Box>
    </>
  );
}

export default ImageDisplay;
