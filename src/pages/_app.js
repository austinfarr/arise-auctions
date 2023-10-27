// import "@/styles/globals.css";
import { ThemeProvider } from "@mui/material/styles";
import theme from "@/styles/theme";
import { AuthProvider } from "@/context/AuthContext";
import { DrawerProvider } from "@/context/DrawerContext";
import { AuctionProvider } from "@/context/AuctionContext";

export default function App({ Component, pageProps }) {
  return (
    <DrawerProvider>
      <AuthProvider>
        <AuctionProvider>
          <ThemeProvider theme={theme}>
            <Component {...pageProps} />
          </ThemeProvider>
        </AuctionProvider>
      </AuthProvider>
    </DrawerProvider>
  );
}
