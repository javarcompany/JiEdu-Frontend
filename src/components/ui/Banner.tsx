import { FanIcon, FileIcon } from "lucide-react";
import React, { ReactNode, useEffect, useState } from "react";
                                                   
interface ImageBannerBoxProps {
	width?: number | string;
	height?: number | string;
	backgroundImageUrl?: string;
	title?: string;
	subtitle?: string;
	action1Label?: string;
	action2Label?: string;
	onAction1Click?: () => void;
	onAction2Click?: () => void;
	className?: string;
	startIcon1?: ReactNode;
	startIcon2?: ReactNode;
}

const ImageBannerBox: React.FC<ImageBannerBoxProps> = ({
	width = "100%",
	height = 200,
	backgroundImageUrl = "/images/banners/fallback-banner.jpg",
	title = "Default Banner Title",
	subtitle = "This is a customizable banner component.",
	action1Label = "Click Here",
	action2Label = "Learn More",
	onAction1Click,
	onAction2Click,
	className = "",
	startIcon1 = <FanIcon />,
	startIcon2 = <FileIcon />
}) => {
	const [isVisible, setIsVisible] = useState(false);
	

	useEffect(() => {
		// Trigger animation on mount
		const timer = setTimeout(() => setIsVisible(true), 100);

		return () => clearTimeout(timer);

	}, []);

	return (
		<div
			style={{
				width: typeof width === "number" ? `${width}px` : width,
				height: typeof height === "number" ? `${height}px` : height,
				backgroundImage: `url(${backgroundImageUrl})`,
				backgroundSize: "cover",
				backgroundPosition: "center",
			}}
			className={`relative mb-4 rounded-2xl overflow-hidden shadow-md transition-all duration-300 ease-out transform 
			${isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-10"} ${className}`}
		>
			<div className="absolute top-4 left-4 md:top-6 md:left-6 bg-black/40 backdrop-blur-md rounded-xl p-4 max-w-xs md:max-w-sm">
			<h2 className="text-base md:text-xl font-semibold text-white">{title}</h2>
			<p className="text-xs md:text-sm text-gray-200 mt-1">{subtitle}</p>

			{onAction1Click && (
				<button
				onClick={onAction1Click} 
				className="mt-3 inline-flex  items-center justify-center gap-3 px-4 py-1.5 text-xs md:text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
				>
					{startIcon1 && <span className="flex items-center">{startIcon1}</span>}
					{action1Label}
				</button>
			)}
			
			{onAction2Click && (
				<button
					onClick={onAction2Click}
					className="mt-3 inline-flex  items-center justify-center gap-3 px-4 ml-2 py-1.5 text-xs md:text-sm font-medium bg-yellow-500 hover:bg-yellow-300 text-white rounded-lg"
				>
					{startIcon2 && <span className="flex items-center">{startIcon2}</span>}
					{action2Label}
				</button>
			)}
			</div>
		</div>
	);
};

export default ImageBannerBox;
