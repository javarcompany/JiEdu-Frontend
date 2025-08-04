import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../components/ui/table";

import {  Pencil, Trash2 } from "lucide-react";

import { useEffect, useState } from "react";
import axios from "axios";

export interface Course {
	id: string;
	name: string;
	abbr: string;
	code: string;
	department: string;
	dor: string;
}

export default function CoursesTable({ searchTerm }: { searchTerm: string }) {
	const token = localStorage.getItem("access");
	const [courses, setCourses] = useState<Course[]>([]);
	const [loading, setLoading] = useState<boolean>(true);

	useEffect(() => {
		const fetchCourses = async () => {
			try {
				const response = await axios.get("/api/courses/",
					{
						headers: {
							Authorization: `Bearer ${token}`,
						},
					}
				);
				setCourses(response.data.results);
				setLoading(false);
			} catch (error) {
				console.error("Failed to fetch Courses", error);
				setLoading(false);
			}
		};
		
		fetchCourses();
			const interval = setInterval(fetchCourses, 2000);
			return () => clearInterval(interval);
	}, []);

	const filteredData = courses.filter((item) =>
		Object.values(item)
			.join(" ")
			.toLowerCase()
			.includes(searchTerm.toLowerCase())
	);

	if (loading) {
		return <div className="p-4 text-sm text-gray-500">Loading branches...</div>;
	}

	return (
		<div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
			<div className="max-w-full overflow-x-auto">
				<Table>
					{/* Table Header */}
					<TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
						<TableRow>
							<TableCell
							isHeader
							className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
							>
							Name
							</TableCell>
							<TableCell
							isHeader
							className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
							>
							Abbreviation
							</TableCell>
							<TableCell
							isHeader
							className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
							>
							Code
							</TableCell>
							<TableCell
							isHeader
							className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
							>
							Date Registered
							</TableCell>
							<TableCell
							isHeader
							className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
							>
							Action(s)
							</TableCell>
						</TableRow>
					</TableHeader>

					{/* Table Body */}
					<TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
						{filteredData.length === 0 ? (
							<TableRow>
								<TableCell colSpan={6} className="text-center">
									<div className="p-4 text-sm text-gray-500">
										No course found...
									</div>
								</TableCell>
							</TableRow>
						) : (
							filteredData.map((course) => (
								<TableRow key={course.id}>
								<TableCell className="px-5 py-4 sm:px-6 text-start">
									<div className="flex items-center gap-3">
										<div>
											<span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
												{course.name}
											</span>
										</div>
									</div>
								</TableCell>
								<TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
									<div className="flex items-center gap-3">
										<div>
											<span className="block text-gray-500 font-medium text-theme-xs dark:text-gray-400">
												{course.abbr}
											</span>
										</div>
									</div>
								</TableCell>
								<TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
									<div className="flex items-center gap-3">
										<div>
											<span className="block text-gray-500 font-medium text-theme-xs dark:text-gray-400">
												{course.code}
											</span>
										</div>
									</div>
								</TableCell>
								<TableCell className="px-5 py-4 sm:px-6 text-start">
									<div className="flex items-center gap-3">
										<div>
											<span className="block text-gray-500 text-theme-xs dark:text-gray-400">
												{course.dor}
											</span>
										</div>
									</div>
								</TableCell>
								<TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
									<button
										title="Edit Group"
										className="text-green-500 hover:text-green-600 transition-colors"
										onClick={() => console.log("Edit")}
									>
										<Pencil size={16} />
									</button>

									<button
										title="Delete Group"
										className="text-red-500 hover:text-red-600 transition-colors  px-4"
										onClick={() => console.log("Delete")}
									>
										<Trash2 size={16} />
									</button>
								</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</div>
		</div>
	);
}
