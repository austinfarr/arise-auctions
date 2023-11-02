import React from "react";
import { Box, Stack, Chip } from "@mui/material";

const CategoriesFilter = ({ categories, activeFilter, onFilterChange }) => {
  function capitalizeFirstLetter(string) {
    if (!string) return "";
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  const handleChipClick = (filter) => () => {
    onFilterChange(filter);
  };

  return (
    <Box
      sx={{
        overflowX: "auto",
        marginX: 2,
        scrollbarWidth: "none",
        "&::-webkit-scrollbar": { display: "none" },
      }}
    >
      <Stack direction="row" spacing={1} sx={{ minWidth: "max-content" }}>
        {[
          { label: "All", value: "all" },
          { label: "Your Bids", value: "myBids" },
          { label: "Sold", value: "sold" },
          ...categories.map((category) => ({
            label: capitalizeFirstLetter(category),
            value: category,
          })),
        ].map((chip) => (
          <Chip
            key={chip.value}
            label={chip.label}
            onClick={handleChipClick(chip.value)}
            sx={{
              color: "gray",
              bgcolor:
                activeFilter === chip.value ? "#ffeeca" : "secondary.main",
              "&:hover": {
                bgcolor:
                  activeFilter === chip.value
                    ? "#ffeeca"
                    : "lighten(secondary.main, 0.2)",
              },
            }}
          />
        ))}
      </Stack>
    </Box>
  );
};

export default CategoriesFilter;
