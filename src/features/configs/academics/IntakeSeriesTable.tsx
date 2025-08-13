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

import {  Pencil, Trash2, CalendarPlusIcon } from "lucide-react";
import PageMeta from "../../../components/common/PageMeta";
import { useModal } from "../../../hooks/useModal";

import axios from "axios";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";
import { fetchDropdownData } from "../../../utils/apiFetch";
import debounce from "lodash.debounce";
import { formatDateTime } from "../../../utils/format";

interface Term {
	id: number;
	name: string;
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

	const [formData, setFormData] = useState({
		name: "",
		abbr: "",
		openingDate: "",
		closingDate: "",
		year: ""
	});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

 	const fetchTerms = debounce(async () => {
		try {
			const response = await axios.get(`/api/terms/?all=true`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			setTerms(response.data.results);
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
		fetchTerms();
    }, [saved]);

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
            await axios.post("/api/terms/", 
				formData,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
            Swal.fire("Success", "Intake created successfully!", "success");
            setFormData({ name: "", abbr: "", openingDate: "", closingDate: "", year: ""});
            closeModal();
			setSaved(!saved);
        } catch (err) {
            console.error(err);
            Swal.fire("Error", "Failed to create intake", "error");
            setFormData({ name: "", abbr: "", openingDate: "", closingDate: "", year: ""});
            closeModal();
        }
    };

	if (loading) {
		return <div className="p-4 text-sm text-gray-500">Loading intakes...</div>;
	}

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

										<TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
											<button
												title="Edit Group"
												className="text-green-500 hover:text-green-600 transition-colors"
												onClick={() => console.log("Edit")}
											>
												<Pencil size={16} />
											</button>

											<button
												title="Delete Group"
												className="text-red-500 hover:text-red-600 transition-colors  px-4"
												onClick={() => console.log("Delete")}
											>
												<Trash2 size={16} />
											</button>
										</TableCell>
									</TableRow>
								))
							)}
						</TableBody>
					</Table>
				</div>

			</div>

			<Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
                <div className="relative w-full p-4 bg-white no-scrollbar rounded-3xl dark:bg-gray-900 lg:p-11">
                    <div className="px-2 pr-14">
                        <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                            Add Intake Series
                        </h4>
                        <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
                            Exapnd the functionality and services offered in the institution
                        </p>
                    </div>

                    <form className="flex flex-col" onSubmit={handleSave}>
                        <div className="px-2 custom-scrollbar">
							<div className="grid grid-cols-2 py-4 gap-x-6 gap-y-5 lg:grid-cols-1">
								<div>
									<Label>Intake</Label>
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
										onChange={handleChange}
									/>
                                </div>
							</div>

							<div className="grid grid-cols-2 py-4 gap-x-6 gap-y-5 lg:grid-cols-1">
                            	<div>
                                    <Label>Academic Year</Label>
                                    <SearchableSelect items={years} onSelect={handleYearSelect} /> 
                                </div>
							</div>

                        </div>

                        <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
                            <Button size="sm" variant="outline" onClick={closeModal}>
                                Close
                            </Button>
                            <button
                                type="submit"
                                className="p-5 border border-gray-500 rounded-lg items-center gap-2 bg-blue px-4 py-2.5 text-theme-md font-medium text-gray-700 shadow-theme-xs hover:bg-gray-100 hover:shadow-lg hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
                            >
                                Add Intake Series
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>
		</>
	);
}
