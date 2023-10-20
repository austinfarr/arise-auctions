// components/Header.js
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { useRouter } from "next/router";
import Image from "next/image"; // Importing the Image component
import { use, useEffect, useState } from "react";
import supabase from "../../lib/supabase";
import Link from "next/link";
import { deleteCookie, getCookie } from "cookies-next";

const Header = () => {
  const router = useRouter();
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (getCookie("userId") === undefined) {
      setLoggedIn(false);
    } else {
      setLoggedIn(true);
      setUser(getCookie("userId"));
    }
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut(); // Call the signOut method from supabase
    if (!error) {
      setLoggedIn(false); // Update the state
      deleteCookie("userId");
      //   router.push("/login"); // Optionally, redirect to login or home page after logout
    } else {
      console.error("Error logging out:", error.message);
    }
  };

  return (
    <AppBar
      position="sticky"
      color="primary"
      sx={{
        width: "100%",
      }}
    >
      <Toolbar>
        <Box display="flex" alignItems="center" sx={{ flexGrow: 1 }}>
          {/* Using the Image component to load the image */}
          <Link href="/">
            <Image
              src="https://www.ariseafrica.org/wp-content/uploads/2020/04/arise-logo-color.png"
              alt="Arise Auctions Logo"
              width={50} // You can adjust these values for your design needs
              height={50}
              priority={true}

              // objectFit="contain"
            />
          </Link>
          <Typography variant="h6" sx={{ marginLeft: 2, color: "white" }}>
            Arise Auctions
          </Typography>
        </Box>

        <Button
          color="inherit"
          sx={{ color: "#fff" }}
          onClick={() => router.push("/")}
        >
          Browse
        </Button>
        {/* <Button
          color="inherit"
          sx={{ color: "#fff" }}
          onClick={() => router.push("/about")}
        >
          About
        </Button> */}
        {loggedIn && (
          <Button
            color="inherit"
            sx={{ color: "#fff" }}
            onClick={handleLogout} // Call the handleLogout function when this button is clicked
          >
            Logout
          </Button>
        )}
        {!loggedIn && (
          <Button
            color="inherit"
            sx={{ color: "#fff" }}
            onClick={() => router.push("/login")}
          >
            Login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
