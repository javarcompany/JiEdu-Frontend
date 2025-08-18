import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "../../components/ui/table";
  
import { Edit2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import { formatDateTime } from "../../utils/format";
import Pagination from "../../components/ui/pagination";
import debounce from "lodash.debounce";
import { useModal } from "../../hooks/useModal";
import Swal from "sweetalert2";
import { Modal } from "../../components/ui/modal";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import Button from "../../components/ui/button/Button";

interface Department {
	id: number;
	name: string;
	abbr: string;
	dor: string	;
}

export default function DepartmentTable({saveValue, searchTerm }: {saveValue:boolean, searchTerm: string }) {
	const token = localStorage.getItem("access");
	const [departments, setDepartment] = useState<Department[]>([]);
	const [loading, setLoading] = useState<boolean>(true);

    const [page, setPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);

	const { isOpen, openModal, closeModal } = useModal();
	const [saved, onSave] = useState<boolean>(false);
	const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);
	const isEditing = Boolean(editingDepartment);

	const [formData, setFormData] = useState({
        name: "",
        abbr: "",
    });

	const fetchDepartments = debounce( async (searchTerm, page=1) => {
		try {
			const response = await axios.get(`/api/departments/?search=${searchTerm}&page=${page}`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			setPage(response.data.page);
			setDepartment(response.data.results);
			setTotalPages(response.data.total_pages || response.data.num_pages || 1);
			setLoading(false);
		} catch (error) {
			console.error("Failed to fetch Departments", error);
			setLoading(false);
		}
	}, 100);
	
	useEffect(() => {
		fetchDepartments(searchTerm, page);
	}, [searchTerm, page, saveValue, saved]);

	const filteredData = departments.filter((item) =>
		Object.values(item)
			.join(" ")
			.toLowerCase()
			.includes(searchTerm.toLowerCase())
	);
	
	if (loading) {
		return <div className="p-4 text-sm text-gray-500">Loading departments...</div>;
	}

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    }
	
    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault(); // 👈 prevent URL update and refresh
		
        try {
            if (isEditing && editingDepartment) {
				await axios.put(`/api/departments/${editingDepartment.id}/`, formData, {
					headers: { Authorization: `Bearer ${token}` },
				});
				Swal.fire("Success", "Department updated successfully!", "success");
			}
            setFormData({ name: "", abbr: "" });
            closeModal();
            onSave(!saved);
        } catch (err) {
            console.error(err);
            Swal.fire("Error", "Failed to edit department", "error");
            setFormData({ name: "", abbr: "" });
            closeModal();
        }
    };
	
	const handleEditDepartment = async (department: Department) => {
		setEditingDepartment(department);
		setFormData({
			name: department.name,
			abbr: department.abbr,
		});
		openModal();
	}

	const handleDeleteDepartment = async (departmentId: number, departmentName: string) => {
		
		const result = await Swal.fire({
			title: "Are you sure?",
			text: `Do you want to delete ${departmentName} Department? This action cannot be undone.`,
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
				await axios.delete(`/api/departments/${departmentId}/`, {
					headers: { Authorization: `Bearer ${token}` },
				});
				Swal.fire("Deleted!", `${departmentName} Department has been deleted.`, "success");
				fetchDepartments(searchTerm, page); // Refresh list
			} catch (error) {
				console.error("Failed to delete department", error);
				Swal.fire("Error", "Something went wrong. Could not delete the department.", "error");
			}
		}
	};
	
	const handleClose = () => {
		setEditingDepartment(null);
		setFormData({ name: "", abbr: ""});
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
							{filteredData.length === 0 ? (
								<TableRow>
									<TableCell colSpan={6} className="text-center">
										<div className="p-4 text-sm text-gray-500">
											No department found...
										</div>
									</TableCell>
								</TableRow>
							) : (
								filteredData.map((department) => (
									<TableRow key={department.id}>
										<TableCell className="px-5 py-4 sm:px-6 text-start">
											<div className="flex items-center gap-3">
												<div>
													<span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
														{department.name}
													</span>
												</div>
											</div>
										</TableCell>
										<TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
											<div className="flex items-center gap-3">
												<div>
													<span className="block text-gray-500 font-medium text-theme-xs dark:text-gray-400">
														{department.abbr}
													</span>
												</div>
											</div>
										</TableCell>
										<TableCell className="px-5 py-4 sm:px-6 text-start">
											<div className="flex items-center gap-3">
												<div>
													<span className="block text-gray-500 text-theme-xs dark:text-gray-400">
														{formatDateTime(department.dor)}
													</span>
												</div>
											</div>
										</TableCell>
										<TableCell>
											<button
												title="Edit Department "
												className="text-blue-500 hover:text-red-600 transition-colors  px-4"
												onClick={() => handleEditDepartment(department)}
											>
												<Edit2Icon size={20} />
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
							{isEditing ? "Edit Branch" : "Add Branch"}
						</h4>
						<p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
							Expand the functionality and services offered in the institution
						</p>
                    </div>

                    <form className="flex flex-col"  onSubmit={handleSave}>
                        <div className="px-2 overflow-y-auto custom-scrollbar">
                            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                                <div>
                                    <Label>Name</Label>
                                    <Input type="text"  name="name" value={formData.name} onChange={handleChange} />  
                                </div>

                                <div>
                                    <Label>Abbreviation</Label>
                                    <Input type="text"  name="abbr" value={formData.abbr} onChange={handleChange}   />  
                                </div>

                            </div>
                        </div>

                        <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
							{isEditing ? (
								<button
									type="button"
									onClick={() => {
										if (editingDepartment){
											handleDeleteDepartment(editingDepartment.id, editingDepartment.name)
										}
									}}
									className="p-5 border border-red-500 rounded-lg items-center gap-2 bg-red-600 px-4 py-2.5 text-theme-md font-medium text-white shadow-theme-xs hover:bg-gray-100 hover:shadow-lg hover:text-red-600 dark:border-gray-700 dark:bg-red-800 dark:text-white dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
								>
									Delete Department
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
								Save Department
							</button>
						</div>
                    </form>
                </div>
            </Modal>
		</>	
	);
}
