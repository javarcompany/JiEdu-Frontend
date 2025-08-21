import {
    Table,
    TableBody,
    TableCell,
    TableRow,
  } from "../../../components/ui/table";
import Badge from "../../../components/ui/badge/Badge";

import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export const SCROLL_INTERVAL = 3000;
const ROW_HEIGHT = 80; // px per row height
export const VISIBLE_ROWS = 3;
    
// Define the TypeScript interface for the table rows
interface Student {
	id: number;
	fname: string;
	mname: string;
	sname: string;
	regno: string;
	Class: string;
	class_name: string;
	state: string;
	branch: string
	branch_name: string;
	course_name: string;
	level: string;
	module_name: string;
	phone: string;
	student_state: string;
	passport: string;
}

interface ApiResponse {
  count: number; // total students
  next: string | null;
  previous: string | null;
  total_pages: number;
  results: Student[];
}

export default function StudentPreview() {
	const token = localStorage.getItem("access");
	const navigate = useNavigate();
	const [offset, setOffset] = useState(0);

	const [students, setStudents] =  useState<Student[]>([]);
	const [currentPage, setCurrentPage] = useState(1);
  	const [hasMore, setHasMore] = useState(true);

	const fetchStudents = async (page: number) => {
		try {
			const response = await axios.get<ApiResponse>(`/api/students-allocations/?page=${page}`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			setStudents(response.data.results);
			setHasMore(currentPage < response.data.total_pages);
			setOffset(0);
		} catch (err) {
			console.error("Failed to fetch students", err);
		}
	};

	useEffect(() => {
		fetchStudents(currentPage);
	}, [currentPage]);

	useEffect(() => {
    	if (students.length === 0) return;

		const interval = setInterval(() => {
			setOffset((prevOffset) => {
				const maxOffset = students.length - VISIBLE_ROWS;

				if (maxOffset <= 0) return 0; // no scroll needed

				if (prevOffset >= maxOffset) {
					// when we reach end of loaded students
					if (hasMore) {
						setCurrentPage((p) => p + 1);
					}else {
						setCurrentPage(1); // loop back to start
					}
					return 0; // restart scrolling
				}
				return prevOffset + 1;
			});
		}, SCROLL_INTERVAL);
	
		return () => clearInterval(interval);
	}, [students, hasMore]);

    return (
		<div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
			<div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
						Student List
					</h3>
				</div>

				<div className="flex items-center gap-3">
					<button onClick={() => navigate("/student-list")} className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
						<svg
						className="stroke-current fill-white dark:fill-gray-800"
						width="20"
						height="20"
						viewBox="0 0 20 20"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
						>
						<path
							d="M2.29004 5.90393H17.7067"
							stroke=""
							strokeWidth="1.5"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
						<path
							d="M17.7075 14.0961H2.29085"
							stroke=""
							strokeWidth="1.5"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
						<path
							d="M12.0826 3.33331C13.5024 3.33331 14.6534 4.48431 14.6534 5.90414C14.6534 7.32398 13.5024 8.47498 12.0826 8.47498C10.6627 8.47498 9.51172 7.32398 9.51172 5.90415C9.51172 4.48432 10.6627 3.33331 12.0826 3.33331Z"
							fill=""
							stroke=""
							strokeWidth="1.5"
						/>
						<path
							d="M7.91745 11.525C6.49762 11.525 5.34662 12.676 5.34662 14.0959C5.34661 15.5157 6.49762 16.6667 7.91745 16.6667C9.33728 16.6667 10.4883 15.5157 10.4883 14.0959C10.4883 12.676 9.33728 11.525 7.91745 11.525Z"
							fill=""
							stroke=""
							strokeWidth="1.5"
						/>
						</svg>
						View All
					</button>
				</div>
			</div>
			
			<div className="max-w-full max-h-[220px] overflow-x-auto relative overflow-hidden">
				<Table>  
					{/* Table Body */}

					<TableBody 
						className="divide-y divide-gray-100 dark:divide-gray-800 transition-transform duration-1000 ease-in-out"
						style={{ transform: `translateY(-${offset * ROW_HEIGHT}px)` }}
					>
						{students.length === 0 ? (
							<TableRow>
								<TableCell  colSpan={5} className="px-5 py-4 sm:px-6 text-start">
									<div className="p-4 text-sm text-gray-500">No Student found.....</div>
								</TableCell>
							</TableRow>
						) : (
							students.map((student) => (
								<TableRow key={student.id} className="fade-slide-in">
									<TableCell className="py-3">
										<div className="flex items-center gap-3">
											<div className="h-[50px] w-[50px] overflow-hidden rounded-md">
												<img
													src={student.passport}
													className="h-[50px] w-[50px]"
													alt={student.fname}
												/>
											</div>

											<div>
												<p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
													{student.fname} {student.mname} {student.sname}
												</p>
												<span className="text-gray-500 text-theme-xs dark:text-gray-400">
													{student.regno}
												</span>
											</div>
										</div>
									</TableCell>

									<TableCell className="py-3">
										<div className="flex items-center gap-3">
											<div>
												<span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
													{student.course_name}
												</span>
												<span className="block text-gray-500 text-theme-xs dark:text-gray-400">
													Module {student.module_name}
												</span>
											</div>
										</div>
									</TableCell>

									<TableCell className="py-3">
										<div className="flex items-center gap-3">
											<div>
												<span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
													{student.class_name}
												</span>
												<span className="block text-gray-500 text-theme-xs dark:text-gray-400">
													Level {student.level}
												</span>
											</div>
										</div>
									</TableCell>


									<TableCell className="py-3">
										<Badge
											size="sm"
											color={
											student.student_state === "Active"
												? "success"
												: student.student_state === "Cleared"
												? "primary"
												: student.student_state === "Suspended"
												? "warning"
												: "error"
											}
										>
											{student.student_state}
										</Badge>
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
  