import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
	plugins: [
		react(),
		svgr({
			svgrOptions: {
				icon: true,
				// This will transform your SVG to a React component
				exportType: "named",
				namedExport: "ReactComponent",
			},
		}),
	],

	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
		},
	},

	server: {
		host: "0.0.0.0",
		port: 5173,
		allowedHosts: ["7380dbac6e3a.ngrok-free.app"],
		proxy: {
			'/api': {
				target: 'http://127.0.0.1:8000',
				changeOrigin: true,
				secure: false,
			},
			'/media': {
				target: 'http://127.0.0.1:8000',
				changeOrigin: true,
				secure: false,
			},
			'/static': {
				target: 'http://127.0.0.1:8000',
				changeOrigin: true,
				secure: false,
			},
		},
	},
});
