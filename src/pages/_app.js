// import "@/styles/globals.css";
import { ThemeProvider } from "@mui/material/styles";
import theme from "@/styles/theme";
import { AuthProvider } from "@/context/AuthContext";
import { DrawerProvider } from "@/context/DrawerContext";
import { AuctionProvider } from "@/context/AuctionContext";
import { PurchaseProvider } from "@/context/PurchaseContext";
import SuccessDrawer from "@/components/SuccessDrawer";
import { ConfigurationsProvider } from "@/context/ConfigurationsContext";

export default function App({ Component, pageProps }) {
  return (
    <DrawerProvider>
      <ConfigurationsProvider>
        <PurchaseProvider>
          <AuthProvider>
            <AuctionProvider>
              <ThemeProvider theme={theme}>
                <SuccessDrawer />
                <Component {...pageProps} />
              </ThemeProvider>
            </AuctionProvider>
          </AuthProvider>
        </PurchaseProvider>
      </ConfigurationsProvider>
    </DrawerProvider>
  );
}
