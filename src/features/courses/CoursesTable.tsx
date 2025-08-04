import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../components/ui/table";

import debounce from "lodash.debounce";

import {  Pencil, Trash2 } from "lucide-react";

import { useEffect, useState } from "react";
import axios from "axios";
import Pagination from "../../components/ui/pagination";

export interface Course {
	id: string;
	name: string;
	abbr: string;
	code: string;
	department: string;
	dor: string;
	durations: {
		module_abbr: string;
		duration: number;
	}[];
}

export default function CoursesTable({ searchTerm }: { searchTerm: string }) {
	const token = localStorage.getItem("access");
	const [courses, setCourses] = useState<Course[]>([]);
	const [loading, setLoading] = useState<boolean>(true);

    const [page, setPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);

	const fetchCourses = debounce(async (searchTerm, page = 1) => {
		try {
			const response = await axios.get(`/api/courses/?search=${searchTerm}&page=${page}`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
            setPage(response.data.page);
			setCourses(response.data.results);
            setTotalPages(response.data.total_pages || response.data.num_pages || 1);
			setLoading(false);
		} catch (error) {
			console.error("Failed to fetch Courses", error);
			setLoading(false);
		}
	}, 100);

	useEffect(() => {
		fetchCourses(searchTerm, page);
	}, [page, searchTerm]);

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
		<>
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
									Course Durations
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
										<TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
											<ul className="space-y-1">
												{course.durations.map((d, idx) => (
													<li key={idx}>
														<span className="font-semibold">{d.module_abbr}:</span> {d.duration} term(s)
													</li>
												))}
											</ul>
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
			
            <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />

		</>
	);
}
