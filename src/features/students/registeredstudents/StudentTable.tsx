import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";

import {  EyeIcon } from "lucide-react";

import Badge from "../../../components/ui/badge/Badge";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import debounce from 'lodash.debounce';
import Pagination from "../../../components/ui/pagination";
import Checkbox from "../../../components/form/input/Checkbox";

export interface Student {
	id: number;
	regno: string;
	passport: string;
	fname: string;
	mname: string;
	sname: string;
	nat_id: string;
	gender: string;
	dob: string;
	branch: string;
	branch_name: string;
	email: string;
	phone: string;
	course: string;
	course_name: string;
	state: string;
}

export default function StudentTable(
	{ searchTerm, 
		selectedStudentIds, 
		setSelectedStudentIds, 
		promotionMode,
		reloadFlag
	}: { searchTerm: string, 
		selectedStudentIds: number[], 
		setSelectedStudentIds: (ids: number[]) => void, 
		promotionMode: boolean, 
		reloadFlag: number }) {

	const token = localStorage.getItem("access");
	const [students, setStudents] = useState<Student[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const navigate = useNavigate();
	const [page, setPage] = useState<number>(1);
	const [totalPages, setTotalPages] = useState<number>(1);

	const fetchStudents = debounce(async (query, page=1) => {
		try {
			const response = await axios.get(`/api/students/?search=${query}&page=${page}`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			const studentsData = response.data.results || response.data;
			setStudents(studentsData);
			setLoading(false);
			setPage(response.data.page || 1);
    		setTotalPages(response.data.total_pages || response.data.num_pages || 1);
		} catch (error) {
			console.error("Failed to fetch Students", error);
			setLoading(false);
		}
	}, 100); // 300ms delay

	useEffect(() => {
		if (!token) {return;}
		
		fetchStudents(searchTerm, page);
	},[token, searchTerm, page, reloadFlag]);

	const handleViewStudent = (student: Student) => {
		const app = student.id
		navigate(`/view-student/${encodeURIComponent(app)}`);
	}

	const toggleStudentSelection = (id: number) => {
		if (selectedStudentIds.includes(id)) {
			setSelectedStudentIds(selectedStudentIds.filter(sid => sid !== id));
		} else {
			setSelectedStudentIds([...selectedStudentIds, id]);
		}
	};

	if (loading) {
		return <div className="p-4 text-sm text-gray-500">Loading students...</div>;
	}

	return (
		<>
			<div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
				
				<div className="max-w-full overflow-x-auto">
					<Table>
						{/* Table Header */}
						<TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
							<TableRow>
								{promotionMode && (
									<TableCell
										isHeader
										className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
									>
										<Checkbox
											className="w-5 h-5 rounded-md border border-gray-300 dark:border-gray-700 cursor-pointer appearance-none checked:bg-brand-500"
											checked={
												students.length > 0 &&
												students
													.filter((student) => student.state !== "Active") // only consider inactive students
													.every((student) => selectedStudentIds.includes(student.id))
											}
											onChange={(e) => {
												if (e) {
													const inactiveIds = students
														.filter((student) => student.state !== "Active")
														.map((student) => student.id);
													setSelectedStudentIds(inactiveIds);
												} else {
													setSelectedStudentIds([]);
												}
											}}
										/>
									</TableCell>
								)}
								<TableCell
									isHeader
									className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
								>
									Student
								</TableCell>

								<TableCell
									isHeader
									className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
								>
									Course
								</TableCell>

								<TableCell
									isHeader
									className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
								>
									Contact
								</TableCell>

								<TableCell
									isHeader
									className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
								>
									Status
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
							{students.length === 0 ? (
								<TableRow>
									<TableCell  colSpan={5} className="px-5 py-4 sm:px-6 text-start">
										<div className="p-4 text-sm text-gray-500">No Student found.....</div>
									</TableCell>
								</TableRow>
							) : (
								students.map((student) => (
									<TableRow key={student.id}>
										{promotionMode && (
											<TableCell className="px-5 py-4 text-start">
												<Checkbox
													disabled={student.state === "Active"} // disable checkbox if already promoted
													checked={selectedStudentIds.includes(student.id)}
													onChange={() => toggleStudentSelection(student.id)}
												/>
											</TableCell>
										)}

										<TableCell className="px-5 py-4 sm:px-6 text-start">
											<div className="flex items-center gap-3">
												<div className="w-10 h-10 overflow-hidden rounded-full">
													<img
														width={40}
														height={40}
														src={student.passport  || "/default-avatar.png"}
														alt={student.regno}
													/>
												</div>
												<div>
													<span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
														{student.fname} {student.mname} {student.sname}
													</span>
													<span className="block text-gray-500 text-theme-xs dark:text-gray-400">
														{student.regno}
													</span>
												</div>
											</div>
										</TableCell>

										<TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
											<div className="flex items-center gap-3">
												<div>
													<span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
														{student.course_name}
													</span>
													<span className="block text-gray-500 text-theme-xs dark:text-gray-400">
														{student.branch_name}
													</span>
												</div>
											</div>
										</TableCell>

										<TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
											<div className="flex items-center gap-3">
												<div>
													<span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
														{student.email}
													</span>
													<span className="block text-gray-500 text-theme-xs dark:text-gray-400">
														{student.phone}
													</span>
												</div>
											</div>
										</TableCell>

										<TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
											<Badge
												size="sm"
												color={
													student.state === "Active"
													? "success"

													: student.state === "Cleared"
													? "primary"

													: student.state === "Suspended"
													? "warning"
													
													: "error"
												}
											>
												{student.state}
											</Badge>
										</TableCell>

										<TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
											<button
												title="View Application"
												className="text-blue-500 hover:text-orange-600 transition-colors  px-4"
												onClick={() => handleViewStudent(student)}
											>
												<EyeIcon size={20} />
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
