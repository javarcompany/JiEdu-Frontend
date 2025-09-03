// src/context/PreviousLocationContext.tsx
import React, { createContext, useContext, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

type PreviousLocationContextType = {
  previousUrl: string | null;
  goBack: () => void;
};

const PreviousLocationContext = createContext<PreviousLocationContextType>({
  previousUrl: null,
  goBack: () => {},
});

export const PreviousLocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const previousUrl = useRef<string | null>(null);
  const currentUrl = useRef<string>(location.pathname);

  useEffect(() => {
    previousUrl.current = currentUrl.current;
    currentUrl.current = location.pathname;
  }, [location]);

   const goBack = () => {
    if (previousUrl.current) {
      navigate(previousUrl.current);
    } else {
      navigate(-1); // fallback to browser history if no stored url
    }
  };

  return (
    <PreviousLocationContext.Provider value={{ previousUrl: previousUrl.current, goBack }}>
      {children}
    </PreviousLocationContext.Provider>
  );
};

export const usePreviousLocation = () => useContext(PreviousLocationContext);
