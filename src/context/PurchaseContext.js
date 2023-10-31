import React, { createContext, useContext, useState } from "react";

const PurchaseContext = createContext();

export const PurchaseProvider = ({ children }) => {
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);
  const [boughtItem, setBoughtItem] = useState(null);

  const showSuccessMessage = (item) => {
    setBoughtItem(item);
    setPurchaseSuccess(true);
  };

  const hideSuccessMessage = () => {
    setPurchaseSuccess(false);
    setBoughtItem(null);
  };

  return (
    <PurchaseContext.Provider
      value={{
        purchaseSuccess,
        boughtItem,
        showSuccessMessage,
        hideSuccessMessage,
      }}
    >
      {children}
    </PurchaseContext.Provider>
  );
};

export const usePurchase = () => {
  return useContext(PurchaseContext);
};
