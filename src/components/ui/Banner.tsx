import { FanIcon } from "lucide-react";
import React, { ReactNode, useEffect, useState } from "react";
                                                   
interface ImageBannerBoxProps {
	width?: number | string;
	height?: number | string;
	backgroundImageUrl?: string;
	title?: string;
	subtitle?: string;
	actionLabel?: string;
	onActionClick?: () => void;
	className?: string;
	startIcon?: ReactNode;
}

const ImageBannerBox: React.FC<ImageBannerBoxProps> = ({
	width = "100%",
	height = 200,
	backgroundImageUrl = "/images/banners/fallback-banner.jpg",
	title = "Default Banner Title",
	subtitle = "This is a customizable banner component.",
	actionLabel = "Click Here",
	onActionClick,
	className = "",
	startIcon = <FanIcon />
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

			{onActionClick && (
				<button
				onClick={onActionClick} 
				className="mt-3 inline-flex  items-center justify-center gap-3 px-4 py-1.5 text-xs md:text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
				>
					{startIcon && <span className="flex items-center">{startIcon}</span>}
					{actionLabel}
				</button>
			)}
			</div>
		</div>
	);
};

export default ImageBannerBox;
