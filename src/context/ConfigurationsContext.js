import React, { createContext, useContext, useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import supabase from "../../lib/supabase";

const ConfigurationsContext = createContext(null);

// Initialize Supabase client outside of the provider

export const ConfigurationsProvider = ({ children }) => {
  const [configurations, setConfigurations] = useState({});

  useEffect(() => {
    const fetchConfigurations = async () => {
      const { data, error } = await supabase.from("Configurations").select("*");

      if (error) {
        console.error("Error fetching configurations:", error);
      } else {
        const configs = data.reduce((acc, { key, value }) => {
          acc[key] = value;
          return acc;
        }, {});
        setConfigurations(configs);
      }
    };

    fetchConfigurations();
  }, []);

  return (
    <ConfigurationsContext.Provider value={configurations}>
      {children}
    </ConfigurationsContext.Provider>
  );
};

export const useConfigurations = () => {
  const context = useContext(ConfigurationsContext);
  if (context === undefined) {
    throw new Error(
      "useConfigurations must be used within a ConfigurationsProvider"
    );
  }
  return context;
};
