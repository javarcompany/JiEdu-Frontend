import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "../../../components/ui/table";
import { useEffect, useState } from "react";
import axios from "axios";
import debounce from "lodash.debounce";
import AttendanceRadio from "../../../utils/AttendanceOption";
import Swal from "sweetalert2";

export interface StudentAttendance{
	id: number;
	fname: string;
	mname: string;
	sname: string;
	regno: string;
	passport: string;
	Class: string;
	state: string;
}

const attendanceOptions = [
	{ value: "Present", label: "P", selectedColor: "bg-green-500" },
	{ value: "Late", label: "L", selectedColor: "bg-yellow-400" },
	{ value: "Absent", label: "A", selectedColor: "bg-red-500" },
];

type AllocateActionsProps = {
    filters: { term: string; class_: string; mode: string };
    status: { [key: string]: string };
    setStatus: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>;
};

export default function MarkattendanceTable({ filters, status, setStatus }: AllocateActionsProps) {
	
	const { class_ } = filters;

	const token = localStorage.getItem("access");

	const [students, setStudents] = useState<StudentAttendance[]>([]);

	const [loading, setLoading] = useState<boolean>(true);

	const fetchStudents = debounce(async (class_ = "all") => {
		try {
			const response = await axios.get(`/api/search-attendance/?class_id=${class_}`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);

			if (response.data.error){
				Swal.fire("Error", response.data.error, "error")
			}

			const studentsWithState = (response.data as StudentAttendance[]).map((student) => ({
				...student,
				state: student.state || "",
			}));

			// Pre-fill status
			const prefillStatus: { [key: string]: string } = {};
			
			studentsWithState.forEach((stud) => {
				if (stud.state) prefillStatus[stud.regno] = stud.state;
			});

			setStudents(studentsWithState);
			setStatus(prefillStatus);
			
			setLoading(false);
		} catch (error) {
			console.error("Failed to fetch Students", error);
			setLoading(false);
		}
	}, 100);

	useEffect(() => {
		if (!token) {return;}
				
		fetchStudents(class_);
	},[token, class_]);
	

	const handleStatusChange = (regno: string, value: string) => {
		setStatus((prev) => ({ ...prev, [regno]: value }));
	};

	if (loading) {
		return <div className="p-4 text-sm text-gray-500">Loading students...</div>;
	}

	if (students.length === 0) {
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
										className="py-3 px-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
									>
										Student
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
							<TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
								<TableRow>
									<TableCell>
										<div className="p-4 text-sm text-gray-500">No student found!...</div>
									</TableCell>
								</TableRow>
							</TableBody>
						</Table>
					</div>
				</div>
			</>
		);
	}

	return (
		<>
			<div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
				<div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
					<div>
						<h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
							Students
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
									className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
								>
									Student
								</TableCell>

								<TableCell
									isHeader
									className="py-3 text-start font-medium text-gray-500 text-theme-xs dark:text-gray-400"
								>
									Status
								</TableCell>

							</TableRow>
						</TableHeader>

						{/* Table Body */}

						<TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
							{students.map((student) => (
								<TableRow key={student.id} className="">
									
									<TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
										<div className="flex items-center gap-3">
											<div className="w-10 h-10 overflow-hidden rounded-full">
												<img
													width={40}
													height={40}
													src={
														student.passport?.trim()
														? student.passport.startsWith("http")
															? student.passport
															: `${student.passport}`
														: "/default-avatar.png"
													}
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

									<TableCell className="py-3 text-gray-500 text-theme-sm text-end items-end dark:text-gray-400">
										<AttendanceRadio
											name={student.regno}
											options={attendanceOptions}
											selected={status[student.regno] ?? student.state ?? ""}
											onChange={(value) => handleStatusChange(student.regno, value)}
										/>
									</TableCell>

								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>
			</div>

		</>
	);
}
