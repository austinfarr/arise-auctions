// context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import supabase from "../../lib/supabase";
import { deleteCookie, getCookie, setCookie } from "cookies-next";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const userId = getCookie("userId");
      if (userId) {
        try {
          let { data: userProfile, error } = await supabase
            .from("user_profiles")
            .select("*") // Adjust according to the fields you need
            .eq("id", userId)
            .single();

          if (error) {
            throw error;
          }

          if (userProfile) {
            setUser(userProfile);
            setLoggedIn(true);
            console.log("user", userProfile);
          }
        } catch (error) {
          console.error("Error fetching user:", error);
        }
      }
    };

    fetchUser();
  }, []);

  const login = async (phoneNumber) => {
    const { data, error } = await supabase.auth.signInWithOtp({
      phone: phoneNumber,
    });
    console.log("data", data);
    console.log("error", error);
    if (error) {
      console.error("Login error:", error.message);
      throw error;
    } else {
      // OTP sent successfully. You might want to set some state here if needed.
      return data;
    }
  };

  const verifyOtp = async (phoneNumber, otp) => {
    const { data, error } = await supabase.auth.verifyOtp({
      phone: phoneNumber,
      token: otp,
      type: "sms",
    });
    if (error) {
      console.error("OTP Verification error:", error.message);
      throw error;
    } else {
      try {
        let { data: userProfile, error: userError } = await supabase
          .from("user_profiles")
          .select("*") // Adjust according to the fields you need
          .eq("id", data.user.id)
          .single();

        if (userError) {
          throw userError;
        }

        if (userProfile) {
          setUser(userProfile);
          setLoggedIn(true);
          setCookie("userId", userProfile.id); // You might want to adjust options here
          return userProfile;
        }
      } catch (error) {
        console.error("Error fetching user after OTP verification:", error);
      }

      // setUser(data.user.id);
      // console.log("data.user.id:", data.user.id);
      // setLoggedIn(true);
      // setCookie("userId", data.user.id); // You might want to adjust options here
      // return data.user;
    }
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      setLoggedIn(false);
      deleteCookie("userId");
      setUser(null);
    } else {
      console.error("Error logging out:", error.message);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loggedIn,
        setLoggedIn,
        login,
        logout,
        verifyOtp,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
