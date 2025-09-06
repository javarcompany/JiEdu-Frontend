import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

type MediaInfoCardProps = {
  icon: LucideIcon;
  iconColor?: string;
  glowColor?: string;
  borderColor?: string;
  title: string;
  filesCount: number;
  usagePercent: number;
  fileSize: string;
};

export default function MediaInfoCard({
  icon: Icon, iconColor = "text-blue-500",
  glowColor = "shadow-blue-300", borderColor = "border-blue-300", title,
  filesCount, usagePercent, fileSize, }: MediaInfoCardProps) 
{
    return (
        <motion.div
            initial={{ opacity: 0, y: -70, x: -70 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            whileHover={{ scale: 1.05 }}
            className={`flex items-center justify-between p-4 rounded-2xl shadow-md border-b-1 ${borderColor}`}
        >
            {/* Icon with glow */}
            <div className={`p-3 rounded-md shadow-lg ${glowColor}`}>
                <Icon className={`w-8 h-8 ${iconColor}`} />
            </div>

            <div className="flex-1 ml-4">
                {/* Top: Title + File Count */}
                <div className="flex justify-between text-gray-800 dark:text-white font-medium">
                    <span>{title}</span>
                    <span className="text-gray-500">{filesCount} Files</span>
                </div>

                {/* Bottom: % Used + File Size */}
                <div className="flex justify-between text-sm text-gray-500 mt-1">
                    <span>{usagePercent}% used</span>
                    <span>{fileSize}</span>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div
                        className="h-2 rounded-full bg-blue-500"
                        style={{ width: `${usagePercent}%` }}
                    />
                </div>
            </div>
        </motion.div>
    );
}
