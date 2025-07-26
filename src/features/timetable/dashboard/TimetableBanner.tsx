import { useEffect, useState } from "react";

interface Props {
  targetRef: React.RefObject<HTMLDivElement | null>;
  backgroundImageUrl?: string;
  title?: string;
  subtitle?: string;
  onActionClick?: () => void;
  actionLabel?: string;
}

export default function TimetableBanner({
  targetRef,
  backgroundImageUrl,
  title = "Institution Timetable",
  subtitle = "Review your scheduled classes across all departments.",
  onActionClick,
  actionLabel = "Manage Timetable",
}: Props) {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!targetRef.current) return;

    const updateSize = () => {
      const { offsetWidth, offsetHeight } = targetRef.current!;
      setDimensions({ width: offsetWidth, height: offsetHeight });
    };

    updateSize();

    const observer = new ResizeObserver(() => {
      updateSize();
    });

    observer.observe(targetRef.current);

    return () => observer.disconnect();
  }, [targetRef]);

  return (
    <div
      style={{
        height: `${dimensions.height}px`,
        backgroundImage: `url(${backgroundImageUrl || "/images/banners/fallback-banner.jpg"})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      className="relative rounded-2xl overflow-hidden shadow-md transition-all duration-300"
    >
      {/* Localized Overlay Box with Blur */}
      <div className="absolute top-4 left-4 md:top-6 md:left-6 bg-black/40 backdrop-blur-md rounded-xl p-4 max-w-xs md:max-w-sm">
        <h2 className="text-base md:text-xl font-semibold text-white">{title}</h2>
        <p className="text-xs md:text-sm text-gray-200 mt-1">{subtitle}</p>

        {onActionClick && (
          <button
            onClick={onActionClick}
            className="mt-3 px-4 py-1.5 text-xs md:text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
          >
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  );
}
