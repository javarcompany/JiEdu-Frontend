import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "../../../components/ui/table";
import Badge from "../../../components/ui/badge/Badge";
import Checkbox from "../../../components/form/input/Checkbox";

import { useEffect, useState } from "react";
import axios from "axios";
import Pagination from "../../../components/ui/pagination";
import debounce from "lodash.debounce";

// Define the TypeScript interface for the table rows
interface Student {
	id: string;
	studentno: string;
	passport: string;
	fname: string;
	mname: string;
	sname: string;
	regno: string;
	Class: string;
	course: string;
	course_name: string;
	module: string;
	module_name: string;
	class_name: string;
	state: string;
	branch: string;
	branch_name: string;
	year_name: string;
	term: string;
	term_name: string;
	level: string;
	phone: string;
}

export default function AllocateTable({filters, selectedIds, setSelectedIds, }: { filters: { branch: string; course: string; module: string; class_: string; term: string; }; selectedIds: string[]; setSelectedIds: React.Dispatch<React.SetStateAction<string[]>>; }) {
	const { branch, course, module, term } = filters;
	const token = localStorage.getItem("access");
	const [students, setStudents] = useState<Student[]>([]);
	const [page, setPage] = useState<number>(1);
	const [totalPages, setTotalPages] = useState<number>(1);

	const [loading, setLoading] = useState<boolean>(true);

	const fetchStudents = debounce(async (page=1) => {
		try {
			const response = await axios.get(`/api/students-allocations/?state=Pending&page=${page}`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			setStudents(response.data.results);
			setLoading(false);
			setPage(response.data.page || 1);
    		setTotalPages(response.data.total_pages || response.data.num_pages || 1);
		} catch (error) {
			console.error("Failed to fetch Students", error);
			setLoading(false);
		}
	}, 100);

	useEffect(() => {
		if (!token) {return;}

		fetchStudents(page);
	},[token, page]);

    const filteredData = students.filter((student) => {
        const matchesBranch = !branch || student.branch.toString() === branch;
        const matchesCourse = !course || student.course.toString() === course;
        const matchesModule = !module || student.module.toString() === module;
		const matchesTerm = !term || student.term.toString() === term;
		return matchesBranch && matchesCourse && matchesModule && matchesTerm;

	});
  
    const isAllSelected = selectedIds.length === filteredData.length && filteredData.length > 0;

    const handleSelectAll = (e: boolean) => {
		if (e) {
			setSelectedIds(filteredData.map((item) => item.studentno));
		} else {
			setSelectedIds([]);
		}
    };
  
    const handleSelectOne = (id: string) => {
		setSelectedIds((prev) =>
			prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
		);
    };

	if (loading) {
		return <div className="p-4 text-sm text-gray-500">Loading students...</div>;
	}

    return (
		<>
			<div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
				<div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
					<div>
						<h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
							Pending Student List for Allocation
						</h3>
					</div>
				</div>

				<div className="max-w-full overflow-x-auto">
					<Table>
						{/* Table Header */}
						<TableHeader className="border-gray-100 dark:border-gray-800 border-y">
							<TableRow>
								<TableCell
									isHeader
									className="py-3 px-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
								>
									<Checkbox
										className="w-5 h-5 appearance-none cursor-pointer dark:border-gray-700 border border-gray-300 checked:border-transparent rounded-md checked:bg-brand-500 checked:text-white"
										checked={isAllSelected}
										onChange={(e) => {handleSelectAll(e)}}
									/>
								</TableCell>

								<TableCell
									isHeader
									className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
								>
									Student
								</TableCell>

								<TableCell
									isHeader
									className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
								>
									Course
								</TableCell>

								<TableCell
									isHeader
									className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
								>
									Intake/Year
								</TableCell>
								
								<TableCell
									isHeader
									className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
								>
									Status
								</TableCell>
							</TableRow>
						</TableHeader>

						{/* Table Body */}

						<TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
							{filteredData.length === 0 ? (
								<TableRow>
									<TableCell  colSpan={5} className="px-5 py-4 sm:px-6 text-start">
										<div className="p-4 text-sm text-gray-500">No student found for class allocation.....</div>
									</TableCell>
								</TableRow>
							) : (
								filteredData.map((student) => (
									<TableRow key={student.id} className="">
										<TableCell className="py-3 px-3 text-gray-500 text-theme-sm dark:text-gray-400">
											<Checkbox
												checked={selectedIds.includes(student.studentno)}
												onChange={() => handleSelectOne(student.studentno)}
											/>
										</TableCell>

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

										<TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
											<div>
												<p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
													{student.course_name}
												</p>
												<span className="text-gray-500 text-theme-xs dark:text-gray-400">
													Module {student.module_name} * Level {student.level}
												</span>
											</div>
										</TableCell>

										<TableCell>
											<div>
												<p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
													{student.year_name}
												</p>
												<span className="text-gray-500 text-theme-xs dark:text-gray-400">
													{student.term_name}
												</span>
											</div>
										</TableCell>

										<TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
											<Badge
												size="sm"
												color={
												student.state === "Allocated"
													? "success"
													: "error"
												}
											>
												{student.state}
											</Badge>
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
  