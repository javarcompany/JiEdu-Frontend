import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "../../../components/ui/table";

import Badge from "../../../components/ui/badge/Badge";
import { UserRoundPenIcon } from "lucide-react";

import { useEffect, useState } from "react";
import axios from "axios";
import Pagination from "../../../components/ui/pagination";
import debounce from "lodash.debounce";
import { Modal } from "../../../components/ui/modal";
import Label from "../../../components/form/Label";
import Select from "../../../components/form/Select";
import Button from "../../../components/ui/button/Button";
import Swal from "sweetalert2";

export interface StudentAllocation {
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
	level: string;
	module_name: string;
	phone: string;
	passport: string;
}

export default function StudentAllocationTable({ searchTerm }: { searchTerm: string }) {
    
	const token = localStorage.getItem("access");
	const [students, setStudents] = useState<StudentAllocation[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [page, setPage] = useState<number>(1);
	const [totalPages, setTotalPages] = useState<number>(1);

	const [isOpen, setIsOpen] = useState(false);
	const [selectedStudent, setSelectedStudent] = useState<StudentAllocation | null>(null);
	const [selectedClassId, setSelectedClassId] = useState<number | null>(null);
	const [saving, setSaving] = useState(false);
	const [classes, setClasses] = useState<{
		value: string;
        label: string;
	}[]>([]);

	const fetchApplicants = debounce(async (query: string, page=1) => {
		try {
			const response = await axios.get(`/api/students-allocations/`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
					params: { search: query, page },
				}
			);
			setStudents(response.data.results);
			setPage(response.data.page || 1);
    		setTotalPages(response.data.total_pages || response.data.num_pages || 1);
		} catch (error) {
			console.error("Failed to fetch Applicants", error);
		}finally{
			setLoading(false);
		}
	}, 300);

	useEffect(() => {
		if (token) {
			setLoading(true);
			fetchApplicants(searchTerm, page);
		}
	}, [token, searchTerm, page]);

	// Fetch classes based on selected student's module
	const fetchClassesForStudent = async (student: StudentAllocation) => {
		try {
			const response = await axios.get(`/api/search-student-class/`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
				params: {
					student_id: student.id,
				},
			});
			setClasses(response.data || []);
		} catch (error) {
			console.error("Failed to fetch classes", error);
		}
	};

	// Called when edit icon is clicked
	const handleEditAllocation = async (student: StudentAllocation) => {
		setSelectedStudent(student);
		await fetchClassesForStudent(student);
		setIsOpen(true);
	};

	const closeModal = () => {
		setIsOpen(false);
		setSelectedStudent(null);
		setSelectedClassId(null);
		setClasses([]);
	};

	const handleSelectClass = (val: number | string, key: string) => {
		if (key === "id") {
			setSelectedClassId(Number(val));
		}
	};

	const handleSave = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!selectedStudent || !selectedClassId) return;

		try {
			setSaving(true);
			const response = await axios.post(
				`api/change-student-allocations/`,
				{},
				{ 
					headers: { Authorization: `Bearer ${token}` },
					params: { student_id:selectedStudent.id, class_id: selectedClassId}
				}
			);
			if (response.data.success){
				Swal.fire("Success", response.data.success, "success");
				closeModal();
				fetchApplicants(searchTerm, page);
			}
			if (response.data.error){
				Swal.fire("Error", response.data.error, "error");
				return;
			}
		} catch (error: any) {
			console.error("Failed to update student class", error);
			Swal.fire(
				"Error",
				error.response?.data?.error || "An unexpected error occurred.",
				"error"
			);
		} finally {
			setSaving(false);
		}
	};

	if (loading) {
		return (
			<div className="p-4 text-sm text-gray-500">Loading applications...</div>
		);
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
									Student
								</TableCell>

								<TableCell
									isHeader
									className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
								>
									Class
								</TableCell>

								<TableCell
									isHeader
									className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
								>
									Level
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
									<TableCell colSpan={5} className="px-5 py-4 text-center text-gray-500 text-sm">
										No students allocation found...
									</TableCell>
								</TableRow>
							) : ( 
								students.map((student) => (
									<TableRow key={student.id}>
										<TableCell className="px-5 py-4 sm:px-6 text-start">
											<div className="flex items-center gap-3">
												<div className="w-10 h-10 overflow-hidden rounded-full">
													<img
														width={40}
														height={40}
														src={student.passport}
														alt={student.fname}
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
														{student.class_name}
													</span>
													<span className="block text-gray-500 text-theme-xs dark:text-gray-400">
														{student.branch_name} Campus
													</span>
												</div>
											</div>
										</TableCell>

										<TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
											<div className="flex items-center gap-3">
												<div>
													<span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
														Module {student.module_name}
													</span>
													<span className="block text-gray-500 text-theme-xs dark:text-gray-400">
														Level {student.level}
													</span>
												</div>
											</div>
										</TableCell>

										<TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
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

										<TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
											<button
												title="Edit Student Allocation"
												className="text-blue-500 hover:text-red-600 transition-colors  px-4"
												onClick={() => handleEditAllocation(student)}
											>
												<UserRoundPenIcon size={20} />
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
			
            <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
                <div className="relative w-full p-4 overflow-y-auto bg-white no-scrollbar rounded-3xl dark:bg-gray-900 lg:p-11">
                    <div className="px-2 pr-14">
                        <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                            {selectedStudent?.fname} {selectedStudent?.mname}'s Class
                        </h4>
                        <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
                            Change student's class.
                        </p>
                    </div>

                    <form className="flex flex-col"  onSubmit={handleSave}>
                        <div className="px-2 overflow-y-auto custom-scrollbar">
                            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-1">
                                <div>
                                    <Label>Class</Label>
                                    <Select
										options={classes}
										placeholder = "Select Class"
										onChange={(val) => handleSelectClass(val, "id")}
									/>
                                </div>

                            </div>
                        </div>

                        <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
                            <Button size="sm" variant="outline" onClick={closeModal}>
                                Close
                            </Button>

                            <button
                                type="submit"
								disabled={saving}
                                className="p-5 border border-gray-500 rounded-lg items-center gap-2 bg-blue px-4 py-2.5 text-theme-md font-medium text-gray-700 shadow-theme-xs hover:bg-gray-100 hover:shadow-lg hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
                            >
                                {saving ? "Saving..." : "Change Class"}
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>
		</>
    );
  }
  