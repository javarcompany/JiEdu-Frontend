import { ClipboardEditIcon, CpuIcon } from "lucide-react";
import { Modal } from "../../components/ui/modal";
import { useModal } from "../../hooks/useModal";
import Pagination from "../../components/ui/pagination";
import { SearchButton } from "../../components/dashboard/SearchButton";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../components/ui/table";
import { useEffect, useState } from "react";
import axios from "axios";
import debounce from "lodash.debounce";
import Input from "../../components/form/input/InputField";
import Label from "../../components/form/Label";
import Swal from "sweetalert2";
import SearchableSelect from "../../components/form/DictSelect";
import Button from "../../components/ui/button/Button";

export interface Account{
    id: number;
    votehead: string;
    abbr: string;
    priority: string;
    priority_name: string;
    priority_level: string;
}

export default function PaymentAccounts () {
    const token = localStorage.getItem("access");
    const { isOpen, openModal, closeModal } = useModal();
	const [searchTerm, setSearchTerm] = useState<string>("");
    
	const [accounts, setAccounts] = useState<Account[]>([]);
	
	const [page, setPage] = useState<number>(1);
	const [totalPages, setTotalPages] = useState<number>(1);

    const [editingAccount, setEditingAccount] = useState<Account | null>(null);
    const isEditing = Boolean(editingAccount);
    
	const [priorities, setPriorities] = useState<{ 
        value: string;
        label: string;
    }[]>([]);
	
	const [saved, onSave] = useState<boolean>(false);
    
	const [formData, setFormData] = useState({
        votehead: "",
        abbr: "",
		priority: ""
    });

	const fetchAccounts = debounce(async (searchTerm, page=1) => {
        try {
            const response = await axios.get(`/api/accounts/?search=${searchTerm}&page=${page}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setPage(response.data.page);
            setAccounts(response.data.results);
            setTotalPages(response.data.total_pages || response.data.num_pages || 1);
        } catch (error) {
            console.error("Failed to fetch accounts", error);
        }
    }, 100);

    useEffect(() => {
		const fetchPriorities = async () => {
            try {
                const response = await axios.get("/api/prioritylevel/?all=true/",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                ); // Adjust this URL if needed
                const data = response.data.results;
                // Convert priorities to the format expected by SearchableSelect
                const formatted = data.map((priority : any) => ({
                    value: priority.id.toString(),
                    label: priority.name,      
                }));
                
                setPriorities(formatted);
                } catch (error) {
                console.error("Failed to load Priorities", error);
            }
        };

		fetchPriorities();
        fetchAccounts(searchTerm, page);

    }, [page, searchTerm, saved]);

	const handleDeleteAccount = async (accountID: number, accountName: string) => {
		
		const result = await Swal.fire({
			title: "Are you sure?",
			text: `Do you want to delete the Fee Account "${accountName}"? This action cannot be undone.`,
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
				await axios.delete(`/api/accounts/${accountID}/`, {
					headers: { Authorization: `Bearer ${token}` },
				});
				Swal.fire("Deleted!", `"${accountName}" has been deleted.`, "success");
				fetchAccounts(searchTerm, page); // Refresh list
			} catch (error) {
				console.error("Failed to delete fee account.", error);
				Swal.fire("Error", "Something went wrong. Could not delete the fee account.", "error");
			}
		}
	};

    const handleEditAccount = async (account: Account) => {
		setEditingAccount(account);
		setFormData({
            votehead: account.votehead,
            abbr: account.abbr,
            priority: account.priority,
		});
		openModal();
	}

    const handleClose = () => {
		setEditingAccount(null);
		setFormData({ votehead: "", abbr: "", priority: "" });
		closeModal();
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

	const handlePrioritySelect = (selected: string) => {
        setFormData((prev) => ({
          ...prev, priority: selected,
        }));
    };

	const handleSave = async (e: React.FormEvent) => {
        e.preventDefault(); // 👈 prevent URL update and refresh
    
        try {
            if (isEditing && editingAccount) {
				await axios.put(`/api/accounts/${editingAccount.id}/`, formData, {
					headers: { Authorization: `Bearer ${token}` },
				});
				Swal.fire("Success", "Fee Account updated successfully!", "success");
			} else {
                await axios.post("/api/accounts/",
                    formData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                Swal.fire("Success", "Vote Head created successfully!", "success");
            }    
            setFormData({ votehead: "", abbr: "", priority:"" });

            onSave(!saved);

            closeModal();
        } catch (err: any) {
            const errorMsg = err?.response?.data.error || "An unexpected error occurred";
            Swal.fire("Error", `${errorMsg}`, "error");
            setFormData({ votehead: "", abbr: "", priority:"" });
            closeModal();
        }
    };

    return(
        <>
			<div className="overflow-hidden mb-2 rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
                <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                            Fee Account
                        </h3>
                    </div>

                    <div className="flex items-center gap-3">
                        <SearchButton onSearch={setSearchTerm} />
                        <button 
                            onClick={openModal} 
                            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
                        >
                            <CpuIcon />
                            Add Account
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
                                    Votehead
                                </TableCell>

                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    Priority
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
                            {accounts.length === 0 ? (
								<TableRow>
									<div className="p-4 text-sm text-gray-500">No Vote Head found.....</div>
								</TableRow>
							) : (
                                accounts.map((account) => (
                                    <TableRow key={account.id}>
                                        
                                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                            <div className="flex items-center gap-3">
                                                <div>
                                                    <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                                                        {account.votehead}
                                                    </span>
                                                    <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                                                        {account.abbr} 
                                                    </span>
                                                </div>
                                            </div>
                                        </TableCell>

                                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                            <div className="flex items-center gap-3">
                                                <div>
                                                    <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                                                        {account.priority_name}
                                                    </span>
                                                    <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                                                        {account.priority_level}%
                                                    </span>
                                                </div>
                                            </div>
                                        </TableCell>

                                        <TableCell>
											<button
												title="Delete Staff Workload"
												className="text-blue-500 hover:text-red-600 transition-colors  px-4"
												onClick={() => handleEditAccount(account)}
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
							{isEditing ? "Edit Account" : "Add Account"}
						</h4>
						<p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
							Expand the functionality and services offered in the institution
						</p>
					</div>

					<form className="flex flex-col" onSubmit={handleSave}>
						<div className="px-2 custom-scrollbar">
							<div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
					
								<div>
									<Label>Votehead</Label>
									<Input type="text" name="votehead" value={formData.votehead} onChange={handleChange}/>  
								</div>

								<div className="">
									<Label>Abbreviation</Label>
									<Input type="text" name="abbr" value={formData.abbr} onChange={handleChange} />  
								</div>

								<div className="">
									<Label>Priority</Label>
									<SearchableSelect items={priorities} onSelect={handlePrioritySelect} />
								</div>

							</div>
						</div>

						<div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
							{ isEditing ? (
                                <button
                                    type="button"
                                    onClick={() => handleDeleteAccount(editingAccount.id, editingAccount?.votehead)}
                                    className="p-5 border border-gray-500 rounded-lg items-center gap-2 bg-red-900 px-4 py-2.5 text-theme-md font-medium text-white shadow-theme-xs hover:bg-gray-100 hover:shadow-lg hover:text-gray-800 dark:border-gray-700 dark:bg-red-800 dark:text-white dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
                                >
                                    Delete Method
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
								Save Votehead
							</button>
						</div>
					</form>
					
				</div>
			</Modal>
		</>
    );
}