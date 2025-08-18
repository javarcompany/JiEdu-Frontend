import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "../../components/ui/table";
import { formatDateTime } from "../../utils/format";

import {  EyeIcon } from "lucide-react";
  
import { useEffect, useState } from "react";
import axios from "axios";
import debounce from 'lodash.debounce';
import Pagination from "../../components/ui/pagination";
import { useModal } from "../../hooks/useModal";
import Swal from "sweetalert2";
import { Modal } from "../../components/ui/modal";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import Button from "../../components/ui/button/Button";
import SearchableSelect from "../../components/form/DictSelect";
import { fetchDropdownData } from "../../utils/apiFetch";

export interface Units {
    id: number;
    name: string;
    abbr: string;
    uncode: string;
    weekly_hours: number;
    course: string;
	course_name: string;
    module: string;
	module_name: string;
    dor: string;
}
  
export default function UnitsTable({saveValue, searchTerm }: {saveValue:boolean, searchTerm: string }) {
	const token = localStorage.getItem("access");
	const [units, setUnits] = useState<Units[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [page, setPage] = useState<number>(1);
	const [totalPages, setTotalPages] = useState<number>(1);

	const { isOpen, openModal, closeModal } = useModal();
	const [saved, onSave] = useState<boolean>(false);
	const [editingUnit, setEditingUnit] = useState<Units | null>(null);
	const isEditing = Boolean(editingUnit);

	const [formData, setFormData] = useState({
        uncode: "",
        name: "",
        abbr: "",
        course: "",
        module: "",
        weekly_hours: 0,
    });
	const [courses, setCourses] = useState<{ value: string; label: string;}[]>([]);
    const [modules, setModules] = useState<{ value: string; label: string; }[]>([]);

	const fetchUnits = debounce(async (query, page=1) => {
		try {
			const response = await axios.get(`/api/units/?search=${query}&page=${page}`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			setUnits(response.data.results);
			setLoading(false);
			setPage(response.data.page || 1);
    		setTotalPages(response.data.total_pages || response.data.num_pages || 1);
		} catch (error) {
			console.error("Failed to fetch Units", error);
			setLoading(false);
		}
	}, 100);

	useEffect(() => {
		if (!token) {return;}
		fetchUnits(searchTerm, page);
	},[token, searchTerm, page, saveValue]);

	useEffect(() => {
		const loadDropdowns = async () => {
			setCourses(await fetchDropdownData("/api/courses/"));
			setModules(await fetchDropdownData("/api/modules/"));
		};
	
		loadDropdowns();
	}, []);

	if (loading) {
		return <div className="p-4 text-sm text-gray-500">Loading branches...</div>;
	}

	const handleSave = async (e: React.FormEvent) => {
        e.preventDefault(); // 👈 prevent URL update and refresh
		
        try {
            if (isEditing && editingUnit) {
				await axios.put(`/api/units/${editingUnit.id}/`, formData, {
					headers: { Authorization: `Bearer ${token}` },
				});
				Swal.fire("Success", "Unit updated successfully!", "success");
			}
            setFormData({ name: "", uncode: "", abbr: "", course: "", module: "", weekly_hours: 0 });
            closeModal();
            onSave(!saved);
        } catch (err) {
            console.error(err);
            Swal.fire("Error", "Failed to edit unit", "error");
            setFormData({ name: "", uncode: "", abbr: "", course: "", module: "", weekly_hours: 0 });
            closeModal();
        }
    };
	
	const handleEditUnit = async (unit: Units) => {
		setEditingUnit(unit);
		setFormData({
			uncode: unit.uncode,
			name: unit.name,
			abbr: unit.abbr,
			course: unit.course,
			module: unit.module,
			weekly_hours: unit.weekly_hours
		});
		openModal();
	}

	const handleDeleteUnit = async (unitId: number, unitName: string) => {
		
		const result = await Swal.fire({
			title: "Are you sure?",
			text: `Do you want to delete ${unitName}? This action cannot be undone.`,
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#d33",
			cancelButtonColor: "#3085d6",
			confirmButtonText: "Yes, delete it!",
			cancelButtonText: "Cancel",
		});

		if (result.isConfirmed) {
			handleClose();
			try {
				await axios.delete(`/api/unit/${unitId}/`, {
					headers: { Authorization: `Bearer ${token}` },
				});
				Swal.fire("Deleted!", `${unitName} has been deleted.`, "success");
				fetchUnits(searchTerm, page); // Refresh list
			} catch (error) {
				console.error("Failed to delete unit", error);
				Swal.fire("Error", "Something went wrong. Could not delete the unit.", "error");
			}
		}
	};
	
	const handleClose = () => {
		setEditingUnit(null);
		setFormData({ name: "", uncode: "", abbr: "", course: "", module: "", weekly_hours: 0 });
		closeModal();
	};

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    
    const handleCourseSelect = (selected: string) => {
        setFormData((prev) => ({
          ...prev, course: selected,
        }));
    };

    const handleModuleSelect = (selected: string) => {
        setFormData((prev) => ({
          ...prev, module: selected,
        }));
    };

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
								Course
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
							{units.length === 0 ? (
								<TableRow>
									<TableCell colSpan={6} className="text-center">
										<div className="p-4 text-sm text-gray-500">
											No unit found...
										</div>
									</TableCell>
								</TableRow>
							) : (
								units.map((unit) => (
									<TableRow key={unit.id}>
										<TableCell className="px-5 py-4 sm:px-6 text-start">
											<div className="flex items-center gap-3">
												<div>
													<span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
														{unit.name}
													</span>
													<span className="block text-gray-500 text-theme-xs dark:text-gray-400">
														{unit.uncode}
													</span>
												</div>
											</div>
										</TableCell>
										<TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
											<div className="flex items-center gap-3">
												<div>
													<span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
														{unit.weekly_hours} Hrs
													</span>
													<span className="block text-gray-500 font-medium text-theme-xs dark:text-gray-400">
														{unit.abbr}
													</span>
												</div>
											</div>
										</TableCell>
										<TableCell className="px-5 py-4 sm:px-6 text-start">
											<div className="flex items-center gap-3">
												<div>
													<span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
														{unit.course_name}
													</span>
													<span className="block text-gray-500 text-theme-xs dark:text-gray-400">
														Module {unit.module_name}
													</span>
												</div>
											</div>
										</TableCell>
										<TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
											<div className="flex items-center gap-3">
												<div>
													<span className="block text-gray-500 font-medium text-theme-xs dark:text-gray-400">
														{formatDateTime(unit.dor)}
													</span>
												</div>
											</div>
										</TableCell>
										<TableCell>
											<button
												title="Edit Unit "
												className="text-blue-500 hover:text-red-600 transition-colors  px-4"
												onClick={() => handleEditUnit(unit)}
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

			<Modal isOpen={isOpen} onClose={handleClose} className="max-w-[700px] m-4">
                <div className="relative w-full p-4 overflow-y-auto bg-white no-scrollbar rounded-3xl dark:bg-gray-900 lg:p-11">
                    <div className="px-2 pr-14">
                        <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
							{isEditing ? "Edit Unit" : "Add Unit"}
						</h4>
						<p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
							Expand the functionality and services offered in the institution
						</p>
                    </div>

                    <form className="flex flex-col"  onSubmit={handleSave}>
                        <div className="px-2 custom-scrollbar">
                            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                                <div>
                                    <Label>Course  [Currently: {editingUnit?.course_name}]</Label>
                                    <SearchableSelect items={courses} onSelect={handleCourseSelect} />
                                </div>

                                <div>
                                    <Label>Module  [Currently: {editingUnit?.module_name}]</Label>
                                    <SearchableSelect items={modules} onSelect={handleModuleSelect} />
                                </div>

                                <div>
                                    <Label>Name</Label>
                                    <Input type="text" name="name" value={formData.name} onChange={handleChange}/>  
                                </div>

                                <div className="">
                                    <Label>Code</Label>
                                    <Input type="text" name="uncode" value={formData.uncode} onChange={handleChange} />  
                                </div>

                                <div>
                                    <Label>Abbreviation</Label>
                                    <Input type="text" name="abbr" value={formData.abbr} onChange={handleChange} />  
                                </div>

                                <div>
                                    <Label>Weekly Hours</Label>
                                    <Input type="text" name="weekly_hours" value={formData.weekly_hours} onChange={handleChange} />  
                                </div>

                            </div>
                        </div>

                        <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
							{isEditing ? (
								<button
									type="button"
									onClick={() => {
										if (editingUnit){
											handleDeleteUnit(editingUnit.id, editingUnit.name)
										}
									}}
									className="p-5 border border-red-500 rounded-lg items-center gap-2 bg-red-600 px-4 py-2.5 text-theme-md font-medium text-white shadow-theme-xs hover:bg-gray-100 hover:shadow-lg hover:text-red-600 dark:border-gray-700 dark:bg-red-800 dark:text-white dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
								>
									Delete Unit
								</button>
							) : (
                                <Button size="sm" variant="outline" onClick={closeModal}>
                                    Close
                                </Button>
							)}
							<button
								type="submit"
								className="p-5 border border-gray-500 rounded-lg items-center gap-2 bg-blue px-4 py-2.5 text-theme-md font-medium text-gray-700 shadow-theme-xs hover:bg-gray-100 hover:shadow-lg hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
							>
								Save Unit
							</button>
						</div>
                    </form>
                </div>
            </Modal>

		</>
	);
}
  