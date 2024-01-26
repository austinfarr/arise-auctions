import { useConfigurations } from "@/context/ConfigurationsContext";
import { Box, Typography, ImageList, ImageListItem } from "@mui/material";
import Image from "next/image";

function Footer() {
  const configurations = useConfigurations();

  let sponsorImages = [];
  if (!configurations["sponsor_images"]) return null;
  else {
    try {
      sponsorImages = JSON.parse(configurations["sponsor_images"]);
      console.log("sponsorImages", sponsorImages);
    } catch (error) {
      console.log("sponsorImages", sponsorImages);
      console.error("Error parsing sponsor images", error);
    }
  }

  return (
    <>
      <Box
        sx={{
          backgroundColor: "#f5f5f5",
          py: 4,
        }}
      />
      <Box
        sx={{
          backgroundColor: "#ebebeb",
          py: 4,
          px: 2,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <Typography variant="h6" sx={{ textAlign: "center", mb: 2 }}>
          THANKS TO OUR SPONSORS:
        </Typography>
        {/* <ImageList sx={{ width: "100%", height: "auto" }} cols={3} gap={24}> */}
        {sponsorImages.map((imgUrl, index) => (
          //   <ImageListItem key={index}>
          <Box key={index} py={1}>
            <Image
              src={imgUrl}
              alt={`Sponsor ${index + 1}`}
              layout="responsive"
              width={1} // Aspect ratio width (1 part width)
              height={1} // Aspect ratio height (1 part height)
              objectFit="contain" // Keeps the aspect ratio, but fits within the element bounds
            />
          </Box>
          //   </ImageListItem>
        ))}
        {/* </ImageList> */}
      </Box>
    </>
  );
}

export default Footer;
