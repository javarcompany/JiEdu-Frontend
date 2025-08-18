import {
	Table,
	TableBody,
	TableCell,
	TableHeader,
	TableRow,
} from "../../../components/ui/table";
import { formatDateTime } from "../../../utils/format";

import { Modal } from "../../../components/ui/modal";

import Button from "../../../components/ui/button/Button";
import Label from "../../../components/form/Label";
import Input from "../../../components/form/input/InputField";

import { CalendarPlusIcon, EyeIcon } from "lucide-react";
import PageMeta from "../../../components/common/PageMeta";
import { useModal } from "../../../hooks/useModal";

import axios from "axios";
import Swal from "sweetalert2";

import { useEffect, useState } from "react";
import debounce from "lodash.debounce";
import Pagination from "../../../components/ui/pagination";
import { SearchButton } from "../../../components/dashboard/SearchButton";

interface AcYears {
	id: number;
	name: string;
	dor: string;
}

export default function AcYearTable() {
    const token = localStorage.getItem("access");
    const { isOpen, openModal, closeModal } = useModal();
	const [loading, setLoading] = useState<boolean>(true);
	const [searchTerm, setSearchTerm] = useState<string>("");

	const [page, setPage] = useState<number>(1);
	const [totalPages, setTotalPages] = useState<number>(1);

	const [years, setYears] = useState<AcYears[]>([]);
	const [formData, setFormData] = useState({
		name: "",
	});
	const [editingAcyear, setEditingAcyear] = useState<AcYears | null>(null);
	const isEditing = Boolean(editingAcyear);
	const [saved, onSave] = useState<boolean>(false);

	const fetchYears = debounce( async (searchTerm, page=1) => {
		try {
			const response = await axios.get(`/api/academic-year/?search=${searchTerm}&page=${page}`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
            setPage(response.data.page);
			setYears(response.data.results);
            setTotalPages(response.data.total_pages || response.data.num_pages || 1);
			setLoading(false);
		} catch (error) {
			console.error("Failed to fetch Intakes", error);
			setLoading(false);
		}
	}, 100);

	useEffect(() => {
		fetchYears(searchTerm, page);

	}, [searchTerm, page, saved]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
			setFormData(prev => ({ ...prev, [name]: value }));
	};

	const handleSave = async (e: React.FormEvent) => {
		e.preventDefault(); // 👈 prevent URL update and refresh
	
		try {
			if (isEditing && editingAcyear) {
				await axios.put(`/api/academic-year/${editingAcyear.id}/`, formData, {
					headers: { Authorization: `Bearer ${token}` },
				});
				Swal.fire("Success", "Academic Year updated successfully!", "success");
			} else {
				const resp = await axios.post(`/api/academic-year/`, 
					formData,
					{
						headers: {
							Authorization: `Bearer ${token}`,
						}
					}
				);
				if (resp.status == 201){
					Swal.fire("Success", "Year created successfully!", "success");
				} else{
					const errorData = resp.data;
					Swal.fire("Error", errorData || "Submission Failed!", "error");
				}
			}
			setFormData({ name: ""});
			onSave(!saved);

		} catch (err) {
			Swal.fire("Error", "Failed to create year", "error");
			setFormData({ name: ""});
		} finally{
			handleClose();
		}
	};

	if (loading) {
		return <div className="p-4 text-sm text-gray-500">Loading academic years...</div>;
	}

	const handleEditAcYear = async (acyear: AcYears) => {
		setEditingAcyear(acyear);
		setFormData({
			name: acyear.name,
		});
		openModal();
	}
	
	const handleDeleteAcyear = async (acyearID: number, acyearName: string) => {
		
		const result = await Swal.fire({
			title: "Are you sure?",
			text: `Do you want to delete the Academic Year "${acyearName}"? This action cannot be undone.`,
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
				await axios.delete(`/api/academic-year/${acyearID}/`, {
					headers: { Authorization: `Bearer ${token}` },
				});
				Swal.fire("Deleted!", `"${acyearName}" has been deleted.`, "success");
				fetchYears(searchTerm, page); // Refresh list
			} catch (error) {
				console.error("Failed to delete academic year.", error);
				Swal.fire("Error", "Something went wrong. Could not delete the term.", "error");
			}
		}
	};

	const handleClose = () => {
		setEditingAcyear(null);
		setFormData({ name: "" });
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
						Academic Years
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
							Add Academic Year
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
									Name
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
							{years.length === 0 ? (
								<TableRow>
									<TableCell colSpan={3} className="text-center">
										<div className="p-4 text-sm text-gray-500">
											No academic year found...
										</div>
									</TableCell>
								</TableRow>
							) : (
								years.map((acyear) => (
									<TableRow key={acyear.id}>
										<TableCell className="px-5 py-4 sm:px-6 text-start">
											<div className="flex items-center gap-3">
												<div>
													<span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
														{acyear.name}
													</span>
												</div>
											</div>
										</TableCell>

										<TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
											<div className="flex items-center gap-3">
												<div>
													<span className="block text-gray-500 font-medium text-theme-xs dark:text-gray-400">
														{formatDateTime(acyear.dor)}
													</span>
												</div>
											</div>
										</TableCell>

										<TableCell>
											<button
												title="Edit Academic Year "
												className="text-blue-500 hover:text-yellow-600 transition-colors  px-4"
												onClick={() => handleEditAcYear(acyear)}
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
                            {isEditing ? "Edit Academic Year" : "Add Academic Year"}
                        </h4>
                        <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
                            Expand the functionality and services offered in the institution
                        </p>
                    </div>

                    <form className="flex flex-col" onSubmit={handleSave}>
                        <div className="px-2 overflow-y-auto custom-scrollbar">
                            <div className="grid grid-cols-2 gap-x-6 gap-y-5 lg:grid-cols-1">

                                <div>
                                    <Label>Name</Label>
                                    <Input type="text" name="name" value={formData.name} onChange={handleChange}  />  
                                </div>

                            </div>
                        </div>

                        <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
							{ isEditing ? (
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (editingAcyear) {
                                            handleDeleteAcyear(editingAcyear.id, editingAcyear?.name)
                                        }
                                    }}
                                    className="p-5 border border-red-500 rounded-lg items-center gap-2 bg-red-600 px-4 py-2.5 text-theme-md font-medium text-white shadow-theme-xs hover:bg-gray-100 hover:shadow-lg hover:text-red-600 dark:border-gray-700 dark:bg-red-800 dark:text-white dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
                                >
                                    Delete Academic Year
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
								Save Academic Year
							</button>
						</div>
                    </form>
                </div>
            </Modal>
		</>
	);
}
