import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "../../components/ui/table";
import { useEffect, useState } from "react";
import axios from "axios";

import {  EyeIcon } from "lucide-react";
import debounce from "lodash.debounce";
import Pagination from "../../components/ui/pagination";
import Badge from "../../components/ui/badge/Badge";

import Swal from "sweetalert2";
import { Modal } from "../../components/ui/modal";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import Button from "../../components/ui/button/Button";
import { useModal } from "../../hooks/useModal";
import { fetchDropdownData } from "../../utils/apiFetch";
import SearchableSelect from "../../components/form/DictSelect";
  
export interface Class {
	id: number;
	name: string;
	year: string;
	year_name: string;
	intake: string;
	intake_name: string;
	branch: string;
	branch_name: string;
	course: string;
	course_name: string;
	module: string;
	module_name: string;
	state: string;
	dor: string;
}
  
export default function ClassTable({saveValue, searchTerm }: {saveValue:boolean, searchTerm: string }) {
	const token = localStorage.getItem("access");
  	const [classes, setClasses] = useState<Class[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [page, setPage] = useState<number>(1);
	const [totalPages, setTotalPages] = useState<number>(1);  

	const { isOpen, openModal, closeModal } = useModal();
	const [saved, onSave] = useState<boolean>(false);
	const [editingClass, setEditingClass] = useState<Class | null>(null);
	const isEditing = Boolean(editingClass);

	const [branches, setBranch] = useState<{ value: string; label: string; }[]>([]);
    const [modules, setModule] = useState<{ value: string; label: string; }[]>([]);
    const [courses, setCourse] = useState<{ value: string; label: string; }[]>([]);
    const [intakes, setIntake] = useState<{ value: string; label: string; }[]>([]);
  
	const [formData, setFormData] = useState({
        name: "",
        course: "",
        intake: "",
        branch: "",
        module: "",
    });

	const fetchClasses = debounce(async (query, page=1) => {
		try {
			const response = await axios.get(`/api/classes/?search=${query}&page=${page}`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			setClasses(response.data.results);
			setLoading(false);
			setPage(response.data.page || 1);
    		setTotalPages(response.data.total_pages || response.data.num_pages || 1);
		} catch (error) {
			console.error("Failed to fetch Classes", error);
			setLoading(false);
		}
	}, 100);

	useEffect(() => {
		if (!token) {return;}
		
		fetchClasses(searchTerm, page);
	}, [token, searchTerm, page, saveValue]);
	
	useEffect(() => {
		const loadDropdowns = async () => {
			setCourse(await fetchDropdownData("/api/courses/"));
			setModule(await fetchDropdownData("/api/modules/"));
			setBranch(await fetchDropdownData("/api/branches/"));
			setIntake(await fetchDropdownData("/api/terms/", "termyear"));
		};
	
		loadDropdowns();
	}, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCourseSelect = (selected: string) => {
        setFormData((prev) => ({
          ...prev, course: selected,
        }));
    };
    const handleIntakeSelect = (selected: string) => {
        setFormData((prev) => ({
          ...prev, intake: selected,
        }));
    };
    const handleBranchSelect = (selected: string) => {
        setFormData((prev) => ({
          ...prev, branch: selected,
        }));
    };
    const handleModuleSelect = (selected: string) => {
        setFormData((prev) => ({
          ...prev, module: selected,
        }));
    };

	if (loading) {
		return <div className="p-4 text-sm text-gray-500">Loading classes...</div>;
	}

	
	const handleEditClass = async (class_: Class) => {
		setEditingClass(class_);
		setFormData({
			name: class_.name,
			course: class_.course,
			intake: class_.intake,
			branch: class_.branch,
			module: class_.module
		});
		openModal();
	}

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault(); // 👈 prevent URL update and refresh
      
        try {
            if (isEditing && editingClass) {
				await axios.put(`/api/classes/${editingClass.id}/`, formData, {
					headers: { Authorization: `Bearer ${token}` },
				});
				Swal.fire("Success", "Class updated successfully!", "success");
			}
            Swal.fire("Success", "Class created successfully!", "success");
            setFormData({ name: "", course: "", intake: "", branch: "", module: "" });
            
            onSave(!true);

            closeModal();
        } catch (err) {
            console.error(err);
            Swal.fire("Error", "Failed to create class", "error");
            setFormData({ name: "", course: "", intake: "", branch: "", module: "" });
            closeModal();
        }
    };

	const handleDeleteClass = async (classId: number, className: string) => {
		
		const result = await Swal.fire({
			title: "Are you sure?",
			text: `Do you want to delete ${className} Class? This action cannot be undone.`,
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
				await axios.delete(`/api/classes/${classId}/`, {
					headers: { Authorization: `Bearer ${token}` },
				});
				Swal.fire("Deleted!", `${className} Class has been deleted.`, "success");
				fetchClasses(searchTerm, page); // Refresh list
            	onSave(!saved);
			} catch (error) {
				console.error("Failed to delete classes", error);
				Swal.fire("Error", "Something went wrong. Could not delete the class.", "error");
			}
		}
	};
	
	const handleClose = () => {
		setEditingClass(null);
		setFormData({ name: "", course: "", intake: "", branch: "", module: "" });
		closeModal();
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
									Course
								</TableCell>
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
									Module
								</TableCell>
								<TableCell
									isHeader
									className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
								>
									Year/ Intake
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
							{classes.length === 0 ? (
								<TableRow>
									<TableCell colSpan={6} className="text-center">
										<div className="p-4 text-sm text-gray-500">
											No class found...
										</div>
									</TableCell>
								</TableRow>
							) : (
								classes.map((class_) => (
									<TableRow key={class_.id}>
										<TableCell className="px-5 py-4 sm:px-6 text-start">
											<div className="flex items-center gap-3">
												<div>
													<span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
														{class_.course_name}
													</span>
													<span className="block text-gray-500 text-theme-xs dark:text-gray-400">
														{class_.branch_name}
													</span>
												</div>
											</div>
										</TableCell>
										<TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
											<div className="flex items-center gap-3">
												<div>
													<span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
														{class_.name}
													</span>
												</div>
											</div>
										</TableCell>
										<TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
											<div className="flex items-center gap-3">
												<div>
													<span className="block text-gray-500 font-medium text-theme-xs dark:text-gray-400">
														{class_.module_name}
													</span>
												</div>
											</div>
										</TableCell>
										<TableCell className="px-5 py-4 sm:px-6 text-start">
											<div className="flex items-center gap-3">
												<div>
													<span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
														{class_.year_name}
													</span>
													<span className="block text-gray-500 text-theme-xs dark:text-gray-400">
														{class_.intake_name}
													</span>
												</div>
											</div>
										</TableCell>
										<TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
											<Badge
												size="sm"
												color={
													class_.state === "Active"
													? "success"

													: class_.state === "Cleared"
													? "primary"

													: class_.state === "Suspended"
													? "warning"
													
													: "error"
												}
											>
												{class_.state}
											</Badge>
										</TableCell>
										<TableCell>
											<button
												title="Edit Class "
												className="text-blue-500 hover:text-red-600 transition-colors  px-4"
												onClick={() => handleEditClass(class_)}
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
							{isEditing ? "Edit Class" : "Add Class"}
						</h4>
						<p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
							Expand the functionality and services offered in the institution
						</p>
                    </div>

                    <form className="flex flex-col"  onSubmit={handleSave}>
                        <div className="px-2 custom-scrollbar">
                            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                                <div>
                                    <Label>Branch  [Currently: {editingClass?.branch_name}]</Label>
                                    <SearchableSelect items={branches} onSelect={handleBranchSelect} />
                                </div>

                                <div>
                                    <Label>Course  [Currently: {editingClass?.course_name}]</Label>
                                    <SearchableSelect items={courses} onSelect={handleCourseSelect} />
                                </div>

                                <div>
                                    <Label>Intake   [Currently: {editingClass?.intake_name}]</Label>
                                    <SearchableSelect items={intakes} onSelect={handleIntakeSelect} />
                                </div>

                                <div>
                                    <Label>Module   [Currently: {editingClass?.module_name}]</Label>
                                    <SearchableSelect items={modules} onSelect={handleModuleSelect} />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 py-5 gap-x-6 gap-y-5 lg:grid-cols-1">
                                <div>
                                    <Label>Name</Label>
                                    <Input type="text" name="name" value={formData.name} onChange={handleChange} />  
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
							{isEditing ? (
								<button
									type="button"
									onClick={() => {
										if (editingClass){
											handleDeleteClass(editingClass.id, editingClass.name)
										}
									}}
									className="p-5 border border-red-500 rounded-lg items-center gap-2 bg-red-600 px-4 py-2.5 text-theme-md font-medium text-white shadow-theme-xs hover:bg-gray-100 hover:shadow-lg hover:text-red-600 dark:border-gray-700 dark:bg-red-800 dark:text-white dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
								>
									Delete Class
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
								Save Class
							</button>
						</div>
                    </form>
                </div>
            </Modal>
		</>
    );
  }
  