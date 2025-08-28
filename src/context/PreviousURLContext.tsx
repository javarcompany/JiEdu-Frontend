// src/context/PreviousLocationContext.tsx
import React, { createContext, useContext, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";

const PreviousLocationContext = createContext<{ previousUrl: string | null }>({
  previousUrl: null,
});

export const PreviousLocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const previousUrl = useRef<string | null>(null);
  const currentUrl = useRef<string>(location.pathname);

  useEffect(() => {
    previousUrl.current = currentUrl.current;
    currentUrl.current = location.pathname;
  }, [location]);

  return (
    <PreviousLocationContext.Provider value={{ previousUrl: previousUrl.current }}>
      {children}
    </PreviousLocationContext.Provider>
  );
};

export const usePreviousLocation = () => useContext(PreviousLocationContext);
