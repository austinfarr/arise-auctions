// context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import supabase from "../../lib/supabase";
import { deleteCookie, getCookie, setCookie } from "cookies-next";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const userId = getCookie("userId");
    if (userId) {
      setUser(userId);
      setLoggedIn(true);
    }
  }, []);

  const login = async (phoneNumber) => {
    const { data, error } = await supabase.auth.signInWithOtp({
      phone: phoneNumber,
    });
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
      setUser(data.user.id);
      setLoggedIn(true);
      setCookie("userId", data.user.id); // You might want to adjust options here
      return data.user;
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
