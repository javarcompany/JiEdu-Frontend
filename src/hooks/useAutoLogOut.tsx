// useAutoLogout.js
import { useEffect, useRef } from "react";
import {jwtDecode} from "jwt-decode"; // ✅ Use default import

export default function useAutoLogout({ token, onLogout }: {token: any, onLogout: ()=> void}) {
    const logoutCalled = useRef(false); // Prevent multiple logouts
    const timeoutIdRef = useRef(null); // ✅ Store timeout ID

    useEffect(() => {
        if (!token) return; // No token, nothing to check
 
        // Clear any previous timer
        if (timeoutIdRef.current) {
            clearTimeout(timeoutIdRef.current);
        }

        try {
            const decoded = jwtDecode(token);
            if (!decoded.exp) return; // No expiry in token

            const expiryTime = decoded.exp * 1000; // exp is in seconds
            const now = Date.now();
            const delay = expiryTime - now;

            if (delay <= 0) {
                // Already expired
                console.log("Delay: ", delay)
                if (!logoutCalled.current) {
                    logoutCalled.current = true;
                    onLogout();
                }
                return;
            }

            timeoutIdRef.current = setTimeout(() => {
                if (!logoutCalled.current) {
                    logoutCalled.current = true;
                    onLogout();
                }
            }, delay);

        } catch (err) {
            console.error("Invalid token", err);
            if (!logoutCalled.current) {
                logoutCalled.current = true;
                onLogout();
            }
        }

        // Cleanup timer on unmount or token change
        return () => {
            if (timeoutIdRef.current) {
                clearTimeout(timeoutIdRef.current);
            }
        };

    }, [token, onLogout]);
}
