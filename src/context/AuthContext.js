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
    let data, error;

    if (phoneNumber === "1111111111") {
      ({ data, error } = await supabase.auth.signInWithOtp({
        phone: phoneNumber,
      }));
    } else {
      const { data, error } = await supabase.auth.signInWithOtp({
        phone: `+1${phoneNumber}`,
      });
    }
    console.log("loggin in user. data:", data);
    if (error) {
      console.error("Login error:", error.message);
      throw error;
    } else {
      // OTP sent successfully. You might want to set some state here if needed.
      return data;
    }
  };

  const signUp = async (phoneNumber, fullName) => {
    const { data, error } = await supabase.auth.signInWithOtp({
      phone: `+1${phoneNumber}`,
    });
    console.log("Signing up user:", data);
    console.log("error", error);
    if (error) {
      console.error("Login error:", error.message);
      throw error;
    } else {
      // OTP sent successfully. You might want to set some state here if needed.
      return data;
    }
  };

  const verifyOtpExistingUser = async (phoneNumber, otp) => {
    console.log("Verifying existing user");
    console.log("phoneNumber", phoneNumber);
    let data, error;

    if (phoneNumber === "4702178238" || phoneNumber === "1111111111") {
      ({ data, error } = await supabase.auth.verifyOtp({
        phone: phoneNumber,
        token: otp,
        type: "sms",
      }));
    } else {
      ({ data, error } = await supabase.auth.verifyOtp({
        phone: `+1${phoneNumber}`,
        token: otp,
        type: "sms",
      }));
    }

    console.log("data", data);

    const userProfile = await supabase
      .from("user_profiles")
      .select("*") // Adjust according to the fields you need
      .eq("id", data.user.id)
      .single();

    if (userProfile.error) {
      console.error("Error fetching user profile:", userProfile.error);
      throw userProfile.error;
    }

    console.log("user profile", userProfile);

    if (error) {
      console.error("OTP Verification error:", error.message);
      throw error;
    } else {
      console.log("data", data);
      setUser(userProfile.data || null);
      console.log("data.user.id:", data.user.id);
      setLoggedIn(true);
      setCookie("userId", data.user.id); // You might want to adjust options here
      return data.user;
    }
  };

  const createUserProfile = async (userId, phoneNumber, fullName) => {
    const { data, error } = await supabase
      .from("user_profiles")
      .insert([{ id: userId, phone: phoneNumber, full_name: fullName }]);

    if (error) {
      console.error("Error creating user profile:", error);
      throw error;
    }
  };

  const verifyOtpNewUser = async (phoneNumber, fullName, otp) => {
    const { data, error } = await supabase.auth.verifyOtp({
      phone: `+1${phoneNumber}`,
      token: otp,
      type: "sms",
    });
    console.log("data", data);
    console.log("error", error);

    const makeNewUserProfile = await createUserProfile(
      data.user.id,
      phoneNumber,
      fullName
    );

    console.log("userProfile", makeNewUserProfile);

    const userProfile = await supabase
      .from("user_profiles")
      .select("*") // Adjust according to the fields you need
      .eq("id", data.user.id)
      .single();

    console.log("userProfile", userProfile);

    if (userProfile.error) {
      console.error("Error fetching user profile:", userProfile.error);
      throw userProfile.error;
    }

    console.log("user profile", userProfile);

    if (error) {
      console.error("OTP Verification error:", error.message);
      throw error;
    } else {
      console.log("data", data);
      setUser(userProfile.data || null);
      console.log("data.user.id:", data.user.id);
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
        verifyOtpExistingUser,
        verifyOtpNewUser,
        signUp,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
