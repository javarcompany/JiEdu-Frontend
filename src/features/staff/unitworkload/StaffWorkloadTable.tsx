import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "../../../components/ui/table";
import {  ClipboardEditIcon } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import Pagination from "../../../components/ui/pagination";
import debounce from "lodash.debounce";
import Swal from "sweetalert2";
import { Modal } from "../../../components/ui/modal";
import Label from "../../../components/form/Label";
import Button from "../../../components/ui/button/Button";
import DictSearchableSelect from "../../../components/form/DictSelect";
  
export interface StaffWorkload {
	id: number;
    staff_regno: string;
	fname: string;
	mname: string;
	sname: string;
	regno: string;
	passport: string;

    Class: string;
	class_name: string;

    unit: string;
	unit_name: string;
	unitcode: string;

	term_name: string;
	term_year: string;

	state: string;

}

export default function StaffWorkloadTable({ searchTerm }: { searchTerm: string }) {

	const token = localStorage.getItem("access");
	const [staffs, setStaffs] = useState<StaffWorkload[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [page, setPage] = useState<number>(1);
	const [totalPages, setTotalPages] = useState<number>(1);

	const [resetKey, setResetKey] = useState(0);
	const [saving, setSaving] = useState(false);
	const [isOpen, setIsOpen] = useState(false);
	const [selectedWorkload, setSelectedWorkload] = useState<StaffWorkload | null>(null);
	const [selectedLecturer, setSelectedLecturer] = useState<number | null>(null);
	const [lecturers, setLecturers] = useState<{
		value: string;
        label: string;
	}[]>([]);

	const fetchWorkloads = debounce(async (query, page=1) => {
		try {
			const response = await axios.get(`/api/staff-workloads/?search=${query}&page=${page}`,
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
		} catch (error) {
			console.error("Failed to fetch Workloads", error);
			setLoading(false);
		}
	}, 100);

	useEffect(() => {
		if (!token) {return;}
		
		fetchWorkloads(searchTerm, page);
	},[token, searchTerm, page]);

	const fetchLecturersForWorkload = async (klass: StaffWorkload) => {
		try {
			const response = await axios.get(`/api/search-workload-lecturers/`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
				params: {
					workload_id: klass.id,
				},
			});
			setLecturers(response.data || []);
		} catch (error) {
			console.error("Failed to fetch lecturers", error);
		}
	};

	const handleEditWorkload = async (staff: StaffWorkload) => {
		setSelectedWorkload(staff);
		await fetchLecturersForWorkload(staff);
		setIsOpen(true);
	}

	const closeModal = () => {
		setIsOpen(false);
		setSelectedWorkload(null);
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

		if (!selectedLecturer || !selectedWorkload) return;

		try {
			setSaving(true);
			const response = await axios.post(
				`api/change-unit-workload/`,
				{},
				{ 
					headers: { Authorization: `Bearer ${token}` },
					params: { lecturer_id:selectedLecturer, workload_id: selectedWorkload?.id}
				}
			);
			if (response.data.success){
				Swal.fire("Success", response.data.success, "success");
				closeModal();
				fetchWorkloads(searchTerm, page);
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
			<div className="p-4 text-sm text-gray-500">Loading workloads...</div>
		);
	}

	return (
		<>
			<div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
				<div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
					<div>
						<h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
							Staff Unit Workloads
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
									Staff
								</TableCell>

								<TableCell
									isHeader
									className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
								>
									Unit
								</TableCell>

								<TableCell
									isHeader
									className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
								>
									Class
								</TableCell>
								
								<TableCell
									isHeader
									className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
								>
									Action(s)
								</TableCell>
							</TableRow>
						</TableHeader>

						{/* Table Body */}
						<TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
							{staffs.length === 0 ? (
								<TableRow>
									<div className="p-4 text-sm text-gray-500">No Staff Workload found.....</div>
								</TableRow>
							) : (
								staffs.map((trainer) => (
									<TableRow key={trainer.id} className="">
										<TableCell className="py-3">
											<div className="flex items-center gap-3">
												<div className="h-[50px] w-[50px] overflow-hidden rounded-md">
													<img
														src={trainer.passport}
														className="h-[50px] w-[50px]"
														alt={trainer.fname}
													/>
												</div>

												<div>
													<p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
														{trainer.fname} {trainer.mname} {trainer.sname}
													</p>
													<span className="text-gray-500 text-theme-xs dark:text-gray-400">
														{trainer.staff_regno}
													</span>
												</div>
											</div>
										</TableCell>

										<TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
											<p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
												{trainer.unit_name}
											</p>
											<span className="text-gray-500 text-theme-xs dark:text-gray-400">
												{trainer.unitcode}
											</span>
										</TableCell>

										<TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
											<p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
												{trainer.class_name}
											</p>
											<span className="text-gray-500 text-theme-xs dark:text-gray-400">
												{trainer.term_year} - {trainer.term_name} 
											</span>
										</TableCell>

										<TableCell>
											<button
												title="Delete Staff Workload"
												className="text-blue-500 hover:text-red-600 transition-colors  px-4"
												onClick={() => handleEditWorkload(trainer)}
											>
												<ClipboardEditIcon size={20} />
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
                <div className="relative w-full p-4 bg-white no-scrollbar rounded-3xl dark:bg-gray-900 lg:p-11">
                    <div className="px-2 pr-14">
                        <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                            {selectedWorkload?.class_name} {selectedWorkload?.unit_name}'s Workload
                        </h4>
                        <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
                            Change unit workload.
                        </p>
                    </div>

                    <form className="flex flex-col"  onSubmit={handleSave}>
                        <div className="px-2 custom-scrollbar">
                            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-1">
                                <div>
                                    <Label>Lecturer</Label>
									<DictSearchableSelect
										items={lecturers}
										resetTrigger={resetKey} 
										placeholder={"Select Lecturer..."}
										onSelect={async (val) => {
											const response = await axios.get("/api/check-new-lecturer-workload/", {
												params: {
													lecturer_id: val,
													load_id: selectedWorkload?.id
												},
												headers: { Authorization: `Bearer ${token}` },
											});

											if (response.data.conflict) {
												Swal.fire({
													icon: "error",
													title: "Conflict Detected",
													text: response.data.message,
												});
												setResetKey(prev => prev + 1);
												return; // Don't set selection
											}

											// If no conflict, update state
											handleSelectLecturer(val, "id")
										}}
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
                                {saving ? "Saving..." : "Change Unit Workload"}
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>
		</>
	);
}
  