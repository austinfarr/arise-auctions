import React, { createContext, useContext, useState } from "react";

const PurchaseContext = createContext();

export const PurchaseProvider = ({ children }) => {
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);
  const [boughtItem, setBoughtItem] = useState(null);

  const [bidSuccess, setBidSuccess] = useState(false);

  const showSuccessMessage = (item) => {
    setBoughtItem(item);
    setPurchaseSuccess(true);
  };

  const hideSuccessMessage = () => {
    setPurchaseSuccess(false);
    setBoughtItem(null);
  };

  const showBidSuccessMessage = (item) => {
    setBidSuccess(true);
  };

  const hideBidSuccessMessage = () => {
    setBidSuccess(false);
  };

  return (
    <PurchaseContext.Provider
      value={{
        purchaseSuccess,
        boughtItem,
        showSuccessMessage,
        hideSuccessMessage,
        bidSuccess,
        showBidSuccessMessage,
        hideBidSuccessMessage,
      }}
    >
      {children}
    </PurchaseContext.Provider>
  );
};

export const usePurchase = () => {
  return useContext(PurchaseContext);
};
