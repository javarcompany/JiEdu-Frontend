import {
	Table,
	TableBody,
	TableCell,
	TableHeader,
	TableRow,
} from "../../../components/ui/table";
import SearchableSelect from "../../../components/form/DictSelect";

import { Modal } from "../../../components/ui/modal";

import Button from "../../../components/ui/button/Button";
import Label from "../../../components/form/Label";
import Input from "../../../components/form/input/InputField";

import {  EyeIcon, CalendarPlusIcon } from "lucide-react";
import PageMeta from "../../../components/common/PageMeta";
import { useModal } from "../../../hooks/useModal";

import axios from "axios";
import Swal from "sweetalert2";

import { useEffect, useState } from "react";
import { fetchDropdownData } from "../../../utils/apiFetch";
import debounce from "lodash.debounce";
import { formatDateTime } from "../../../utils/format";
import Pagination from "../../../components/ui/pagination";
import { SearchButton } from "../../../components/dashboard/SearchButton";

interface Term {
	id: number;
	name: string;
	term: string;
	term_name: string;
	openingDate: string;
	closingDate: string;
	year: string;
	year_name: string;
	dor: string;
}

export default function IntakeSeriesTable() {
    const { isOpen, openModal, closeModal } = useModal();
    const token = localStorage.getItem("access");

	const [terms, setTerms] = useState<Term[]>([]);
	const [intakes, setIntakes] = useState<{ value: string; label: string; }[]>([]);
	const [years, setYear] = useState<{ value: string; label: string; }[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	
	const [saved, setSaved] = useState<boolean>(false);
	const [searchTerm, setSearchTerm] = useState<string>("");

	const [page, setPage] = useState<number>(1);
	const [totalPages, setTotalPages] = useState<number>(1);

	const [editingTerm, setEditingTerm] = useState<Term | null>(null);
	const isEditing = Boolean(editingTerm);

	const [formData, setFormData] = useState({
		name: "",
		openingDate: "",
		closingDate: "",
		year: ""
	});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

 	const fetchTerms = debounce(async (searchTerm, page) => {
		try {
			const response = await axios.get(`/api/terms/?all=true&search=${searchTerm}&page=${page}`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
            setPage(response.data.page);
			setTerms(response.data.results);
            setTotalPages(response.data.total_pages || response.data.num_pages || 1);
			setLoading(false);
		} catch (error) {
			console.error("Failed to fetch Terms", error);
			setLoading(false);
		}
	}, 100);

    useEffect(() => {
        const loadDropdowns = async () => {
          setIntakes(await fetchDropdownData("/api/intakes/?all=true"));
          setYear(await fetchDropdownData("/api/academic-year/")); 
        };

        loadDropdowns();
		fetchTerms(searchTerm, page);
    }, [searchTerm, page, saved]);

	const handleIntakeSelect = (selected: string) => {
        setFormData((prev) => ({
          ...prev, name: selected,
        }));
    };
	const handleYearSelect = (selected: string) => {
        setFormData((prev) => ({
          ...prev, year: selected,
        }));
    };

	// const handleDateChange = (date: Date | null, name:string) => {
	// 	console.log(date)
	// 	if (date){
    //     	setFormData((prev) => ({ ...prev, [name]: date}));
	// 	}
    // };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault(); // 👈 prevent URL update and refresh
    
        try {
			if (isEditing && editingTerm) {
				await axios.put(`/api/terms/${editingTerm.id}/`, formData, {
					headers: { Authorization: `Bearer ${token}` },
				});
				Swal.fire("Success", "Intake updated successfully!", "success");
			} else {
				await axios.post("/api/terms/", 
					formData,
					{
						headers: {
							Authorization: `Bearer ${token}`,
						},
					}
				);
            	Swal.fire("Success", "Intake created successfully!", "success");
			}
			setFormData({ name: "", openingDate: "", closingDate: "", year: ""});
            handleClose();
			setSaved(!saved);
        } catch (err) {
            console.error(err);
            Swal.fire("Error", "Failed to create intake", "error");
            setFormData({ name: "", openingDate: "", closingDate: "", year: ""});
            handleClose();
        }
    };

	if (loading) {
		return <div className="p-4 text-sm text-gray-500">Loading intakes...</div>;
	}

	const handleEditTerm = async (term: Term) => {
		setEditingTerm(term);
		setFormData({
			name: term.name,
			openingDate: term.openingDate,
			closingDate: term.closingDate,
			year: term.year
		});
		openModal();
	}
	
	const handleDeleteTerm = async (termID: number, termName: string) => {
		
		const result = await Swal.fire({
			title: "Are you sure?",
			text: `Do you want to delete the Term "${termName}"? This action cannot be undone.`,
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
				await axios.delete(`/api/term/${termID}/`, {
					headers: { Authorization: `Bearer ${token}` },
				});
				Swal.fire("Deleted!", `"${termName}" has been deleted.`, "success");
				fetchTerms(searchTerm, page); // Refresh list
			} catch (error) {
				console.error("Failed to delete term.", error);
				Swal.fire("Error", "Something went wrong. Could not delete the term.", "error");
			}
		}
	};

	const handleClose = () => {
		setEditingTerm(null);
		setFormData({ name: "", openingDate: "", closingDate: "", year: ""});
		closeModal();
	};

	return (
		<>
			<PageMeta
				title="JiEdu Dashboard | Academic Page"
				description="Academic Page for JiEdu Application showing institution's information"
			/>

			<div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
				<div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
					<div>
						<h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
							Intake Series
						</h3>
					</div>
			
					<div className="flex items-center gap-3">
						<SearchButton onSearch={setSearchTerm} />
						<Button
							onClick={openModal}
							size="md"
							variant="outline"
							startIcon={<CalendarPlusIcon className="size-5" />}
						>
							Add Intake Series
						</Button>
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
									Opening/Closing Month
								</TableCell>

								<TableCell
									isHeader
									className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
								>
									Opening Date
								</TableCell>

								<TableCell
									isHeader
									className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
								>
									Closing Date
								</TableCell>

								<TableCell
									isHeader
									className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
								>
									Academic Year
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
							{terms.length === 0 ? (
								<TableRow>
									<TableCell colSpan={6} className="text-center">
										<div className="p-4 text-sm text-gray-500">
											No intake series found...
										</div>
									</TableCell>
								</TableRow>
							) : (
								terms.map((intake) => (
									<TableRow key={intake.id}>
										<TableCell className="px-5 py-4 sm:px-6 text-start">
											<div className="flex items-center gap-3">
												<div>
													<span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
														{intake.term_name}
													</span>
												</div>
											</div>
										</TableCell>

										<TableCell className="px-5 py-4 sm:px-6 text-start">
											<div className="flex items-center gap-3">
												<div>
													<span className="block text-gray-500 font-medium text-theme-xs dark:text-gray-400">
														{formatDateTime(intake.openingDate)}
													</span>
												</div>
											</div>
										</TableCell>

										<TableCell className="px-5 py-4 sm:px-6 text-start">
											<div className="flex items-center gap-3">
												<div>
													<span className="block text-gray-500 font-medium text-theme-xs dark:text-gray-400">
														{formatDateTime(intake.closingDate)}
													</span>
												</div>
											</div>
										</TableCell>

										<TableCell className="px-5 py-4 sm:px-6 text-start">
											<div className="flex items-center gap-3">
												<div>
													<span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
														{intake.year_name}
													</span>
												</div>
											</div>
										</TableCell>

										<TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
											<div className="flex items-center gap-3">
												<div>
													<span className="block text-gray-500 font-medium text-theme-xs dark:text-gray-400">
														{formatDateTime(intake.dor)}
													</span>
												</div>
											</div>
										</TableCell>
										<TableCell>
											<button
												title="Edit Academic Year "
												className="text-blue-500 hover:text-yellow-600 transition-colors  px-4"
												onClick={() => handleEditTerm(intake)}
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
                <div className="relative w-full p-4 bg-white no-scrollbar rounded-3xl dark:bg-gray-900 lg:p-11">
                    <div className="px-2 pr-14">
                        <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                            {isEditing ? "Edit Intake Series": "Add Intake Series"}
                        </h4>
                        <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
                            Expand the functionality and services offered in the institution
                        </p>
                    </div>

                    <form className="flex flex-col" onSubmit={handleSave}>
                        <div className="px-2 custom-scrollbar">
							<div className="grid grid-cols-2 py-4 gap-x-6 gap-y-5 lg:grid-cols-1">
								<div>
									<Label>Intake [Current Intake: {editingTerm?.term_name}]</Label>
									<SearchableSelect items={intakes} onSelect={handleIntakeSelect} /> 
								</div>
							</div>

                            <div className="grid grid-cols-2 gap-x-6 gap-y-5 lg:grid-cols-2">
								<div>
									<Label>Opening Date</Label>
									<Input 
										type="date" 
										name="openingDate" 
										id="id_openingDate" 
										placeholder="Select a date"
										value={editingTerm?.openingDate}
										onChange={handleChange}
									/>
                                </div>

								<div>
									<Label>Closing Date</Label>
									<Input 
										type="date" 
										name="closingDate" 
										id="id_closingDate" 
										placeholder="Select a date"
										value={editingTerm?.closingDate}
										onChange={handleChange}
									/>
                                </div>
							</div>

							<div className="grid grid-cols-2 py-4 gap-x-6 gap-y-5 lg:grid-cols-1">
                            	<div>
                                    <Label>Academic Year [Current: {editingTerm?.year_name}]</Label>
                                    <SearchableSelect items={years} onSelect={handleYearSelect} /> 
                                </div>
							</div>

                        </div>

                        <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
							{ isEditing ? (
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (editingTerm) {
                                            handleDeleteTerm(editingTerm.id, editingTerm?.term_name)
                                        }
                                    }}
                                    className="p-5 border border-red-500 rounded-lg items-center gap-2 bg-red-600 px-4 py-2.5 text-theme-md font-medium text-white shadow-theme-xs hover:bg-gray-100 hover:shadow-lg hover:text-red-600 dark:border-gray-700 dark:bg-red-800 dark:text-white dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
                                >
                                    Delete Term
                                </button>
                            ) : (
                                <Button size="sm" variant="outline" onClick={handleClose}>
                                    Close
                                </Button>
                            )}
							<button
								type="submit"
								className="p-5 border border-gray-500 rounded-lg items-center gap-2 bg-blue px-4 py-2.5 text-theme-md font-medium text-gray-700 shadow-theme-xs hover:bg-gray-100 hover:shadow-lg hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
							>
								Save Term
							</button>
						</div>
                    </form>
                </div>
            </Modal>
		</>
	);
}
