import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
  } from "../../../components/ui/table";
import Pagination from "../../../components/ui/pagination";
import {  FileEditIcon } from "lucide-react";
import { useEffect, useState } from "react";
import debounce from 'lodash.debounce';
import axios from "axios";
import { Modal } from "../../../components/ui/modal";
import Label from "../../../components/form/Label";
import Button from "../../../components/ui/button/Button";
import Swal from "sweetalert2";
import DictSearchableSelect from "../../../components/form/DictSelect";

interface ClassTutor {
	id: number;
    regno: string;
    staff_regno: string;
    fname: string;
    mname: string;
    sname: string;
    branch: string;
    branch_name: string;
    Class: string;
    class_name: string;
    passport: string;
	state: string;
}

export default function ClassTutorTable({ searchTerm }: { searchTerm: string }) {
	const token = localStorage.getItem("access");
	const [isOpen, setIsOpen] = useState(false);

	const [staffs, setStaffs] = useState<ClassTutor[]>([]);
	const [loading, setLoading] = useState<boolean>(true);

	const [selectedClass, setSelectedClass] = useState<ClassTutor | null>(null);
	
	const [page, setPage] = useState<number>(1);
	const [totalPages, setTotalPages] = useState<number>(1);

	const [selectedLecturer, setSelectedLecturer] = useState<number | null>(null);
	const [saving, setSaving] = useState(false);
	const [lecturers, setLecturers] = useState<{
		value: string;
        label: string;
	}[]>([]);
	
	const fetchClassTutors = debounce(async (query: any, page=1) => {
		try {
			const response = await axios.get(`/api/class-tutors/?search=${query}&page=${page}`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			setStaffs(response.data.results);
			setLoading(false);
			setPage(response.data.page || 1);
    		setTotalPages(response.data.total_pages || response.data.num_pages || 1);
			console.log(response)
		} catch (error) {
			console.error("Failed to fetch Class Tutors", error);
			setLoading(false);
		}
	}, 300); 

	useEffect(() => {
		if (token) {
			setLoading(true);
			fetchClassTutors(searchTerm, page);
		}

	},[token, searchTerm, page]);

	// Fetch classes based on selected lecturer's module
	const fetchLecturersForClass = async (klass: ClassTutor) => {
		try {
			const response = await axios.get(`/api/search-class-lecturers/`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
				params: {
					class_id: klass.id,
				},
			});
			setLecturers(response.data || []);
		} catch (error) {
			console.error("Failed to fetch lecturers", error);
		}
	};

	// Called when edit icon is clicked
	const handleEditAllocation = async (staff: ClassTutor) => {
		setSelectedClass(staff);
		await fetchLecturersForClass(staff);
		setIsOpen(true);
	};

	const closeModal = () => {
		setIsOpen(false);
		setSelectedClass(null);
		setSelectedLecturer(null);
		setLecturers([]);
	};

	const handleSelectLecturer = (val: number | string, key: string) => {
		if (key === "id") {
			setSelectedLecturer(Number(val));
		}
	};

	const handleSave = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!selectedLecturer || !selectedClass) return;

		try {
			setSaving(true);
			const response = await axios.post(
				`api/change-class-tutor/`,
				{},
				{ 
					headers: { Authorization: `Bearer ${token}` },
					params: { lecturer_id:selectedLecturer, class_name: selectedClass?.class_name}
				}
			);
			if (response.data.success){
				Swal.fire("Success", response.data.success, "success");
				closeModal();
				fetchClassTutors(searchTerm, page);
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
		return <div className="p-4 text-sm text-gray-500">Loading staffs...</div>;
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
									Staff
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
									Action(s)
								</TableCell>
							</TableRow>
						</TableHeader>

						{/* Table Body */}
						<TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
							{staffs.length === 0 ? (
								<TableRow>
									<TableCell className="px-5 py-2 sm:px-6 text-start">
										<div className="p-4 text-sm text-gray-500">No record found....</div>
									</TableCell>
								</TableRow>
							) : (
								staffs.map((staff) => (
									<TableRow key={staff.id}>
										<TableCell className="px-5 py-4 sm:px-6 text-start">
											<div className="flex items-center gap-3">
												<div className="w-10 h-10 overflow-hidden rounded-full">
													<img
														width={40}
														height={40}
														src={staff.passport}
														alt={staff.fname}
													/>
												</div>
												<div>
													<span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
														{staff.fname} {staff.mname} {staff.sname}
													</span>
													<span className="block text-gray-500 text-theme-xs dark:text-gray-400">
														{staff.staff_regno}
													</span>
												</div>
											</div>
										</TableCell>
										<TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
											<div className="flex items-center gap-3">
												<div>
													<span className="block text-gray-500 font-medium text-theme-xs dark:text-gray-400">
														{staff.class_name}
													</span>
												</div>
											</div>
										</TableCell>
										<TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
											<button
												title="View Class Tutor"
												className="text-blue-500 hover:text-red-600 transition-colors  px-4"
												onClick={() => handleEditAllocation(staff)}
											>
												<FileEditIcon size={20} />
											</button>
										</TableCell>
									</TableRow>
								))
							)}
						</TableBody>
					</Table>
				</div>
			</div>

			<Pagination  currentPage={page} totalPages={totalPages} onPageChange={setPage}/>
		
			<Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
                <div className="relative w-full p-4  bg-white no-scrollbar rounded-3xl dark:bg-gray-900 lg:p-11">
                    <div className="px-2 pr-14">
                        <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                            {selectedClass?.class_name}'s Class Tutor
                        </h4>
                        <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
                            Change class's tutor.
                        </p>
                    </div>

                    <form className="flex flex-col"  onSubmit={handleSave}>
                        <div className="px-2 custom-scrollbar">
                            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-1">
                                <div>
                                    <Label>Lecturer</Label>
									<DictSearchableSelect
										items={lecturers}
										placeholder={"Select Lecturer..."}
										onSelect={(val) => handleSelectLecturer(val, "id")}
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
                                {saving ? "Saving..." : "Change Class Tutor"}
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>
		</>
    );
  }
  