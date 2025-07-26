// react plugin for creating vector maps
import { VectorMap } from "@react-jvectormap/core";
import { worldMill } from "@react-jvectormap/world";

import { useEffect, useRef, useState } from "react";

// Define the component props
interface CountryMapProps {
  mapColor?: string;
}

const CountryMap: React.FC<CountryMapProps> = ({ mapColor }) => {
	const [markers, setMarkers] = useState([]);
	const token = localStorage.getItem("access");
	const mapRef = useRef<any>(null);

	useEffect(() => {
		const fetchMarkers = async () => {
			try {
				const res = await fetch("/api/branches/with_coordinates/",
					{
						headers: {
							Authorization: `Bearer ${token}`,
						},
					}
				);
				const data = await res.json();
				// Add optional custom styling here if needed
				const formatted = data.map((item: any) => ({
					...item,
					style: {
						fill: "#465FFF",
						borderWidth: 1,
						borderColor: "white",
						stroke: "#383f47",
					},
				}));
				setMarkers(formatted);
				setTimeout(() => {
					zoomToFitMarkers(formatted);
				}, 300);
			} catch (err) {
				console.error("Failed to fetch branch markers", err);
			}
		};

		fetchMarkers();
	}, []);

	const zoomToFitMarkers = (markerData: any[]) => {
		if (!mapRef.current || markerData.length === 0) return;

		const latitudes = markerData.map((m) => m.latLng[0]);
		const longitudes = markerData.map((m) => m.latLng[1]);

		const minLat = Math.min(...latitudes);
		const maxLat = Math.max(...latitudes);
		const minLng = Math.min(...longitudes);
		const maxLng = Math.max(...longitudes);

		mapRef.current.setFocus({
			region: null,
			scale: 3,
			animate: true,
			lat: (minLat + maxLat) / 2,
			lng: (minLng + maxLng) / 2,
		});
	};
	
	return (
		<VectorMap
			mapRef={mapRef}
			map={worldMill}
			backgroundColor="transparent"
			markerStyle={{
				initial: {
					fill: "#465FFF",
					r: 4, // Custom radius for markers
				} as any, // Type assertion to bypass strict CSS property checks
			}}
			markersSelectable={true}
			markers={markers}
			zoomOnScroll={true}
			zoomMax={12}
			zoomMin={1}
			zoomAnimate={true}
			zoomStep={1.5}
			regionStyle={{
				initial: {
					fill: mapColor || "#D0D5DD",
					fillOpacity: 1,
					fontFamily: "Outfit",
					stroke: "none",
					strokeWidth: 0,
					strokeOpacity: 0,
				},
				hover: {
					fillOpacity: 0.7,
					cursor: "pointer",
					fill: "#465fff",
					stroke: "none",
				},
				selected: {
					fill: "#465FFF",
				},
				selectedHover: {},
			}}
			regionLabelStyle={{
				initial: {
					fill: "#35373e",
					fontWeight: 500,
					fontSize: "13px",
					stroke: "none",
				},
				hover: {},
				selected: {},
				selectedHover: {},
			}}
		/>
	);
};

export default CountryMap;
