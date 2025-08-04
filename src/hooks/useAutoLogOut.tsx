// useAutoLogout.js
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const useAutoLogout = (timeout = 8 * 60 * 1000) => {
  const navigate = useNavigate();
  const timerId = useRef<ReturnType<typeof setTimeout> | null>(null);

  const logout = () => {
    // Clear tokens
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    // Optionally call backend logout endpoint
    // Redirect
    navigate("/signin");
  };

  const resetTimer = () => {
    if (timerId.current) clearTimeout(timerId.current);
    timerId.current = setTimeout(logout, timeout);
  };

  useEffect(() => {
    const events = ["mousemove", "keydown", "scroll", "click"];
    events.forEach(event => window.addEventListener(event, resetTimer));

    resetTimer(); // Initial call
    console.log(timerId.current)

    return () => {
      events.forEach(event => window.removeEventListener(event, resetTimer));
      if (timerId.current) clearTimeout(timerId.current);
    };
  }, []);
};

export default useAutoLogout;
