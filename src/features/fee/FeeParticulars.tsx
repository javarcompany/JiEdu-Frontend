import { BanknoteIcon, ClipboardEditIcon } from "lucide-react";
import { Modal } from "../../components/ui/modal";
import { useModal } from "../../hooks/useModal";
import { SearchButton } from "../../components/dashboard/SearchButton";
import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../components/ui/table";
import debounce from "lodash.debounce";
import axios from "axios";
import Pagination from "../../components/ui/pagination";
import Swal from "sweetalert2";
import Label from "../../components/form/Label";
import SearchableSelect from "../../components/form/DictSelect";
import Input from "../../components/form/input/InputField";
import Button from "../../components/ui/button/Button";

export interface Particulars{
    id: number;
    name: string;
    course: string;
    course_name: string;
    module: string;
    module_name: string;
    term: string;
    year_name: string;
    intake_name: string;
    account: string;
    account_name: string;
    amount: string;
}

export default function FeeParticulars () {
    const token = localStorage.getItem("access");
    
    const { isOpen, openModal, closeModal } = useModal();
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [particulars, setParticulars] = useState<Particulars[]>([]);
    
    const [page, setPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);

    const [courses, setCourses] = useState<{ 
        value: string;
        label: string;
    }[]>([]);

    const [modules, setModules] = useState<{ 
        value: string;
        label: string;
    }[]>([]);

    const [terms, setTerms] = useState<{ 
        value: string;
        label: string;
    }[]>([]);
	
    const [accounts, setAccounts] = useState<{ 
        value: string;
        label: string;
    }[]>([]);
	
	const [saved, onSave] = useState<boolean>(false);

    const [editingParticular, setEditingParticular] = useState<Particulars | null>(null);
    const isEditing = Boolean(editingParticular);
        
	const [formData, setFormData] = useState({
        name: "",
        course: "",
		module: "",
        term: "",
        account: "",
		amount: ""
    });


    const fetchParticulars = debounce(async (searchTerm, page=1) => {
        try {
            const response = await axios.get(`/api/feeparticular/?search=${searchTerm}&page=${page}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setPage(response.data.page);
            setParticulars(response.data.results);
            setTotalPages(response.data.total_pages || response.data.num_pages || 1);
        } catch (error) {
            console.error("Failed to fetch Particulars", error);
        }
    }, 100);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await axios.get("/api/courses/?all=true",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                ); // Adjust this URL if needed
                const data = response.data.results;
                // Convert courses to the format expected by SearchableSelect
                const formatted = data.map((course : any) => ({
                    value: course.id.toString(),
                    label: course.name,      
                }));
                
                setCourses(formatted);
                } catch (error) {
                console.error("Failed to load Courses", error);
            }
        };

        const fetchModules = async () => {
            try {
                const response = await axios.get("/api/modules/?all=true",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                ); // Adjust this URL if needed
                const data = response.data.results;
                // Convert modules to the format expected by SearchableSelect
                const formatted = data.map((module : any) => ({
                    value: module.id.toString(),
                    label: module.name,      
                }));
                
                setModules(formatted);
                } catch (error) {
                console.error("Failed to load Modules", error);
            }
        };

        const fetchTerms = async () => {
            try {
                const response = await axios.get("/api/terms/?all=true",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                ); // Adjust this URL if needed
                const data = response.data.results;
                // Convert courses to the format expected by SearchableSelect
                const formatted = data.map((term : any) => ({
                    value: term.id.toString(),
                    label: term.termyear,      
                }));
                
                setTerms(formatted);
            } catch (error) {
                console.error("Failed to load Terms", error);
            }
        };

        const fetchAccounts = async () => {
            try {
                const response = await axios.get("/api/accounts/?all=true",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                ); // Adjust this URL if needed
                const data = response.data.results;
                // Convert modules to the format expected by SearchableSelect
                const formatted = data.map((account : any) => ({
                    value: account.id.toString(),
                    label: account.votehead,      
                }));
                
                setAccounts(formatted);
            } catch (error) {
                console.error("Failed to load Accounts", error);
            }
        };

        fetchCourses();
        fetchModules();
        fetchTerms();
        fetchAccounts();

        fetchParticulars(searchTerm, page);
    }, [page, searchTerm, saved]);

    const handleEditParticular = async (particular: Particulars) => {
        setEditingParticular(particular);
		setFormData({
			name: particular.name,
			course: particular.course,
			module: particular.module,
			term: particular.term,
			account: particular.account,
			amount: particular.amount,
		});
		openModal();
    }
        
	const handleDeleteParticular = async (particularId: number, particularName: string) => {
		
		const result = await Swal.fire({
			title: "Are you sure?",
			text: `Do you want to delete the payment particular "${particularName}"? This action cannot be undone.`,
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
				await axios.delete(`/api/feeparticular/${particularId}/`, {
					headers: { Authorization: `Bearer ${token}` },
				});
				Swal.fire("Deleted!", `"${particularName}" has been deleted.`, "success");
				fetchParticulars(searchTerm, page); // Refresh list
			} catch (error) {
				console.error("Failed to delete payment particular", error);
				Swal.fire("Error", "Something went wrong. Could not delete the method.", "error");
			}
		}
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
    
    const handleTermSelect = (selected: string) => {
        setFormData((prev) => ({
          ...prev, term: selected,
        }));
    };

    const handleAccountSelect = (selected: string) => {
        setFormData((prev) => ({
          ...prev, account: selected,
        }));
    };
    
    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault(); // 👈 prevent URL update and refresh
      
        try {
			if (isEditing && editingParticular) {
				await axios.put(`/api/feeparticular/${editingParticular.id}/`, formData, {
					headers: { Authorization: `Bearer ${token}` },
				});
				Swal.fire("Success", "Particular updated successfully!", "success");
			} else {
                await axios.post("/api/feeparticular/",
                    formData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                Swal.fire("Success", "Fee Particular created successfully!", "success");
            }
            setFormData({ name: "", course: "", module: "", term: "", account: "", amount: "" });

            onSave(!saved);

            closeModal();
        } catch (err: any) {
            const errorMsg = err?.response?.data.error || "An unexpected error occurred";
            Swal.fire("Error", `${errorMsg}`, "error");
            setFormData({name: "", course: "", module: "", term: "", account: "", amount: "" });
            closeModal();
        }
    };

    const handleClose = () => {
		setEditingParticular(null);
		setFormData({ name: "", course: "", module: "", term: "", account: "", amount: "" });
		closeModal();
	};

    return(
        <>
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
                <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                            Course Particulars
                        </h3>
                    </div>

                    <div className="flex items-center gap-3">
                        <SearchButton onSearch={setSearchTerm} />
                        <button 
                            onClick={openModal} 
                            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
                        >
                            <BanknoteIcon />
                            Add Course Particulars
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
                                    Course
                                </TableCell>

                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    Term
                                </TableCell>

                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    Account
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
                            {particulars.length === 0 ? (
								<TableRow>
									<div className="p-4 text-sm text-gray-500">No Particular found.....</div>
								</TableRow>
							) : (
                                particulars.map((particular) => (
                                    <TableRow key={particular.id}>
                                        <TableCell className="px-5 py-4 sm:px-6 text-start">
                                            <div className="flex items-center gap-3">
                                                <div>
                                                    <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                                                        {particular.name}
                                                    </span>
                                                </div>
                                            </div>
                                        </TableCell>

                                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                            <div className="flex items-center gap-3">
                                                <div>
                                                    <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                                                        {particular.course_name}
                                                    </span>
                                                    <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                                                        Module {particular.module_name}
                                                    </span>
                                                </div>
                                            </div>
                                        </TableCell>

                                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                            <div className="flex items-center gap-3">
                                                <div>
                                                    <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                                                        {particular.year_name}
                                                    </span>
                                                    <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                                                        {particular.intake_name}
                                                    </span>
                                                </div>
                                            </div>
                                        </TableCell>

                                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                            <div className="flex items-center gap-3">
                                                <div>
                                                    <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                                                        {particular.account_name}
                                                    </span>
                                                    <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                                                        Kshs. {particular.amount}
                                                    </span>
                                                </div>
                                            </div>
                                        </TableCell>

                                        <TableCell>
											<button
												title="Edith Fee Particular"
												className="text-blue-500 hover:text-red-600 transition-colors  px-4"
												onClick={() => handleEditParticular(particular)}
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
            
            <Modal isOpen={isOpen} onClose={handleClose} className="max-w-[700px] m-4 max-h-[90vh] items-start" >
                <div className="relative w-full h-full overflow-y-auto bg-white rounded-3xl p-4 dark:bg-gray-900 lg:p-11 custom-scrollbar">
                    {/* Header */}
                    <div className="px-2 pr-14">
                        <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                            {isEditing ? "Edit Particular" : "Add Particular"}
                        </h4>
                        <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
                            Expand the functionality and services offered in the institution
                        </p>
                    </div>

                    {/* Form */}
                    <form className="flex flex-col" onSubmit={handleSave}>
                        <div className="px-2">
                            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                                {/* Input Fields */}
                                <div>
                                    <Label>Name</Label>
                                    <Input type="text" name="name" value={formData.name} onChange={handleChange} />
                                </div>

                                <div>
                                    <Label>Course</Label>
                                    <SearchableSelect items={courses} onSelect={handleCourseSelect} />
                                </div>

                                <div>
                                    <Label>Module</Label>
                                    <SearchableSelect items={modules} onSelect={handleModuleSelect} />
                                </div>

                                <div>
                                    <Label>Term</Label>
                                    <SearchableSelect items={terms} onSelect={handleTermSelect} />
                                </div>

                                <div>
                                    <Label>Account</Label>
                                    <SearchableSelect items={accounts} onSelect={handleAccountSelect} />
                                </div>

                                <div>
                                    <Label>Amount</Label>
                                    <Input type="text" name="amount" value={formData.amount} onChange={handleChange} />
                                </div>
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="flex flex-wrap items-center gap-3 px-2 mt-6 lg:justify-end">
                            {isEditing ? (
                                <button
                                    type="button"
                                    onClick={() => handleDeleteParticular(editingParticular.id, editingParticular.name)}
                                    className="rounded-lg border border-red-500 bg-red-600 px-4 py-2.5 text-white font-medium hover:bg-gray-100 hover:text-red-700 dark:bg-red-800 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
                                >
                                    Delete Particular
                                </button>
                                ) : (
                                <Button size="sm" variant="outline" onClick={closeModal}>
                                    Close
                                </Button>
                            )}
                            <button
                                type="submit"
                                className="rounded-lg border border-gray-500 bg-blue px-4 py-2.5 text-gray-700 font-medium hover:bg-gray-100 hover:text-gray-800 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
                            >
                                Save Fee Particular
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>

        </>
    );
}