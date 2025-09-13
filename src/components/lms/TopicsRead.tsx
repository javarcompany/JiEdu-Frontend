import { useState } from "react";
import { BookPlusIcon, ChevronDown, ChevronRight, Star } from "lucide-react";
import IntroBannerBox from "../ui/IntroBanner";
import { Link } from "react-router-dom";
import { useUser } from "../../context/AuthContext";

interface Lesson {
	id: string;
	number: string;
	title: string;
}

interface Topic {
	number: number;
	title: string;
	lessons: Lesson[];
}

interface Instructor {
	id: number;
	name: string;
	contact: string;
	rating: number;
	intro: string;
	photo: string;
}

interface UnitViewProps {
	name: string;
	description: string;
	welcomeVideo: string;
	welcomeNote: string;
	objectives: string[];
	lessons: Lesson[];
	requirements: string[];
	topics: Topic[];
	instructors: Instructor[];
}

export default function TopicView({
	name,
	description,
	welcomeVideo,
	welcomeNote,
	objectives,
	lessons,
	requirements,
	topics,
	instructors,
}: UnitViewProps) {
	const { user } = useUser();
	const [activeTab, setActiveTab] = useState<"curriculum" | "overview" | "instructors">("curriculum");
	const [expandedTopics, setExpandedTopics] = useState<number[]>([]);

	const toggleTopic = (id: number) => {
		setExpandedTopics((prev) =>
			prev.includes(id) ? prev.filter((tid) => tid !== id) : [...prev, id]
		);
	};

	return (
		<div className="space-y-6">
			{/* Banner */}
			{user?.user_type === "student" ? (
				<IntroBannerBox 
					title={name}
					subtitle={welcomeNote}
					videoUrl={welcomeVideo} 
				/>
			): (
					<IntroBannerBox 
					title={name}
					subtitle={welcomeNote}
					videoUrl={welcomeVideo} 
					startIcon1 = {<BookPlusIcon />}
					action1Label="Add Topic"
					onAction1Click={() => console.log("")}
					startIcon2 = {<BookPlusIcon />}
					action2Label="Add Lesson"
					onAction2Click={() => console.log("")}
				/>
			)} 

			{/* Content Area */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* Left Side - Tabs */}
				<div className="lg:col-span-2">
					<div className="flex mb-4">
						{["curriculum", "overview", "instructors"].map((tab) => (
							<button
								key={tab}
								onClick={() => setActiveTab(tab as any)}
								className={`px-4 py-2 font-medium capitalize transition-all 
									${
									activeTab === tab
										? "border-t-2 border-blue-500 text-blue-600 rounded-t-md bg-white"
										: "border-b-2 border-transparent text-gray-500 hover:text-blue-500"
									}`}
							>
								{tab}
							</button>
						))}
					</div>

					{/* Tab Content */}
					<div className="bg-white dark:bg-gray-900 rounded-lg p-4 shadow">
						{activeTab === "curriculum" && (
							<div>
								{topics.length === 0 ? (
									<div className="bg-red-600 text-white p-3 pl-6 rounded-md">
										No Topic found!
									</div>
								):(
								topics.map((topic) => (
									<div key={topic.number} className="mb-3">
										<button
											onClick={() => toggleTopic(topic.number)}
											className="flex items-center gap-2 text-xs md:text-lg font-semibold text-white dark:text-gray-200 bg-brand-600 hover:bg-brand-800 w-full h-10 rounded-md pl-8 mt-2"
										>
											{expandedTopics.includes(topic.number) ? (
												<ChevronDown className="w-5 h-5" />
												) : (
												<ChevronRight className="w-5 h-5" />
											)}
											Topic {topic.number}: {topic.title}
										</button>
										
										{expandedTopics.includes(topic.number) && (
											<ul className="ml-6 mt-6 space-y-2 text-gray-600 dark:text-gray-400">
												{topic.lessons.map((lesson) => (
												<li
													key={lesson.number}
													className="pl-2 border-l-4 border-gray-800 dark:border-white cursor-pointer transition-all duration-200 
																	hover:translate-x-2 hover:text-blue-500 
																	hover:font-bold hover:italic"
												>
													<Link
														to={user?.user_type === "student" ? `/learn/lesson/${lesson.id}`  : `/lesson/${lesson.id}`}
														className="block"
														>
														{lesson.title}
													</Link>
												</li>
												))}
											</ul>
										)}
									</div>
								)))}
							</div>
						)}

						{activeTab === "overview" && (
							<div className="space-y-4">
								<h2 className="text-xl font-bold">{name}</h2>
								<p className="text-gray-600 dark:text-gray-300">{welcomeNote}</p>

								<div>
									<h3 className="font-semibold">Objectives</h3>
									
									<ul className="list-disc ml-6">
										{objectives.length === 0 ? (
											<li>No Objective found!</li>
										): (
										objectives.map((obj, i) => (
											<li key={i}>{obj}</li>
										)))}
									</ul>
								</div>

								<div>
									<h3 className="font-semibold">Lesson Breakdown</h3>
									<ul className="list-disc ml-6">
										{lessons.length === 0 ? (
											<li>No Lessons found!</li>
										): (
										lessons.map((lesson) => (
											<li key={lesson.number}><strong>{lesson.number}</strong> {lesson.title}</li>
										)))}
									</ul>
								</div>

								<div>
									<h3 className="font-semibold">Requirements</h3>
									<ul className="list-disc ml-6">
										{requirements.length === 0 ? (
											<li>No Requirement found!</li>
										): (
										requirements.map((req, i) => (
											<li key={i}>{req}</li>
										)))}
									</ul>
								</div>
							</div>
						)}

						{activeTab === "instructors" && (
							<div className="space-y-4">
								{instructors.length === 0 ? (
									<div className="bg-red-600 text-white p-3 pl-6 rounded-md">
										No Lecturer found!
									</div>
								):(
								instructors.map((inst) => (
									<div
										key={inst.id}
										className="flex gap-4 p-4 border rounded-lg shadow-sm bg-gray-50 dark:bg-gray-800"
									>
										<img
											src={inst.photo}
											alt={inst.name}
											className="w-16 h-16 rounded-full object-cover"
										/>
										<div className="flex-1">
											<h3 className="font-bold">{inst.name}</h3>
											<p className="text-sm text-gray-500">{inst.contact}</p>
											<p className="text-sm text-gray-700 dark:text-gray-300 mt-1">{inst.intro}</p>
											<div className="flex gap-1 mt-1">
												{Array.from({ length: 5 }, (_, i) => (
													<Star
														key={i}
														className={`w-4 h-4 ${
															i < inst.rating
															? "text-yellow-400 fill-yellow-400"
															: "text-gray-300"
														}`}
													/>
												))}
											</div>
										</div>
									</div>
								)))}
							</div>
						)}
					</div>
				</div>

				{/* Right Side - Overview Card */}
				<div className="bg-white dark:bg-gray-900 rounded-lg shadow p-4">
					<h2 className="font-bold text-lg mb-2">Unit Overview</h2>
						<p className="text-gray-600 dark:text-gray-300">{description}</p>
				</div>

			</div>
		</div>
	);
}
