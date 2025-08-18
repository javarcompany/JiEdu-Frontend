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
import debounce from "lodash.debounce";
import Pagination from "../../components/ui/pagination";
import { useModal } from "../../hooks/useModal";
import Swal from "sweetalert2";
import { Modal } from "../../components/ui/modal";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import Button from "../../components/ui/button/Button";

interface Branch {
	id: number;
	name: string;
	code: string;
	paddr: string;
	tel_a: string;
	tel_b: string;
	email: string;
}
  
export default function BranchesTable({saveValue, searchTerm }: {saveValue:boolean, searchTerm: string }) {
	const token = localStorage.getItem("access");
	const [branches, setBranches] = useState<Branch[]>([]);
	const [loading, setLoading] = useState<boolean>(true);

    const [page, setPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
	
	const { isOpen, openModal, closeModal } = useModal();
	const [saved, onSave] = useState<boolean>(false);
	const [editingBranch, setEditingBranch] = useState<Branch | null>(null);
	const isEditing = Boolean(editingBranch);

	const [formData, setFormData] = useState({
        name: "",
        code: "",
        paddr: "",
        tel_a: "",
        tel_b: "",
        email: "",
    });

    const [error, setError] = useState({
        email: false,
        tel_a: false,
        tel_b: false,
    });

	const fetchBranches = debounce( async (searchTerm, page = 1) => {
		try {
			const response = await axios.get(`/api/branches/?search=${searchTerm}&page=${page}`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			setPage(response.data.page);
			setBranches(response.data.results);
			setTotalPages(response.data.total_pages || response.data.num_pages || 1);
			setLoading(false);
		} catch (error) {
			console.error("Failed to fetch branches", error);
			setLoading(false);
		}
	}, 100);

	useEffect(() => {
		fetchBranches(searchTerm, page);
	}, [page, searchTerm, saveValue, saved]);

    const filteredData = branches.filter((item) =>
        Object.values(item)
            .join(" ")
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
    );

	if (loading) {
		return <div className="p-4 text-sm text-gray-500">Loading branches...</div>;
	}
	
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    
        // Basic field validation
        if (name === "email") {
          const valid = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value);
          setError(prev => ({ ...prev, email: !valid }));
        }
        if (name === "tel_a") {
          const valid = /^\d{10,}$/.test(value);
          setError(prev => ({ ...prev, tel_a: !valid }));
        }
        if (name === "tel_b"){
            const valid = /^\d{10,}$/.test(value);
            setError(prev => ({ ...prev, tel_b: !valid}));
        }
    };
	
    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault(); // 👈 prevent URL update and refresh
      
        if (error.email || error.tel_a) {
            Swal.fire("Invalid input", "Please fix errors before submitting", "error");
            return;
        }
		
        try {
            if (isEditing && editingBranch) {
				await axios.put(`/api/branches/${editingBranch.id}/`, formData, {
					headers: { Authorization: `Bearer ${token}` },
				});
				Swal.fire("Success", "Branch updated successfully!", "success");
			}
            setFormData({ name: "", code: "", paddr: "", tel_a: "", tel_b: "", email: "" });
            closeModal();
            onSave(!saved);
        } catch (err) {
            console.error(err);
            Swal.fire("Error", "Failed to edit branch", "error");
            setFormData({ name: "", code: "", paddr: "", tel_a: "", tel_b: "", email: "" });
            closeModal();
        }
    };
	
	const handleEditBranch = async (branch: Branch) => {
		setEditingBranch(branch);
		setFormData({
			name: branch.name,
			code: branch.code,
			paddr: branch.paddr,
			tel_a: branch.tel_a,
			tel_b: branch.tel_b,
			email: branch.email,
		});
		openModal();
	}

	const handleDeleteBranch = async (branchId: number, branchName: string) => {
		
		const result = await Swal.fire({
			title: "Are you sure?",
			text: `Do you want to delete the ${branchName} Branch? This action cannot be undone.`,
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
				await axios.delete(`/api/branch/${branchId}/`, {
					headers: { Authorization: `Bearer ${token}` },
				});
				Swal.fire("Deleted!", `${branchName} Branch has been deleted.`, "success");
				fetchBranches(searchTerm, page); // Refresh list
			} catch (error) {
				console.error("Failed to delete branch", error);
				Swal.fire("Error", "Something went wrong. Could not delete the branch.", "error");
			}
		}
	};
	
	const handleClose = () => {
		setEditingBranch(null);
		setFormData({ name: "", code: "", paddr: "", tel_a: "", tel_b: "", email: "" });
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
								Address
							</TableCell>
							<TableCell
								isHeader
								className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
							>
								Phone
							</TableCell>
							<TableCell
								isHeader
								className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
							>
								Email
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
											No branches found...
										</div>
									</TableCell>
								</TableRow>
							) : (
								filteredData.map((branch) => (
									<TableRow key={branch.id}>
										<TableCell className="px-5 py-4 sm:px-6 text-start">
											<div className="flex items-center gap-3">
												<div>
													<span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
														{branch.name}
													</span>
													<span className="block text-gray-500 text-theme-xs dark:text-gray-400">
														{branch.code}
													</span>
												</div>
											</div>
										</TableCell>
										<TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
											<div className="flex items-center gap-3">
												<div>
													<span className="block text-gray-500 font-medium text-theme-xs dark:text-gray-400">
														{branch.paddr}
													</span>
												</div>
											</div>
										</TableCell>
										<TableCell className="px-5 py-4 sm:px-6 text-start">
											<div className="flex items-center gap-3">
												<div>
													<span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
														{branch.tel_a}
													</span>
													<span className="block text-gray-500 text-theme-xs dark:text-gray-400">
														{branch.tel_b}
													</span>
												</div>
											</div>
										</TableCell>
										<TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
											<div className="flex items-center gap-3">
												<div>
													<span className="block text-gray-500 font-medium text-theme-xs dark:text-gray-400">
														{branch.email}
													</span>
												</div>
											</div>
										</TableCell>
										<TableCell>
											<button
												title="Edit Branch "
												className="text-blue-500 hover:text-red-600 transition-colors  px-4"
												onClick={() => handleEditBranch(branch)}
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
                                    <Input type="text"  name="name" value={formData.name} onChange={handleChange}  />  
                                </div>

                                <div>
                                    <Label>Code</Label>
                                    <Input type="text"  name="code" value={formData.code} onChange={handleChange} />  
                                </div>

                                <div>
                                    <Label>Phone A</Label>
                                    <Input
                                        type="text"
                                        name="tel_a"
                                        value={formData.tel_a}
                                        onChange={handleChange}
                                        error={error.tel_a}
                                        hint={error.tel_a ? "Enter a valid phone number" : ""}
                                    
                                    />
                                </div>

                                <div>
                                    <Label>Phone B</Label>
                                    <Input 
                                        type="text" 
                                        name="tel_b" 
                                        value={formData.tel_b} 
                                        onChange={handleChange} 
                                        error={error.tel_b}
                                        hint={error.tel_b ? "Enter a valid phone number" : ""}
                                    
                                    />
                                </div>

                                <div className="col-span-2">
                                    <Label>Email</Label>
                                    <Input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        error={error.email}
                                        hint={error.email ? "This is an invalid email address." : ""}
                                    
                                    />
                                </div>

                                <div className="col-span-2">
                                    <Label>Address</Label>
                                    <Input type="text" name="paddr" value={formData.paddr} onChange={handleChange} />
                                </div>

                            </div>
                        </div>

                        <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
							{isEditing ? (
								<button
									type="button"
									onClick={() => {
										if (editingBranch){
											handleDeleteBranch(editingBranch.id, editingBranch.name)
										}
									}}
									className="p-5 border border-red-500 rounded-lg items-center gap-2 bg-red-600 px-4 py-2.5 text-theme-md font-medium text-white shadow-theme-xs hover:bg-gray-100 hover:shadow-lg hover:text-red-600 dark:border-gray-700 dark:bg-red-800 dark:text-white dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
								>
									Delete Branch
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
								Save Branch
							</button>
						</div>
                    </form>
                </div>
            </Modal>
		
		</>
    );
  }
  