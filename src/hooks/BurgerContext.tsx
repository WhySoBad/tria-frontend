import { NextPage } from "next";
import React, { useState } from "react";

interface BurgerContext {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const defaultValue: BurgerContext = {
  open: true,
  setOpen: () => {},
};

export const BurgerContext = React.createContext<BurgerContext>(defaultValue);

export const BurgerProvider: NextPage = ({ children }): JSX.Element => {
  const [open, setOpen] = useState<boolean>();

  return <BurgerContext.Provider value={{ open: open, setOpen: setOpen }}>{children}</BurgerContext.Provider>;
};

export const useBurger = () => {
  const context = React.useContext(BurgerContext);

  if (context === undefined) {
    throw new Error("useBurger must be used within a BurgerProvider");
  }
  return context;
};
