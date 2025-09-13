import { motion } from "framer-motion";
import { BookOpen, Edit, Star, StarHalf, ToggleLeft, ToggleRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function UnitCard({
	unitId,
	image,
	title,
	rating = 0,
	isPublished,
	onTogglePublish,
	totalTopics,
	course,
	module,
	publishedOn,
	updatedOn,
	unitCode,
	abbreviation,
}: {
	unitId: number;
	image: string;
	title: string;
	rating: number;
	isPublished: boolean;
	onTogglePublish?: () => void;
	totalTopics: number;
	course: string;
	module: string;
	publishedOn: string;
	updatedOn: string;
	unitCode: string;
	abbreviation: string;
}) {
	
	const navigate = useNavigate();

	const formatDate = (date: string | Date) => {
		const d = new Date(date);
		return d.toLocaleDateString(undefined, {
			year: "numeric",
			month: "short",
			day: "numeric",
		});
	};

	const renderStars = () => {
		const fullStars = Math.floor(rating);
		const hasHalf = rating % 1 >= 0.5;
		const stars = [];

		for (let i = 0; i < 5; i++) {
			if (i < fullStars) {
				stars.push(
				<Star
					key={i}
					className="w-5 h-5 text-yellow-400 fill-yellow-400"
				/>
				);
			} else if (i === fullStars && hasHalf) {
				stars.push(
					<>
						<StarHalf
							key={i}
							className="w-5 h-5 text-yellow-400 fill-yellow-400"
						/>
					</>
				);
			} else {
				stars.push(<Star key={i} className="w-5 h-5 text-gray-300" />);
			}
		}
		return stars;
	};

	return (
		<motion.div
			whileHover={{ scale: 1.02 }}
			className="mt-20 relative border-b-2 dark:shadow-lg rounded-2xl shadow-md w-full p-4 flex flex-col gap-3"
		>
			{/* Image */} 
			<div className="w-full flex justify-center absolute -top-15 left-1/2 -translate-x-1/2">
				<img
					src={image}
					alt={title}
					className="w-[90%] h-50 object-cover rounded-2xl shadow-md"
				/>
			</div>

			{/* Title + Rating */}
			<div className="mt-30 flex flex-col gap-0 pl-4 pt-4 pr-4">
                {/* Title */}
                <h3 className="text-lg font-semibold">{title}</h3>
			
				<div className="flex mt-1 gap-1 items-center">Rating: {renderStars()}</div>

				{/* Unit Details */}
				<div className="text-xs text-gray-600 dark:text-gray-300 mt-3 grid grid-cols-2 gap-x-4 gap-y-1">
					<p><strong>Course:</strong> {course}</p>
					<p><strong>Module:</strong> {module}</p>
					<p><strong>Published on:</strong> {formatDate(publishedOn)}</p>
					<p><strong>Updated on:</strong> {formatDate(updatedOn)}</p>
					<p><strong>Unit Code:</strong> {unitCode}</p>
					<p><strong>Abb:</strong> {abbreviation}</p>
				</div>
			</div>

			<div className="flex items-center gap-2 text-gray-600 pl-4 pr-4">
				<BookOpen size={18} />
				<span className="text-sm">Total Topics: {totalTopics}</span>
			</div>

			{/* Action Buttons */}
			<div className="grid grid-cols-3 gap-3 mt-6">
				{/* Edit Button */}
				<button className="flex flex-col items-center justify-center gap-1 p-3 rounded-lg bg-blue-500 text-white hover:bg-blue-600">
					<Edit className="w-5 h-5" />
					<span className="text-sm font-medium">Edit</span>
				</button>

				{/* Read Button */}
				<button 
					className="flex flex-col items-center justify-center gap-1 p-3 rounded-lg bg-purple-500 text-white hover:bg-purple-600"
					onClick={() => navigate(`/unit/${unitId}`)}
				>
					<BookOpen className="w-5 h-5" />
					<span className="text-sm font-medium">Read</span>
				</button>

				{/* Publish Button */}
				<button
					onClick={onTogglePublish}
					className={`flex flex-col items-center justify-center gap-1 p-3 rounded-lg text-white ${
					isPublished
						? "bg-green-500 hover:bg-green-600"
						: "bg-red-500 hover:bg-red-600"
					}`}
				>
					{isPublished ? (
					<ToggleRight className="w-5 h-5" />
					) : (
					<ToggleLeft className="w-5 h-5" />
					)}
					<span className="text-sm font-medium">
					{isPublished ? "Unpublish" : "Publish"}
					</span>
				</button>
			</div>

		</motion.div>
	);
}
