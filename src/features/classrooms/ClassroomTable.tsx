import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "../../components/ui/table";
  
import {  EyeIcon } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import Pagination from "../../components/ui/pagination";
import debounce from "lodash.debounce";
import { formatDateTime } from "../../utils/format";
import { useModal } from "../../hooks/useModal";
import { fetchDropdownData } from "../../utils/apiFetch";
import Swal from "sweetalert2";
import { Modal } from "../../components/ui/modal";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import Button from "../../components/ui/button/Button";
import SearchableSelect from "../../components/form/DictSelect";

interface Classroom {
	id: number;
	name: string;
	branch_name: string;
	branch: string;
	dor: string;
}

export default function ClassroomTable({saveValue, searchTerm }: {saveValue:boolean, searchTerm: string }) {
	const token = localStorage.getItem("access");
	const [classrooms, setClassrooms] = useState<Classroom[]>([]);
	const [loading, setLoading] = useState<boolean>(true);  

    const [page, setPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [branches, setBranch] = useState<{ value: string; label: string; }[]>([]);

	const { isOpen, openModal, closeModal } = useModal();
	const [saved, onSave] = useState<boolean>(false);
	const [editingClassroom, setEditingClassroom] = useState<Classroom | null>(null);
	const isEditing = Boolean(editingClassroom);

	const [formData, setFormData] = useState({
        branch: "",
        name: ""
    });
	
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    const handleSelect = (selected: string) => {
        setFormData((prev) => ({
          ...prev, branch: selected,
        }));
    };

	useEffect(() => {
		const loadDropdowns = async () => {
		  setBranch(await fetchDropdownData("/api/branches/"));
		};
	
		loadDropdowns();
	}, []);

	const fetchClassrooms = debounce( async (searchTerm, page = 1) => {
		try {
			const response = await axios.get(`/api/classrooms/?search=${searchTerm}&page=${page}`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
            setPage(response.data.page);
			setClassrooms(response.data.results);
            setTotalPages(response.data.total_pages || response.data.num_pages || 1);
			setLoading(false);
		} catch (error) {
			console.error("Failed to fetch Classrooms", error);
			setLoading(false);
		}
	}, 100);

	useEffect(() => {
		fetchClassrooms(searchTerm, page);
	}, [page, searchTerm, saveValue, saved]);

	const filteredData = classrooms.filter((item) =>
        Object.values(item)
            .join(" ")
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
    );

	if (loading) {
		return <div className="p-4 text-sm text-gray-500">Loading classrooms...</div>;
	}

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault(); // 👈 prevent URL update and refresh
		
        try {
            if (isEditing && editingClassroom) {
				await axios.put(`/api/classrooms/${editingClassroom.id}/`, formData, {
					headers: { Authorization: `Bearer ${token}` },
				});
				Swal.fire("Success", "Classroom updated successfully!", "success");
			}
            setFormData({ name: "", branch: "" });
            closeModal();
            onSave(!saved);
        } catch (err) {
            console.error(err);
            Swal.fire("Error", "Failed to edit classroom", "error");
            setFormData({ name: "", branch: "" });
            closeModal();
        }
    };
	
	const handleEditClassroom = async (classroom: Classroom) => {
		setEditingClassroom(classroom);
		setFormData({
			name: classroom.name,
			branch: classroom.branch,
		});
		openModal();
	}

	const handleDeleteClassroom = async (classroomId: number, classroomName: string) => {
		
		const result = await Swal.fire({
			title: "Are you sure?",
			text: `Do you want to delete Room ${classroomName}? This action cannot be undone.`,
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
				await axios.delete(`/api/classroom/${classroomId}/`, {
					headers: { Authorization: `Bearer ${token}` },
				});
				Swal.fire("Deleted!", `Room ${classroomName} has been deleted.`, "success");
				fetchClassrooms(searchTerm, page); // Refresh list
			} catch (error) {
				console.error("Failed to delete classroom", error);
				Swal.fire("Error", "Something went wrong. Could not delete the classroom.", "error");
			}
		}
	};
	
	const handleClose = () => {
		setEditingClassroom(null);
		setFormData({ name: "", branch: ""});
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
								Branch
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
											No classroom found...
										</div>
									</TableCell>
								</TableRow>
							) : (
								filteredData.map((classroom) => (
									<TableRow key={classroom.id}>
										<TableCell className="px-5 py-4 sm:px-6 text-start">
											<div className="flex items-center gap-3">
												<div>
													<span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
														{classroom.name}
													</span>
												</div>
											</div>
										</TableCell>
										<TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
											<div className="flex items-center gap-3">
												<div>
													<span className="block text-gray-500 font-medium text-theme-xs dark:text-gray-400">
														{classroom.branch_name}
													</span>
												</div>
											</div>
										</TableCell>
										<TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
											<div className="flex items-center gap-3">
												<div>
													<span className="block text-gray-500 font-medium text-theme-xs dark:text-gray-400">
														{formatDateTime(classroom.dor)}
													</span>
												</div>
											</div>
										</TableCell>
										<TableCell>
											<button
												title="Edit Classroom "
												className="text-blue-500 hover:text-red-600 transition-colors  px-4"
												onClick={() => handleEditClassroom(classroom)}
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
							{isEditing ? "Edit Classroom" : "Add Classroom"}
						</h4>
						<p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
							Expand the functionality and services offered in the institution
						</p>
                    </div>

                    <form className="flex flex-col"  onSubmit={handleSave}>
                        <div className="px-2 custom-scrollbar">
                            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                                <div>
                                    <Label>Branch  [Currently: {editingClassroom?.branch_name}]</Label>
                                    <SearchableSelect items={branches} onSelect={handleSelect} />
                                </div>

                                <div>
                                    <Label>Name</Label>
                                    <Input type="text"  name="name" value={formData.name} onChange={handleChange}/>  
                                </div>

                            </div>
                        </div>

                        <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
							{isEditing ? (
								<button
									type="button"
									onClick={() => {
										if (editingClassroom){
											handleDeleteClassroom(editingClassroom.id, editingClassroom.name)
										}
									}}
									className="p-5 border border-red-500 rounded-lg items-center gap-2 bg-red-600 px-4 py-2.5 text-theme-md font-medium text-white shadow-theme-xs hover:bg-gray-100 hover:shadow-lg hover:text-red-600 dark:border-gray-700 dark:bg-red-800 dark:text-white dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
								>
									Delete Classroom
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
								Save Classroom
							</button>
						</div>
                    </form>
                </div>
            </Modal>
		</>
    );
  }
  