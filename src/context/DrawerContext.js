import React, { createContext, useContext, useState } from "react";

const DrawerContext = createContext();

export const useDrawer = () => {
  return useContext(DrawerContext);
};

export const DrawerProvider = ({ children }) => {
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [isSideDrawerOpen, setIsSideDrawerOpen] = useState(false);

  const openDrawer = () => setDrawerOpen(true);
  const closeDrawer = () => setDrawerOpen(false);
  const openSideDrawer = () => setIsSideDrawerOpen(true);
  const closeSideDrawer = () => setIsSideDrawerOpen(false);

  return (
    <DrawerContext.Provider
      value={{
        isDrawerOpen,
        openDrawer,
        openSideDrawer,
        closeDrawer,
        closeSideDrawer,
        isSideDrawerOpen,
        setIsSideDrawerOpen,
      }}
    >
      {children}
    </DrawerContext.Provider>
  );
};
