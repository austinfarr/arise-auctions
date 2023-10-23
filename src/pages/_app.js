// import "@/styles/globals.css";
import { ThemeProvider } from "@mui/material/styles";
import theme from "@/styles/theme";
import { AuthProvider } from "@/context/AuthContext";

export default function App({ Component, pageProps }) {
  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <Component {...pageProps} />
      </ThemeProvider>
    </AuthProvider>
  );
}
