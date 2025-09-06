import { motion } from "framer-motion";
import { BookOpen, Edit, Star, ToggleLeft, ToggleRight } from "lucide-react";
import { useMemo } from "react";

interface UnitListRowProps {
  image: string;
  title: string;
  rating: number;
  abbreviation: string;
  unitCode: string;
  course: string;
  module: string;
  publishedOn: string | Date;
  updatedOn: string | Date;
  isPublished: boolean;
  onTogglePublish: () => void;
  onEdit?: () => void;
  onRead?: () => void;
}

export default function UnitListRow({
  image,
  title,
  rating,
  abbreviation,
  unitCode,
  course,
  module,
  publishedOn,
  updatedOn,
  isPublished,
  onTogglePublish,
  onEdit,
  onRead,
}: UnitListRowProps) {
  const formatDate = (date: string | Date) => {
    const d = new Date(date);
    return d.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const renderStars = useMemo(() => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    return Array.from({ length: 5 }, (_, i) => {
      if (i < fullStars) {
        return <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />;
      }
      if (i === fullStars && halfStar) {
        return <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-200" />;
      }
      return <Star key={i} className="w-4 h-4 text-gray-300" />;
    });
  }, [rating]);

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className="grid grid-cols-6 items-center gap-4 border-b p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
    >
      {/* Image */}
      <div className="flex justify-center">
        <img src={image} alt={title} className="w-16 h-16 object-cover rounded-lg shadow" />
      </div>

      {/* Name + Rating */}
      <div className="flex flex-col">
        <h3 className="text-sm font-semibold">{title}</h3>
        <div className="flex gap-1">{renderStars}</div>
      </div>

      {/* Abbreviation + Code */}
      <div className="flex flex-col text-sm text-gray-600 dark:text-gray-300">
        <span className="font-medium">{abbreviation}</span>
        <span>{unitCode}</span>
      </div>

      {/* Course + Module */}
      <div className="flex flex-col text-sm text-gray-600 dark:text-gray-300">
        <span>{course}</span>
        <span>Module {module}</span>
      </div>

      {/* Dates */}
      <div className="hidden md:flex flex-col text-sm text-gray-600 dark:text-gray-300">
        <span>Published: {formatDate(publishedOn)}</span>
        <span>Updated: {formatDate(updatedOn)}</span>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-row gap-2 justify-center">
        {/* Edit */}
        <button
          onClick={onEdit}
          className="flex flex-col items-center p-2 rounded bg-blue-500 text-white hover:bg-blue-600 text-xs"
        >
          <Edit className="w-4 h-4" />
          Edit
        </button>

        {/* Read */}
        <button
          onClick={onRead}
          className="flex flex-col items-center p-2 rounded bg-purple-500 text-white hover:bg-purple-600 text-xs"
        >
          <BookOpen className="w-4 h-4" />
          Read
        </button>

        {/* Publish Toggle */}
        <button
          onClick={onTogglePublish}
          className={`flex flex-col items-center p-2 rounded text-white text-xs ${
            isPublished ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"
          }`}
        >
          {isPublished ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
          {isPublished ? "Unpublish" : "Publish"}
        </button>
      </div>
    </motion.div>
  );
}
