import "./index.css";
import "swiper/swiper-bundle.css";
import "flatpickr/dist/flatpickr.css";
import App from "./App";
import { AppWrapper } from "./components/common/PageMeta";
import { ThemeProvider } from "./context/ThemeContext";

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { UserProvider } from "./context/AuthContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<BrowserRouter>
			<ThemeProvider>
				<AppWrapper>
					<UserProvider>
						<App />
					</UserProvider>
				</AppWrapper>
			</ThemeProvider>
		</BrowserRouter>
	</React.StrictMode>
);
