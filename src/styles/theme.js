import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#ff8e44", // Taken from your primary glow; you might adjust this
    },
    secondary: {
      main: "#f5f5f5", // Taken from your primary glow; you might adjust this
    },
    // You can add secondary, error, warning, etc. colors similarly
    background: {
      default: "#f5f5f5", // Background color for light mode
      paper: "#f5f5f5", // Equivalent to your tile start for light mode
    },
    text: {
      primary: "#13294B", // Text color for light mode
    },
    yellowColor: {
      main: "#ffeeca", // Taken from your primary glow; you might adjust this
    },
  },
  typography: {
    fontFamily: ["Poppins", "sans-serif"].join(","),
    h1: {
      fontWeight: 700, // Bold
      color: "#13294B",
    },
    h2: {
      fontWeight: 600, // Semi-bold
      color: "#13294B",
    },
    h3: {
      fontWeight: 500, // Medium
      color: "#13294B",
    },
    h4: {
      fontWeight: 400, // Regular
      color: "#13294B",
    },
    h5: {
      fontWeight: 400, // Regular
      color: "#13294B",
    },
    h6: {
      fontWeight: 400, // Regular
      color: "#13294B",
    },
    body1: {
      fontWeight: 300, // Light
      color: "#13294B",
    },
  },
  // typography: {
  //   fontFamily:
  //     "ui-monospace, Menlo, Monaco, 'Cascadia Mono', 'Segoe UI Mono', 'Roboto Mono', 'Oxygen Mono', 'Ubuntu Monospace', 'Source Code Pro', 'Fira Mono', 'Droid Sans Mono', 'Courier New', monospace",
  // },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCssBaseline: {
      // This replaces the global styles for html, body, etc.
      styleOverrides: {
        html: {
          boxSizing: "border-box",
          overflowX: "hidden",
          maxWidth: "100vw",
        },
        body: {
          margin: 0,
          padding: 0,
          color: "rgb(0, 0, 0)", // Text color for light mode
          // background:
          //   "linear-gradient(to bottom, transparent, rgb(255, 255, 255)) rgb(214, 219, 220)",
        },
        a: {
          textDecoration: "none",
          color: "inherit",
        },
        // Add more global styles as needed
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          boxShadow: "none",
          "&:hover": {
            boxShadow: "none",
          },
          "&:active": {
            boxShadow: "none",
          },
          "&:focus": {
            boxShadow: "none",
          },
        },
      },
    },
  },
});

export default theme;

// Dark mode can be integrated similarly. If you want to switch between light and dark modes dynamically, it would involve a bit more logic.
