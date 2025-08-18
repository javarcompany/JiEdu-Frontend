import { ChartCandlestickIcon, ClipboardEditIcon } from "lucide-react";
import { Modal } from "../../components/ui/modal";
import { useModal } from "../../hooks/useModal";
import Pagination from "../../components/ui/pagination";
import { SearchButton } from "../../components/dashboard/SearchButton";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "../../components/ui/table";
import { useEffect, useState } from "react";
import debounce from "lodash.debounce";
import axios from "axios";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import Button from "../../components/ui/button/Button";
import Swal from "sweetalert2";

interface Priorities{
	id: number;
	name: string;
	rank: string;
}

export default function PriorityLevels () {
	const token = localStorage.getItem("access");
    
	const { isOpen, openModal, closeModal } = useModal();
	const [searchTerm, setSearchTerm] = useState<string>("");
	const [priorities, setPriorities] = useState<Priorities[]>([]);
	
	const [page, setPage] = useState<number>(1);
	const [totalPages, setTotalPages] = useState<number>(1);

	const [saved, onSave] = useState<boolean>(false);
	
	const [editingPriority, setEditingPriority] = useState<Priorities | null>(null);
	const isEditing = Boolean(editingPriority);
		
	const [formData, setFormData] = useState({
        name: "",
        rank: ""
    });
	
    const fetchPriorities = debounce(async (searchTerm: any, page=1) => {
        try {
            const response = await axios.get(`/api/prioritylevel/?search=${searchTerm}&page=${page}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setPage(response.data.page);
            setPriorities(response.data.results);
            setTotalPages(response.data.total_pages || response.data.num_pages || 1);
        } catch (error) {
            console.error("Failed to fetch Payment Methods", error);
        }
    }, 100);

    useEffect(() => {
        fetchPriorities(searchTerm, page);
    }, [page, searchTerm, saved]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

	const handleEditPriority = async (priority: Priorities) => {
		setEditingPriority(priority);
		setFormData({
			name: priority.name,
			rank: priority.rank,
		});
		openModal();
	}

	const handleDeletePriority = async (priorityId: number, priorityName: string) => {
		
		const result = await Swal.fire({
			title: "Are you sure?",
			text: `Do you want to delete the Priority "${priorityName}"? This action cannot be undone.`,
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
				await axios.delete(`/api/prioritylevel/${priorityId}/`, {
					headers: { Authorization: `Bearer ${token}` },
				});
				Swal.fire("Deleted!", `"${priorityName}" has been deleted.`, "success");
				fetchPriorities(searchTerm, page); // Refresh list
			} catch (error) {
				console.error("Failed to delete priority", error);
				Swal.fire("Error", "Something went wrong. Could not delete the priority.", "error");
			}
		}
	};
	

	const handleSave = async (e: React.FormEvent) => {
        e.preventDefault(); // 👈 prevent URL update and refresh
    
        try {
            if (isEditing && editingPriority) {
				await axios.put(`/api/prioritylevel/${editingPriority.id}/`, formData, {
					headers: { Authorization: `Bearer ${token}` },
				});
				Swal.fire("Success", "Priority updated successfully!", "success");
			} else {
				await axios.post("/api/prioritylevel/", 
					formData,
					{
						headers: {
							Authorization: `Bearer ${token}`,
						},
					}
				);
				Swal.fire("Success", "Priority created successfully!", "success");
			}
			setFormData({ name: "", rank: "" });

            onSave(!saved);

            closeModal();
        } catch (err: any) {
            const errorMsg = err?.response?.data.error || "An unexpected error occurred";
            Swal.fire("Error", `${errorMsg}`, "error");
            setFormData({ name: "", rank: "" });
            closeModal();
        }
    };

	const handleClose = () => {
		setEditingPriority(null);
		setFormData({ name: "", rank: "" });
		closeModal();
	};

    return(
        <>
			<div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
				<div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
					<div>
						<h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
							Priority
						</h3>
					</div>

					<div className="flex items-center gap-3">
						<SearchButton onSearch={setSearchTerm} />
						<button 
							onClick={openModal} 
							className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
						>
							<ChartCandlestickIcon />
							Add
						</button>
					</div>
				</div>
				
				<div className="max-w-full overflow-x-auto relative overflow-hidden">
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
									Rank
								</TableCell>

								<TableCell
									isHeader
									className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
								>
									Action
								</TableCell>

							</TableRow>
						</TableHeader>

						{/* Table Body */}
						<TableBody 
							className="divide-y divide-gray-100 dark:divide-gray-800 transition-transform duration-1000 ease-in-out"
						>
							{priorities.length === 0 ? (
								<TableRow>
									<div className="p-4 text-sm text-gray-500">No Priority found.....</div>
								</TableRow>
							) : (
								priorities.map((priority) => (
									<TableRow key={priority.id}>
										<TableCell className="px-5 py-4 sm:px-6 text-start">
											<div className="flex items-center gap-3">
												<div>
													<span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
														{priority.name}
													</span>
												</div>
											</div>
										</TableCell>

										<TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
											<div className="flex items-center gap-3">
												<div>
													<span className="block text-gray-500 text-theme-xs dark:text-gray-400">
														{priority.rank}%
													</span>
												</div>
											</div>
										</TableCell>

										<TableCell>
											<button
												title="Edit Priority "
												className="text-blue-500 hover:text-red-600 transition-colors  px-4"
												onClick={() => handleEditPriority(priority)}
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
		

			<Modal isOpen={isOpen} onClose={handleClose} className="max-w-[700px] m-4">
				<div className="relative w-full p-4 bg-white no-scrollbar rounded-3xl dark:bg-gray-900 lg:p-11">
					<div className="px-2 pr-14">
						<h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
							{isEditing ? "Edit Priority Level" : "Add Priority Level"}
						</h4>
						<p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
							Expand the functionality and services offered in the institution
						</p>
					</div>
					
					<form className="flex flex-col" onSubmit={handleSave}>
						<div className="px-2 custom-scrollbar">
							<div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
					
								<div>
									<Label>Name</Label>
									<Input type="text" name="name" value={formData.name} onChange={handleChange}/>  
								</div>

								<div className="">
									<Label>Rank</Label>
									<Input type="text" name="rank" value={formData.rank} onChange={handleChange} />  
								</div>

							</div>
						</div>

						<div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
							{isEditing ? (
								<button
									type="button"
									onClick={() => {
										if (editingPriority){
											handleDeletePriority(editingPriority.id, editingPriority.name)
										}
									}}
									className="p-5 border border-red-500 rounded-lg items-center gap-2 bg-red-600 px-4 py-2.5 text-theme-md font-medium text-white shadow-theme-xs hover:bg-gray-100 hover:shadow-lg hover:text-red-600 dark:border-gray-700 dark:bg-red-800 dark:text-white dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
								>
									Delete Priority
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
								Save Priority
							</button>
						</div>
					</form>
				</div>
			</Modal>
		</>
    );
}