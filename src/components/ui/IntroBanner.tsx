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
  videoUrl?: string; // mp4 or YouTube
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
  startIcon2 = <FileIcon />,
  videoUrl
}) => {
    const [isVisible, setIsVisible] = useState(false);
    const [videoError, setVideoError] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), 100);
        return () => clearTimeout(timer);
    }, []);

    const isYouTube = videoUrl?.includes("youtube.com") || videoUrl?.includes("youtu.be");

    const getYouTubeEmbed = (url: string) => {
        const videoIdMatch = url.match(/(?:youtube\.com.*v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
        if (videoIdMatch && videoIdMatch[1]) {
            return `https://www.youtube.com/embed/${videoIdMatch[1]}?autoplay=1&mute=1&loop=1&playlist=${videoIdMatch[1]}`;
        }
        return null;
    };

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
            <div className="absolute inset-0 bg-black/40" /> {/* overlay for readability */}

            <div className="absolute inset-0 flex w-full items-center justify-between p-2">
                {/* Left content */}
                <div className="flex-shrink-0 w-auto p-4 md:p-6 bg-black/30 backdrop-blur-sm border-b border-yellow-500 rounded-xl m-4"  style={{ maxWidth: "50%" }}>
                    <h1 className="text-lg md:text-3xl font-semibold text-white">{title}</h1>
                    <p className="text-xs md:text-sm text-gray-200 mt-1">{subtitle}</p>

                    {onAction1Click && (
                    <button
                        onClick={onAction1Click}
                        className="mt-3 inline-flex items-center justify-center gap-3 px-4 py-1.5 text-xs md:text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                    >
                        {startIcon1 && <span className="flex items-center">{startIcon1}</span>}
                        {action1Label}
                    </button>
                    )}

                    {onAction2Click && (
                    <button
                        onClick={onAction2Click}
                        className="mt-3 inline-flex items-center justify-center gap-3 px-4 ml-2 py-1.5 text-xs md:text-sm font-medium bg-yellow-500 hover:bg-yellow-300 text-white rounded-lg"
                    >
                        {startIcon2 && <span className="flex items-center">{startIcon2}</span>}
                        {action2Label}
                    </button>
                    )}
                </div>

                {/* Right: Video above background */}
                {videoUrl && !videoError && (
                    <div className="ml-auto h-full max-h-full flex items-center">
                        {isYouTube ? (
                            getYouTubeEmbed(videoUrl) ? (
                                <iframe
                                src={getYouTubeEmbed(videoUrl)!}
                                className="h-full w-auto max-h-full max-w-full rounded-xl shadow-md"
                                allow="autoplay; encrypted-media"
                                allowFullScreen
                                />
                            ) : null
                            ) : (
                            <video
                                src={videoUrl}
                                className="h-full w-auto max-h-full max-w-full object-contain rounded-xl shadow-md"
                                autoPlay
                                muted
                                loop
                                playsInline
                                onError={() => setVideoError(true)}
                            />
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ImageBannerBox;
