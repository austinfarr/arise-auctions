import { Search } from "@mui/icons-material";
import { InputAdornment, TextField } from "@mui/material";

function SearchBar({ searchQuery, onSearchChange }) {
  return (
    <TextField
      fullWidth
      sx={{
        "& .MuiOutlinedInput-root": {
          height: "100%",
          borderRadius: 0.5,
          backgroundColor: "rgb(239, 245, 249)",
          border: "none",
          "& fieldset": {
            border: "none", // Remove border
          },
          "&:hover fieldset": {
            border: "none", // Remove border on hover
          },
          "&.Mui-focused fieldset": {
            border: "none", // Remove border when focused
          },
        },
      }}
      variant="outlined"
      value={searchQuery}
      onChange={(e) => onSearchChange(e.target.value)}
      // placeholder="Search for items..."
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Search />
          </InputAdornment>
        ),
        style: { backgroundColor: "#e8e8e8" },
      }}
    />
  );
}

export default SearchBar;
